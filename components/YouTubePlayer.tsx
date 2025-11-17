// components/YouTubePlayer.tsx
import React from "react";

interface YouTubePlayerProps {
  videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div style={{ width: "100%", height: "90vh", overflow: "hidden" }}>
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: "block" }}
      />
    </div>
  );
};

export default YouTubePlayer;
