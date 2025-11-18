// pages/v/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMode } from "../context/ModeContext";

const RandomVideoRedirect: React.FC = () => {
  const router = useRouter();
  const { mode, filteredVideos } = useMode();

  useEffect(() => {
    const pool = filteredVideos[mode] || [];
    if (pool.length === 0) return;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const videoIndex = pool[randomIndex].index;

    router.replace(`/${videoIndex + 1}`);
  }, [mode, router, filteredVideos]);

  return <p>Redirecting to a random video...</p>;
};

export default RandomVideoRedirect;
