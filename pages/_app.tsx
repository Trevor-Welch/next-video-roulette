// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ModeProvider } from "../context/ModeContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ModeProvider>
        <Component {...pageProps} />
      </ModeProvider>
  );
}

export default MyApp;
