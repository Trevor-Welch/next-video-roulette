// components/VideoPagination.tsx
import { forwardRef, useImperativeHandle } from "react";
import { useMode } from "../context/ModeContext";

interface VideoPaginationProps {
  currentIndex: number; // zero-based index
  onNavigate?: (newIndex: number) => void; // callback to update current index
}

// Define all modes in one array for easy updates
const modes = [
  { key: "all", label: "All" },
  { key: "music", label: "Music-Only" },
  { key: "videos", label: "Videos-Only" },
  { key: "under5", label: "Under 5 Min" },
  { key: "under1", label: "Under 1 Min" },
] as const;

const VideoPagination = forwardRef(
  ({ currentIndex, onNavigate }: VideoPaginationProps, ref) => {
    const { mode, setMode, filteredVideos, autoplayNext, setAutoplayNext } = useMode();

    const getFilteredPool = () => filteredVideos[mode] || [];

    // Go to a random video respecting the current mode
    const goRandom = () => {
      const pool = getFilteredPool();
      if (pool.length === 0) return;

      let randomPickIndex = Math.floor(Math.random() * pool.length);

      // Avoid picking the same video if possible
      if (pool[randomPickIndex].index === currentIndex && pool.length > 1) {
        randomPickIndex = (randomPickIndex + 1) % pool.length;
      }

      onNavigate?.(pool[randomPickIndex].index);
    };

    // Go to previous or next video respecting the mode
    const goToFilteredVideo = (direction: 1 | -1) => {
      const pool = getFilteredPool();
      if (pool.length === 0) return;

      let currentPos = pool.findIndex((v) => v.index === currentIndex);

      // If current video isn't in the filtered pool, pick first or last based on direction
      if (currentPos === -1) {
        currentPos = direction === 1 ? -1 : 0;
      }

      const nextPos = (currentPos + direction + pool.length) % pool.length;
      onNavigate?.(pool[nextPos].index);
    };

    useImperativeHandle(ref, () => ({
      goToFilteredVideo,
    }));

    const handleModeCycle = () => {
      const currentModeIndex = modes.findIndex((m) => m.key === mode);
      const nextIndex = (currentModeIndex + 1) % modes.length;
      setMode(modes[nextIndex].key);
    };

    const toggleAutoplayNext = () => {
      setAutoplayNext(!autoplayNext);
    };

    return (
      <div style={{ textAlign: "center", marginTop: "10px", padding: "10px" }}>
        {/* Pagination buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <button onClick={() => goToFilteredVideo(-1)}>Previous</button>
          <button onClick={goRandom}>Random</button>
          <button onClick={() => goToFilteredVideo(1)}>Next</button>
        </div>

        {/* Mode & Autoplay */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "10px",
          }}
        >
          <button onClick={handleModeCycle}>
            Mode: {modes.find((m) => m.key === mode)?.label || "All"}
          </button>
          <button onClick={toggleAutoplayNext}>
            Autoplay Next: {autoplayNext ? "On" : "Off"}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "40px",
          }}
        >
        <a href="https://forms.gle/CmmwYdoaj5sFeFpr6" target="_blank" rel="noopener noreferrer">
            <button>Give Feedback</button>
        </a>
          
        </div>
      </div>
    );
  }
);

export default VideoPagination;
