import React from "react";
import Column from "./common/Column";
import Row from "./common/Row";
import Text from "./common/Text";
import Link from "./common/Link";

import styles from "../css/Career.module.css";

const ANALYTICS_LINK =
  "https://www.gartner.com/en/information-technology/glossary/augmented-analytics";

function Career() {
  return (
    <Row>
      <Column>
        <div className={styles.textBlock}>
          <Text>
            I'm a software engineer currently working at Facebook. I have an
            interest in data visualization and analysis.
          </Text>
          <br />
          <Text>
            Most recently I've been working on{" "}
            <Link href={ANALYTICS_LINK}>augmented analytics</Link> tooling in
            the forecasting, monitoring, and root cause analysis spaces.
          </Text>
        </div>
      </Column>
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
    </Row>
  );
}

export default Career;
