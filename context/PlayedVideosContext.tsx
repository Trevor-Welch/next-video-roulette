// context/PlayedVideosContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface PlayedVideosContextType {
  playedVideos: number[];
  markPlayed: (videoIndex: number) => void;
  resetPlayed: () => void;
  getUnplayedFromPool: (pool: { index: number }[]) => { index: number }[];
  getRandomUnplayed: (pool: { index: number }[], exclude?: number) => number | null;
}

const PlayedVideosContext = createContext<PlayedVideosContextType | undefined>(undefined);

export const PlayedVideosProvider = ({ children }: { children: ReactNode }) => {
  const [playedVideos, setPlayedVideos] = useState<number[]>([]);

  const markPlayed = (videoIndex: number) => {
    setPlayedVideos((prev) => (prev.includes(videoIndex) ? prev : [...prev, videoIndex]));
  };

  const resetPlayed = () => setPlayedVideos([]);

  // Return all unplayed videos in a pool
  const getUnplayedFromPool = (pool: { index: number }[]) => {
    let unplayed = pool.filter(v => !playedVideos.includes(v.index));

    if (unplayed.length === 0 && pool.length > 0) {
      // reset if everything played
      setPlayedVideos([]);
      unplayed = [...pool];
    }

    return unplayed;
  };

  // Pick a random unplayed video, reset if pool is empty
  const getRandomUnplayed = (pool: { index: number }[], excludeIndex?: number): number | null => {
  let unplayed = pool.filter(v => !playedVideos.includes(v.index));
  
  // Reset automatically if empty
  if (unplayed.length === 0) {
    setPlayedVideos([]);
    unplayed = [...pool];
  }

  // Exclude the current index if provided
  if (excludeIndex !== undefined) {
    unplayed = unplayed.filter(v => v.index !== excludeIndex);
  }

  if (unplayed.length === 0) return null;
  const pick = Math.floor(Math.random() * unplayed.length);
  const next = unplayed[pick].index;

  markPlayed(next);
  return next;
};

  return (
    <PlayedVideosContext.Provider
      value={{ playedVideos, markPlayed, resetPlayed, getUnplayedFromPool, getRandomUnplayed }}
    >
      {children}
    </PlayedVideosContext.Provider>
  );
};

export const usePlayedVideos = () => {
  const context = useContext(PlayedVideosContext);
  if (!context) throw new Error("usePlayedVideos must be used within a PlayedVideosProvider");
  return context;
};
