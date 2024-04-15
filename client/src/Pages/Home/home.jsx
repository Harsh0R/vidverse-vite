import React, { useContext, useEffect, useState } from 'react';
import { VidverseContext } from '../../Context/VidverseContext';
import Webplayer from '../../Components/ForLiveStream/Webplayer';
import RegisteredUsers from '../../Components/RegisteredUsers/RegisteredUsers';
import VideoCard from '../../Components/VideoCard/VideoCard';
import { LivepeerConfig, createReactClient, studioProvider } from "@livepeer/react";
import styles from "./Home.module.css";
import imgs from "../../assets/imgs"
import { apiKey } from '../../Context/constants';
import SubscriptionUser from '../../Components/SubscriptionUser/SubscriptionUser';

const Home = () => {
  const { allVideo } = useContext(VidverseContext);
  const [contentToShow, setContentToShow] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [context, setContext] = useState('')
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

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <button onClick={() => setContentToShow('videos')} className={contentToShow === 'videos' ? styles.active : styles.notActive}>Videos</button>
        <button onClick={() => setContentToShow('livestream')} className={contentToShow === 'livestream' ? styles.active : styles.notActive}>LiveStream</button>
        <button onClick={() => setContentToShow('registeredUsers')} className={contentToShow === 'registeredUsers' ? styles.active : styles.notActive}>registeredUsers</button>
        <button onClick={() => setContentToShow('Subscriptions')} className={contentToShow === 'Subscriptions' ? styles.active : styles.notActive}>Subscriptions</button>
      </div>
      <div >
        {contentToShow === 'videos' && (
          <div className={styles.videoGrid}>
            {videos.length ? videos.map((video, index) => (
              <VideoCard key={index} video={video} />
            )) : <p className={styles.noVideos}>No videos available.</p>}
          </div>
        )}
        {contentToShow === 'livestream' && (
          <LivepeerConfig client={livepeerClient}>
            <div className={styles.videoGrid}>
              <Webplayer />
            </div>
          </LivepeerConfig>
        )}
        {contentToShow === 'registeredUsers' && (
          <>
            <RegisteredUsers />
          </>
        )}
        {contentToShow === 'Subscriptions' && (
          <>
            <SubscriptionUser context={''} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
