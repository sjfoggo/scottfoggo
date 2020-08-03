import React from "react";
import styles from "../../css/About.module.css";

function PhotoColumn(props) {
  return <div className={styles.photoColumn}>{props.children}</div>;
}

export default PhotoColumn;
