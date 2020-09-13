import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../css/Header.module.css";

const Header = ({ refs }) => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/about":
        scrollSmoothHandler(refs.aboutRef);
        break;
      case "/career":
        scrollSmoothHandler(refs.careerRef);
        break;
      case "/contact":
        scrollSmoothHandler(refs.contactRef);
        break;

      default:
      // ignore
    }
  }, [location, refs]);

  const scrollSmoothHandler = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
      <div className={styles.container}>
        <h1 className={styles.name}>Scott Foggo</h1>
        <nav className={styles.nav}>
          <>
            <Link className={styles.aboutLink} to="/about">About</Link>
            <Link className={styles.careerLink} to="/career">Career</Link>
            <Link className={styles.contactLink} to="/contact">Contact</Link>
          </>
        </nav>
      </div>
  );
}

export default Header;
