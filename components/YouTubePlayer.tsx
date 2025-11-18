// components/YouTubePlayer.tsx
import { useEffect, useRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
  onEnd?: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onEnd }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize player once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const createPlayer = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED && onEnd) {
              onEnd();
            }
          },
        },
        playerVars: {
          autoplay: 1,
          rel: 0,
        },
      });
    };

    const interval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(interval);
        if (!playerRef.current) createPlayer();
      }
    }, 100);

    return () => {
      if (playerRef.current) playerRef.current.destroy();
      clearInterval(interval);
    };
  }, []); // <-- empty deps, runs only once

  // Load a new video when videoId changes, without recreating player
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  return <div ref={containerRef} style={{ width: "100%", height: "90vh" }} />;
};

export default YouTubePlayer;
