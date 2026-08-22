import React from "react";
import styles from "../css/Contact.module.css";
import Row from "./common/Row";
import Link from "./common/Link";
import Resume from "../assets/ScottFoggo-Resume.pdf";

function Contact() {
  return (
    <div className={styles.backgroundContainer}>
      <Row>
        <div className={styles.iconContainer}>
          <Link href="https://github.com/sjfoggo" color="yellow">
            <i className="fab fa-github"></i>
          </Link>
          <Link href="https://www.linkedin.com/in/scott-foggo/" color="blue">
            <i className="fab fa-linkedin"></i>
          </Link>
          <Link href={Resume} color="pink">
            <i className="fas fa-file-alt"></i>
          </Link>
        </div>
      </Row>
    </div>
  );
}

export default Contact;
