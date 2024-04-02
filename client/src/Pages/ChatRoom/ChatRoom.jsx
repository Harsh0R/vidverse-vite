import React, { useContext, useEffect, useState } from 'react'
import { createLightNode, waitForRemotePeer, Protocols, createEncoder, createDecoder } from "@waku/sdk";
import protobuf from "protobufjs";
import ChatRoomCompo from '../../Components/ChatRoomCompo/ChatRoomCompo';
import { LightNodeProvider } from "@waku/react";
import { useNavigate } from "react-router-dom";
import Style from "./ChatRoom.module.css"
import { VidverseContext } from '../../Context/VidverseContext';
const ChatRoom = () => {

    const [chatRoomTopic, setChatRoomTopic] = useState()
    const [flag, setFlag] = useState(false)
    const { createChatRoom, userName, account, chatRoomName } = useContext(VidverseContext);


    const NODE_OPTIONS = { defaultBootstrap: true };
    let navigate = useNavigate();
    const handleBack = () => {
        let path = `/myAccount`;
        navigate(path);
    }


    const handleCreateChatRoom = async () => {
        createChatRoom(chatTopic, userName, account);
        setFlag(true);
    }

    return (
        <div>
            <button onClick={handleBack} className={Style.backArrow}> {`<`}--- Back</button>

            {/* {(chatRoomTopic && flag) ? (
                <>
                    <LightNodeProvider options={NODE_OPTIONS}>
                        <ChatRoomCompo chatTopic={chatRoomTopic} />
                    </LightNodeProvider>

                </>
            ) : (
                <>
                    Enter Room Name : <input type="text" onChange={(e) => setChatRoomTopic(e.target.value)} />
                    <button onClick={handleCreateChatRoom}>Make Chat Room</button>
                </>
            )} */}

            {chatRoomName == '' || chatRoomName == null ?
                (<>
                    Enter Room Name : <input type="text" onChange={(e) => setChatRoomTopic(e.target.value)} />
                    <button onClick={handleCreateChatRoom}>Make Chat Room</button>
                </>
                ) : (
                    <>
                        <LightNodeProvider options={NODE_OPTIONS}>
                            <ChatRoomCompo chatTopic={chatRoomName} />
                        </LightNodeProvider>
                    </>
                )
            }

        </div>
    )
}

export default ChatRoom