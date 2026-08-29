import React, { useEffect, useState } from "react";
import styles from "../css/Header.module.css";

const Header = () => {
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  useEffect(() => {
    if (!isIndexOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsIndexOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isIndexOpen]);

  const closeIndex = () => setIsIndexOpen(false);

  return (
    <header className={styles.hero} id="top" data-index-open={isIndexOpen}>
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source
          src="https://videos.pexels.com/video-files/5419061/5419061-sd_960_540_25fps.mp4"
          type="video/mp4"
          media="(max-width: 767px)"
        />
        <source
          src="https://videos.pexels.com/video-files/5419061/5419061-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className={styles.scrim} />

      <div className={styles.topbar}>
        <span className={styles.location}>Vancouver, Canada</span>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={isIndexOpen ? "Close site index" : "Open site index"}
          aria-expanded={isIndexOpen}
          aria-controls="site-index"
          data-open={isIndexOpen}
          onClick={() => setIsIndexOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <h1 className={styles.name} aria-label="Scott Foggo">
        <span>Scott</span>
        <span>Foggo</span>
      </h1>

      <div className={styles.footer}>
        <span className={styles.status}><i />Available for thoughtful collaborations</span>
      </div>

      <nav
        className={styles.indexPanel}
        id="site-index"
        aria-label="Site index"
        data-open={isIndexOpen}
        aria-hidden={!isIndexOpen}
      >
        <ol className={styles.indexLinks}>
          <li><span>01</span><a href="#about" onClick={closeIndex}>About</a></li>
          <li><span>02</span><a href="#career" onClick={closeIndex}>Experience</a></li>
          <li><span>03</span><a href="#contact" onClick={closeIndex}>Contact</a></li>
        </ol>
      </nav>
    </header>
  );
}

export default Header;
