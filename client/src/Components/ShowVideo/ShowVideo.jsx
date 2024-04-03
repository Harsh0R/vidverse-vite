import React, { useContext, useEffect, useState } from 'react'
import { VidverseContext } from '../../Context/VidverseContext'
import Style from "./ShowVideo.module.css"
import imgs from '../../assets/imgs'
import { Link } from 'react-router-dom'
import VideoCard from '../VideoCard/VideoCard'
import Error from '../Error/Error'
import Loader from '../Loader/Loader'

const ShowVideo = ({ vidId }) => {

    const { getVid, hasValideAllowance, allVideo, tipVideoOwner, increaseAllowance, dislikeVideo, likeVideo, userName, subscribeToCreator, isSubscrobeThisCreator, unsubscribeFromCreator, getSubs } = useContext(VidverseContext);
    const [vidData, setVidData] = useState()
    const [rnum, setRnum] = useState();
    const Rnum = Math.floor((Math.random() * 9) + 1);
    const [subFlag, setSubFlag] = useState(false)
    const [videos, setVideos] = useState([]);
    const [subsCount, setsubsCount] = useState(0)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true); // State to manage overall loading
    const [isSubmitting, setIsSubmitting] = useState(false); // State for loading during form submission


    const fetchData = async (vidId) => {
        setIsLoading(true); // Start loading
        try {
            const vid = await getVid(vidId)
            const data = await allVideo();
            const flag = await isSubscrobeThisCreator(vid[0].owner);
            const subC = await getSubs(vid[0].owner)
            const count = subC.length
            console.log("sub Count ==> ", count);
            setsubsCount(count)
            setSubFlag(flag)
            console.log("Vid =", data);
            setVideos(data);
            console.log("Vid ===> ", vid[0]);
            setVidData(vid[0]);
        } finally {
            setIsLoading(false); // End loading
        }
    }

    useEffect(() => {

        setRnum(Rnum);
        fetchData(vidId)
    }, [vidId, vidData])


    const handleTip = async (vidID, tipAmount) => {
        try {
            if (userName && userName !== '') {
                const allowance = await hasValideAllowance();

                if (allowance < tipAmount) {
                    await increaseAllowance(tipAmount);
                } else {
                    console.log("Tip amount => ", tipAmount);
                    await tipVideoOwner(vidID, tipAmount);
                }
            } else {
                setError('Register First Then you can tip other creator')
            }

        } catch (error) {
            console.error('Error tipping video owner:', error);
        }
    };

    const handleLikeVid = async (vidId) => {
        // console.log("Vid id ==> ",vidId);
        if (userName && userName !== '') {
            await likeVideo(vidId)
        }
        else {
            setError('Register First Then you can Like other creator video')
        }
    }
    const handleDislikeVid = async (vidId) => {
        if (userName && userName !== '') {
            await dislikeVideo(vidId)
        }
        else {
            setError('Register First Then you can Dislike other creator video')
        }
    }
    const handleSubscribe = async (vidMaker) => {
        if (userName && userName !== '') {
            console.log("Sub to ====> ", vidMaker);
            // await subscribeToCreator(vidMaker)
        }
        else {
            setError('Register First Then you can Subscribe other creator')
        }
    }
    const handleUnsubscribe = async (vidMaker) => {
        if (userName && userName !== '') {
            console.log("UnSub to ====> ", vidMaker);
            await unsubscribeFromCreator(vidMaker)
        }
        else {
            setError('Register First Then you can Subscribe other creator')
        }
    }


    const VITE_GATEWAY_URL = 'violet-rare-crawdad-98.mypinata.cloud';

    return (
        <div className={Style.container}>
            {!isLoading ? (
                <>
                    <div className={Style.mainContainder}>
                        {vidData ? (
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
                                                    <button className={Style.btn}
                                                        type="submit">
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

                                                <div className={Style.username}>
                                                    <div>
                                                        {vidData.username}
                                                    </div>
                                                    <div className={Style.subCount}>
                                                        Subs : {subsCount}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className={Style.subscribBtn}>
                                            {!subFlag ? (

                                                <button className={Style.subBtn} onClick={() => handleSubscribe(vidData.owner)}>Subscribe</button>
                                            ) : (
                                                <button className={Style.unSubBtn} onClick={() => handleUnsubscribe(vidData.owner)}>Unsubscribe</button>

                                            )}
                                        </div>
                                        <div className={Style.likeDislike}>
                                            <button onClick={() => handleLikeVid(vidId)} className={Style.likes}>
                                                <small >Like : {vidData.likes}</small>
                                            </button>
                                            <button onClick={() => handleDislikeVid(vidId)} className={Style.dislikes}>
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
                        ) : (
                            <div className={Style.loader}>
                                video not found...
                            </div>
                        )
                        }
                    </div>
                    <div className={Style.content}>
                        {videos.length ? videos.map((video, index) => (
                            <VideoCard key={index} video={video} />
                        )) : <p className={Style.noVideos}>No videos available.</p>}
                    </div>
                </>

            ) : (
                <>
                    <div className={Style.loader}>
                        <Loader />
                    </div>
                </>
            )}
            {error && <Error error={error} />}
        </div>
    )
}

export default ShowVideo