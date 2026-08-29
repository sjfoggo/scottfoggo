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
          I like the moment an ambitious idea becomes something people trust. At
          Meta, I’ve taken data products from prototype to company-wide adoption,
          from foundational metrics to the context layer helping data agents make
          better decisions.
        </p>
      </div>
    </div>
  );
}

export default About;
