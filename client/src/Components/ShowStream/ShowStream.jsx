import React, { useContext, useState, useEffect } from 'react'
import { Player } from "@livepeer/react";
import { Link } from 'react-router-dom'
import ChatBox from '../ChatBox/ChatBox';
import { VidverseContext } from '../../Context/VidverseContext';
import { apiKey } from '../../Context/constants';
import imgs from '../../assets/imgs';
import { LivepeerConfig, createReactClient, studioProvider } from "@livepeer/react";
import Style from './ShowStream.module.css'
import ChatRoomCompo from '../ChatRoomCompo/ChatRoomCompo';

const ShowStream = ({ streamId }) => {

  const [rnum, setRnum] = useState();
  const { userName, getStream } = useContext(VidverseContext);
  const [livepeerClient, setLivepeerClient] = useState();
  const [strData, setStrData] = useState()
  const [isLoading, setIsLoading] = useState(true);

  const Rnum = Math.floor(Math.random() * 9);

  const fetchData = async (streamId) => {
    setIsLoading(true);
    try {
      const str = await getStream(streamId)
      // const data = await allVideo();
      // const flag = await isSubscrobeThisCreator(vid[0].owner);
      // const subC = await getSubs(vid[0].owner)
      // const count = subC.length
      // console.log("sub Count ==> ", count);
      // setsubsCount(count)
      // setSubFlag(flag)
      // console.log("Vid =", data);
      // setVideos(data);
      setRnum(Rnum);
      console.log("Vid ===> ", str[0]);
      setStrData(str[0]);
    } finally {
      setIsLoading(false);
    }
  }
  const initializeLivepeerClient = () => {
    const client = createReactClient({ provider: studioProvider({ apiKey }) });
    setLivepeerClient(client);
  };

  useEffect(() => {

    initializeLivepeerClient();
    // setRnum(Rnum);
    fetchData(streamId)
  }, [])


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
    <div>
      <div className={Style.card}>
        <div className={Style.colMd4}>
          {strData &&
            <></>
          }
        </div>
        <div className={Style.colMd8}>
          <div className={Style.cardBody}>


            {/* <div className={Style.cardTitle}>{packId.username}</div>
            <small className={Style.username}>{packId.owner}
            </small> */}
            {/* <div className={styles.likeDislike}>
                <small className={styles.likes}>
                  Like : {video.likes}</small>
                <small className={styles.dislikes}>Dislike : {video.dislikes}</small>
              </div> */}
            {/* <div className={styles.cardText}>{video.description}</div> */}
          </div>
        </div>
        <>
          {/* <ChatBox chat={packId.stramName} name1={userName}></ChatBox> */}
        </>


        {strData && (
          <>
            <div className={Style.broadcastBox}>
              <div className={Style.streamBox}>
                <div className={Style.broadcastBox}>
                  {/* <Broadcast streamKey={strData.streamKey} onError={console.error} /> */}
                  <LivepeerConfig client={livepeerClient}>


                    <Player
                      title={strData.stramName}
                      playbackId={strData.playBackId}
                      showPipButton
                      showTitle={false}
                      aspectRatio="16to9"
                      controls={{
                        autohide: 3000,
                      }}
                      theme={{
                        borderStyles: { containerBorderStyle: "hidden" },
                        radii: { containerBorderRadius: "10px" },
                      }}
                    />
                  </LivepeerConfig>
                </div>
                <div className={Style.nameAndTip}>
                  <div className={Style.cardTitle}>{strData.stramName}</div>
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
                  <Link to={`/creator/${strData.owner}`}>
                    <div className={Style.userImgAndName} >

                      <img className={Style.userImg} src={imgs[`image${rnum}`]} alt="Copy" />

                      <div className={Style.username}>{strData.username}
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

                <p>Playback ID : {strData.playBackId}</p>
                <p>Genre : {strData.genre}</p>
            
              </div>
              <ChatBox chat={strData.stramName} name1={userName} />
              {/* <ChatRoomCompo chatTopic={strData.stramName}/> */}
            </div>
          </>
        )}



      </div>
    </div>
  )
}

export default ShowStream