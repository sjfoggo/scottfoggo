import React, { useRef } from "react";
import Header from "./Header";
import Bio from "./Bio";
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
      <Bio ref={bioRef} />
      <WorkExp ref={workExpRef} />
      <Contact ref={contactRef} />
    </Router>
  );
}

export default App;
