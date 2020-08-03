import React from "react";
import styles from "../../css/About.module.css";

function Image(props) {
  const { alt, src } = props;

  return (
    <div className={styles.image}>
      <img alt={alt} src={src} />
    </div>
  );
}

export default Image;
