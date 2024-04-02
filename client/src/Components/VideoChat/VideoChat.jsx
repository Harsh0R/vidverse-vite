import React, { useEffect, useRef, useState } from 'react'
import { initializeApp } from "firebase/app";
import { ToastContainer, toast } from 'react-toastify';
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    updateDoc,
    onSnapshot,
    getDoc,
} from "firebase/firestore";
import Style from "./VideoChat.module.css"


const firebaseConfig = {
    apiKey: "AIzaSyBqmpd5uDN5feqiOVJAlAUtte6uY8pEfI8",
    authDomain: "chattingapp-98dc0.firebaseapp.com",
    projectId: "chattingapp-98dc0",
    storageBucket: "chattingapp-98dc0.appspot.com",
    messagingSenderId: "519550228808",
    appId: "1:519550228808:web:6a5c32499cc06d32a3bb7d",
    measurementId: "G-EHDHL1HRST"
};


const VideoChat = () => {

    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);

    const [isClient, setIsClient] = useState(false);
    const [pc, setPc] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const [tempFlag, setTempFlag] = useState(false);
    const [startFlag, setStartFlag] = useState(true);
    const [inputFlag, setInputFlag] = useState(false);

    const webcamVideo = useRef(null);
    const remoteVideo = useRef(null);
    const callInput = useRef(null);

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (!isClient) return;

        const servers = {
            iceServers: [
                {
                    urls: [
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                    ],
                },
            ],
            iceCandidatePoolSize: 10,
        };

        const pcInstance = new RTCPeerConnection(servers);
        setPc(pcInstance);
    }, [isClient]);


    const startWebcam = async () => {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setLocalStream(stream);
        setRemoteStream(new MediaStream());


        if (!localStream || !remoteStream) {
            console.log(`local ${localStream} and remote ${remoteStream}`);
            console.warn("Local or remote stream is not set.");
            console.log("Click start again....");
            // toast.info("Click start again... 😉");
            return;
        }
        // console.log(`out loop local ${localStream} and remote ${remoteStream}`);

        stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        webcamVideo.current.srcObject = stream;
        remoteVideo.current.srcObject = remoteStream;

        setStartFlag(false);

    };

    const createCall = async () => {

        setTempFlag(true);
        setInputFlag(true);

        const callsCollection = collection(firestore, "calls");
        const callDoc = doc(callsCollection);
        const offerCandidates = collection(callDoc, "offerCandidates");
        const answerCandidates = collection(callDoc, "answerCandidates");


        if (!callInput.current) {
            alert("fucked up...")
            return
        }

        callInput.current.value = callDoc.id;

        pc.onicecandidate = (event) => {
            console.log("onicecandidtae event ran 👑");
            event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
        };
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        await setDoc(callDoc, { offer });

        onSnapshot(callDoc, (snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.setRemoteDescription(answerDescription);
            }
        });

        onSnapshot(answerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
            });
        });
    };

    const answerCall = async () => {

        setTempFlag(false);


        const callId = callInput.current.value;
        console.log(callId);
        const callDoc = doc(firestore, "calls", callId);
        const answerCandidates = collection(callDoc, "answerCandidates");
        const offerCandidates = collection(callDoc, "offerCandidates");

        pc.onicecandidate = (event) => {
            event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
        };

        const callData = (await getDoc(callDoc)).data();

        const offerDescription = callData.offer;
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await updateDoc(callDoc, { answer });

        onSnapshot(offerCandidates, (snapshot) => {
            console.log("snapshot run in answer");
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    let data = change.doc.data();
                    pc.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });
    };

    const hangUp = () => {
        pc.close();
        localStream.getTracks().forEach((track) => {
            track.stop();
        });
        setLocalStream(null);
        setRemoteStream(null);
        webcamVideo.current.srcObject = null;
        remoteVideo.current.srcObject = null;
    };




    return (
        <div>
            <>
                <div>
                    <ToastContainer autoClose={600} hideProgressBar={false} closeButton={false} newestOnTop={false} rtl={false} draggable />
                    <div className={Style["videoCall-holder"]}>
                        <div className={Style["videos"]}>
                            <div className={Style["gradient-border"]}>
                                <video id="webcamVideo" ref={webcamVideo} autoPlay playsInline className={Style.video} />
                            </div>
                            <div className={Style["gradient-border"]}>
                                <video id="remoteVideo" ref={remoteVideo} autoPlay playsInline className={Style.video} />
                            </div>
                        </div>
                        <div className={Style["video-controls"]}>
                            <button onClick={startWebcam} className={`${Style["rainbow-hover"]} ${Style.button}`}><span className={Style.sp}>START</span></button>
                            {localStream && !startFlag && (
                                <>
                                    <button onClick={createCall} className={`${Style["rainbow-hover"]} ${Style.button}`} disabled={!localStream}><span className={Style.sp}>GET CODE</span></button>
                                    <button onClick={() => setInputFlag(true)} className={`${Style["rainbow-hover"]} ${Style.button}`} disabled={!localStream}><span className={Style.sp}>JOIN CALL</span></button>

                                    {inputFlag && (
                                        <div style={{ width: "30%" }} className="mb-3 input-group">
                                            <input ref={callInput} className="form-control" placeholder="Call ID..." />
                                            {tempFlag ? (
                                                <button onClick={() => { navigator.clipboard.writeText(callInput.current.value); toast("CALL ID COPIED..."); }} className={`${Style["rainbow-hover"]} ${Style.button}`}><span className={Style.sp}>Copy</span></button>
                                            ) : (
                                                <button onClick={answerCall} className={`${Style["rainbow-hover"]} ${Style.button}`} disabled={!localStream}><span className={Style.sp}>Answer</span></button>
                                            )}
                                        </div>
                                    )}

                                    <button onClick={hangUp} className={`${Style["rainbow-hover"]} ${Style.button}`} disabled={!localStream}><span className={Style.sp}>Hangup</span></button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </>

        </div>
    )
}

export default VideoChat