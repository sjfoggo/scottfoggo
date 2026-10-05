import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import styles from "../css/FireAtlasProject.module.css";

const CanadaMap = lazy(() => import("./CanadaMap"));
const base = import.meta.env.BASE_URL;
const atlas = `${base}atlas/`;

function RegionalImage({ file, title, description }) {
  return <figure className={styles.figure}>
    <a href={`${atlas}${file}.png`} aria-label={`Open full-resolution map: ${title}`}>
      <img src={`${atlas}previews/${file}-detail-1280.webp`} srcSet={`${atlas}previews/${file}-detail-640.webp 640w, ${atlas}previews/${file}-detail-1280.webp 1280w`} sizes="(max-width: 767px) calc(100vw - 40px), 52vw" alt={description} width="2136" height="1728" loading="lazy" decoding="async" />
    </a>
    <figcaption><span>{title}</span><a href={`${atlas}${file}.png`} download>Download map ↗</a></figcaption>
  </figure>;
}

function MapSection() {
  const section = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "400px" });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  const preview = <img className={styles.mapPreview} src={`${atlas}national/canada-preview.webp`} srcSet={`${atlas}national/canada-preview-800.webp 800w, ${atlas}national/canada-preview.webp 2400w`} sizes="(max-width: 767px) calc(100vw - 40px), 94vw" alt="Canada-wide view of recorded wildfire perimeters" width="2400" height="2081" loading="lazy" />;
  return <section id="explore" className={styles.explore} ref={section} aria-labelledby="explore-title">
    <div className={styles.mapHeading}>
      <h2 id="explore-title">Explore the map</h2>
      <p>Zoom in to see recorded fire perimeters and population centres across Canada.</p>
    </div>
    {visible ? <Suspense fallback={preview}><CanadaMap /></Suspense> : preview}
    <div className={styles.mapFoot}>
      <p>Red transparency shows overlapping recorded perimeters, not fire risk. Pale areas may reflect gaps in the record.</p>
      <a href={`${atlas}national/canada-preview.png`} download>Download national overview ↗</a>
    </div>
  </section>;
}

export default function FireAtlasProject() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <div className={styles.page}>
    <a className={styles.skip} href="#project">Skip to project</a>
    <header className={styles.header}>
      <a className={styles.name} href={base}>Scott Foggo</a>
    </header>
    <main id="project">
      <section className={styles.hero} aria-labelledby="project-title">
        <h1 id="project-title">Canadian Wildfire Atlas</h1>
        <p className={styles.lede}>Recorded wildfire perimeters across Canada, 1980–2024.</p>
        <figure className={styles.heroFigure}>
          <a href="#explore" aria-label="Explore the zoomable map of Canada">
            <img src={`${atlas}national/canada-preview.webp`} srcSet={`${atlas}national/canada-preview-800.webp 800w, ${atlas}national/canada-preview.webp 2400w`} sizes="(max-width: 767px) calc(100vw - 40px), min(83vw, 83vh, 1040px)" width="2400" height="2081" alt="The full map of Canada, with recorded wildfire perimeters in translucent red across every province and territory." fetchPriority="high" />
          </a>
          <figcaption><span>Canada · 1980–2024</span><a href="#explore">Open interactive map ↗</a></figcaption>
        </figure>
      </section>

      <section id="about" className={styles.story} aria-labelledby="about-title">
        <div className={styles.storyCopy}>
          <h2 id="about-title">About the project</h2>
          <p>I made these maps to see where recorded wildfires sit in relation to Canada’s cities and towns. They combine 45 years of fire perimeters in national, provincial and regional views.</p>
          <p>Each recorded incident uses the same translucent red. Where perimeters overlap, the colour deepens.</p>
        </div>
        <RegionalImage file="bc-overview" title="British Columbia" description="Recorded wildfire perimeters across British Columbia, with its main population centres labelled." />
      </section>

      <section className={styles.method} aria-labelledby="method-title">
        <div className={styles.methodHeading}><h2 id="method-title">Data & technology</h2></div>
        <div className={styles.methodBody}>
          <h3>The data</h3>
          <p>Fire perimeters come from Natural Resources Canada’s <a href="https://cwfis.cfs.nrcan.gc.ca/downloads/nfdb/fire_poly/current_version/">National Fire Database</a>, filtered to 1980-2024. Statistics Canada supplies the <a href="https://geo.statcan.gc.ca/geo_wa/rest/services/2021/Cartographic_boundary_files/MapServer/0">2021 province and territory boundaries</a>, <a href="https://geo.statcan.gc.ca/geo_wa/rest/services/2021/Cartographic_boundary_files/MapServer/7">population-centre shapes</a> and <a href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810001101">census populations</a> used for labels.</p>
          <h3>The technology</h3>
          <p>Python, GeoPandas and Shapely merge the pieces of each incident and put the geometry into one Canada-wide projection. Matplotlib renders the map; OpenSeadragon brings the high-resolution image into the browser as small tiles, keeping panning and pinch-to-zoom lightweight.</p>
        </div>
      </section>

      <div className={styles.regionalMaps}>
        <RegionalImage file="bc-southern-interior" title="Southern Interior, British Columbia" description="Overlapping red fire perimeters around Kamloops, Vernon, Kelowna and Penticton in British Columbia’s Southern Interior." />
        <RegionalImage file="ab-fort-mcmurray-region" title="Fort McMurray region, Alberta" description="Dense overlapping historical fire perimeters around Fort McMurray, shown in translucent red." />
      </div>

      <section className={styles.coverage} aria-labelledby="coverage-title">
        <RegionalImage file="qc-saguenay-region" title="Saguenay region, Quebec" description="Historical wildfire footprints surrounding the labelled population centres of Alma and Chicoutimi - Jonquière in Quebec." />
        <div className={styles.coverageCopy}>
          <h2 id="coverage-title">Reading the maps</h2>
          <p>Darker red means more overlapping recorded perimeters. It does not measure risk, severity or ignition density. A pale area is not evidence that it has never burned.</p>
          <p>Coverage varies by agency and year. These maps are for exploring the historical record, not incident decisions or comparisons that assume uniform reporting.</p>
          <details><summary>Coverage & source details</summary>
            <p>This snapshot uses the NFDB archive posted January 28, 2026, downloaded October 3, 2026. New Brunswick lacks 2014-2023 updates; Newfoundland and Labrador lacks 2017-2024 updates. PEI has polygons only for 2024. Nunavut has no agency polygon layer, although Parks Canada perimeters may intersect it.</p>
            <p>Historical size thresholds and other missing years also affect coverage. The national rendering simplifies geometry by 250 metres and has a finite image resolution; it is not a parcel-level map.</p>
            <p>Source citation: Canadian Forest Service. 2021. <cite>Canadian National Fire Database - Agency Fire Data.</cite> Natural Resources Canada, Canadian Forest Service, Northern Forestry Centre, Edmonton, Alberta.</p>
            <p><a href="https://cwfis.cfs.nrcan.gc.ca/downloads/nfdb/fire_poly/current_version/NFDB_poly_shapefile_metadata.pdf">Source metadata</a> / <a href={`${atlas}national/national-manifest.json`}>National map manifest</a></p>
          </details>
        </div>
      </section>
      <MapSection />
    </main>
  </div>;
}
