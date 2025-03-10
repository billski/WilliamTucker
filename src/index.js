import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("Starting render...");
const container = document.getElementById("root");
console.log("Root element:", container);
if (!container) {
  console.error("Root element not found!");
} else {
  const root = createRoot(container);
  console.log("Rendering App...");
  root.render(<App />);
  console.log("App rendered.");
}