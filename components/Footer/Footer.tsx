// components/Footer.tsx
import styles from "./Footer.module.css";
import VideoStats from "../VideoStats/VideoStats";

interface FooterProps {
  videoCount: number;
}

const Footer: React.FC<FooterProps> = ({ videoCount }) => {
  return (
    <footer className={styles.footer}>
      <p className={styles.aboutText}>
        This app is a personal collection of my favorite YouTube videos and music over the years.
        <br /><br />
        Built with Next.js.
      </p>

      <p >
        <VideoStats />
      </p>

      <p className={styles.credit}>
        By{" "}
        <a
          href="https://trevor.example.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.feedbackLink}
        >
          Trevor W.
        </a>
      </p>

      <p>
        <a
          href="https://forms.gle/CmmwYdoaj5sFeFpr6"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.feedbackLink}
        >
          Give Feedback
        </a>
      </p>
    </footer>
  );
};

export default Footer;
