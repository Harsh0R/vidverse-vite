import React, { useContext, useState } from "react";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import Webplayer from "./Webplayer";
import { VidverseContext } from "../../Context/VidverseContext";
import LivestreamCom from "./StartLivestream";


const StreamStarterFile = () => {
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [playbackId, setPlaybackId] = useState("");
  const [createStreamMode, setCreateStreamMode] = useState(true); 

  const apiKey = "45cddd3a-e60e-4a8b-b121-e353f8b107b0";

  const livepeerClient = createReactClient({
    provider: studioProvider({ apiKey: apiKey }),
  });
  return (
    <LivepeerConfig client={livepeerClient}>
      {createStreamMode ? (
        <div>
          <LivestreamCom
            onStreamCreated={(streamId) => {
              setPlaybackId(streamId);
              setShowLiveStream(true);
              setCreateStreamMode(false);
            }}
            
          />
        </div>
      ) : (
        <div> 
         {showLiveStream && <Webplayer />}
        </div>
      )}
    </LivepeerConfig>
  );
};

export default StreamStarterFile;
