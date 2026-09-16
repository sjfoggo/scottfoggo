import React, { useEffect, useRef, useState } from "react";
import ConceptNav from "./ConceptNav";
import styles from "../css/Concepts.module.css";

const OCEAN_POSTER =
  "https://images.pexels.com/videos/5419061/4k50fps-above-sea-beautiful-girl-beautiful-sunset-5419061.jpeg?auto=compress&cs=tinysrgb&w=1920";

const signals = [
  {
    number: "01",
    name: "Context",
    title: "Give complex systems a shared language.",
    detail: "Semantic layers that help people—and agents—make better decisions with data.",
  },
  {
    number: "02",
    name: "Systems",
    title: "Make the invisible inspectable.",
    detail: "Metrics, monitoring, and infrastructure designed to earn trust through use.",
  },
  {
    number: "03",
    name: "Human touch",
    title: "Build for confidence, not dashboards.",
    detail: "Technical depth matters most when the experience still feels clear and human.",
  },
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function TideSignalConcept() {
  const sceneRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame;

    const updateProgress = () => {
      const scene = sceneRef.current;
      if (!scene) return;

      const rect = scene.getBoundingClientRect();
      const distance = Math.max(1, scene.offsetHeight - window.innerHeight);
      const nextProgress = clamp(-rect.top / distance);
      setProgress((current) => Math.abs(current - nextProgress) > 0.002 ? nextProgress : current);
    };

    const requestUpdate = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const rise = clamp((progress - 0.08) / 0.78);
  const tideTop = 100 - rise * 82;
  const activeSignal = Math.min(2, Math.floor(clamp((progress - 0.18) / 0.72) * 3));
  const heroOpacity = 1 - clamp((progress - 0.04) / 0.28);

  return (
    <main className={styles.conceptPage} data-concept="tide">
      <ConceptNav active="tide" />

      <section className={styles.tideScene} ref={sceneRef} aria-label="Tide and Signal concept">
        <div
          className={styles.tideSticky}
          style={{
            "--tide-top": `${tideTop}%`,
            "--hero-opacity": heroOpacity,
            "--ocean-scale": 1 + progress * 0.08,
          }}
        >
          <div
            className={styles.oceanPoster}
            style={{ backgroundImage: `url(${OCEAN_POSTER})` }}
            aria-hidden="true"
          />
          <video
            className={styles.oceanVideo}
            autoPlay
            loop
            muted
            playsInline
            poster={OCEAN_POSTER}
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
          <div className={styles.oceanScrim} aria-hidden="true" />

          <div className={styles.tideHero}>
            <p className={styles.conceptEyebrow}>Scott Foggo / Product engineer</p>
            <h1><span>Scott</span><span>Foggo</span></h1>
            <p className={styles.scrollPrompt}>Scroll with the tide <span aria-hidden="true">↓</span></p>
          </div>

          <div className={styles.tidePanel}>
            <div className={styles.tideEdge} aria-hidden="true" />
            <div className={styles.signalStage} aria-live="polite">
              <p className={styles.signalCounter}>{signals[activeSignal].number} / 03</p>
              <p className={styles.signalName}>{signals[activeSignal].name}</p>
              <h2>{signals[activeSignal].title}</h2>
              <p className={styles.signalDetail}>{signals[activeSignal].detail}</p>
            </div>

            <ol className={styles.signalRail}>
              {signals.map((signal, index) => (
                <li key={signal.name} data-active={index === activeSignal}>
                  <span>{signal.number}</span>
                  <strong>{signal.name}</strong>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.depthMeter} aria-hidden="true">
            <span style={{ height: `${Math.max(2, progress * 100)}%` }} />
          </div>
        </div>
      </section>

      <section className={styles.tideOutro}>
        <p className={styles.conceptEyebrow}>What follows</p>
        <h2>Two case studies.<br />A living lab.<br /><em>No résumé wall.</em></h2>
        <p>
          Each signal becomes a doorway into one carefully told project—what changed,
          what was difficult, and why it mattered.
        </p>
        <a href={`${import.meta.env.BASE_URL}concept/lab/`}>Enter Quiet Lab →</a>
      </section>
    </main>
  );
}

export default TideSignalConcept;
