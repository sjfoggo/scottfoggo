import React from "react";
import Column from "./common/Column";
import Row from "./common/Row";
import Text from "./common/Text";

import styles from "./../css/Career.module.css";

const ANALYTICS_LINK =
  "https://www.gartner.com/en/information-technology/glossary/augmented-analytics";

function Career() {
  return (
    <Row>
      <Column>
        <div className={styles.imgContainer}>
        <Text>Looking for:</Text>
        <Text>Software eng roles working on data visualization and analysis.</Text>
        <br />
        <br />
        <Text>Experienced in:</Text>
        <Text>Frontend Web Stack</Text>
        <Text>(JS / React / Redux / GraphQL / Relay / PHP / Hack)</Text>
        <Text>Backend/Data Science Stack (Python)</Text>
        <Text>Time series analysis and forecasting</Text>
        </div>
      </Column>
      <Column>
        <div className={styles.textContainer}>
          <Text>
            Work:
          </Text>
          <Text>Facebook</Text>
          <Text>Oculus</Text>
        </div>
      </Column>
    </Row>
  );
}

export default Career;
