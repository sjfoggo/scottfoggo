import React from "react";
import styles from "../../css/Common.module.css";

function Text(props) {
  return <p className={styles.text}>{props.children}</p>
}

export default Text;
