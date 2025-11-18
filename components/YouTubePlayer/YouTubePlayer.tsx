import { useEffect, useRef, useState } from "react";
import styles from "./YouTubePlayer.module.css";

interface YouTubePlayerProps {
  videoId: string;
  onEnd?: () => void;
  autoplayNextRef?: React.MutableRefObject<boolean>;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onEnd, autoplayNextRef }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentVideoId, setCurrentVideoId] = useState(videoId);

  // Load YouTube API script once
  useEffect(() => {
    if (!window.YT) {
      console.log("Adding YouTube iframe API script...");
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      console.log("YouTube API already loaded");
    }
  }, []);

  // Create player
  useEffect(() => {
    const createPlayer = () => {
      if (!containerRef.current || playerRef.current) return;

      console.log("Creating YouTube player for videoId:", videoId);

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        events: {
          onReady: () => console.log("Player ready for videoId:", videoId),
          onStateChange: (event: any) => {
            const loadedVideoId = playerRef.current?.getVideoData().video_id;
            console.log("Player state changed:", event.data, "video:", loadedVideoId);

            if (
              event.data === window.YT.PlayerState.ENDED &&
              autoplayNextRef?.current &&
              onEnd &&
              loadedVideoId === currentVideoId
            ) {
              console.log("Autoplay is ON, triggering onEnd for videoId:", loadedVideoId);
              onEnd();
            }
          },
        },
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      console.log("Destroying player for videoId:", currentVideoId);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]); // recreate player each time videoId changes

  // Load and play video
  useEffect(() => {
    if (!playerRef.current || !playerRef.current.loadVideoById) return;

    console.log("Loading new video:", videoId);
    setCurrentVideoId(videoId);
    playerRef.current.loadVideoById(videoId);

    const timeout = setTimeout(() => {
      if (playerRef.current?.playVideo) {
        console.log("Calling playVideo() for videoId:", videoId);
        playerRef.current.playVideo();
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [videoId]);

  return (
    <div className={styles.playerWrapper}>
      <div ref={containerRef} className={styles.playerIframe} />
    </div>
  );
};

export default YouTubePlayer;
