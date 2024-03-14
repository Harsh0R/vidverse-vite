import React, { useContext, useState } from "react";
import StreamStarterFile from '../../Components/ForLiveStream/StreamStarterFile'
import Style from "../Home/Home.module.css"


const Livestream = () => {


  return (
    <div className={Style.container}>
      <StreamStarterFile></StreamStarterFile>
    </div>
  )
}

export default Livestream