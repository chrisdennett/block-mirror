import React from "react";
import "./styles.css";
import { WebcamMirror } from "./components/WebcamMirror";

export default function App() {
  return (
    <div>
      <WebcamMirror
        showVideo={false}
        resolution={2}
        blockSize={10}
        threshold={0.09}
      />
    </div>
  );
}
