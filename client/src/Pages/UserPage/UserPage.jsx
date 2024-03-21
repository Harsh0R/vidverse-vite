import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { VidverseContext } from '../../Context/VidverseContext';
import Style from "./UserPage.module.css"

const UserPage = () => {
    const { allVideo, uploadVideos, account, allMyVideos, userName } = useContext(VidverseContext);
    const { id } = useParams()
    const [video, setVideo] = useState([]);

    const fetchData = async () => {
        try {
            const data = await allMyVideos(id);
            console.log("Data ==> ", data);
            setVideo(data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const VITE_GATEWAY_URL = 'violet-rare-crawdad-98.mypinata.cloud';
    useEffect(() => {

        fetchData();
    }, [account, allVideo]);

    return (
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
                                    <div className={Style.username}>{video.username}
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

    )
}

export default UserPage