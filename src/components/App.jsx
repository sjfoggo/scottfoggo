import React from "react";
import TideSignalConcept from "./TideSignalConcept";

import "../css/reset.css";
import "../css/App.css";

function App() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const preview = path.endsWith("/concept/tide") || path.endsWith("/concept/lab");

  return <TideSignalConcept preview={preview} />;
}

export default App;
