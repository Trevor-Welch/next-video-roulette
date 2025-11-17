import { useRouter } from "next/router";
import videosData from "../data/videos.json";

const videos: string[] = videosData;

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    router.push(`/v/${randomIndex + 1}`); // +1 because /v/[number] starts at 1
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Video Roulette</h1>
      <button
        onClick={handleRandomVideo}
        style={{ padding: "10px 20px", fontSize: "18px", marginTop: "20px", cursor: "pointer" }}
      >
        Watch Random Video
      </button>
    </div>
  );
};

export default HomePage;
