// components/VideoStats.tsx
import React from "react";
import { useMode } from "../../context/ModeContext";
import styles from "./VideoStats.module.css";

const VideoStats: React.FC = () => {
  const { filteredVideos } = useMode();

  const allCount = filteredVideos.all.length;
  const musicCount = filteredVideos.music.length;
  const videosCount = filteredVideos.videos.length;
  const under5Count = filteredVideos.under5.length;
  const under1Count = filteredVideos.under1.length;

  return (
    <div className={styles.statsContainer}>
      <h3>Collection Stats</h3>
      <ul>
        <li>Total videos: {allCount}</li>
        <li>Music videos: {musicCount}</li>
        <li>Non-music videos: {videosCount}</li>
        <li>Under 5 minutes: {under5Count}</li>
        <li>Under 1 minute: {under1Count}</li>
      </ul>
    </div>
  );
};

export default VideoStats;
