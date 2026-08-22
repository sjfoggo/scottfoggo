import React from "react";
import styles from "../css/About.module.css";

function About() {
  return (
    <div className={styles.about}>
      <p className="eyebrow">About</p>
      <div className={styles.content}>
        <p className={styles.statement}>
          I build software that makes <em>complex systems</em> feel clear,
          useful, and human.
        </p>
        <p className={styles.detail}>
          I’m a software engineer focused on the space where product thinking,
          data, and dependable infrastructure meet. Most recently, that has meant
          building tools for forecasting, monitoring, root-cause analysis, and
          reporting.
        </p>
      </div>
    </div>
  );
}

export default About;
