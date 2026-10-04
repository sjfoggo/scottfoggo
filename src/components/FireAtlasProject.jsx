import React from "react";
import styles from "../css/FireAtlasProject.module.css";

const base = import.meta.env.BASE_URL;
const atlas = `${base}atlas/`;

function MapFigure({ file, title, description, priority = false, sizes = "(max-width: 767px) calc(100vw - 40px), (max-width: 1440px) 47vw, 680px" }) {
  return (
    <figure className={styles.figure}>
      <a className={styles.mapLink} href={`${atlas}${file}.png`} aria-label={`Open full-resolution map: ${title}`}>
        <img src={`${atlas}previews/${file}-1280.webp`} srcSet={[640, 1280, 1600].map(size => `${atlas}previews/${file}-${size}.webp ${size}w`).join(", ")} sizes={sizes} alt={description} width="2400" height="2400" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />
      </a>
      <figcaption><span>{title}</span><a href={`${atlas}${file}.png`} download>Download PNG <span aria-hidden="true">↗</span></a></figcaption>
    </figure>
  );
}

export default function FireAtlasProject() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#project">Skip to project</a>
      <header className={styles.header}>
        <a className={styles.name} href={base}>Scott Foggo</a>
        <nav aria-label="Project navigation"><a href="#maps">Selected maps</a><a href="#data">About the data</a></nav>
      </header>
      <main id="project">
        <section className={styles.hero} aria-labelledby="project-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Wildfire Technology Field Guide</p>
            <h1 id="project-title">Canadian Fire Perimeter Atlas</h1>
            <p className={styles.lede}>Forty-five years of recorded fire perimeters across Canada, from province-wide patterns to places people know.</p>
            <a className={styles.button} href={atlas}>Explore the atlas <span aria-hidden="true">↗</span></a>
          </div>
          <MapFigure file="bc-overview" title="British Columbia / Overview" description="British Columbia overview showing translucent red recorded fire perimeters from 1980 to 2024 over a grey province outline, with labelled population centres." priority sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1440px) 44vw, 610px" />
        </section>

        <section className={styles.introduction} aria-labelledby="purpose-title">
          <div>
            <p className={styles.eyebrow}>The first shipped project</p>
            <h2 id="purpose-title">Making the historical record visible.</h2>
          </div>
          <div className={styles.prose}>
            <p>The Wildfire Technology Field Guide starts with a practical question: what can the recorded geography of past fires tell us? This atlas brings agency-reported fire perimeters into one consistent set of maps.</p>
            <p>It is a historical mapping project. Thirteen province and territory overviews and seven population-centred close-ups make the record easier to explore, with pan, zoom and titled image exports.</p>
            <p className={styles.interpretation}><strong>How to read the red.</strong> Each incident is drawn with the same transparency. Darker red shows overlapping recorded 1980-2024 National Fire Database perimeters, not fire risk, burn severity or ignition density.</p>
          </div>
        </section>

        <section id="maps" className={styles.selected} aria-labelledby="maps-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Selected maps</p>
            <h2 id="maps-title">A closer look at familiar places.</h2>
            <p>Population-centre labels connect the shapes to geography. The close-ups are editorial selections, not a ranking of the highest-risk places.</p>
          </div>
          <div className={styles.detail}>
            <MapFigure file="bc-southern-interior" title="British Columbia / Southern Interior" description="Southern Interior close-up of recorded fire perimeters around Kamloops, Revelstoke, Vernon, Kelowna, Nakusp and Penticton." sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1440px) 58vw, 770px" />
            <div className={styles.detailCopy}>
              <h3>From the province to the Southern Interior.</h3>
              <p>The same historical record, viewed at a more local scale. Labels around Kamloops and the Okanagan help orient the overlapping footprints.</p>
              <a className={styles.textLink} href={`${atlas}#BC/1`}>Explore Southern Interior <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className={styles.albertaHeading}>
            <h3>Alberta, at two scales.</h3>
            <p>The provincial overview and the Fort McMurray region show how much the reading of a map changes with its extent.</p>
          </div>
          <div className={styles.pair}>
            <MapFigure file="ab-overview" title="Alberta / Overview" description="Alberta overview showing recorded 1980 to 2024 fire perimeters across the province, with labels including Edmonton, Calgary and Fort McMurray." />
            <MapFigure file="ab-fort-mcmurray-region" title="Alberta / Fort McMurray region" description="Close-up of overlapping historical fire perimeters around the Fort McMurray population centre." />
          </div>
          <a className={styles.textLink} href={`${atlas}#AB/1`}>Explore Fort McMurray <span aria-hidden="true">↗</span></a>
        </section>

        <section className={styles.method} id="data" aria-labelledby="data-title">
          <div><p className={styles.eyebrow}>Method & coverage</p><h2 id="data-title">A map of the record.<br />With gaps in the record.</h2></div>
          <div className={styles.prose}>
            <h3>From polygons to an atlas</h3>
            <p>The Python workflow filters the National Fire Database archive to 1980-2024, merges pieces sharing an agency, year and fire ID, and clips them to each jurisdiction. GeoPandas prepares the geometry; Matplotlib renders the maps. A small browser viewer adds pan, zoom and downloads without a live map service.</p>
            <h3>What a pale area does not tell you</h3>
            <p>Coverage varies by place and year, with different historical size thresholds and missing years. A pale area is not proof that it has never burned. Counts describe mapped incident perimeters, not all fire starts; cross-border perimeters may appear in two jurisdictions.</p>
            <details>
              <summary>Coverage gaps in this archive edition</summary>
              <ul>
                <li>New Brunswick: no updates for 2014-2023.</li>
                <li>Newfoundland and Labrador: no updates for 2017-2024.</li>
                <li>Prince Edward Island: polygons only for 2024.</li>
                <li>Nunavut: no agency polygon layer; intersecting Parks Canada perimeters may still appear.</li>
              </ul>
              <p>These gaps limit comparisons between jurisdictions. This atlas does not estimate future fire spread or provide operational fire guidance.</p>
            </details>
            <h3>Sources & attribution</h3>
            <p>Fire perimeters: <a href="https://cwfis.cfs.nrcan.gc.ca/downloads/nfdb/fire_poly/current_version/">Natural Resources Canada, National Fire Database</a>, archive edition posted January 28, 2026, retrieved October 3, 2026.</p>
            <p className={styles.citation}>Canadian Forest Service. 2021. <cite>Canadian National Fire Database - Agency Fire Data.</cite> Natural Resources Canada, Canadian Forest Service, Northern Forestry Centre, Edmonton, Alberta.</p>
            <p>Map outlines and labels: Statistics Canada’s <a href="https://geo.statcan.gc.ca/geo_wa/rest/services/2021/Cartographic_boundary_files/MapServer/0">2021 province and territory boundaries</a>, <a href="https://geo.statcan.gc.ca/geo_wa/rest/services/2021/Cartographic_boundary_files/MapServer/7">population-centre geometries</a> and <a href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810001101">2021 Census population-centre counts</a>.</p>
            <div className={styles.resources}><a href={`${atlas}manifest.json`}>View the manifest</a><a href="https://cwfis.cfs.nrcan.gc.ca/downloads/nfdb/fire_poly/current_version/NFDB_poly_shapefile_metadata.pdf">Read the source metadata</a></div>
          </div>
        </section>
        <section className={styles.explore} aria-labelledby="explore-title">
          <div><h2 id="explore-title">Explore the full atlas.</h2><p>13 provinces and territories. Seven closer views. All maps available as PNGs.</p></div>
          <a className={styles.button} href={atlas}>Explore the atlas <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <footer className={styles.footer}><a href={base}>Back to Scott Foggo</a><span>Wildfire Technology Field Guide</span></footer>
    </div>
  );
}
