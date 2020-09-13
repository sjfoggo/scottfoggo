import React, { useRef } from "react";
import Header from "./Header";
import Section from "./common/Section";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";

import { BrowserRouter as Router } from "react-router-dom";
import "../css/reset.css";
import "../css/App.css";

function App() {
  const aboutRef = useRef(null);
  const careerRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <Router>
      <Header refs={{ aboutRef, careerRef, contactRef }} />
      <Section ref={aboutRef}><About /></Section>
      <Section ref={careerRef}><Career /></Section>
      <Section ref={contactRef}><Contact /></Section>
    </Router>
  );
}

export default App;
