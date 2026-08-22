import React from "react";
import Header from "./Header";
import Section from "./common/Section";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";

import "../css/reset.css";
import "../css/App.css";

function App() {
  return (
    <>
      <Header />
      <Section id="about"><About /></Section>
      <Section id="career"><Career /></Section>
      <Section id="contact"><Contact /></Section>
    </>
  );
}

export default App;
