// pages/[number].tsx
import { useRouter } from "next/router";
import { usePlayedVideos } from "../context/PlayedVideosContext";
import { useMode } from "../context/ModeContext";

import YouTubePlayer from "../components/YouTubePlayer/YouTubePlayer";
import VideoPagination from "../components/VideoPagination/VideoPagination";
import Footer from "../components/Footer/Footer";

import { useEffect, useState, useRef } from "react";
import styles from "../styles/VideoPage.module.css";

const VideoPage: React.FC<{ userInteracted: boolean }> = ({ userInteracted }) => {
  const router = useRouter();
  const { number } = router.query;
  const { filteredVideos, mode, autoplayNext } = useMode();
  const { getRandomUnplayed } = usePlayedVideos();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const autoplayNextRef = useRef(autoplayNext);
  useEffect(() => { autoplayNextRef.current = autoplayNext; }, [autoplayNext]);

  // Initialize currentIndex from URL
  useEffect(() => {
    if (!number) return;
    const idx = Array.isArray(number)
      ? parseInt(number[0], 10) - 1
      : parseInt(number as string, 10) - 1;
    setCurrentIndex(idx);
  }, [number]);

  if (currentIndex === null) return <p>Loading...</p>;

  const allVideos = filteredVideos["all"];
  const currentVideo = allVideos[currentIndex] || allVideos[0];

  // Handle "next" video
  const handleNext = () => {
    const nextIndex = getRandomUnplayed(filteredVideos[mode], currentIndex);
    if (nextIndex === null) return; // pool empty
    setCurrentIndex(nextIndex);
    router.push(`/${nextIndex + 1}`, undefined, { shallow: true });
  };

  return (
    <div className={styles.pageContainer}>
      <YouTubePlayer
        videoId={currentVideo.videoId}
        onEnd={handleNext}
        autoplayNextRef={autoplayNextRef}
        userInteracted={userInteracted}
      />

      <VideoPagination
        currentIndex={currentIndex}
        onNavigate={(newIndex) => {
          setCurrentIndex(newIndex);
          router.push(`/${newIndex + 1}`, undefined, { shallow: true });
        }}
      />

      <Footer videoCount={allVideos.length} />
    </div>
  );
};

export default VideoPage;
