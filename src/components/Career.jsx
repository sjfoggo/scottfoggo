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
          <span className={styles.period}>2022—Now</span>
          <div className={styles.role}>
            <h3>Semantic Models</h3>
            <span>Meta</span>
          </div>
          <p className={styles.summary}>
            Co-created Meta’s primary context layer for data agents and led its
            platform team, scaling from prototype to 1,100+ models across 100+
            teams in seven months.
          </p>
        </article>

        <article className={styles.row}>
          <span className={styles.period}>2022—Now</span>
          <div className={styles.role}>
            <h3>Metric 360</h3>
            <span>Meta</span>
          </div>
          <p className={styles.summary}>
            Led metrics catalog and governance systems adopted by 98%+ of data
            science and data engineering teams, certifying 7,000+ critical
            metrics and dashboards.
          </p>
        </article>

        <article className={styles.row}>
          <span className={styles.period}>2019—2022</span>
          <div className={styles.role}>
            <h3>Integrated Analytics</h3>
            <span>Facebook</span>
          </div>
          <p className={styles.summary}>
            Built forecasting and experimentation tooling that saved days of
            manual data science work each quarter, and co-hosted a 200+ person
            time-series summit.
          </p>
        </article>

        <article className={styles.row}>
          <span className={styles.period}>2017—2019</span>
          <div className={styles.role}>
            <h3>Oculus</h3>
            <span>Facebook</span>
          </div>
          <p className={styles.summary}>
            Shipped and tested recommendation systems that increased weekly
            actives, time spent, and monthly revenue across the Oculus platform.
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
