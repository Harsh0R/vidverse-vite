import React, { useContext } from 'react'
import ChatBox from '../ChatBox/ChatBox'
import { Player } from "@livepeer/react";
import { VidverseContext } from '../../Context/VidverseContext';
import Style from "./StreamCard.module.css"
import { Link } from 'react-router-dom';

const StreamCard = ({ stream }) => {


    return (
        <div>
            <div className={Style.card}>
                <Link to={`/WatchStream/${stream.VideoPlatform_id}`}>
                    <div className={Style.colMd4}>

                        <Player
                            title={stream.stramName}
                            playbackId={stream.playBackId}
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


                    </div>
                    <div className={Style.colMd8}>
                        <div className={Style.cardBody}>


                            <div className={Style.cardTitle}>{stream.username}</div>
                            <small className={Style.username}>{stream.owner}
                                {/* <div className={styles.likeDislike}>
                <small className={styles.likes}>
                  Like : {video.likes}</small>
                <small className={styles.dislikes}>Dislike : {video.dislikes}</small>
              </div> */}
                            </small>
                            {/* <div className={styles.cardText}>{video.description}</div> */}
                        </div>
                    </div>
                </Link>
                <>
                    {/* <ChatBox chat={stream.stramName} name1={userName}></ChatBox> */}
                </>
            </div>
        </div>
    )
}

export default StreamCard