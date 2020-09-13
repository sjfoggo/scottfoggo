import React from "react";
import styles from "../../css/Flex.module.css";

function Row(props) {
  return <div className={styles.row}>{props.children}</div>;
}

export default Row;
