import React from "react";
import styles from "../css/Career.module.css";

function Career() {
  return (
    <div className={styles.experience}>
      <header className={styles.heading}>
        <span className={styles.number}>01</span>
        <div>
          <p className="eyebrow">Experience</p>
          <h2>Selected experience</h2>
        </div>
      </header>

      <div className={styles.rows}>
        <article className={styles.row}>
          <span className={styles.period}>2017—Now</span>
          <div className={styles.role}>
            <h3>Integrated Analytics</h3>
            <span>Facebook</span>
          </div>
          <p className={styles.summary}>
            Building tools that support product-analysis workflows, including
            forecasting, metric monitoring, root-cause analysis, and reporting.
          </p>
        </article>

        <article className={styles.row}>
          <span className={styles.period}>Earlier</span>
          <div className={styles.role}>
            <h3>AR / VR systems</h3>
            <span>Facebook</span>
          </div>
          <p className={styles.summary}>
            Built developer infrastructure for notifications at scale and product
            systems for the Oculus Gear VR platform.
          </p>
        </article>

        <article className={styles.row}>
          <span className={styles.period}>2016</span>
          <div className={styles.role}>
            <h3>Software engineer intern</h3>
            <span>Facebook</span>
          </div>
          <p className={styles.summary}>
            Extended an internal visualization library to React Native and built
            operational tools for distributed systems.
          </p>
        </article>

        <article className={styles.row}>
          <span className={styles.period}>2017</span>
          <div className={styles.role}>
            <h3>Honours Computer Science</h3>
            <span>University of Waterloo</span>
          </div>
          <p className={styles.summary}>
            A technical foundation shaped by systems, product work, and the
            discipline of building useful things.
          </p>
        </article>
      </div>
    </div>
  );
}

export default Career;
