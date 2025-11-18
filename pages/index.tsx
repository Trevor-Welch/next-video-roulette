// pages/index.tsx
import { useRouter } from "next/router";
import { useMode } from "../context/ModeContext";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { setMode, filteredVideos } = useMode(); // access context
  const allVideos = filteredVideos.all; // always use the full list

  const handleRandomVideo = () => {
    if (allVideos.length === 0) return;

    // Force mode to "all" before navigating
    setMode("all");

    const randomIndex = Math.floor(Math.random() * allVideos.length);
    router.push(`/v/${allVideos[randomIndex].index + 1}`); // +1 because /v/[number] is 1-based
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Video Roulette</h1>
      <button
        onClick={handleRandomVideo}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Watch Random Video
      </button>
    </div>
  );
};

export default HomePage;
