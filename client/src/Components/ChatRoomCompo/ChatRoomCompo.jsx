import React, { useContext, useEffect, useState } from 'react'
import { useFilterMessages, useLightPush, useStoreMessages, useWaku } from "@waku/react";
import { createEncoder, createDecoder } from "@waku/sdk";
import protobuf from 'protobufjs';
import { VidverseContext } from '../../Context/VidverseContext';
import Style from "./ChatRoomCompo.module.css"

const ChatRoomCompo = ({ chatTopic }) => {
    // console.log("Topic Name ===> " , chatTopic);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const { createChatRoom, userName, account, chatRoomName } = useContext(VidverseContext);
    // Update the inputMessage state as the user input changes
    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    // Create and start a Light Node
    const { node, error, isLoading } = useWaku();

    // Create a message encoder and decoder
    const contentTopic = `/waku-react-guide/1/${chatTopic}/proto`;
    const encoder = createEncoder({ contentTopic });
    const decoder = createDecoder(contentTopic);

    // Create a message structure using Protobuf
    const ChatMessage = new protobuf.Type("ChatMessage")
        .add(new protobuf.Field("timestamp", 1, "uint64"))
        .add(new protobuf.Field("message", 2, "string"))
        .add(new protobuf.Field("name", 3, "string")); // Add this line to include the sender's name

    // Send the message using Light Push
    const { push } = useLightPush({ node, encoder });

    // Query Store peers for past messages
    const { messages: storeMessages } = useStoreMessages({ node, decoder });

    // Receive messages from Filter subscription
    const { messages: filterMessages } = useFilterMessages({ node, decoder });


    // Render both past and new messages
    useEffect(() => {
        const allMessages = storeMessages.concat(filterMessages);
        const uniqueMessages = allMessages.reduce((acc, message) => {
            // Assuming each message has a unique ID or a combination of timestamp and payload can be used
            const key = message.id || `${message.timestamp}-${message.payload}-${message.name}`; // Include the sender's name in the key

            if (!acc.has(key)) {
                acc.set(key, message);
            }
            return acc;
        }, new Map());
        setMessages(Array.from(uniqueMessages.values()).map((wakuMessage) => {
            if (!wakuMessage.payload) return;
            return ChatMessage.decode(wakuMessage.payload);
        }));
    }, [filterMessages, storeMessages]);
    // useEffect(() => {
    //   const allMessages = storeMessages.concat(filterMessages);
    //   setMessages(allMessages.map((wakuMessage) => {
    //     if (!wakuMessage.payload) return;
    //     return ChatMessage.decode(wakuMessage.payload);
    //   }));
    // }, [filterMessages, storeMessages]);

    // Send the message using Light Push
    const sendMessage = async () => {
        if (!push || inputMessage.length === 0) return;

        // Create a new message object
        const timestamp = Date.now();
        const protoMessage = ChatMessage.create({
            timestamp: timestamp,
            message: inputMessage,
            name: userName, // Assuming 'nick' is the sender's name
        });
        // Serialise the message and push to the network
        const payload = ChatMessage.encode(protoMessage).finish();
        const { recipients, errors } = await push({ payload, timestamp });

        // Check for errors
        if (errors.length === 0) {
            setInputMessage("");
            console.log("MESSAGE PUSHED");
        } else {
            console.log(errors);
        }
    };


    return (
        <div> <div className="chat-interface">
            <h1>{chatTopic} Room</h1>
            <div className="chat-body">
                {messages.map((message, index) => (
                    <div key={index} className="chat-message">
                        <span>{new Date(message.timestamp).toUTCString()}</span>
                        <br /> <span>Fom : {message.name} </span> {/* Display the sender's name */}
                        <div className="message-text">{message.message}</div>
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    id="message-input"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div></div>
    )
}

export default ChatRoomCompo