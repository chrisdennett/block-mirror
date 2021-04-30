import React from "react";
import "./styles.css";
import { WebcamMirror } from "./components/WebcamMirror";

export default function App() {
  return (
    <div>
      <WebcamMirror showVideo={true} />
    </div>
  );
}