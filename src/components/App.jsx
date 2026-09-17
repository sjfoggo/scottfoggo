import React from "react";
import Header from "./Header";
import Section from "./common/Section";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import TideSignalConcept from "./TideSignalConcept";

import "../css/reset.css";
import "../css/App.css";

function App() {
  const path = window.location.pathname.replace(/\/+$/, "");

  if (path.endsWith("/concept/tide") || path.endsWith("/concept/lab")) {
    return <TideSignalConcept />;
  }

  return (
    <div className="site">
      <Header />
      <Section id="about"><About /></Section>
      <Section id="career"><Career /></Section>
      <Section id="contact"><Contact /></Section>
    </div>
  );
}

export default App;
