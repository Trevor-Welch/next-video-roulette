// pages/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import videosData from "../data/videos.json";

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (videosData.length === 0) return;

    // Pick a random video
    const randomIndex = Math.floor(Math.random() * videosData.length);
    const video = videosData[randomIndex];

    // Redirect to the video's page (using array index)
    router.replace(`/${randomIndex + 1}`);
  }, [router]);

  return <p>Redirecting to a random video...</p>;
};

export default HomePage;
