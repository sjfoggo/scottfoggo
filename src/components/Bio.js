import React, {forwardRef} from "react";
import styles from "../css/Bio.module.css";

const Bio = forwardRef((props, ref) => {
  return (
    <section ref={ref} className={styles.container}>
      <div className={styles.content}>
        <p>This is who I am</p>
        <p>I'm interested in building tools to work with and visualize data</p>
      </div>
    </section>
  );
});

export default Bio;
