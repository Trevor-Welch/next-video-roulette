// components/YouTubePlayer/YouTubePlayer.tsx
import { useEffect, useRef, useState } from "react";
import styles from "./YouTubePlayer.module.css";

interface YouTubePlayerProps {
  videoId: string;
  onEnd?: () => void;
  autoplayNextRef?: React.MutableRefObject<boolean>;
  userInteracted: boolean;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  onEnd,
  autoplayNextRef,
  userInteracted,
}) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentVideoId, setCurrentVideoId] = useState(videoId);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => createPlayer();
    } else if (window.YT.Player) {
      createPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = () => createPlayer();
    }

    function createPlayer() {
      if (!containerRef.current) return;

      playerRef.current?.destroy();

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        events: {
          onReady: (event: any) => {
            const player = event.target;

            // Always start muted
            player.mute();
            player.playVideo();
            console.log("Attempted muted autoplay for videoId:", videoId);

            // Only unmute if user has already interacted
            if (userInteracted) {
              player.unMute();
              console.log("User had interacted → unmuted");
            }
          },
          onStateChange: (event: any) => {
            const loadedVideoId = playerRef.current?.getVideoData().video_id;
            if (
              event.data === window.YT.PlayerState.ENDED &&
              autoplayNextRef?.current &&
              onEnd &&
              loadedVideoId === currentVideoId
            ) {
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

      setCurrentVideoId(videoId);
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, userInteracted]);

  const handleUserGesture = () => {
    if (playerRef.current) {
      playerRef.current.unMute();
      playerRef.current.playVideo();
      console.log("User interaction: unmuted and playing video");
    }
  };

  // Only show overlay if user has not yet interacted
  return (
    <div className={styles.playerWrapper}>
      <div ref={containerRef} className={styles.playerIframe} />
      {!userInteracted && (
        <div
          className={styles.interactionOverlay}
          onClick={handleUserGesture}
          onKeyDown={handleUserGesture}
          onTouchStart={handleUserGesture}
          onScroll={handleUserGesture}
          tabIndex={0}
        >
          <p>Tap or click anywhere to start playing videos</p>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
