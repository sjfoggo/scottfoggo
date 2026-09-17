import React, { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import ConceptNav from "./ConceptNav";
import TidalFieldCanvas from "./TidalFieldCanvas";
import Resume from "../assets/ScottFoggo-Resume.pdf";
import styles from "../css/Concepts.module.css";

const OCEAN_POSTER =
  "https://images.pexels.com/videos/5419061/4k50fps-above-sea-beautiful-girl-beautiful-sunset-5419061.jpeg?auto=compress&cs=tinysrgb&w=1920";

const OCEAN_VIDEO =
  "https://videos.pexels.com/video-files/5419061/5419061-hd_1920_1080_25fps.mp4";

const moments = [
  {
    id: "introduction",
    center: 0,
    range: [0, 0, 0.075, 0.15],
    position: styles.fieldNoteLow,
    title: "Scott Foggo",
    fieldText: ["SCOTT", "FOGGO"],
    body: "Software engineer",
  },
  {
    id: "practice",
    center: 0.245,
    range: [0.13, 0.2, 0.3, 0.37],
    position: styles.fieldNoteHigh,
    title: "Human systems",
    fieldText: ["HUMAN", "SYSTEMS"],
    body: "I work where product, data, and dependable infrastructure meet, all with a decidedly human touch.",
  },
  {
    id: "semantic-models",
    center: 0.49,
    range: [0.375, 0.445, 0.545, 0.615],
    position: styles.fieldNoteLow,
    title: "Semantic Models",
    fieldText: ["SEMANTIC", "MODELS"],
    body: "A contextual layer that helps data agents make better decisions. Built from prototype to broad adoption.",
    meta: "Meta, since 2025",
  },
  {
    id: "metric-360",
    center: 0.735,
    range: [0.62, 0.69, 0.79, 0.855],
    position: styles.fieldNoteHigh,
    title: "Metric 360",
    fieldText: ["METRIC", "360"],
    body: "A shared metrics system that turned fragmented definitions into trusted, company-wide infrastructure.",
    meta: "Meta, 2022-2025",
  },
  {
    id: "contact",
    center: 0.965,
    range: [0.855, 0.91, 0.999, 1],
    position: styles.fieldNoteContact,
    title: "Make something useful",
    fieldText: ["MAKE", "SOMETHING", "USEFUL"],
    body: "A conversation is a good place to begin.",
  },
];

function ContactLinks() {
  return (
    <div className={styles.fieldLinks}>
      <a href="https://github.com/sjfoggo" target="_blank" rel="noreferrer">GitHub</a>
      <a href="https://www.linkedin.com/in/scott-foggo/" target="_blank" rel="noreferrer">LinkedIn</a>
      <a href={Resume} target="_blank" rel="noreferrer">Résumé</a>
    </div>
  );
}

function FieldMoment({ moment, progress }) {
  const inputRange = moment.id === "introduction"
    ? [0, moment.range[2], moment.range[3]]
    : moment.range;
  const opacityRange = moment.id === "introduction"
    ? [1, 1, 0]
    : [0, 1, 1, 0];
  const yRange = moment.id === "introduction"
    ? [0, 0, -18]
    : [22, 0, 0, -18];
  const opacity = useTransform(progress, inputRange, opacityRange);
  const y = useTransform(
    progress,
    inputRange,
    yRange,
  );

  return (
    <motion.article
      className={`${styles.fieldNote} ${moment.position}`}
      style={{ opacity, y }}
    >
      {moment.id !== "introduction" && <h2>{moment.title}</h2>}
      <p>{moment.body}</p>
      {moment.meta && <span>{moment.meta}</span>}
      {moment.id === "contact" && <ContactLinks />}
    </motion.article>
  );
}

function StaticField() {
  return (
    <main className={`${styles.tidalPage} ${styles.staticTidalPage}`}>
      <ConceptNav />
      <div
        className={styles.staticOcean}
        style={{ backgroundImage: `url(${OCEAN_POSTER})` }}
        aria-hidden="true"
      />
      <div className={styles.staticGrade} aria-hidden="true" />
      <div className={styles.fieldGrain} aria-hidden="true" />
      <h1 className="screenReaderOnly">Scott Foggo, software engineer</h1>
      <div className={styles.staticMoments}>
        {moments.map((moment) => (
          <article className={styles.staticMoment} key={moment.id}>
            <h2>{moment.title}</h2>
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
  const reducedMotion = useReducedMotion();
  const [fieldState, setFieldState] = useState("loading");
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });
  const rawVelocity = useVelocity(scrollYProgress);
  const scrollVelocity = useSpring(rawVelocity, {
    stiffness: 90,
    damping: 24,
    mass: 0.55,
  });

  if (reducedMotion) {
    return <StaticField />;
  }

  return (
    <main className={styles.tidalPage}>
      <ConceptNav />
      <section
        className={styles.fieldJourney}
        ref={sceneRef}
        aria-label="Tidal Field concept"
      >
        <div className={styles.fieldViewport}>
          <div
            className={styles.fieldPoster}
            style={{ backgroundImage: `url(${OCEAN_POSTER})` }}
            aria-hidden="true"
          />
          {fieldState === "failed" && (
            <video
              className={styles.fieldFallbackVideo}
              autoPlay
              loop
              muted
              playsInline
              poster={OCEAN_POSTER}
              preload="metadata"
              aria-hidden="true"
            >
              <source src={OCEAN_VIDEO} type="video/mp4" />
            </video>
          )}
          <TidalFieldCanvas
            progress={scrollYProgress}
            velocity={scrollVelocity}
            moments={moments}
            onStateChange={setFieldState}
          />
          <div className={styles.fieldVignette} aria-hidden="true" />
          <div className={styles.fieldGrain} aria-hidden="true" />

          <h1 className="screenReaderOnly">Scott Foggo, software engineer</h1>
          {moments.map((moment) => (
            <FieldMoment
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
