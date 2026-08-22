import React from "react";
import Column from "./common/Column";
import Row from "./common/Row";
import Image from "./common/Image";
import Link from "./common/Link";
import redwood from "../assets/Redwood.png";
import bigSur from "../assets/BigSur.png";
import yosemite from "../assets/Yosemite.png";

import styles from "../css/Career.module.css";

const PROPHET_LINK = "https://facebook.github.io/prophet/";
const AX_LINK = "https://ax.dev/";

function Career() {
  return (
    <Row>
      <Column>
        <div className={styles.centeredBlock}>
          <h2 className={styles.sectionHeading}>Recent Experience</h2>
          <h3 className={styles.sectionSubHeading}>
            Facebook | 2017 - Current
          </h3>
          <div className={styles.experienceBlock}>
            <h4 className={styles.teamName}>Integrated Analytics</h4>
            <ul className={styles.text}>
              <li>
                - Building tooling to support product analysis workflows (e.g.
                metric monitoring, root cause analysis, and reporting)
              </li>
              <li>
                - Worked on an internal forecasting platform, used by 100s of
                data scientists, engineers and analysts across finance, product,
                infra, etc.
              </li>
            </ul>
          </div>
          <div className={styles.experienceBlock}>
            <h4 className={styles.teamName}>AR/VR</h4>
            <ul className={styles.text}>
              <li>
                - Built out notifications infrastructure for 3rd-party devs;
                ~10k notification/sec during peak load.
              </li>
              <li>
                - Setup recommended app notifications resulting in increases to
                weekly active users, timespent and monthly revenue for Oculus'
                Gear VR platform.
              </li>
            </ul>
          </div>

          <h3 className={styles.sectionSubHeading}>Facebook (Intern) | 2016</h3>
          <div className={styles.experienceBlock}>
            <ul className={styles.text}>
              <li>
                - Added React Native support for an internal data visualization
                library originally written in React
              </li>
              <li>
                - Built a set of CLI tools for use during system outages of a
                globally distributed config management system
              </li>
            </ul>
          </div>
          <h2 className={styles.sectionHeading}>Tech</h2>
          <p className={styles.text}>
            JavaScript (React, Relay/GraphQL, Redux), PHP (Hack), Python (
            <Link color="pink" href={PROPHET_LINK}>Prophet</Link>,{" "}
            <Link href={AX_LINK}>Adaptive Experimentation</Link>), C++, MySQL,
            RocksDB
          </p>
          <h2 className={styles.sectionHeading}>Education</h2>
          <p className={styles.text}>
            Honours Computer Science, UWaterloo, 2017
          </p>
        </div>
      </Column>
      <Column noMobile>
        <div className={styles.image}>
          <Image alt="Redwoods" src={redwood} />
        </div>
        <div className={styles.image}>
          <Image alt="Big Sur" src={bigSur} />
        </div>
        <div className={styles.image}>
          <Image alt="Yosemite" src={yosemite} />
        </div>
      </Column>
    </Row>
  );
}

export default Career;
