import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useMemo,
} from "react";
import type { JVideoPlayerProps, JessibucaPlayer } from "../../types";

type JVideoPlayerHandle = {
  play: (link?: string) => void;
  destroy: () => void;
  pause: () => void;
};

const parseConfig = (configString?: string): Record<string, unknown> => {
  if (!configString) {
    return {};
  }

  try {
    return JSON.parse(configString);
  } catch {
    return {};
  }
};

const generateUniqueId = () =>
  `jessibuca-container-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 11)}`;

const swallowPromiseRejection = (maybePromise: unknown) => {
  if (
    maybePromise &&
    typeof maybePromise === "object" &&
    "then" in maybePromise &&
    typeof (maybePromise as Promise<unknown>).then === "function"
  ) {
    void (maybePromise as Promise<unknown>).catch(() => undefined);
  }
};

const JVideoPlayer = forwardRef<JVideoPlayerHandle, JVideoPlayerProps>(
  (props, ref) => {
    const { videoLink, videoConfig } = props;
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<JessibucaPlayer | null>(null);
    const containerId = useMemo(() => generateUniqueId(), []);

    const parsedConfig = useMemo(() => parseConfig(videoConfig), [videoConfig]);

    useImperativeHandle(ref, () => ({
      play: (link?: string) => {
        const player = playerRef.current;
        if (!player) {
          return;
        }

        const target = link || videoLink;
        if (!target) {
          return;
        }

        player.play(target).catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          console.error("Jessibuca play error", message);
        });
      },
      destroy: () => {
        const player = playerRef.current;
        if (!player) {
          return;
        }

        try {
          const result = player.destroy?.();
          swallowPromiseRejection(result);
        } catch (error) {
          console.error("Jessibuca destroy error", error);
        } finally {
          playerRef.current = null;
        }
      },
      pause: () => {
        const player = playerRef.current;
        try {
          player?.pause?.();
        } catch (error) {
          console.error("Jessibuca pause error", error);
        }
      },
    }));

    useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) {
        return;
      }

      const mountTarget = document.createElement("div");
      mountTarget.className = "jessibuca-mount";
      wrapper.replaceChildren(mountTarget);

      const JessibucaConstructor =
        (
          window as typeof window & {
            Jessibuca?: new (
              config: Record<string, unknown>
            ) => JessibucaPlayer;
          }
        ).Jessibuca ??
        (
          window as typeof window & {
            jessibuca?: new (
              config: Record<string, unknown>
            ) => JessibucaPlayer;
          }
        ).jessibuca;

      if (typeof JessibucaConstructor !== "function") {
        console.error("Jessibuca library is not loaded or not available");
        return;
      }

      const decoderPath = import.meta.env.DEV
        ? "/assets/decoder.js"
        : "./assets/decoder.js";

      const baseConfig = {
        decoder: decoderPath,
        useWCS: false,
        autoWasm: true,
        videoBuffer: 0.5,
        isResize: false,
        showBandwidth: false,
        forceNoOffscreen: false,
        isNotMute: false,
        loadingTimeout: 30,
        keepScreenOn: true,
        openWebglAlignment: true,
        loadingText: "loading...",
        debug: import.meta.env.DEV,
        hasControl: true,
        operateBtns: {
          fullscreen: true,
          screenshot: true,
          play: true,
          audio: true,
          record: false,
        },
        controlAutoHide: false,
        useMSE:
          typeof (parsedConfig as Record<string, unknown>).isFlv === "boolean"
            ? !(parsedConfig as { isFlv?: boolean }).isFlv
            : true,
      } satisfies Record<string, unknown>;

      const mergedConfig = {
        ...baseConfig,
        ...parsedConfig,
        container: mountTarget,
      } satisfies Record<string, unknown>;

      let player: JessibucaPlayer | null = null;

      try {
        player = new JessibucaConstructor(mergedConfig);
        playerRef.current = player;
      } catch (error) {
        console.error("Failed to initialize Jessibuca", error);
        return;
      }

      const handleError = (event: unknown) => {
        console.error("Jessibuca playback error", event);
      };

      const handleTimeout = () => {
        console.error("Jessibuca playback timeout");
      };

      if (typeof player.on === "function") {
        player.on("error", handleError);
        player.on("timeout", handleTimeout);
        player.on("loadingTimeout", handleTimeout);
      }

      return () => {
        if (player) {
          try {
            const result = player.destroy?.();
            swallowPromiseRejection(result);
          } catch (error) {
            console.error("Jessibuca destroy error", error);
          }
        }

        if (playerRef.current === player) {
          playerRef.current = null;
        }

        if (wrapper) {
          if (wrapper.contains(mountTarget)) {
            wrapper.removeChild(mountTarget);
          } else {
            wrapper.replaceChildren();
          }
        }
      };
    }, [parsedConfig]);

    useEffect(() => {
      if (!videoLink) {
        return;
      }

      const player = playerRef.current;
      if (!player) {
        return;
      }

      player.play(videoLink).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Jessibuca play error", message);
      });
    }, [videoLink]);

    return (
      <div
        id={containerId}
        ref={wrapperRef}
        className="z-9 aspect-video"
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "16 / 9",
        }}
      />
    );
  }
);

JVideoPlayer.displayName = "JVideoPlayer";

export type { JVideoPlayerHandle };
export default JVideoPlayer;
