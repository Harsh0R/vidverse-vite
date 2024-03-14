import React, { useContext, useEffect, useState } from 'react';
import { Broadcast, LivepeerConfig, createReactClient, studioProvider, useCreateStream } from "@livepeer/react";
import ChatBox from '../ChatBox/ChatBox';
import Style from "./StreamCss.module.css"
import { VidverseContext } from '../../Context/VidverseContext';

const LivestreamCom = () => {
    const [streamName, setStreamName] = useState('');
    const [error, setError] = useState('');
    const [activeStream, setActiveStream] = useState(null);
    const { createLiveStream, getMyActiveLiveStreams, stopStreamByStreamID, account } = useContext(VidverseContext);

    const apiToken = '45cddd3a-e60e-4a8b-b121-e353f8b107b0';
    const { mutate: createStream, data: createdStream, status } = useCreateStream(
        streamName ? { name: streamName } : null
    );

    useEffect(() => {
        const fetchActiveStreams = async () => {
            try {
                // console.log("Acc in S l ", account);
                if (account) {
                    const streams = await getMyActiveLiveStreams(account);
                    if (streams.length > 0) {
                        setActiveStream(streams[0]); // Assuming you want the first active stream
                    }
                }
            } catch (error) {
                console.error("Error fetching active live streams:", error);
            }
        };

        fetchActiveStreams();
    }, [getMyActiveLiveStreams, account]);

    const updateInContract = async () => {
        try {
            await createLiveStream(createdStream.name, createdStream.playbackId, createdStream.streamKey, createdStream.id);
            setActiveStream({ ...createdStream, status: true });
            window.location.reload();
        } catch (error) {
            console.error("Error updating stream in contract:", error);
            setError("Failed to update stream. Please try again.");
        }
    };

    const handleCreateStream = () => {
        if (!streamName) {
            setError('Stream name is required.');
            return;
        }
        createStream();
    };

    const handleStopStream = async () => {
        try {
            console.log("Strdt sr , =", activeStream.streamID);
            const response = await fetch(`https://livepeer.studio/api/stream/${activeStream.streamID}/terminate`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${apiToken}` }
            });

            if (response.status === 204) {
                console.log('Livestream terminated successfully.');
                await stopStreamByStreamID(activeStream.streamID);
                setActiveStream(null); // Reset or remove the active stream from state
            } else {
                console.error('Failed to terminate livestream.');
                setError('Failed to terminate the livestream. Please try again.');
            }
        } catch (error) {
            console.error('Error terminating livestream:', error);
            setError('Failed to stop stream. Please try again.');
        }
    };

    return (
        <div className={Style.container}>
            <div>Enter Stream Name:</div>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Stream Name"
                value={streamName}
                onChange={(e) => setStreamName(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleCreateStream} disabled={status === "loading"}>
                {status === "loading" ? 'Creating Stream...' : 'Create Stream'}
            </button>
            {createdStream && (
                <button className="btn btn-success" onClick={updateInContract} disabled={!createdStream}>
                    Start Stream
                </button>
            )}
            {error && <p className="text-danger mt-3">{error}</p>}
            {activeStream && (
                <div className="mt-3">
                    <p>Stream: {activeStream.stramName}</p>
                    <p>Playback ID: {activeStream.playBackId}</p>
                    <Broadcast streamKey={activeStream.streamKey} onError={console.error} />
                    <ChatBox chat={activeStream.stramName} />
                    <button className="btn btn-danger" onClick={handleStopStream}>
                        Stop Stream
                    </button>
                </div>
            )}
        </div>
    );
};

export default LivestreamCom;
