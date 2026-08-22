import React from "react";
import styles from "../../css/Common.module.css";

function Link(props) {
  const { color } = props;

  let className;
  switch (color) {
    case "yellow":
      className = styles.yellow;
      break;
    case "blue":
      className = styles.blue;
      break;
    case "pink":
      className = styles.pink;
      break;
    default:
      className = styles.blue;
      break;
  }

  return (
    <a
      className={className}
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  );
}

export default Link;
