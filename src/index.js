import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import Conversion from "./Conversion";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Conversion />
  </React.StrictMode>,
  rootElement
);
