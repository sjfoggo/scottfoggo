import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import OceanRenderer from "./OceanRenderer";
import styles from "../css/OceanExperience.module.css";

const OCEAN_MEDIA = {
  poster:
    "https://images.pexels.com/videos/5419061/4k50fps-above-sea-beautiful-girl-beautiful-sunset-5419061.jpeg?auto=compress&cs=tinysrgb&w=1920",
  video:
    "https://videos.pexels.com/video-files/5419061/5419061-hd_1920_1080_25fps.mp4",
};

const STATEMENTS = [
  {
    id: "decisions",
    range: [0.12, 0.2, 0.35, 0.42],
    position: styles.decisionStatement,
    text: "I build software that turns data into decisions.",
  },
  {
    id: "action",
    range: [0.38, 0.46, 0.59, 0.66],
    position: styles.actionStatement,
    text: "I value simplicity, bias for action, and moving fast.",
  },
  {
    id: "together",
    range: [0.62, 0.7, 0.82, 0.88],
    position: styles.togetherStatement,
    text: "I believe we’re better when working together.",
  },
  {
    id: "contact",
    range: [0.84, 0.92, 0.999, 1],
    position: styles.contactStatement,
    text: "Let’s build something useful.",
  },
];

const CONTACT_LINKS = [
  { href: "mailto:s.foggo.7@gmail.com", label: "Email" },
  { href: "https://github.com/sjfoggo", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/scott-foggo/",
    label: "LinkedIn",
  },
];

const SNAP_CHAPTERS = ["intro", ...STATEMENTS.map(({ id }) => id)];

const HERO_NAME_FADE_OUT_START = 0.04;
const HERO_NAME_FADE_OUT_END = 0.09;

export function getHeroNameScrollStyle(progress) {
  if (progress <= HERO_NAME_FADE_OUT_START) {
    return { opacity: 1, visibility: "visible" };
  }

  if (progress >= HERO_NAME_FADE_OUT_END) {
    return { opacity: 0, visibility: "hidden" };
  }

  const fadeProgress =
    (progress - HERO_NAME_FADE_OUT_START) /
    (HERO_NAME_FADE_OUT_END - HERO_NAME_FADE_OUT_START);

  return {
    opacity: 1 - fadeProgress,
    visibility: "visible",
  };
}

function ContactLinks() {
  return (
    <nav className={styles.contactLinks} aria-label="Contact">
      {CONTACT_LINKS.map(({ href, label }) => (
        <a
          href={href}
          key={label}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

function AnimatedStatement({ progress, statement }) {
  const isContact = statement.id === "contact";
  const opacity = useTransform(
    progress,
    statement.range,
    isContact ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    statement.range,
    isContact ? [14, 0, 0, 0] : [14, 0, 0, -12],
  );

  return (
    <motion.article
      className={`${styles.statement} ${statement.position}`}
      style={{ opacity, y }}
    >
      <h2>{statement.text}</h2>
      {isContact && <ContactLinks />}
    </motion.article>
  );
}

function OceanExperience() {
  const journeyRef = useRef(null);
  const videoRef = useRef(null);
  const heroNameLayerRef = useRef(null);
  const [nameVisible, setNameVisible] = useState(false);
  const [rendererStatus, setRendererStatus] = useState("loading");
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });

  const syncHeroNameWithScroll = useCallback((progress) => {
    if (!heroNameLayerRef.current) return;

    const { opacity, visibility } = getHeroNameScrollStyle(progress);
    heroNameLayerRef.current.style.opacity = String(opacity);
    heroNameLayerRef.current.style.visibility = visibility;
  }, []);

  useMotionValueEvent(scrollYProgress, "change", syncHeroNameWithScroll);

  useEffect(() => {
    syncHeroNameWithScroll(scrollYProgress.get());
    const revealTimer = window.setTimeout(() => setNameVisible(true), 2000);
    return () => window.clearTimeout(revealTimer);
  }, [scrollYProgress, syncHeroNameWithScroll]);

  return (
    <main className={styles.page}>
      <section
        className={styles.journey}
        ref={journeyRef}
        aria-label="Scott Foggo"
      >
        <div className={styles.viewport} data-renderer={rendererStatus}>
          <div
            className={styles.poster}
            style={{ backgroundImage: `url(${OCEAN_MEDIA.poster})` }}
            aria-hidden="true"
          />
          <video
            className={styles.video}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            poster={OCEAN_MEDIA.poster}
            preload="auto"
            aria-hidden="true"
          >
            <source src={OCEAN_MEDIA.video} type="video/mp4" />
          </video>
          <OceanRenderer
            videoRef={videoRef}
            progress={scrollYProgress}
            onStatusChange={setRendererStatus}
          />

          <div
            className={styles.heroNameLayer}
            ref={heroNameLayerRef}
          >
            <h1
              className={`${styles.heroName} ${
                nameVisible ? styles.heroNameVisible : ""
              }`}
            >
              Scott Foggo
            </h1>
          </div>
          {STATEMENTS.map((statement) => (
            <AnimatedStatement
              statement={statement}
              progress={scrollYProgress}
              key={statement.id}
            />
          ))}
        </div>
        <div className={styles.chapterRail} aria-hidden="true">
          {SNAP_CHAPTERS.map((chapter) => (
            <div
              className={styles.snapChapter}
              data-snap-chapter={chapter}
              key={chapter}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default OceanExperience;
