import React from "react";
import "./styles.css";
import { WebcamMirror } from "./components/WebcamMirror";

export default function App() {
  return (
    <div>
      <WebcamMirror
        showVideo={false}
        resolution={20}
        blockSize={20}
        threshold={0}
      />
    </div>
  );
}
