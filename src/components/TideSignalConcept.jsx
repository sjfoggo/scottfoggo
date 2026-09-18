import React, { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import ConceptNav from "./ConceptNav";
import OceanFilmCanvas from "./OceanFilmCanvas";
import styles from "../css/Concepts.module.css";

const OCEAN_POSTER =
  "https://images.pexels.com/videos/5419061/4k50fps-above-sea-beautiful-girl-beautiful-sunset-5419061.jpeg?auto=compress&cs=tinysrgb&w=1920";

const OCEAN_VIDEO =
  "https://videos.pexels.com/video-files/5419061/5419061-hd_1920_1080_25fps.mp4";

const moments = [
  {
    id: "decisions",
    range: [0.12, 0.2, 0.35, 0.42],
    position: styles.horizonDecisions,
    title: "I build software that turns data into decisions.",
  },
  {
    id: "action",
    range: [0.38, 0.46, 0.59, 0.66],
    position: styles.horizonAction,
    title: "I value simplicity, bias for action, and moving fast.",
  },
  {
    id: "together",
    range: [0.62, 0.7, 0.82, 0.88],
    position: styles.horizonTogether,
    title: "I believe we’re better when working together.",
  },
  {
    id: "contact",
    range: [0.84, 0.92, 0.999, 1],
    position: styles.horizonContact,
    title: "Let’s build something useful.",
  },
];

function ContactLinks() {
  return (
    <div className={styles.horizonLinks}>
      <a href="mailto:s.foggo.7@gmail.com">Email</a>
      <a href="https://github.com/sjfoggo" target="_blank" rel="noreferrer">GitHub</a>
      <a href="https://www.linkedin.com/in/scott-foggo/" target="_blank" rel="noreferrer">LinkedIn</a>
    </div>
  );
}

function HorizonMoment({ moment, progress }) {
  const terminal = moment.id === "contact";
  const inputRange = moment.range;
  const opacityRange = terminal ? [0, 1, 1, 1] : [0, 1, 1, 0];
  const yRange = terminal ? [14, 0, 0, 0] : [14, 0, 0, -12];
  const opacity = useTransform(progress, inputRange, opacityRange);
  const y = useTransform(progress, inputRange, yRange);

  return (
    <motion.article
      className={`${styles.horizonMoment} ${moment.position}`}
      style={{ opacity, y }}
    >
      {moment.title && <h2>{moment.title}</h2>}
      {moment.body && <p>{moment.body}</p>}
      {moment.meta && <span>{moment.meta}</span>}
      {moment.id === "contact" && <ContactLinks />}
    </motion.article>
  );
}

function StaticHorizon({ preview }) {
  return (
    <main className={`${styles.horizonPage} ${styles.staticHorizonPage}`}>
      {preview && <ConceptNav />}
      <div
        className={styles.staticOcean}
        style={{ backgroundImage: `url(${OCEAN_POSTER})` }}
        aria-hidden="true"
      />
      <div className={styles.staticGrade} aria-hidden="true" />
      <h1 className={styles.staticName}>Scott Foggo</h1>
      <div className={styles.staticMoments}>
        {moments.map((moment) => (
          <article className={styles.staticMoment} key={moment.id}>
            {moment.title && <h2>{moment.title}</h2>}
            {moment.body && <p>{moment.body}</p>}
            {moment.meta && <span>{moment.meta}</span>}
            {moment.id === "contact" && <ContactLinks />}
          </article>
        ))}
      </div>
    </main>
  );
}

function AnimatedHorizon({ preview }) {
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const [rendererState, setRendererState] = useState("loading");
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className={styles.horizonPage}>
      {preview && <ConceptNav />}
      <section
        className={styles.horizonJourney}
        ref={sceneRef}
        aria-label="Horizon concept"
      >
        <div className={styles.horizonViewport} data-renderer={rendererState}>
          <div
            className={styles.horizonPoster}
            style={{ backgroundImage: `url(${OCEAN_POSTER})` }}
            aria-hidden="true"
          />
          <video
            className={styles.oceanSource}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            poster={OCEAN_POSTER}
            preload="auto"
            aria-hidden="true"
          >
            <source src={OCEAN_VIDEO} type="video/mp4" />
          </video>
          <OceanFilmCanvas
            videoRef={videoRef}
            progress={scrollYProgress}
            onStateChange={setRendererState}
          />

          <h1 className="screenReaderOnly">Scott Foggo</h1>
          {moments.map((moment) => (
            <HorizonMoment
              moment={moment}
              progress={scrollYProgress}
              key={moment.id}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function TideSignalConcept({ preview = false }) {
  const reducedMotion = useReducedMotion();

  return reducedMotion
    ? <StaticHorizon preview={preview} />
    : <AnimatedHorizon preview={preview} />;
}

export default TideSignalConcept;
