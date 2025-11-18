import { forwardRef, useImperativeHandle } from "react";
import { useMode } from "../../context/ModeContext";
import { usePlayedVideos } from "../../context/PlayedVideosContext";
import styles from "./VideoPagination.module.css";

interface VideoPaginationProps {
  currentIndex: number;
  onNavigate?: (newIndex: number) => void;
}

const modes = [
  { key: "all", label: "All" },
  { key: "music", label: "Music-Only" },
  { key: "videos", label: "Videos-Only" },
  { key: "under5", label: "Under 5 Min" },
  { key: "under1", label: "Under 1 Min" },
] as const;

const VideoPagination = forwardRef(({ currentIndex, onNavigate }: VideoPaginationProps, ref) => {
  const { mode, setMode, filteredVideos, autoplayNext, setAutoplayNext } = useMode();
  const { markPlayed, getUnplayedFromPool } = usePlayedVideos();

  const getFilteredPool = () => filteredVideos[mode] || [];
  const getUnplayedPool = () => getUnplayedFromPool(getFilteredPool());

  const goRandom = () => {
    const pool = getUnplayedPool();
    if (!pool.length) return; // nothing left

    const randomPickIndex = Math.floor(Math.random() * pool.length);
    const nextVideo = pool[randomPickIndex];
    markPlayed(nextVideo.index);
    onNavigate?.(nextVideo.index);
  };

  const goToFilteredVideo = (direction: 1 | -1) => {
    const pool = getFilteredPool();
    if (!pool.length) return;

    let currentPos = pool.findIndex((v) => v.index === currentIndex);
    if (currentPos === -1) currentPos = direction === 1 ? -1 : 0;

    const unplayedPool = getUnplayedPool();
    if (!unplayedPool.length) return; // all played

    // Find next unplayed video
    let nextIndex;
    if (unplayedPool.length === 1) {
      nextIndex = unplayedPool[0].index;
    } else {
      const currentVideoIndex = pool[currentPos]?.index ?? -1;
      const nextPos = unplayedPool.findIndex((v) => v.index > currentVideoIndex);
      nextIndex = nextPos !== -1 ? unplayedPool[nextPos].index : unplayedPool[0].index;
    }

    markPlayed(nextIndex);
    onNavigate?.(nextIndex);
  };

  useImperativeHandle(ref, () => ({ goToFilteredVideo }));

  const handleModeCycle = () => {
    const currentModeIndex = modes.findIndex((m) => m.key === mode);
    setMode(modes[(currentModeIndex + 1) % modes.length].key);
  };

  const toggleAutoplayNext = () => setAutoplayNext(!autoplayNext);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.buttonRow}>
        <button className={styles.button} onClick={() => goToFilteredVideo(-1)}>Previous</button>
        <button className={`${styles.button} ${styles.randomButton}`} onClick={goRandom}>Random</button>
        <button className={styles.button} onClick={() => goToFilteredVideo(1)}>Next</button>
      </div>
      <div className={styles.buttonRow}>
        <button className={styles.toggleButton} onClick={handleModeCycle}>
          Mode: {modes.find((m) => m.key === mode)?.label || "All"}
        </button>
        <button className={styles.toggleButton} onClick={toggleAutoplayNext}>
          Autoplay Next: {autoplayNext ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
});

export default VideoPagination;
