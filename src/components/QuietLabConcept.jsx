import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import ConceptNav from "./ConceptNav";
import Resume from "../assets/ScottFoggo-Resume.pdf";
import styles from "../css/Concepts.module.css";

const OCEAN_POSTER =
  "https://images.pexels.com/videos/5419061/4k50fps-above-sea-beautiful-girl-beautiful-sunset-5419061.jpeg?auto=compress&cs=tinysrgb&w=1920";

const OCEAN_VIDEO =
  "https://videos.pexels.com/video-files/5419061/5419061-hd_1920_1080_25fps.mp4";

const currents = [
  {
    name: "Clarity",
    statement: "Complex systems should feel obvious in the hand.",
    note: "I work where product, data, and dependable infrastructure meet.",
  },
  {
    name: "Context",
    statement: "Shared meaning is infrastructure.",
    note: "I helped take a semantic layer from prototype to 1,100 models across more than 100 teams.",
  },
  {
    name: "Trust",
    statement: "Useful tools reveal how they know.",
    note: "Metrics, monitoring, lineage, and uncertainty made legible without losing the human thread.",
  },
  {
    name: "Contact",
    statement: "Let’s make something useful.",
    note: "A conversation is a good place to begin.",
  },
];

const wrap = (value, length) => (value + length) % length;

function QuietLabConcept() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 18 });
  const refraction = useMotionTemplate`radial-gradient(circle at ${smoothX}% ${smoothY}%, rgba(49, 92, 255, .1) 0%, rgba(49, 92, 255, .28) 13%, rgba(3, 10, 16, .06) 28%, rgba(3, 10, 16, .54) 74%)`;

  const moveTo = (next, nextDirection = 1) => {
    setDirection(nextDirection);
    setActive(wrap(next, currents.length));
  };

  const updateRefraction = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  return (
    <main className={styles.openWaterPage}>
      <ConceptNav active="lab" />

      <motion.section
        className={styles.openWater}
        aria-label="Quiet Lab concept"
        onPointerMove={updateRefraction}
        drag={reducedMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -45) moveTo(active + 1, 1);
          if (info.offset.x > 45) moveTo(active - 1, -1);
        }}
      >
        <div
          className={styles.oceanPoster}
          style={{ backgroundImage: `url(${OCEAN_POSTER})` }}
          aria-hidden="true"
        />
        <video
          className={styles.currentFilm}
          autoPlay
          loop
          muted
          playsInline
          poster={OCEAN_POSTER}
          preload="auto"
          aria-hidden="true"
        >
          <source src={OCEAN_VIDEO} type="video/mp4" />
        </video>
        <div className={styles.currentGrade} aria-hidden="true" />
        <motion.div
          className={styles.refractionField}
          style={{ background: refraction }}
          aria-hidden="true"
        />
        <div className={styles.surfaceGrain} aria-hidden="true" />

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.article
            className={styles.currentThought}
            key={currents[active].name}
            custom={direction}
            style={{ y: "-50%" }}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 100, filter: "blur(12px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -90, filter: "blur(10px)" }}
            transition={{ duration: reducedMotion ? 0.01 : 1.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{currents[active].statement}</p>
            <span>{currents[active].note}</span>
            {active === currents.length - 1 && (
              <div className={styles.waterLinks}>
                <a href="https://github.com/sjfoggo" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/scott-foggo/" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={Resume} target="_blank" rel="noreferrer">Résumé</a>
              </div>
            )}
          </motion.article>
        </AnimatePresence>

        <nav className={styles.currentNav} aria-label="Explore currents">
          {currents.map((current, index) => (
            <button
              type="button"
              aria-current={active === index ? "step" : undefined}
              onClick={() => moveTo(index, index >= active ? 1 : -1)}
              key={current.name}
            >
              {current.name}
            </button>
          ))}
        </nav>

        <button
          className={styles.nextCurrent}
          type="button"
          onClick={() => moveTo(active + 1, 1)}
          aria-label="Move to the next current"
        >
          <span>{currents[wrap(active + 1, currents.length)].name}</span>
          <span aria-hidden="true">→</span>
        </button>
      </motion.section>
    </main>
  );
}

export default QuietLabConcept;
