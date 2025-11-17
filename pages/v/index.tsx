import { useEffect } from "react";
import { useRouter } from "next/router";
import videosData from '../../data/videos.json';

const videos: string[] = videosData;

const RandomVideoRedirect: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    router.replace(`/v/${randomIndex + 1}`);
  }, [router]);

  return <p>Redirecting to a random video...</p>;
};

export default RandomVideoRedirect;
