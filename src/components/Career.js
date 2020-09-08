import React from "react";
import Column from "./common/Column";
import Row from "./common/Row";
import Text from "./common/Text";
import Image from "./common/Image";
import redwood from "../assets/Redwood.png";
import yosemite from "../assets/Yosemite.png";

import styles from "../css/Career.module.css";

function Career() {
  return (
    <Row>
      <Column>
        <div className={styles.textBlock}>
          <Text>Places I've worked</Text>
          <Text>Facebook</Text>
          <Text>Oculus</Text>
          <br />
          <br />
          <Text>Frontend Web Stack</Text>
          <Text>(JS / React / Redux / GraphQL / Relay / PHP / Hack)</Text>
          <Text>Backend/Data Science Stack (Python)</Text>
          <Text>Time series analysis and forecasting</Text>
        </div>
      </Column>
      <Column>
        <Image alt="Redwoods" src={redwood} />
        <Image alt="Yosemite" src={yosemite} />
      </Column>
    </Row>
  );
}

export default Career;
