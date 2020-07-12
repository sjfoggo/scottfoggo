import React, {forwardRef} from "react";
import styles from "../css/WorkExp.module.css";

const WorkExp = forwardRef((props, ref) => {
  return (
    <section ref={ref} className={styles.container}>
      <div className={styles.content}>
        <p>I've been at Facebook for about 3 years working on data tools</p>
        <p>More info more info more info</p>
      </div>
    </section>
  );
});

export default WorkExp;
