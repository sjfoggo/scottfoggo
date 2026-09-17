import React, { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import ConceptNav from "./ConceptNav";
import OceanFilmCanvas from "./OceanFilmCanvas";
import Resume from "../assets/ScottFoggo-Resume.pdf";
import styles from "../css/Concepts.module.css";

const OCEAN_POSTER =
  "https://images.pexels.com/videos/5419061/4k50fps-above-sea-beautiful-girl-beautiful-sunset-5419061.jpeg?auto=compress&cs=tinysrgb&w=1920";

const OCEAN_VIDEO =
  "https://videos.pexels.com/video-files/5419061/5419061-hd_1920_1080_25fps.mp4";

const moments = [
  {
    id: "introduction",
    range: [0, 0.075, 0.15],
    position: styles.horizonIntro,
    body: "Software engineer",
  },
  {
    id: "practice",
    range: [0.12, 0.2, 0.31, 0.39],
    position: styles.horizonPractice,
    body: "I’m a software engineer working where product, data, and dependable infrastructure converge, all with a decidedly human touch.",
  },
  {
    id: "semantic-models",
    range: [0.37, 0.445, 0.56, 0.635],
    position: styles.horizonSemantic,
    title: "Semantic Models",
    body: "A contextual layer that helps data agents make better decisions.",
    meta: "Meta, since 2025",
  },
  {
    id: "metric-360",
    range: [0.61, 0.685, 0.8, 0.87],
    position: styles.horizonMetric,
    title: "Metric 360",
    body: "A shared metrics system adopted across the company.",
    meta: "Meta, 2022-2025",
  },
  {
    id: "contact",
    range: [0.84, 0.915, 0.999, 1],
    position: styles.horizonContact,
    title: "Let’s make something useful.",
    body: "A conversation is a good place to begin.",
  },
];

function ContactLinks() {
  return (
    <div className={styles.horizonLinks}>
      <a href="https://github.com/sjfoggo" target="_blank" rel="noreferrer">GitHub</a>
      <a href="https://www.linkedin.com/in/scott-foggo/" target="_blank" rel="noreferrer">LinkedIn</a>
      <a href={Resume} target="_blank" rel="noreferrer">Résumé</a>
    </div>
  );
}

function HorizonMoment({ moment, progress }) {
  const introduction = moment.id === "introduction";
  const terminal = moment.id === "contact";
  const inputRange = moment.range;
  const opacityRange = introduction
    ? [1, 1, 0]
    : terminal
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0];
  const yRange = introduction
    ? [0, 0, -12]
    : terminal
      ? [14, 0, 0, 0]
      : [14, 0, 0, -12];
  const opacity = useTransform(progress, inputRange, opacityRange);
  const y = useTransform(progress, inputRange, yRange);

  return (
    <motion.article
      className={`${styles.horizonMoment} ${moment.position}`}
      style={{ opacity, y }}
    >
      {moment.title && <h2>{moment.title}</h2>}
      <p>{moment.body}</p>
      {moment.meta && <span>{moment.meta}</span>}
      {moment.id === "contact" && <ContactLinks />}
    </motion.article>
  );
}

function StaticHorizon() {
  return (
    <main className={`${styles.horizonPage} ${styles.staticHorizonPage}`}>
      <ConceptNav />
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
            <p>{moment.body}</p>
            {moment.meta && <span>{moment.meta}</span>}
            {moment.id === "contact" && <ContactLinks />}
          </article>
        ))}
      </div>
    </main>
  );
}

function TideSignalConcept() {
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [rendererState, setRendererState] = useState("loading");
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  if (reducedMotion) {
    return <StaticHorizon />;
  }

  return (
    <main className={styles.horizonPage}>
      <ConceptNav />
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

          <h1 className="screenReaderOnly">Scott Foggo, software engineer</h1>
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

export default TideSignalConcept;
