import React from "react";
import Column from "../common/Column";
import Row from "../common/Row";

import styles from "../../css/Bio.module.css";

import profile from "../../assets/Profile.png";

const ANALYTICS_LINK =
  "https://www.gartner.com/en/information-technology/glossary/augmented-analytics";

const PIZZA_LINK =
  "http://doughgenerator.allsimbaseball9.com/recipe.php?recipe_id=27";

function Bio() {
  return (
    <Row>
      <Column>
        <div className={styles.imgContainer}>
          <img src={profile} alt="profile"/>
        </div>
      </Column>
      <Column>
        <div className={styles.textContainer}>
          <p>I build tools that make it easier to work with data. </p>
          <br />
          <br />

          <p>
            Some people call it{" "}
            <a href={ANALYTICS_LINK} target="_blank" rel="noopener noreferrer">
              "augmented analytics"
            </a>
            ... but that sounds pretty corporate to me.
          </p>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <p>
            Oh, and I make{" "}
            <a href={PIZZA_LINK} target="_blank" rel="noopener noreferrer">
              pizza from scratch
            </a>
            . I <b>really</b> like pizza.
          </p>
        </div>
      </Column>
    </Row>
  );
}

export default Bio;
