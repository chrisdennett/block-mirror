import React, { useState } from "react";
import "./styles.css";
import { folder, Leva, useControls } from "leva";
import { WebcamMirror } from "./components/WebcamMirror";
import BlockMirror from "./components/blockMirror/BlockMirror";
import useImageCanvas from "./hooks/useImageCanvas";

export default function App() {
  const [showControls, setShowControls] = useState(true);
  const [frame, setFrame] = useState({ canvas: null, counter: 0 });

  const values = useControls({
    showGrid: false,
    showImage: false,
    blocksAcross: {
      value: 70,
      min: 1,
      max: 200,
    },
    blockSize: {
      value: 11,
      min: 2,
      max: 100,
    },
    blockColour: "#2a0034",
    bgColour: "#d2a6d8",
    Input: folder({
      inputType: {
        value: "webcam",
        options: ["webcam", "img", "video"],
      },
      image: {
        render: (get) => get("Input.inputType") === "img",
        image: "./pexels-rompalli-harish-2235924.jpg",
      },
    }),
  });

  useImageCanvas(values.image, (canvas) => {
    if (values.inputType !== "img") return;

    setFrame((prev) => {
      return { canvas, counter: prev + 1 };
    });
  });

  const toggleControls = (e) => {
    if (e.target.id === "app" || e.target.id === "canvas") {
      setShowControls((prev) => !prev);
    }
  };

  return (
    <div
      className="app"
      onClick={toggleControls}
      id="app"
      style={{ background: values.bgColour }}
    >
      <Leva hidden={!showControls} {...values} />

      <BlockMirror id="canvas" frame={frame} {...values} />

      {values.inputType === "webcam" && (
        <WebcamMirror showVideo={false} setFrame={setFrame} grabInterval={80} />
      )}

      {/* <a href="https://www.pexels.com/video/jellyfish-swimming-inside-the-aquarium-5158727/">
        Video by 伍俊明 from Pexels
      </a>

      <a href="https://www.pexels.com/photo/red-crab-2235924/">
        Photo by rompalli harish from Pexels
      </a> */}
    </div>
  );
}
