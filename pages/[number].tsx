import { useRouter } from "next/router";
import YouTubePlayer from "../components/YouTubePlayer/YouTubePlayer";
import VideoPagination from "../components/VideoPagination/VideoPagination";
import Footer from "../components/Footer/Footer";
import { useMode } from "../context/ModeContext";
import { useEffect, useState, useRef } from "react";
import styles from "../styles/VideoPage.module.css";

const VideoPage: React.FC<{ userInteracted: boolean }> = ({ userInteracted }) => {
  const router = useRouter();
  const { number } = router.query;
  const { filteredVideos, mode, autoplayNext } = useMode();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const autoplayNextRef = useRef(autoplayNext);
  useEffect(() => { autoplayNextRef.current = autoplayNext; }, [autoplayNext]);

  // Initialize currentIndex from URL
  useEffect(() => {
    if (!number) return;
    const idx = Array.isArray(number) ? parseInt(number[0], 10) - 1 : parseInt(number, 10) - 1;
    console.log("Initialized currentIndex from URL:", idx);
    setCurrentIndex(idx);
  }, [number]);

  if (currentIndex === null) return <p>Loading...</p>;

  // Find the current video from ALL videos, don't filter yet
  const allVideos = filteredVideos["all"];
  const currentVideo = allVideos.find(v => v.index === currentIndex) || allVideos[0];

  const handleNext = () => {
    const pool = filteredVideos[mode] || [];
    if (pool.length === 0) return;

    let nextIndex: number;
    if (pool.length === 1) {
      nextIndex = pool[0].index;
    } else {
      do {
        const randomPick = Math.floor(Math.random() * pool.length);
        nextIndex = pool[randomPick].index;
      } while (nextIndex === currentIndex); // avoid picking same video twice
    }

    console.log("Autoplay picking next random video:", allVideos[nextIndex]?.videoId, "at index:", nextIndex);

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

      <Footer videoCount={filteredVideos["all"].length} />
    </div>
  );
};

export default VideoPage;
