import React from "react";

import styles from "../../css/Common.module.css";

const Section = ({ children, id }) => {
  return <section id={id} className={styles.section}>{children}</section>;
};

export default Section;
