import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";
import "./assets/styles/index.css";

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
