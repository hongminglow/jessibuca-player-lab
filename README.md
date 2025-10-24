# Jessibuca Player Lab

An experimental playground for evaluating Jessibuca WebAssembly playback inside a React + Vite app. The project demonstrates how to host multiple transport formats, switch streams safely, and integrate the player into a Swiper.js carousel to observe lifecycle and performance behaviour while slides change.

## Features

- Smart player wrapper that selects Jessibuca for FLV/HLS-style transports and falls back to `react-player` for progressive formats.
- `/` route (Stream Switcher) for manual FLV/Twitch/MP4 swaps without remounting the component tree.
- `/carousel` route (Carousel POC) that mounts one player per slide and tears down inactive slides to prove we can interrupt buffering/decoding mid-flight.
- Sample FLV sources (`weathering-with-you.flv`, `1080p.flv`) hosted by flvplayer.js.org for deterministic testing.
- TypeScript-first setup with strict compiler options and ESLint in bundler mode.

## Getting Started

```bash
npm install
npm run dev
```

- Visit `http://localhost:5173/` for the Stream Switcher lab.
- Visit `http://localhost:5173/carousel` for the Swiper carousel demonstration.

## How the Carousel Interrupts Playback

- Swiper emits slide-change events that update `activeIndex` in `CarouselLab.tsx`.
- Each slide only renders `SmartVideoPlayer` when `isActive` is true. When a slide becomes inactive React unmounts the component entirely.
- The Jessibuca wrapper (`src/component/player/index.tsx`) listens for unmount via `useEffect` cleanup and calls `player.destroy()` (with guards) so decoding stops immediately.
- Because we destroy the player rather than pausing, pending network requests and WASM work are cancelled, giving a clean swap even if the previous stream was still loading.

## Notes

- This is a lab project—behaviour and APIs may change while we evaluate performance trade-offs.
- Large bundle sizes are expected when including Jessibuca’s optional decoders; refer to `vite.config.ts` for code-splitting ideas if shipping to production.

## License

MIT
