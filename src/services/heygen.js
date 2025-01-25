import { useState, useEffect } from "react";

const API_CONFIG = {
  apiKey: 'Nzc4MjNhMTFmYzNkNGZiNTlhMDQxOTcyYTJkNjMyZDQtMTczNTIxNzY0Ng==', 
  serverUrl: 'https://api.heygen.com'
};

export const generateVideo = async (text) => {
  try {
    const response = await fetch(`${API_CONFIG.serverUrl}/v2/video/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        video_inputs: [{
          character: {
            type: "avatar",
            avatar_id: "June_HR_public",
            avatar_style: "normal"
          },
          voice: {
            type: "text",
            input_text: text,
            voice_id: "2d5b0e6cf36f460aa7fc47e3eee4ba54"
          },
          background: {
            type: "color",
            value: "#008000"
          }
        }],
        dimension: {
          width: 1280,
          height: 720
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Response:', errorData);
      throw new Error(errorData.error?.message || `API call failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Video generation response:', data);
    return {
      task_id: data.data.video_id
    };

  } catch (error) {
    console.error('Error details:', error);
    throw new Error(`Failed to generate video: ${error.message}`);
  }
};

export const checkVideoStatus = async (taskId) => {
  try {
    // Fixed: Using the correct endpoint structure for video status
    const response = await fetch(`${API_CONFIG.serverUrl}/v1/video_status.get?video_id=${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Status check response:', errorData);
      throw new Error(errorData.message || `Status check failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Status check response:', data);
    
    return {
      status: data.data?.status,
      video_url: data.data?.video_url,
      error: data.error
    };
  } catch (error) {
    console.error('Status check error:', error);
    throw new Error(`Failed to check video status: ${error.message}`);
  }
};

export const streamVideo = async (taskId, interval = 5000, maxAttempts = 12) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    const statusResponse = await checkVideoStatus(taskId);

    if (statusResponse.status === 'ready') {
      console.log('Video is ready for streaming:', statusResponse.video_url);
      return statusResponse.video_url; // Return the video URL for streaming
    } else if (statusResponse.status === 'error') {
      throw new Error(`Video generation failed: ${statusResponse.error}`);
    }

    console.log(`Video status: ${statusResponse.status}. Checking again in ${interval / 1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, interval)); // Wait for the specified interval
  }

  throw new Error('Max attempts reached. Video is not ready for streaming.');
};

export const useHeyGenStreaming = () => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [streamStatus, setStreamStatus] = useState('Not Connected');
  const [error, setError] = useState(null);

  // Create a new streaming session
  const createNewSession = async (avatarId, voiceId) => {
    try {
      const response = await fetch(`${API_CONFIG.serverUrl}/v1/streaming.new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': API_CONFIG.apiKey,
        },
        body: JSON.stringify({
          quality: 'high',
          avatar_name: avatarId,
          voice: {
            voice_id: voiceId,
          },
        }),
      });

      const data = await response.json();
      
      // Setup WebRTC connection
      const { sdp: serverSdp, ice_servers2: iceServers } = data.data;
      const newPeerConnection = new RTCPeerConnection({ iceServers });

      // Set remote description
      await newPeerConnection.setRemoteDescription(new RTCSessionDescription(serverSdp));

      setSessionInfo(data.data);
      setPeerConnection(newPeerConnection);
      setStreamStatus('Session Created');

      return { sessionId: data.data.session_id, peerConnection: newPeerConnection };
    } catch (err) {
      setError(`Session creation failed: ${err.message}`);
      setStreamStatus('Connection Failed');
      throw err;
    }
  };

  // Start streaming session
  const startStreamingSession = async () => {
    if (!peerConnection || !sessionInfo) {
      throw new Error('No active session');
    }

    try {
      // Create and set local description
      const localDescription = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(localDescription);

      // Start streaming
      const startResponse = await fetch(`${API_CONFIG.serverUrl}/v1/streaming.start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': API_CONFIG.apiKey,
        },
        body: JSON.stringify({
          session_id: sessionInfo.session_id,
          sdp: localDescription,
        }),
      });

      setStreamStatus('Streaming Started');
      return sessionInfo.session_id;
    } catch (err) {
      setError(`Streaming start failed: ${err.message}`);
      setStreamStatus('Streaming Failed');
      throw err;
    }
  };

  // Send text to avatar
  const sendTextToAvatar = async (text) => {
    if (!sessionInfo) {
      throw new Error('No active session');
    }

    try {
      const response = await fetch(`${API_CONFIG.serverUrl}/v1/streaming.task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': API_CONFIG.apiKey,
        },
        body: JSON.stringify({
          session_id: sessionInfo.session_id,
          text,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      setError(`Send text failed: ${err.message}`);
      throw err;
    }
  };

  // Close streaming session
  const closeSession = async () => {
    if (!sessionInfo) return;

    try {
      await fetch(`${API_CONFIG.serverUrl}/v1/streaming.stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': API_CONFIG.apiKey,
        },
        body: JSON.stringify({
          session_id: sessionInfo.session_id,
        }),
      });

      if (peerConnection) {
        peerConnection.close();
      }

      setSessionInfo(null);
      setPeerConnection(null);
      setStreamStatus('Session Closed');
    } catch (err) {
      setError(`Close session failed: ${err.message}`);
    }
  };

  return {
    createNewSession,
    startStreamingSession,
    sendTextToAvatar,
    closeSession,
    sessionInfo,
    peerConnection,
    streamStatus,
    error
  };
};
