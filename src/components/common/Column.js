import React from "react";
import styles from "../../css/Flex.module.css";

function Column(props) {
  return <div className={styles.column}>{props.children}</div>;
}

export default Column;
