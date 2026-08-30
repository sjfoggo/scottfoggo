import React from "react";
import styles from "../css/About.module.css";

function About() {
  return (
    <div className={styles.about}>
      <p className="eyebrow">About</p>
      <span className={styles.counter}>01 / 03</span>
      <div className={styles.content}>
        <p className={styles.statement}>
          I build software that makes <em>complex systems</em> feel clear,
          useful, and human.
        </p>
        <p className={styles.detail}>
          I’m a software engineer working at the intersection of product, data,
          and dependable infrastructure—all with a decidedly human touch. I’ve
          taken data products from prototype to company-wide adoption, from
          foundational metrics to the contextual layer helping agents make
          better decisions with data.
        </p>
      </div>
    </div>
  );
}

export default About;
