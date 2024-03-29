import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { VidverseContext } from '../../Context/VidverseContext';
import Style from "./UserPage.module.css"
import ChatRoomCompo from '../../Components/ChatRoomCompo/ChatRoomCompo';
import { LightNodeProvider } from '@waku/react';

const UserPage = () => {
    const { allVideo, uploadVideos, account, allMyVideos, userName, registeredUser } = useContext(VidverseContext);
    const { id } = useParams()
    console.log("IIIIDDDD===.>>>", id);
    const [flag, setFlag] = useState(0)
    const [chatRoomName, setChatRoomName] = useState('')
    const [video, setVideo] = useState([]);
    const [userData, setUserData] = useState()

    const handleJoinChat = async () => {
        setFlag(2);
    }
    const handleLeaveChat = async () => {
        setFlag(1);
    }

    const NODE_OPTIONS = { defaultBootstrap: true };

    const fetchData = async () => {
        try {
            const data = await allMyVideos(id);
            const UserData = await registeredUser(id);
            const chatN = UserData[0].chatRoom;
            console.log("UserData ==> ", UserData);
            console.log("Data ==> ", data);

            setChatRoomName(chatN)
            setFlag(1)
            setVideo(data);
            setUserData(UserData);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const VITE_GATEWAY_URL = 'violet-rare-crawdad-98.mypinata.cloud';
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {flag == 1 &&
                (
                    <>
                        <h1>creator Name : {userData[0].username}</h1>
                        <h1>creator Account : {userData[0].userAddress}</h1>
                        {/* <h1>creator Account : {id}</h1> */}
                        <div>
                            {userData[0].chatRoom !== '' && userData[0].chatRoom !== null ?
                                (

                                    <button onClick={handleJoinChat}>Join {userData[0].username}'s ChatRoom : {userData[0].chatRoom}</button>
                                ) : (
                                    <div>This user have not ChatRoom</div>
                                )

                            }
                        </div>
                        <div className={Style.content}>
                            {
                                video.length ? video.map((video, index) => (
                                    <div className={Style.card} key={index}>
                                        <Link to={`/watch/${video.VideoPlatform_id}`} >
                                            <div className={Style.colMd4}>
                                                <img
                                                    className={Style.imgFluid}
                                                    // width="100%"
                                                    // height="100%"
                                                    controls
                                                    src={`https://${VITE_GATEWAY_URL}/ipfs/${video.ipfsHash}`}
                                                    type="video/mp4"
                                                />
                                                {/* <video
              className={Style.imgFluid}
              width="100%"
              height="100%"
              controls
              src={`https://gateway.lighthouse.storage/ipfs/${video.ipfsHash}`}
              type="video/mp4"
            /> */}
                                            </div>
                                            <div className={Style.colMd8}>
                                                <div className={Style.cardBody}>


                                                    <h3 className={Style.cardTitle}>{video.title}</h3>
                                                    <div className={Style.username}>
                                                        {video.username}
                                                        <div className={Style.likeDislike}>
                                                            <small className={Style.likes}>
                                                                Like : {video.likes}</small>
                                                            <small className={Style.dislikes}>Dislike : {video.dislikes}</small>
                                                        </div>
                                                    </div>
                                                    <p className={Style.cardText}>{video.description}</p>
                                                    {/* <p className={Style.cardText}>
              <small className={Style.textMuted}>CID: {CID}</small>
              </p>
              <p className={Style.cardText}>
              <small className={Style.textMuted}>Owner: {makerAdd}</small>
            </p> */}
                                                    {/* <small className={Style.textMuted}>CID: {video.ipfsHash}</small> */}
                                                    {/* <p className={Style.cardText}>Tip Amount: {video.totalTipAmount}</p> */}
                                                    {/* <p className={Style.cardText}>Maker = {video.username}</p> */}
                                                    {/* <small className={Style.cardText}>Like = {video.likes}</small>
            <small className={Style.cardText}>Dislike = {video.dislikes}</small> */}
                                                    {/* <p className={Style.cardText}>Genre = {video.genre}</p> */}
                                                    {/* <form
              onSubmit={(e) => {
                  e.preventDefault();
                const tipAmount = e.target.elements.tipAmount.value;
                handleTip(video.VideoPlatform_id, tipAmount);
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
            </form> */}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )) : <p className={Style.noVideos}>No videos available.</p>
                            }
                        </div>
                    </>
                )
            }
            {
                flag == 2 &&
                (
                    <>
                        CharROom
                        <button onClick={handleLeaveChat}>leave Chat Room : {chatRoomName}</button>
                        <LightNodeProvider options={NODE_OPTIONS}>
                            <ChatRoomCompo chatTopic={chatRoomName} />
                        </LightNodeProvider>
                    </>
                )
            }
        </>

    )
}

export default UserPage