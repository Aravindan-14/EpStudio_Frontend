import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Routers from "./Routers";
import { DataProvider } from "./components/Contexts/DataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DataProvider>
    <Routers />
  </DataProvider>
);
