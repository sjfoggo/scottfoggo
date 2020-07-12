import React, {forwardRef} from "react";
import styles from "../css/Contact.module.css";

const Contact = forwardRef((props, ref) => {
  return (
    <section ref={ref} className={styles.container}>
      <div className={styles.content}>
        <p>You can reach me via email</p>
        <p>LinkedIn</p>
        <p>or checkout my Github</p>
      </div>
    </section>
  );
});

export default Contact;
