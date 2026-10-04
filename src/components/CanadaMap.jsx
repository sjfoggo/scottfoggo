import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import styles from "../css/CanadaMap.module.css";

const national = `${import.meta.env.BASE_URL}atlas/national/`;
const overviewLabels = new Set(["Vancouver", "Calgary", "Edmonton", "Winnipeg", "Toronto", "Montréal", "Halifax", "Whitehorse", "Yellowknife", "Iqaluit"]);

export default function CanadaMap() {
  const frame = useRef(null);
  const mount = useRef(null);
  const labelLayer = useRef(null);
  const viewerRef = useRef(null);
  const zoomText = useRef(null);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const labelsEnabled = useRef(true);

  useEffect(() => {
    const abort = new AbortController();
    let disposed = false;
    let viewer;
    let scheduled;
    setStatus("loading");
    async function initialise() {
      try {
        const response = await fetch(`${national}national-manifest.json`, { signal: abort.signal });
        if (!response.ok) throw new Error("Map metadata unavailable");
        const metadata = await response.json();
        if (disposed) return;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        viewer = OpenSeadragon({
          element: mount.current,
          tileSources: `${national}canada.dzi`,
          showNavigationControl: false,
          showNavigator: false,
          showAttributionControl: false,
          drawer: "canvas",
          animationTime: reducedMotion ? 0 : 0.45,
          blendTime: reducedMotion ? 0 : 0.12,
          visibilityRatio: 0.7,
          constrainDuringPan: true,
          minZoomImageRatio: 1,
          maxZoomPixelRatio: 1.6,
          imageLoaderLimit: 6,
          maxImageCacheCount: 80,
          gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true, scrollToZoom: true },
          gestureSettingsTouch: { clickToZoom: false, dblClickToZoom: true, dblClickDragToZoom: false, scrollToZoom: false, pinchToZoom: true, pinchRotate: false, flickEnabled: !reducedMotion },
        });
        viewerRef.current = viewer;
        viewer.canvas.setAttribute("aria-label", "Interactive Canada wildfire map. Use arrow keys to pan, plus and minus to zoom, and Home to reset.");
        viewer.canvas.setAttribute("role", "application");
        const labels = metadata.labels.map(place => {
          const node = document.createElement("span");
          node.className = styles.place;
          node.textContent = place.name;
          node.hidden = true;
          labelLayer.current.appendChild(node);
          return { ...place, node, labelWidth: place.name.length * 6.5 + 18 };
        });
        function updateLabels() {
          scheduled = null;
          if (disposed || !viewer.isOpen()) return;
          const zoom = viewer.viewport.getZoom(true) / viewer.viewport.getHomeZoom();
          frame.current.dataset.zoom = zoom.toFixed(2);
          zoomText.current.textContent = `${zoom.toFixed(1)}×`;
          const width = mount.current.clientWidth;
          const height = mount.current.clientHeight;
          const occupied = [];
          labels.forEach(place => {
            const point = viewer.viewport.imageToViewerElementCoordinates(new OpenSeadragon.Point(place.x * metadata.width, place.y * metadata.height));
            const rightAligned = point.x + place.labelWidth > width - 8;
            const x = rightAligned ? point.x - place.labelWidth : point.x;
            const box = { left: x, right: x + place.labelWidth, top: point.y - 10, bottom: point.y + 14 };
            const eligible = labelsEnabled.current && (zoom >= 2.2 || overviewLabels.has(place.name)) && box.left >= 4 && box.right <= width - 4 && box.top >= 4 && box.bottom <= height - 4;
            const overlap = occupied.some(b => box.left < b.right + 8 && box.right + 8 > b.left && box.top < b.bottom + 6 && box.bottom + 6 > b.top);
            place.node.hidden = !eligible || overlap;
            if (eligible && !overlap) {
              occupied.push(box);
              place.node.style.transform = `translate(${point.x}px, ${point.y}px) translate(${rightAligned ? "-100%" : "0"}, -50%)`;
              place.node.dataset.align = rightAligned ? "right" : "left";
            }
          });
        }
        function scheduleLabels() {
          if (scheduled == null) scheduled = requestAnimationFrame(updateLabels);
        }
        viewer.addHandler("open", () => { setStatus("ready"); scheduleLabels(); });
        viewer.addHandler("open-failed", () => setStatus("error"));
        viewer.addHandler("tile-load-failed", () => setStatus("partial"));
        viewer.addHandler("viewport-change", scheduleLabels);
        viewer.addHandler("resize", scheduleLabels);
        viewer.addHandler("update-labels", scheduleLabels);
        viewer.addHandler("canvas-key", event => {
          if (["KeyR", "KeyF"].includes(event.originalEvent.code)) event.preventDefaultAction = true;
        });
      } catch (error) {
        if (!disposed && error.name !== "AbortError") setStatus("error");
      }
    }
    initialise();
    return () => {
      disposed = true;
      abort.abort();
      cancelAnimationFrame(scheduled);
      viewer?.destroy();
      viewerRef.current = null;
      labelLayer.current?.replaceChildren();
    };
  }, [attempt]);

  useEffect(() => {
    function syncFullscreen() { setExpanded(document.fullscreenElement === frame.current); }
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  function zoom(factor) {
    const viewer = viewerRef.current;
    if (!viewer?.isOpen()) return;
    viewer.viewport.zoomBy(factor);
    viewer.viewport.applyConstraints();
  }
  function reset() { viewerRef.current?.viewport.goHome(); }
  async function fullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (frame.current.requestFullscreen) {
      try { await frame.current.requestFullscreen(); } catch { setExpanded(value => !value); }
    } else setExpanded(value => !value);
  }
  function toggleLabels() {
    labelsEnabled.current = !labelsEnabled.current;
    setShowLabels(labelsEnabled.current);
    viewerRef.current?.raiseEvent("update-labels");
  }
  function keydown(event) {
    if (event.key === "Escape" && expanded && !document.fullscreenElement) setExpanded(false);
    if (event.key === "Home" && event.target.closest(".openseadragon-canvas")) { event.preventDefault(); reset(); }
  }
  const ready = status === "ready" || status === "partial";
  return <div className={`${styles.frame} ${expanded ? styles.expanded : ""}`} ref={frame} data-viewer-status={status} onKeyDown={keydown}>
    <div className={styles.toolbar}>
      <div className={styles.zoomControls} aria-label="Map zoom controls">
        <button type="button" onClick={() => zoom(1 / 1.5)} disabled={!ready} aria-label="Zoom out">−</button>
        <span ref={zoomText} className={styles.zoomValue} aria-label="Zoom level">1.0×</span>
        <button type="button" onClick={() => zoom(1.5)} disabled={!ready} aria-label="Zoom in">+</button>
        <button type="button" onClick={reset} disabled={!ready}>Reset view</button>
      </div>
      <div className={styles.options}>
        <button type="button" onClick={toggleLabels} aria-pressed={showLabels} disabled={!ready}>City labels</button>
        <button type="button" onClick={fullscreen} aria-pressed={expanded}>{expanded ? "Exit fullscreen" : "Fullscreen"}</button>
      </div>
    </div>
    <div className={styles.stage}>
      <div ref={mount} className={styles.canvas} />
      <div ref={labelLayer} className={styles.labels} aria-hidden="true" />
      {!ready && <img className={styles.preview} src={`${national}canada-preview.webp`} srcSet={`${national}canada-preview-800.webp 800w, ${national}canada-preview.webp 2400w`} sizes="(max-width: 767px) calc(100vw - 40px), 94vw" alt="Static overview of recorded Canadian wildfire perimeters" />}
    </div>
    <div className={styles.legend}>
      <span><i className={styles.swatch} aria-hidden="true" />Recorded perimeters, 1980-2024</span>
      <span className={styles.mouseHint}>Scroll to zoom. Drag to move.</span>
      <span className={styles.touchHint}>Pinch to zoom. Drag to move.</span>
    </div>
    <div role="status" className={styles.status}>
      {status === "loading" && "Loading the national map…"}
      {(status === "error" || status === "partial") && <span>{status === "partial" ? "Some map detail could not load." : "The interactive map could not load."} <button type="button" onClick={() => setAttempt(value => value + 1)}>Retry map</button> or <a href={`${national}canada-preview.png`}>open the static overview</a>.</span>}
    </div>
  </div>;
}
