import React from "react";
import Row from "./common/Row";
import Column from "./common/Column";
import Image from "./common/Image";
import Link from "./common/Link";
import styles from "../css/About.module.css";

import profile from "../assets/Profile.png";

const ANALYTICS_LINK =
  "https://www.gartner.com/en/information-technology/glossary/augmented-analytics";

function About() {
  return (
    <Row>
      <Column>
        <div className={styles.image}>
          <Image alt="Profile" src={profile} />
        </div>
      </Column>
      <Column>
        <div className={styles.textBlock}>
          <p>
            I'm a software engineer, currently working
            at Facebook. I have an interest in data science/engineering and a
            goal of making state-of-the-art data analysis techniques accessible
            for <b>everyone</b> to use.
          </p>
          <br />
          <br />
          <p>
            Most recently, I've been working in the{" "}
            <Link href={ANALYTICS_LINK}>"augmented analytics"</Link> space,
            building tooling for time series forecasting, monitoring, root cause
            analysis, and reporting.
          </p>
        </div>
      </Column>
    </Row>
  );
}

export default About;
