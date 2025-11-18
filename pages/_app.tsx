// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ModeProvider } from "../context/ModeContext";
import { PlayedVideosProvider } from "../context/PlayedVideosContext";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [userInteracted, setUserInteracted] = useState(false);

  // Log state changes
  useEffect(() => {
    console.log("userInteracted state updated:", userInteracted);
  }, [userInteracted]);

  useEffect(() => {
    if (!userInteracted) {
      console.log("Setting up interaction listeners...");
      const handler = (event: Event) => {
        console.log("User interaction detected:", event.type);
        setUserInteracted(true);
      };

      const events = ["click", "keydown", "touchstart", "scroll"];
      events.forEach((evt) => document.addEventListener(evt, handler, { once: true }));

      return () => {
        console.log("Cleaning up interaction listeners...");
        events.forEach((evt) => document.removeEventListener(evt, handler));
      };
    }
  }, [userInteracted]);

  return (
    <ModeProvider>
      <PlayedVideosProvider>
        <Component {...pageProps} userInteracted={userInteracted} />
      </PlayedVideosProvider>
    </ModeProvider>
  );
}

export default MyApp;
