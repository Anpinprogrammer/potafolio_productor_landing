import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

// El router controla el scroll; el navegador no debe restaurar una sección anterior.
window.history.scrollRestoration = "manual";
const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
if (window.location.pathname === "/" && navigation?.type === "reload") {
  // Normaliza la URL antes de montar BrowserRouter, conservando los parámetros de búsqueda.
  window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);
