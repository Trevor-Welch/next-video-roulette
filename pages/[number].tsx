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
  const { filteredVideos, autoplayNext, mode } = useMode();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const autoplayNextRef = useRef(autoplayNext);

  useEffect(() => {
    autoplayNextRef.current = autoplayNext;
    console.log("AutoplayNext updated:", autoplayNext);
  }, [autoplayNext]);

  // Initialize currentIndex from URL
  useEffect(() => {
    if (!number) return;
    const idx = Array.isArray(number)
      ? parseInt(number[0], 10) - 1
      : parseInt(number, 10) - 1;
    setCurrentIndex(idx);
    console.log("Initialized currentIndex from URL:", idx);
  }, [number]);

  if (currentIndex === null) return <p>Loading...</p>;

  const pool = filteredVideos[mode] || [];
  if (pool.length === 0) return <p>No videos found for this mode.</p>;

  const video = pool.find(v => v.index === currentIndex) || pool[0];
  console.log("Currently playing video:", video.videoId, "at index:", currentIndex);

  const handleNext = () => {
    if (!autoplayNextRef.current) return;

    if (pool.length === 1) {
      console.log("Only one video, replaying:", pool[0].videoId);
      router.push(`/${pool[0].index + 1}`);
      setCurrentIndex(pool[0].index);
      return;
    }

    let nextIndex: number;
    do {
      const randomPick = Math.floor(Math.random() * pool.length);
      nextIndex = pool[randomPick].index;
    } while (nextIndex === currentIndex);

    console.log("Autoplay picking next random video:", pool[nextIndex].videoId, "at index:", nextIndex);

    setCurrentIndex(nextIndex);
    router.push(`/${nextIndex + 1}`);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Pass videoId to YouTubePlayer; recreating player each time is fine */}
      <YouTubePlayer
        key={video.videoId} // forces full re-mount each time
        videoId={video.videoId}
        onEnd={handleNext}
        autoplayNextRef={autoplayNextRef}
        userInteracted={userInteracted}
      />

      <VideoPagination
        currentIndex={currentIndex}
        onNavigate={(newIndex) => {
          setCurrentIndex(newIndex);
          router.push(`/${newIndex + 1}`);
        }}
      />

      <Footer />
    </div>
  );
};

export default VideoPage;
