import React, { useContext, useEffect, useState } from 'react'
import { VidverseContext } from '../../Context/VidverseContext'
import Style from "./ShowVideo.module.css"
import imgs from '../../assets/imgs'
import { Link } from 'react-router-dom'
import VideoCard from '../VideoCard/VideoCard'

const ShowVideo = ({ vidId }) => {

    const { getVid, hasValideAllowance, allVideo,tipVideoOwner, increaseAllowance, dislikeVideo, likeVideo } = useContext(VidverseContext);
    const [vidData, setVidData] = useState()
    const [rnum, setRnum] = useState();
    const Rnum = Math.floor((Math.random() * 9)+1);
    const [videos, setVideos] = useState([]);

    const fetchData = async (vidId) => {
        const vid = await getVid(vidId)
        const data = await allVideo();

        console.log("Vid =", data);
        setVideos(data);
        console.log("Vid ===> ", vid[0]);
        setVidData(vid[0]);
    }


    const handleTip = async (vidID, tipAmount) => {
        try {

            const allowance = await hasValideAllowance();

            if (allowance < tipAmount) {
                await increaseAllowance(tipAmount);
            } else {
                console.log("Tip amount => ", tipAmount);
                await tipVideoOwner(vidID, tipAmount);
            }
        } catch (error) {
            console.error('Error tipping video owner:', error);
        }
    };

    const handleLikeVid = async (vidId) => {
        await likeVideo(vidId)
    }
    const handleDislikeVid = async (vidId) => {
        await dislikeVideo(vidId)
    }
    const handleSubscribe = async (vidMaker) => {
        console.log("Sun to ====> ", vidMaker);
        // await subscribeToCreator(vidMaker)
    }


    useEffect(() => {

        setRnum(Rnum);
        fetchData(vidId)
    }, [vidId])

    const VITE_GATEWAY_URL = 'violet-rare-crawdad-98.mypinata.cloud';

    return (
        <div className={Style.container}>
            <div className={Style.mainContainder}>
                {vidData && (
                    <>
                        <div className={Style.imgContainer}>
                            <video
                                className={Style.imgFluid}
                                width="100%"
                                height="100%"
                                controls
                                src={`https://${VITE_GATEWAY_URL}/ipfs/${vidData.ipfsHash}`}
                                poster={`https://${VITE_GATEWAY_URL}/ipfs/${vidData.ipfsHash}`}
                                type="video/mp4"
                            />
                        </div>

                        <div className={Style.dataContainer}>

                            <div className={Style.nameAndTip}>
                                <div className={Style.cardTitle}>{vidData.title}</div>
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
                                <Link to={`/creator/${vidData.owner}`}>
                                    <div className={Style.userImgAndName} >

                                        <img className={Style.userImg} src={imgs[`image${rnum}`]} alt="Copy" />

                                        <div className={Style.username}>{vidData.username}
                                        </div>
                                    </div>
                                </Link>
                                <div className={Style.subscribBtn}>
                                    <button className={Style.subBtn} onClick={() => handleSubscribe(vidData.owner)}>Subscribe</button>
                                </div>
                                <div className={Style.likeDislike}>
                                    <button onClick={handleLikeVid} className={Style.likes}>
                                        <small >Like : {vidData.likes}</small>
                                    </button>
                                    <button onClick={handleDislikeVid} className={Style.dislikes}>
                                        <small >Dislike : {vidData.dislikes}</small>
                                    </button>
                                </div>

                            </div>

                            <div>
                                <p className={Style.cardText}>Tip Amount: {(vidData.totalTipAmount) / 10 ** 18}</p>
                                <p className={Style.cardText}>{vidData.description}</p>
                                <p className={Style.cardText}>Genre = {vidData.genre}</p>
                            </div>



                        </div>

                    </>
                )}
            </div>
            <div className={Style.content}>
                {videos.length ? videos.map((video, index) => (
                    <VideoCard key={index} video={video} />
                )) : <p className={Style.noVideos}>No videos available.</p>}
            </div>
        </div>
    )
}

export default ShowVideo