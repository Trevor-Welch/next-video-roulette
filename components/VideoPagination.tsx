// components/VideoPagination.tsx
import React from "react";
import { useRouter } from "next/router";

interface VideoPaginationProps {
  currentIndex: number; // zero-based index
  totalVideos: number;
}

const VideoPagination: React.FC<VideoPaginationProps> = ({ currentIndex, totalVideos }) => {
  const router = useRouter();

  const goToVideo = (index: number) => {
    // Loop around using modulo
    const newIndex = (index + totalVideos) % totalVideos;
    router.push(`/v/${newIndex + 1}`);
  };

  const goRandom = () => {
    let randomIndex = Math.floor(Math.random() * totalVideos);
    // avoid picking the same video
    if (randomIndex === currentIndex && totalVideos > 1) {
      randomIndex = (randomIndex + 1) % totalVideos;
    }
    router.push(`/v/${randomIndex + 1}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "10px",
        padding: "10px",
      }}
    >
      <button onClick={() => goToVideo(currentIndex - 1)}>Previous</button>
      <button onClick={goRandom}>Random</button>
      <button onClick={() => goToVideo(currentIndex + 1)}>Next</button>
    </div>
  );
};

export default VideoPagination;
