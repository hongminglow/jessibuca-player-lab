import { forwardRef, useMemo } from "react";
import ReactPlayer from "react-player";
import JVideoPlayer, { type JVideoPlayerHandle } from "./index";
import type { VideoPlayerProps } from "../../types";

const detectVideoFormat = (url: string): string => {
  if (!url) {
    return "unknown";
  }

  const urlLower = url.toLowerCase();

  if (urlLower.includes(".flv") || urlLower.includes("flv")) return "flv";
  if (urlLower.includes(".m3u8") || urlLower.includes("hls")) return "hls";
  if (urlLower.includes("rtmp://")) return "rtmp";
  if (urlLower.includes("rtsp://")) return "rtsp";
  if (urlLower.includes("twitch.tv")) return "twitch";
  if (urlLower.includes(".mp4") || urlLower.includes("mp4")) return "mp4";
  if (urlLower.includes(".webm")) return "webm";
  if (urlLower.includes(".ogv") || urlLower.includes(".ogg")) return "ogv";
  if (
    urlLower.includes("/live/") ||
    urlLower.includes("live.") ||
    urlLower.includes("stream")
  ) {
    return "live";
  }
  if (urlLower.startsWith("http")) {
    return "flv";
  }

  return "unknown";
};

const shouldUseReactPlayerFor = (url: string, format: string): boolean => {
  const reactPlayerFormats = ["mp4", "webm", "ogv"];
  const urlLower = url.toLowerCase();

  const hasFileExtension = reactPlayerFormats.some(
    (ext) =>
      urlLower.includes(`.${ext}`) &&
      !urlLower.includes("live") &&
      !urlLower.includes("stream")
  );

  return hasFileExtension && reactPlayerFormats.includes(format);
};

const buildJessibucaConfig = (url: string, format: string): string => {
  const urlLower = url.toLowerCase();
  const isFlv = format === "flv" || urlLower.includes(".flv");
  const isHls = format === "hls" || urlLower.includes(".m3u8");

  return JSON.stringify({
    hasControl: true,
    controlAutoHide: false,
    debug: false,
    loadingTimeout: 30,
    videoBuffer: 0.2,
    operateBtns: {
      fullscreen: true,
      screenshot: true,
      play: true,
      audio: true,
      record: false,
    },
    isFlv,
    useMSE: !isFlv || isHls,
  });
};

const SmartVideoPlayer = forwardRef<
  JVideoPlayerHandle | null,
  VideoPlayerProps
>((props, ref) => {
  const {
    videoLink,
    className = "",
    enablePause = true,
    controls = true,
    playing = false,
    muted = true,
    ...otherProps
  } = props;

  const videoFormat = useMemo(() => detectVideoFormat(videoLink), [videoLink]);
  const useReactPlayer = useMemo(
    () => shouldUseReactPlayerFor(videoLink, videoFormat),
    [videoLink, videoFormat]
  );
  const jessibucaConfig = useMemo(
    () => buildJessibucaConfig(videoLink, videoFormat),
    [videoLink, videoFormat]
  );

  if (useReactPlayer) {
    return (
      <div className={`smart-video-player react-player ${className}`}>
        <ReactPlayer
          src={videoLink}
          width="100%"
          height="100%"
          controls={controls}
          playing={playing}
          muted={muted}
          {...otherProps}
        />
      </div>
    );
  }

  return (
    <div className={`smart-video-player jessibuca-player ${className}`}>
      <JVideoPlayer
        ref={ref}
        videoLink={videoLink}
        videoClassName={className}
        videoConfig={jessibucaConfig}
        enablePause={enablePause}
        {...otherProps}
      />
    </div>
  );
});

SmartVideoPlayer.displayName = "SmartVideoPlayer";

export default SmartVideoPlayer;
