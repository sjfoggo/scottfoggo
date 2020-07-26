import React, { useRef } from "react";
import Header from "./Header";
import Section from "./common/Section";
import Bio from "./bio/Bio";
import WorkExp from "./WorkExp";
import Contact from "./Contact";

import { BrowserRouter as Router } from "react-router-dom";
import "../css/reset.css";
import "../css/App.css";

function App() {
  const bioRef = useRef(null);
  const workExpRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <Router>
      <Header refs={{ bioRef, workExpRef, contactRef }} />
      <Section ref={bioRef}><Bio /></Section>
      <Section ref={workExpRef}><WorkExp /></Section>
      <Section ref={contactRef}><Contact /></Section>
    </Router>
  );
}

export default App;
