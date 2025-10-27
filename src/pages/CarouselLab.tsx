import { useState } from "react";
import type { Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import SmartVideoPlayer from "../component/player/SmartVideoPlayer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./CarouselLab.css";

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  tags: string[];
}

// Flv   - https://jumpshare.com/s/DmZ1jiyNEyEKc9xeksuj%22,%20type:%20%22video/x-flv
//       - https://live.nodemedia.cn:8443/live/sony_4k_264.flv
//       - https://live.nodemedia.cn:8443/live/b480_264.flv
// Twitch stream - https://www.twitch.tv/cdawg
// Twitch video - https://www.twitch.tv/tarik/clip/PlausiblePeppyGrassJKanStyle-z0KYNyp3DuCGX--Z

const SLIDES: CarouselSlide[] = [
  {
    id: "city-flv",
    title: "City Traffic FLV",
    description:
      "Alternate FLV asset hosted on flvplayer.js.org. Useful for validating Jessibuca playback with a different source.",
    streamUrl: " https://live.nodemedia.cn:8443/live/sony_4k_264.flv",
    tags: ["FLV", "Jessibuca", "Alternate"],
  },
  {
    id: "flv-demo",
    title: "Jessibuca FLV Demo",
    description:
      "FLV transport stream rendered via Jessibuca. Highlights the custom player pipeline and WASM decoder.",
    streamUrl: "https://flvplayer.js.org/assets/video/weathering-with-you.flv",
    tags: ["FLV", "Jessibuca", "WASM"],
  },
  {
    id: "mp4-fallback",
    title: "Progressive MP4",
    description:
      "Direct MP4 asset rendered through the ReactPlayer fallback, mimicking VOD playback scenarios.",
    streamUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    tags: ["MP4", "Fallback", "VOD"],
  },
];

const CarouselLab = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="carousel-page">
      <header className="carousel-header">
        <h1>Video Carousel POC</h1>
        <p>
          Each slide hosts an isolated player instance. Navigating to a new
          slide destroys the previous player to interrupt any ongoing fetch or
          decode work.
        </p>
      </header>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper: SwiperType) => setActiveIndex(swiper.activeIndex)}
        onSlideChange={(swiper: SwiperType) =>
          setActiveIndex(swiper.activeIndex)
        }
        style={{
          maxWidth: "100%",
        }}
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <CarouselPanel slide={slide} isActive={index === activeIndex} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

interface CarouselPanelProps {
  slide: CarouselSlide;
  isActive: boolean;
}

const CarouselPanel = ({ slide, isActive }: CarouselPanelProps) => (
  <article className="carousel-panel">
    <div className="carousel-player">
      {isActive ? (
        <SmartVideoPlayer
          key={slide.streamUrl}
          videoLink={slide.streamUrl}
          className="carousel-player-inner"
          enablePause={true}
          controls={true}
          playing={true}
          muted={true}
        />
      ) : (
        <div className="player-placeholder" aria-hidden="true">
          <span>Slide inactive — player halted to free resources.</span>
        </div>
      )}
    </div>
    <div className="carousel-copy">
      <h2>{slide.title}</h2>
      <p>{slide.description}</p>
      <ul className="tag-list">
        {slide.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  </article>
);

export default CarouselLab;
