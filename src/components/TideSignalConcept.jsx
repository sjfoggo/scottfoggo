import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import ConceptNav from "./ConceptNav";
import Resume from "../assets/ScottFoggo-Resume.pdf";
import styles from "../css/Concepts.module.css";

const OCEAN_POSTER =
  "https://images.pexels.com/videos/5419061/4k50fps-above-sea-beautiful-girl-beautiful-sunset-5419061.jpeg?auto=compress&cs=tinysrgb&w=1920";

const OCEAN_VIDEO =
  "https://videos.pexels.com/video-files/5419061/5419061-hd_1920_1080_25fps.mp4";

const chapters = [
  {
    at: 0.22,
    className: styles.soundingNorth,
    line: "I make complex systems feel clear, useful, and human.",
    aside: "Product thinking, data, and dependable infrastructure in one practice.",
  },
  {
    at: 0.46,
    className: styles.soundingWest,
    line: "From foundational metrics to shared meaning.",
    aside: "Products adopted across a company, and context that helps agents reason with data.",
  },
  {
    at: 0.69,
    className: styles.soundingEast,
    line: "The deeper the system, the calmer it should feel.",
    aside: "Clear lineage, visible uncertainty, and a decidedly human touch.",
  },
];

function Sounding({ chapter, progress, reducedMotion }) {
  const start = chapter.at;
  const opacity = useTransform(
    progress,
    [start - 0.12, start - 0.035, start + 0.07, start + 0.15],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [start - 0.12, start + 0.15],
    reducedMotion ? [0, 0] : [46, -34],
  );
  const filter = useTransform(
    progress,
    [start - 0.12, start - 0.03, start + 0.1, start + 0.15],
    reducedMotion
      ? ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"]
      : ["blur(12px)", "blur(0px)", "blur(0px)", "blur(9px)"],
  );

  return (
    <motion.article
      className={`${styles.sounding} ${chapter.className}`}
      style={{ opacity, y, filter }}
    >
      <p>{chapter.line}</p>
      <span>{chapter.aside}</span>
    </motion.article>
  );
}

function TideSignalConcept() {
  const sceneRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const videoScale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1.06, 1.06] : [1.04, 1.2],
  );
  const videoY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ["0%", "0%"] : ["0%", "4%"],
  );
  const blueDepth = useTransform(scrollYProgress, [0.1, 0.84], [0.08, 0.72]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.1, 0.19], [1, 1, 0]);
  const introY = useTransform(
    scrollYProgress,
    [0, 0.19],
    reducedMotion ? [0, 0] : [0, -44],
  );
  const finalOpacity = useTransform(scrollYProgress, [0.82, 0.91], [0, 1]);
  const finalY = useTransform(
    scrollYProgress,
    [0.82, 0.94],
    reducedMotion ? [0, 0] : [40, 0],
  );
  const nameTracking = useTransform(
    scrollYProgress,
    [0, 0.15],
    reducedMotion ? ["-0.065em", "-0.065em"] : ["-0.065em", "0.015em"],
  );

  return (
    <main className={styles.immersivePage} data-concept="tide">
      <ConceptNav active="tide" />

      <section className={styles.depthJourney} ref={sceneRef} aria-label="Tide and Signal concept">
        <div className={styles.depthViewport}>
          <div
            className={styles.oceanPoster}
            style={{ backgroundImage: `url(${OCEAN_POSTER})` }}
            aria-hidden="true"
          />
          <motion.video
            className={styles.oceanFilm}
            autoPlay
            loop
            muted
            playsInline
            poster={OCEAN_POSTER}
            preload="auto"
            style={{ scale: videoScale, y: videoY }}
            aria-hidden="true"
          >
            <source src={OCEAN_VIDEO} type="video/mp4" />
          </motion.video>
          <div className={styles.monochromeWash} aria-hidden="true" />
          <motion.div
            className={styles.depthBlue}
            style={{ opacity: blueDepth }}
            aria-hidden="true"
          />
          <div className={styles.surfaceGrain} aria-hidden="true" />

          <motion.header
            className={styles.depthOpening}
            style={{ opacity: introOpacity, y: introY }}
          >
            <motion.h1 style={{ letterSpacing: nameTracking }}>
              Scott Foggo
            </motion.h1>
            <p>Software engineer</p>
          </motion.header>

          {chapters.map((chapter) => (
            <Sounding
              chapter={chapter}
              progress={scrollYProgress}
              reducedMotion={reducedMotion}
              key={chapter.line}
            />
          ))}

          <motion.footer
            className={styles.depthClosing}
            style={{ opacity: finalOpacity, y: finalY }}
          >
            <p>Let’s make something useful.</p>
            <div>
              <a href="https://github.com/sjfoggo" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/scott-foggo/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={Resume} target="_blank" rel="noreferrer">Résumé</a>
            </div>
          </motion.footer>
        </div>
      </section>
    </main>
  );
}

export default TideSignalConcept;
