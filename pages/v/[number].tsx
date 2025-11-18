import { useRouter } from "next/router";
import YouTubePlayer from "../../components/YouTubePlayer";
import VideoPagination from "../../components/VideoPagination";
import { useMode } from "../../context/ModeContext";
import { useEffect, useState } from "react";

const VideoPage: React.FC = () => {
  const router = useRouter();
  const { number } = router.query;
  const { filteredVideos, autoplayNext, mode } = useMode();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Initialize currentIndex from URL
  useEffect(() => {
    if (!number) return;
    const idx = Array.isArray(number)
      ? parseInt(number[0], 10) - 1
      : parseInt(number, 10) - 1;
    setCurrentIndex(idx);
  }, [number]);

  if (currentIndex === null) return <p>Loading...</p>;

  const video = filteredVideos["all"][currentIndex];
  if (!video) return <p>Video not found</p>;

  const handleNext = () => {
    const pool = filteredVideos[mode] || [];
    if (pool.length === 0) return;

    let nextIndexInPool = pool.findIndex((v) => v.index === currentIndex);
    if (nextIndexInPool === -1) nextIndexInPool = 0; // fallback if video not in filtered list

    const nextPos = (nextIndexInPool + 1) % pool.length;
    const nextIndex = pool[nextPos].index;

    setCurrentIndex(nextIndex);
    router.push(`/v/${nextIndex + 1}`, undefined, { shallow: true });
  };

  return (
    <div>
      <YouTubePlayer
        videoId={video.videoId}
        onEnd={() => {
          if (autoplayNext) handleNext();
        }}
      />
      <VideoPagination
        currentIndex={currentIndex}
        onNavigate={(newIndex) => {
          setCurrentIndex(newIndex);
          router.push(`/v/${newIndex + 1}`, undefined, { shallow: true });
        }}
      />
    </div>
  );
};

export default VideoPage;
