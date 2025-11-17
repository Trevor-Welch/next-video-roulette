import { useRouter } from "next/router";
import YouTubePlayer from "../../components/YouTubePlayer";
import VideoPagination from "../../components/VideoPagination";
import videosData from "../../data/videos.json";

const videos: string[] = videosData;

const VideoPage: React.FC = () => {
  const router = useRouter();
  const { number } = router.query;

  const num = Array.isArray(number) ? number[0] : number;
  if (!num) return <p>Loading...</p>;

  const index = parseInt(num, 10) - 1; // 0-based index
  const videoId = videos[index];

  if (!videoId) return <p>Video not found</p>;

  return (
    <div>
      <YouTubePlayer videoId={videoId} />
      <VideoPagination currentIndex={index} totalVideos={videos.length} />
    </div>
  );
};

export default VideoPage;
