import React from "react";
import { createRoot } from "react-dom/client";
import FireAtlasProject from "./components/FireAtlasProject";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode><FireAtlasProject /></React.StrictMode>,
);
