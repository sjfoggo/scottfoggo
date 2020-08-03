import React from "react";
import styles from "../../css/Common.module.css";

function Link(props) {
  return (
    <a className={styles.link} href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
}

export default Link;
