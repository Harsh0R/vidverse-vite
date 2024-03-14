import React, { useContext, useEffect, useState } from 'react';
import { VidverseContext } from '../../Context/VidverseContext';
import { Link } from 'react-router-dom';
import Style from "./myaccount.module.css";
import StreamStarterFile from '../../Components/ForLiveStream/StreamStarterFile';

const MyAccount = () => {
  const { allVideo, uploadVideos, account } = useContext(VidverseContext);
  const [toggle, setToggle] = useState('');
  const [videoName, setVideoName] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [uploadedVid, setUploadedVid] = useState([]);

  const [selectedFile, setSelectedFile] = useState();
  const [cid, setCid] = useState();
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await allVideo();
        const filteredVideos = data.filter(video => video.owner.toLowerCase() === account.toLowerCase());
        setUploadedVid(filteredVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchData();
  }, [account, allVideo]);

  const VITE_PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZGEwYTM0My04ODE1LTQ4MGItODY1MS1iYmEwZDM5NGJjNzAiLCJlbWFpbCI6ImhhcnNocmFkYWRpeWE5OTk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkZGFmYWE2NjQ4OWQ0MDEyZDNkOSIsInNjb3BlZEtleVNlY3JldCI6ImFhNmRjN2I3YWQxMjRkZWVlODZjMzBlMTZjZmU1NTdmYWMyOGU1YWY5ZTMwOGI0MzFlNWFmNGQ2NDY5ZTk1MWYiLCJpYXQiOjE3MTAyMzY3MDh9.UWUL6dQB4P1-Qe75mr07QQizVkaLepOHLyYuHK7gBvM'
  const VITE_GATEWAY_URL = 'violet-rare-crawdad-98.mypinata.cloud';

  const handleSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setCid(resData.IpfsHash)
      await uploadVideos(videoName, videoDescription, resData.IpfsHash);
      setUploadedVid([...uploadedVid, {
        title: videoName,
        description: videoDescription,
        ipfsHash: resData.IpfsHash,
        owner: account,
      }]);
      setVideoName('');
      setVideoDescription('');
      console.log(resData);
    } catch (error) {
      console.log("Error in upload videos : ", error);
    }
  };


  return (
    <div className={Style.myAccountContainer}>
      <h2 className={Style.heading1}>My Account : {account}</h2>

      <button className={`${Style.listgroupitem} ${toggle === 'videos' ? Style.active : ''}`} onClick={() => setToggle('videos')}>
        Upload Videos
      </button>
      <Link to='/livestream' className={Style.btnPrimary}>
        <button className={`${Style.listgroupitem} ${toggle === 'livestream' ? Style.active : ''}`} onClick={() => setToggle('livestream')}>
          Create LiveStream
        </button>
      </Link>

      {toggle == 'videos' &&
        (
          <div className={Style.uploadVidBlock}>
            <h2 className={Style.heading}>Upload New Video</h2>
            <div className={Style.inputGroup}>
              <div>Video Name : </div>
              <input
                className={Style.formControl}
                type="text"
                placeholder="Video Name"
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
              />
            </div>
            <div className={Style.inputGroup}>
              <div>Video Description : </div>
              <input
                className={Style.formControl}
                type="text"
                placeholder="Video Description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
              />
            </div>
            <div className={Style.inputGroup}>
              <div>Upload New Video :</div>
              <input
                className={Style.formControl}
                type="file"
                onChange={changeHandler}
              />
            </div>
            <div>
              <button onClick={handleSubmission}>Upload Video</button>
            </div>
          </div>
        )}
 
      <div className={Style.uploadedVidBlock}>
        <h2 className={Style.heading}>Uploaded Videos</h2>
        <div className={Style.listGroup}>
          {uploadedVid.map((video, index) => (
            <div key={index} className={Style.listGroupItem}>
              <div className={Style.videoDetails}>
                <h5 className={Style.videoTitle}>Title = {video.title}</h5>
                <p className={Style.videoDescription}>des = {video.description}</p>
                <small className={Style.videoCID}>CID: {video.ipfsHash}
                  <br />
                  https://{VITE_GATEWAY_URL}/ipfs/${video.ipfsHash}
                </small>
              </div>
              {video.ipfsHash && (
                <>
                  <img
                    src={`https://${VITE_GATEWAY_URL}/ipfs/${video.ipfsHash}`}
                    alt="ipfs image"
                  />
                </>
              )}
              <br></br>
              <br></br>
              <br></br>
              <br></br>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MyAccount;


// https://violet-rare-crawdad-98.mypinata.cloud/ipfs/QmVFmFMYYFxkhcV7Zse5ATHXaW3ix8bExBmZaf94GhMpYh
// violet-rare-crawdad-98.mypinata.cloud/ipfs/$QmeXWi16h1Ca7ZzJGHAsft6Qfsbw22z9hKWrNqng2sTnZp
{/* <video className={Style.videoPlayer} controls src={`https://gateway.lighthouse.storage/ipfs/${video.ipfsHash}`} /> */}