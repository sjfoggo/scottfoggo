import React from "react";
import styles from "../css/Contact.module.css";
import Resume from "../assets/ScottFoggo-Resume.pdf";

function Contact() {
  return (
    <footer className={styles.contact}>
      <div className={styles.topline}>
        <span>Get in touch</span>
        <span>04 / 04</span>
      </div>

      <h2 className={styles.callout}>
        Let’s make
        <span>something useful.</span>
      </h2>

      <div className={styles.links}>
        <a href="https://github.com/sjfoggo" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a href="https://www.linkedin.com/in/scott-foggo/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a href={Resume} target="_blank" rel="noopener noreferrer">Résumé ↗</a>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

export default Contact;
