import React, { useContext, useEffect, useState } from 'react';
import { VidverseContext } from '../../Context/VidverseContext';
import { Link } from 'react-router-dom';
import Error from '../../Components/Error/Error.jsx'
import Style from "./myaccount.module.css";

const MyAccount = () => {
  const { allVideo, uploadVideos, account, allMyVideos, userName } = useContext(VidverseContext);
  const [toggle, setToggle] = useState('');
  const [videoName, setVideoName] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [uploadedVid, setUploadedVid] = useState([]);
  const [vidGenre, setVidGenre] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [error, setError] = useState('')
  const [cid, setCid] = useState();
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRoyaltyChange = (event) => {
    setVidGenre(event.target.value);
  };

  const genreArr = ["Gaming", "Comedy", "Drama", "Tech", "Education", "SciFi", "Social", "News"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const acc = await account;
        const data = await allMyVideos(acc);
        // console.log('fetching videos:', data);
        setUploadedVid(data);
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
      await uploadVideos(videoName, videoDescription, resData.IpfsHash, vidGenre);
      // setUploadedVid([...uploadedVid, {
      //   title: videoName,
      //   description: videoDescription,
      //   ipfsHash: resData.IpfsHash,
      //   owner: account,
      // }]);
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

      <button className={`${Style.listgroupitem} ${toggle === 'videos' ? Style.active : ''}`} onClick={() => { userName !== '' ? setToggle('videos') : setError('Register First Then Upload') }}>
        Upload Videos
      </button>
      <Link to='/livestream' className={Style.btnPrimary}>
        <button className={`${Style.listgroupitem} ${toggle === 'livestream' ? Style.active : ''}`} onClick={() => { userName !== '' ? setToggle('livestream') : setError('Register First Then Go Live') }}>
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
              <div>Select Your Video Genre : </div>
              <select
                value={vidGenre}
                onChange={handleRoyaltyChange}
                className={Style.input}
              >
                <option value="">Select Video Genre</option>
                {genreArr.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
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
                {video.ipfsHash && (
                  <>
                    <img
                      src={`https://${VITE_GATEWAY_URL}/ipfs/${video.ipfsHash}`}
                      alt="ipfs image"
                    />
                  </>
                )}
                <h3 className={Style.videoTitle}>{video.title}</h3>
                <div className={Style.username}>{video.username}
                  <div className={Style.likeDislike}>
                    <small className={Style.likes}>
                      Like : {video.likes}</small>
                    <small className={Style.dislikes}>Dislike : {video.dislikes}</small>
                  </div>
                </div>
                <small className={Style.videoDescription}>des = {video.description}</small>
                <small className={Style.genre}>Genre = {video.genre}</small>
                <p className={Style.cardText}>Tip Amount: {(video.totalTipAmount)/10**18} NVT</p>
                {/* <small className={Style.videoCID}>CID: {video.ipfsHash}
                  <br />
                  https://{VITE_GATEWAY_URL}/ipfs/${video.ipfsHash}
                </small> */}
              </div>
              {/* <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const tipAmount = e.target.elements.totalTipAmount.value;
                  handleTip(video.VideoPlatform_id, tipAmount);
                }}
              ></form> */}
            </div>
          ))}
        </div>


      </div>

      {error && <Error error={error} />}
      
    </div>
  );
};

export default MyAccount;


// https://violet-rare-crawdad-98.mypinata.cloud/ipfs/QmVFmFMYYFxkhcV7Zse5ATHXaW3ix8bExBmZaf94GhMpYh
// violet-rare-crawdad-98.mypinata.cloud/ipfs/$QmeXWi16h1Ca7ZzJGHAsft6Qfsbw22z9hKWrNqng2sTnZp
{/* <video className={Style.videoPlayer} controls src={`https://gateway.lighthouse.storage/ipfs/${video.ipfsHash}`} /> */ }