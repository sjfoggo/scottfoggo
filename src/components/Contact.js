import React from "react";
import styles from "../css/Contact.module.css";
import Row from "./common/Row";

function Contact() {
  return (
    <div className={styles.container}>
      <Row>
        <i class="fas fa-paper-plane"></i>
        <i class="fab fa-linkedin"></i>
        <i class="fab fa-github"></i>
      </Row>
    </div>
  );
}

export default Contact;
