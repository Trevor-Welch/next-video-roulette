// context/ModeContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { Video } from "../types/video";
import videosData from "../data/videos.json";

export type ModeKey = "all" | "music" | "videos" | "under5" | "under1";

interface VideoWithIndex extends Video {
  index: number; // original position in videosData
}

interface ModeContextType {
  mode: ModeKey;
  setMode: (mode: ModeKey) => void;
  filteredVideos: Record<ModeKey, VideoWithIndex[]>;
  autoplayNext: boolean;
  setAutoplayNext: (value: boolean) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ModeKey>("all");
  const [autoplayNext, setAutoplayNext] = useState(false);

  // Precompute filtered arrays once, attaching index
  const filteredVideos = useMemo(() => {
    const all: VideoWithIndex[] = videosData.map((v, i) => ({ ...v, index: i }));
    const music = all.filter((v) => v.tags.includes("music"));
    const videosOnly = all.filter((v) => !v.tags.includes("music"));
    const under5 = all.filter((v) =>
      v.tags.some((t) => t === "under 1 minute" || t === "under 5 minutes")
    );
    const under1 = all.filter((v) => v.tags.includes("under 1 minute"));

    return { all, music, videos: videosOnly, under5, under1 };
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode, filteredVideos, autoplayNext, setAutoplayNext }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error("useMode must be used within ModeProvider");
  return context;
};
