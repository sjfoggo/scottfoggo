import React, { forwardRef } from "react";

import styles from "../../css/Flex.module.css";

const Section = forwardRef((props, ref) => {
  return <section ref={ref} className={styles.section}>{props.children}</section>;
});

export default Section;
