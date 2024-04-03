import React, { useContext, useEffect, useState } from "react";
import { Player } from "@livepeer/react";
import ChatBox from "../ChatBox/ChatBox";
import { VidverseContext } from "../../Context/VidverseContext";

const Webplayer = () => {
  const [liveStreams, setLiveStreams] = useState([]);

  const { getAllLiveStreamData, userName } = useContext(VidverseContext);

  const handleShowLiveStream = async () => {
    const streams = await getAllLiveStreamData(); // Assume this returns an array of streams
    setLiveStreams(streams); // Set the live streams state
    console.log("Streams = ", streams);
  }

  useEffect(() => {
    handleShowLiveStream()

  }, [])


  return (
    <div>
      {/* <button style={{ color: 'black' }}>Show live stream</button> */}
      {liveStreams.length > 0 ? (
        <div>
          {liveStreams.map((stream, index) => (
            <div key={index}>
              <div style={{ width: "20%" }}>
                <p>Stream Name: {stream.stramName}</p> {/* Note the typo 'stramName' might be a mistake. */}
                <p>Owner: {stream.owner}</p>
                <p>Playback ID: {stream.playBackId}</p>

                <>
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
                  <ChatBox chat={stream.stramName} name1={userName}></ChatBox>
                </>
              </div>

            </div>

          ))}
        </div>
      ):(
        <p>No stream is live</p>
      )
    }

    </div>
  );
};

export default Webplayer;
