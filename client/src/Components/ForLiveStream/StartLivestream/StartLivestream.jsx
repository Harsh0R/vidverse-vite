import React, { useContext, useEffect, useState } from 'react';
import { Broadcast, LivepeerConfig, createReactClient, studioProvider, useCreateStream } from "@livepeer/react";
import ChatBox from '../../ChatBox/ChatBox';
import Style from "./StartLivestream.module.css"
import { VidverseContext } from '../../../Context/VidverseContext';
import Error from '../../Error/Error';
import imgs from '../../../assets/imgs';
import { Link } from 'react-router-dom';
import ChatRoomCompo from '../../ChatRoomCompo/ChatRoomCompo';

const LivestreamCom = () => {
    const [streamName, setStreamName] = useState('');
    const [error, setError] = useState('');
    const [activeStream, setActiveStream] = useState(null);
    const [vidGenre, setVidGenre] = useState("");
    const { createLiveStream, getAllLiveStreamData, getAllMyLiveStreamData, stopStreamByStreamID, account, userName } = useContext(VidverseContext);

    const [rnum, setRnum] = useState();
    const Rnum = Math.floor(Math.random() * 9);
    const apiToken = '45cddd3a-e60e-4a8b-b121-e353f8b107b0';
    const { mutate: createStream, data: createdStream, status } = useCreateStream(
        streamName ? { name: streamName } : null
    );

    const genreArr = ["Gaming", "Comedy", "Drama", "Tech", "Education", "SciFi", "Social", "News"];

    useEffect(() => {
        const fetchActiveStreams = async () => {
            try {
                if (account) {
                    const streams = await getAllMyLiveStreamData(account);
                    if (streams.length > 0) {
                        setActiveStream(streams[0]);
                    }
                }

                setRnum(Rnum);
            } catch (error) {
                console.error("Error fetching active live streams:", error);
            }
        };
        fetchActiveStreams();
    }, [account]);

    const handleRoyaltyChange = (event) => {
        setVidGenre(event.target.value);
    };


    const updateInContract = async () => {
        try {
            console.log("creat stream data ===> ", vidGenre);
            await createLiveStream(createdStream.name, createdStream.playbackId, createdStream.streamKey, createdStream.id, vidGenre);
            setActiveStream({ ...createdStream, status: true });
        } catch (error) {
            console.error("Error updating stream in contract:", error);
            setError("Failed to update stream. Please try again.");
        }
    };

    const handleCreateStream = () => {
        if (!streamName) {
            setError('Stream name is required.');
            return;
        }
        createStream();
    };

    const handleStopStream = async () => {
        try {
            console.log("Strdt sr , =", activeStream.streamID);
            const response = await fetch(`https://livepeer.studio/api/stream/${activeStream.streamID}/terminate`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${apiToken}` }
            });

            if (response.status === 204) {
                await stopStreamByStreamID(activeStream.streamID);
                console.log('Livestream terminated successfully.');
                setActiveStream(null);
            } else {
                console.error('Failed to terminate livestream.');
                setError('Failed to terminate the livestream. Please try again.');
            }
        } catch (error) {
            console.error('Error terminating livestream:', error);
            setError('Failed to stop stream. Please try again.');
        }
    };

    const handleLikeVid = async (vidId) => {
        // await likeVideo(vidId)
    }
    const handleDislikeVid = async (vidId) => {
        // await dislikeVideo(vidId)
    }
    const handleSubscribe = async (vidMaker) => {
        // console.log("Sun to ====> ", vidMaker);
        // await subscribeToCreator(vidMaker)
    }


    return (
        <div className={Style.container}>
            {!activeStream && <div className={Style.container1}>
                <h3 className={Style.streamName}>Stream Name : </h3>
                <input
                    className={Style.strInp}
                    type="text"
                    placeholder="Enter Stream Name"
                    value={streamName}
                    onChange={(e) => setStreamName(e.target.value)}
                />

                <div className={Style.inputGroup}>
                    <div className={Style.SelectGen}>Select Your Video Genre : </div>
                    <select
                        value={vidGenre}
                        onChange={handleRoyaltyChange}
                        className={Style.input}
                    >
                        <option value="">Select Video Genre</option>
                        {genreArr.map((genre) => (
                            <option key={genre} value={genre} >
                                {genre}
                            </option>
                        ))}
                    </select>
                </div>
                <button className={Style.streamBtn} onClick={handleCreateStream} disabled={status === "loading"}>
                    {status === "loading" ? 'Creating Stream...' : 'Create Stream'}
                </button>

            </div>}
            {createdStream && (
                <button className={Style.startStream} onClick={updateInContract} disabled={!createdStream}>
                    Start Stream
                </button>
            )}
            {error && <Error error={error} />}

            {activeStream && (
                <>
                    <div className={Style.broadcastBox}>
                        <div className={Style.streamBox}>
                            <div className={Style.broadcastBox}>
                                <Broadcast streamKey={activeStream.streamKey} onError={console.error} />
                            </div>
                            <div className={Style.nameAndTip}>
                                <div className={Style.cardTitle}>{activeStream.stramName}</div>
                                <div className={Style.tipForm}>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const tipAmount = e.target.elements.tipAmount.value;
                                            handleTip(vidData.VideoPlatform_id, tipAmount);
                                        }}
                                    >
                                        <div className={Style.inputGroup}>
                                            <input
                                                type="number"
                                                className={Style.formControl}
                                                name="tipAmount"
                                                placeholder="Tip Amount"
                                            />
                                            <button className={Style.btn} type="submit">
                                                Give Tip
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className={Style.userDatas}>
                                <Link to={`/creator/${activeStream.owner}`}>
                                    <div className={Style.userImgAndName} >

                                        <img className={Style.userImg} src={imgs[`image${rnum}`]} alt="Copy" />

                                        <div className={Style.username}>{activeStream.username}
                                        </div>
                                    </div>
                                </Link>
                                <div className={Style.subscribBtn}>
                                    <button onClick={() => handleSubscribe(account.username)}>Subscribe</button>
                                </div>
                                <div className={Style.likeDislike}>
                                    <button onClick={handleLikeVid} className={Style.likes}>
                                        <small >Like : 0</small>
                                    </button>
                                    <button onClick={handleDislikeVid} className={Style.dislikes}>
                                        <small >Dislike : 0</small>
                                    </button>
                                </div>

                            </div>

                            <p>Playback ID : {activeStream.playBackId}</p>
                            <p>Genre : {activeStream.genre}</p>
                            <button className={Style.stopBtn} onClick={handleStopStream}>
                                Stop Stream
                            </button>
                        </div>
                        {/* <ChatBox chat={activeStream.stramName} name1={userName} /> */}
                        <ChatRoomCompo chatTopic={activeStream.stramName} />

                    </div>
                </>
            )}
        </div>
    );
};

export default LivestreamCom;
