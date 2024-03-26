import React, { useState } from "react";
import styles from "./VideoCard.module.css";
import { Link } from "react-router-dom";
const VideoCard = ({ video, handleTip }) => {

  const CID = video.ipfsHash
    ? `${video.ipfsHash.slice(0, 4)}...${video.ipfsHash.slice(-4)}`
    : "";
  const makerAdd = video.owner
    ? `${video.owner.slice(0, 4)}...${video.owner.slice(-4)}`
    : "";
  const VITE_GATEWAY_URL = 'violet-rare-crawdad-98.mypinata.cloud';


  return (
    <div className={styles.card}>
      <Link to={`/watch/${video.VideoPlatform_id}`}>
        <div className={styles.colMd4}>
          <img
            className={styles.imgFluid}
            // width="100%"
            // height="100%"
            controls
            src={`https://${VITE_GATEWAY_URL}/ipfs/${video.ipfsHash}`}
            type="video/mp4"
          />
          
          {/* <video
            className={styles.imgFluid}
            width="100%"
            height="100%"
            controls
            src={`https://gateway.lighthouse.storage/ipfs/${video.ipfsHash}`}
            type="video/mp4"
          /> */}

        </div>
        <div className={styles.colMd8}>
          <div className={styles.cardBody}>


            <h3 className={styles.cardTitle}>{video.title}</h3>
            <div className={styles.username}>{video.username}
              <div className={styles.likeDislike}>
                <small className={styles.likes}>
                  Like : {video.likes}</small>
                <small className={styles.dislikes}>Dislike : {video.dislikes}</small>
              </div>
            </div>
            <p className={styles.cardText}>{video.description}</p>
          
          </div>
        </div>
      </Link>
    </div>
  );
};
export default VideoCard;





  {/* <p className={styles.cardText}>
            <small className={styles.textMuted}>CID: {CID}</small>
            </p>
            <p className={styles.cardText}>
            <small className={styles.textMuted}>Owner: {makerAdd}</small>
          </p> */}
            {/* <small className={styles.textMuted}>CID: {video.ipfsHash}</small> */}
            {/* <p className={styles.cardText}>Tip Amount: {video.totalTipAmount}</p> */}
            {/* <p className={styles.cardText}>Maker = {video.username}</p> */}
            {/* <small className={styles.cardText}>Like = {video.likes}</small>
          <small className={styles.cardText}>Dislike = {video.dislikes}</small> */}
            {/* <p className={styles.cardText}>Genre = {video.genre}</p> */}
            {/* <form
            onSubmit={(e) => {
              e.preventDefault();
              const tipAmount = e.target.elements.tipAmount.value;
              handleTip(video.VideoPlatform_id, tipAmount);
            }}
          >
            <div className={styles.inputGroup}>
              <input
                type="number"
                className={styles.formControl}
                name="tipAmount"
                placeholder="Tip Amount"
              />
              <button className={styles.btn} type="submit">
                Give Tip
              </button>
            </div>
          </form> */}