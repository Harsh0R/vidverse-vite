import React, { useContext, useEffect, useState } from 'react';
import { VidverseContext } from '../../Context/VidverseContext';
import Webplayer from '../../Components/ForLiveStream/Webplayer';
import VideoCard from '../../Components/VideoCard/VideoCard';
import { LivepeerConfig, createReactClient, studioProvider } from "@livepeer/react";
import styles from "./Home.module.css";
import { apiKey } from '../../Context/constants';

const Home = () => {
  const { allVideo, tipVideoOwner, hasValideAllowance, increaseAllowance, checkIfWalletConnected } = useContext(VidverseContext);
  const [contentToShow, setContentToShow] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [livepeerClient, setLivepeerClient] = useState();

  useEffect(() => {
    const initializeLivepeerClient = () => {
      const client = createReactClient({ provider: studioProvider({ apiKey }) });
      setLivepeerClient(client);
    };

    const fetchVideos = async () => {
      if (contentToShow === 'videos') {
        try {
          const data = await allVideo();

          console.log("Vid =", data);
          setVideos(data);
        } catch (error) {
          console.error('Error fetching videos:', error);
        }
      }
    };

    initializeLivepeerClient();
    fetchVideos();
  }, [contentToShow, allVideo]);

  const handleTip = async (vidID, tipAmount) => {
    try {

      const allowance = await hasValideAllowance();

      if (allowance < tipAmount) {
        await increaseAllowance(tipAmount);
      } else {
        console.log("Tip amount => " , tipAmount);
        await tipVideoOwner(vidID, tipAmount);
      }
    } catch (error) {
      console.error('Error tipping video owner:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <button onClick={() => setContentToShow('videos')} className={contentToShow === 'videos' ? styles.active : ''}>Videos</button>
        <button onClick={() => setContentToShow('livestream')} className={contentToShow === 'livestream' ? styles.active : ''}>LiveStream</button>
      </div>
      <div className={styles.content}>
        {contentToShow === 'videos' && (
          <div>
            {videos.length ? videos.map((video, index) => (
              <VideoCard key={index} video={video} handleTip={handleTip} />
            )) : <p className={styles.noVideos}>No videos available.</p>}
          </div>
        )}
        {contentToShow === 'livestream' && (
          <LivepeerConfig client={livepeerClient}>
            <Webplayer />
          </LivepeerConfig>
        )}
      </div>
    </div>
  );
};

export default Home;
