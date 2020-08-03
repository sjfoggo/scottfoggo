import React from "react";
import PhotoColumn from "./PhotoColumn";
import Row from "../common/Row";
import Image from "./Image";
import styles from "../../css/About.module.css";

import bigBen from "../../assets/BigBen.png";
import bigSur from "../../assets/BigSur.png";
import castle from "../../assets/Castle.png";
import deer from "../../assets/Deer.png";
import desert from "../../assets/Desert.png";
import glass from "../../assets/Glass.png";
import greenhouse from "../../assets/Greenhouse.png";
import island from "../../assets/Island.png";
import jelly from "../../assets/Jelly.png";
import osaka from "../../assets/Osaka.png";
import profile from "../../assets/Profile.png";
import redwood from "../../assets/Redwood.png";
import sunset from "../../assets/Sunset.png";
import tokyo from "../../assets/Tokyo.png";
import yosemite from "../../assets/Yosemite.png";

function About() {
  return (
    <Row>
      <PhotoColumn>
        <Image alt="Osaka" src={osaka} />
        <Image alt="Desert" src={desert} />
        <Image alt="Deer" src={deer} />
        <Image alt="Glass" src={glass} />
      </PhotoColumn>
      <PhotoColumn>
        <div className={styles.twoColumn}>
          <Image alt="Redwoods" src={redwood} />
          <Image alt="Greenhouse" src={greenhouse} />
          <Image alt="Castle" src={castle} />
          <Image alt="Tokyo" src={tokyo} />
        </div>
      </PhotoColumn>
      <PhotoColumn>
        <div className={styles.threeColumn}>
          <Image alt="Profile" src={profile} />
          <Image alt="Yosemite" src={yosemite} />
          <Image alt="Big Ben" src={bigBen} />
        </div>
      </PhotoColumn>
      <PhotoColumn>
        <div className={styles.fourColumn}>
          <Image alt="Jellyfish" src={jelly} />
          <Image alt="Island" src={island} />
          <Image alt="Sunset" src={sunset} />

          <Image alt="Big Sur" src={bigSur} />
        </div>
      </PhotoColumn>
    </Row>
  );
}

export default About;
