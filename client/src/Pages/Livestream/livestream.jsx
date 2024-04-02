import React from "react";
import StreamStarterFile from '../../Components/ForLiveStream/StreamStarterFile'
import Style from "./livestream.module.css"
import { useNavigate } from "react-router-dom";


const Livestream = () => {
  let navigate = useNavigate();
  const handleBack = () => {
    let path = `/myAccount`;
    navigate(path);
  }

  return (
    <div className={Style.container}>
      <button onClick={handleBack} className={Style.backArrow}> {`<`}--- Back</button>
      <StreamStarterFile></StreamStarterFile>
    </div>
  )
}

export default Livestream