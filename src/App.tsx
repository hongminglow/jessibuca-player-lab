import { useState } from "react";
import "./App.css";
import SmartVideoPlayer from "./component/player/SmartVideoPlayer";

const SAMPLE_FLV_STREAM =
  "https://flvplayer.js.org/assets/video/weathering-with-you.flv";
const SAMPLE_HLS_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const SAMPLE_MP4_STREAM =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const TWITCH_STREAM =
  "https://www.twitch.tv/rayasianboy/clip/CulturedSuaveChipmunkDancingBanana-p46gqclK6MfiquFa";

function App() {
  const [currentStream, setCurrentStream] = useState(SAMPLE_FLV_STREAM);

  const handleStreamChange = (streamUrl: string) => {
    setCurrentStream(streamUrl);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Jessibuca Video Player Lab</h1>
        <p>Testing multiple video formats with smart player detection</p>
      </div>

      <div className="controls">
        <button onClick={() => handleStreamChange(SAMPLE_FLV_STREAM)}>
          Test FLV Stream
        </button>
        <button onClick={() => handleStreamChange(SAMPLE_HLS_STREAM)}>
          Test HLS Stream
        </button>
        <button onClick={() => handleStreamChange(SAMPLE_MP4_STREAM)}>
          Test MP4 Stream
        </button>
        <button onClick={() => handleStreamChange(TWITCH_STREAM)}>
          Test Twitch Stream
        </button>
      </div>

      <div className="player-wrapper">
        <SmartVideoPlayer
          videoLink={currentStream}
          className="rounded-t-xl"
          enablePause={true}
          controls={true}
          playing={true}
          muted={true}
        />
      </div>

      <div className="stream-info">
        <p>
          <strong>Current Stream:</strong> {currentStream}
        </p>
        <p>
          <strong>Format detected:</strong> {getVideoFormat(currentStream)}
        </p>
      </div>
    </div>
  );
}

// Helper function to detect video format (moved from SmartVideoPlayer for display)
function getVideoFormat(url: string): string {
  if (!url) return "unknown";

  const urlLower = url.toLowerCase();

  if (urlLower.includes(".mp4") || urlLower.includes("mp4")) return "mp4";
  if (urlLower.includes(".webm")) return "webm";
  if (urlLower.includes(".ogv") || urlLower.includes(".ogg")) return "ogv";
  if (urlLower.includes(".flv") || urlLower.includes("flv")) return "flv";
  if (urlLower.includes(".m3u8") || urlLower.includes("hls")) return "hls";
  if (urlLower.includes("rtmp://")) return "rtmp";
  if (urlLower.includes("rtsp://")) return "rtsp";
  if (urlLower.includes("twitch.tv")) return "twitch";

  if (urlLower.includes("/live/") || urlLower.includes("live.")) return "live";
  if (urlLower.startsWith("http") && !urlLower.includes("live")) return "mp4";

  return "unknown";
}

export default App;
