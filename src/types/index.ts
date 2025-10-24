// Type definitions for the project

export interface VideoPlayerProps {
  videoLink: string;
  className?: string;
  enablePause?: boolean;
  controls?: boolean;
  playing?: boolean;
  muted?: boolean;
}

export interface JVideoPlayerProps {
  videoLink: string;
  videoClassName?: string;
  videoConfig?: string;
  enablePause?: boolean;
}

export interface JessibucaPlayer {
  play: (url: string) => Promise<void>;
  pause?: () => void | Promise<void>;
  destroy?: () => void | Promise<void>;
  hasLoaded?: () => boolean;
  on?: (event: string, handler: (payload?: unknown) => void) => void;
}

// Extend Window interface to include Jessibuca
declare global {
  interface Window {
    Jessibuca?: unknown;
    jessibuca?: unknown;
  }
}
