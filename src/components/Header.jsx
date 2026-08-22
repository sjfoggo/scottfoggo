import React from "react";
import styles from "../css/Header.module.css";

const Header = () => {
  return (
      <div className={styles.container}>
        <h1 className={styles.name}>Scott Foggo</h1>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a className={styles.aboutLink} href="#about">About</a>
          <a className={styles.careerLink} href="#career">Career</a>
          <a className={styles.contactLink} href="#contact">Contact</a>
        </nav>
      </div>
  );
}

export default Header;
