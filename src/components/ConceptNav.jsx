import React from "react";
import styles from "../css/Concepts.module.css";

const BASE = import.meta.env.BASE_URL;

function ConceptNav({ active }) {
  return (
    <nav className={styles.conceptNav} aria-label="Concept previews">
      <a className={styles.homeLink} href={BASE}>Current site</a>
      <div className={styles.conceptLinks}>
        <a
          href={`${BASE}concept/tide/`}
          aria-current={active === "tide" ? "page" : undefined}
        >
          Tide / Signal
        </a>
        <a
          href={`${BASE}concept/lab/`}
          aria-current={active === "lab" ? "page" : undefined}
        >
          Quiet Lab
        </a>
      </div>
    </nav>
  );
}

export default ConceptNav;
