import React, { useEffect, useRef, useState } from "react";
import ConceptNav from "./ConceptNav";
import styles from "../css/Concepts.module.css";

const OCEAN_POSTER =
  "https://images.pexels.com/videos/5419061/4k50fps-above-sea-beautiful-girl-beautiful-sunset-5419061.jpeg?auto=compress&cs=tinysrgb&w=1920";

const discoveries = [
  {
    name: "Context",
    title: "Meaning is infrastructure.",
    detail: "A contextual layer that helps agents reason with data instead of merely retrieving it.",
    x: 24,
    y: 62,
  },
  {
    name: "Trust",
    title: "Dependability can be felt.",
    detail: "Good systems expose lineage, failure, and uncertainty without overwhelming the person using them.",
    x: 54,
    y: 42,
  },
  {
    name: "Prototype",
    title: "Small experiments reveal the edge.",
    detail: "A rotating lab for ideas that are easier to understand by touching than by describing.",
    x: 78,
    y: 70,
  },
];

function QuietLabConcept() {
  const fieldRef = useRef(null);
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const pointerRef = useRef({ x: 0.5, y: 0.5, lastSpawn: 0 });
  const [active, setActive] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const field = fieldRef.current;
    if (!canvas || !field) return undefined;

    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let frame;

    const resize = () => {
      const bounds = field.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);

      context.lineWidth = 1;
      for (let line = 0; line < 18; line += 1) {
        const baseline = height * (0.3 + line * 0.045);
        context.beginPath();
        for (let x = -20; x <= width + 20; x += 12) {
          const proximity = 1 - Math.min(1, Math.abs(x - pointerRef.current.x * width) / Math.max(width * 0.45, 1));
          const wave = Math.sin(x * 0.018 + time * 0.00045 + line * 0.55) * (2 + proximity * 4);
          const y = baseline + wave;
          if (x === -20) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(247, 245, 239, ${0.025 + line * 0.002})`;
        context.stroke();
      }

      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        const age = (time - ripple.start) / ripple.duration;
        if (age >= 1) return false;

        const radius = ripple.strength * (24 + age * Math.min(width, height) * 0.34);
        context.beginPath();
        context.arc(ripple.x * width, ripple.y * height, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(${ripple.blue ? "70, 105, 255" : "247, 245, 239"}, ${(1 - age) * 0.48})`;
        context.lineWidth = 0.8 + ripple.strength;
        context.stroke();
        return true;
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const spawnRipple = (x, y, strength = 1, blue = false) => {
    ripplesRef.current.push({
      x,
      y,
      strength,
      blue,
      start: performance.now(),
      duration: 1800 + strength * 600,
    });
  };

  const updatePointer = (event) => {
    const field = fieldRef.current;
    if (!field) return;

    const bounds = field.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    const now = performance.now();

    field.style.setProperty("--pointer-x", `${x * 100}%`);
    field.style.setProperty("--pointer-y", `${y * 100}%`);
    pointerRef.current.x = x;
    pointerRef.current.y = y;

    if (now - pointerRef.current.lastSpawn > 180) {
      spawnRipple(x, y, 0.45);
      pointerRef.current.lastSpawn = now;
    }

    let closest = active;
    let closestDistance = 0.18;
    discoveries.forEach((discovery, index) => {
      const distance = Math.hypot(x - discovery.x / 100, y - discovery.y / 100);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    setActive(closest);
    setHasMoved(true);
  };

  const activateDiscovery = (index) => {
    const discovery = discoveries[index];
    setActive(index);
    setHasMoved(true);
    spawnRipple(discovery.x / 100, discovery.y / 100, 1.5, true);
  };

  return (
    <main className={styles.labPage}>
      <ConceptNav active="lab" />

      <section
        className={styles.labField}
        ref={fieldRef}
        onPointerMove={updatePointer}
        onPointerDown={(event) => {
          updatePointer(event);
          spawnRipple(pointerRef.current.x, pointerRef.current.y, 1.7, true);
        }}
        aria-label="Interactive Quiet Lab concept"
      >
        <div
          className={styles.labPoster}
          style={{ backgroundImage: `url(${OCEAN_POSTER})` }}
          aria-hidden="true"
        />
        <video
          className={styles.labVideo}
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
        <div className={styles.labShade} aria-hidden="true" />
        <canvas className={styles.rippleCanvas} ref={canvasRef} aria-hidden="true" />
        <div className={styles.pointerLight} aria-hidden="true" />

        <header className={styles.labHeader}>
          <p className={styles.conceptEyebrow}>Scott Foggo / Quiet Lab</p>
          <p className={styles.labInstruction}>{hasMoved ? "Follow the signal" : "Move to disturb"}</p>
        </header>

        <div className={styles.labStatement}>
          <p>Useful systems</p>
          <h1>should feel <em>calm.</em></h1>
        </div>

        {discoveries.map((discovery, index) => (
          <button
            className={styles.discoveryNode}
            style={{ left: `${discovery.x}%`, top: `${discovery.y}%` }}
            data-active={active === index}
            type="button"
            key={discovery.name}
            onFocus={() => activateDiscovery(index)}
            onClick={() => activateDiscovery(index)}
            aria-label={`Reveal ${discovery.name}`}
          >
            <span />
            <small>{String(index + 1).padStart(2, "0")}</small>
          </button>
        ))}

        <aside className={styles.discoveryPanel} aria-live="polite">
          <p>{String(active + 1).padStart(2, "0")} / 03 · {discoveries[active].name}</p>
          <h2>{discoveries[active].title}</h2>
          <span>{discoveries[active].detail}</span>
        </aside>

        <footer className={styles.labFooter}>
          <span>Pointer / touch / keyboard</span>
          <a href={`${import.meta.env.BASE_URL}concept/tide/`}>Tide / Signal →</a>
        </footer>
      </section>
    </main>
  );
}

export default QuietLabConcept;
