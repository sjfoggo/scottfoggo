import React from "react";
import styles from "../../css/Flex.module.css";

function Column(props) {
  const className = props.noMobile ? [styles.noMobile, styles.column].join(" ") : styles.column;

  return <div className={className}>{props.children}</div>;
}

export default Column;
