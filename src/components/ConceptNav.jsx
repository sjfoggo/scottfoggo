import React from "react";
import styles from "../css/Concepts.module.css";

const BASE = import.meta.env.BASE_URL;

function ConceptNav() {
  return (
    <nav className={styles.conceptNav} aria-label="Tidal Field preview">
      <a className={styles.homeLink} href={BASE}>Current site</a>
      <span>Tidal Field</span>
    </nav>
  );
}

export default ConceptNav;
