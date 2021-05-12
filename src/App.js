import React, { useState } from "react";
import "./styles.css";
import { folder, Leva, useControls } from "leva";
import { WebcamCanvas } from "./components/webcamCanvas/WebcamCanvas";
import BlockMirror from "./components/blockMirror/BlockMirror";
import useImageCanvas from "./hooks/useImageCanvas";
import VideoCanvas from "./components/videoCanvas/VideoCanvas";

export default function App() {
  const [showControls, setShowControls] = useState(true);
  const [frame, setFrame] = useState({ canvas: null, counter: 0 });

  const values = useControls({
    canvasShape: {
      value: "circle",
      options: ["circle", "square"],
    },
    blocksAcross: {
      value: 38,
      min: 1,
      max: 200,
    },
    pixelShape: {
      value: "square",
      options: [
        "circle",
        "square",
        "triangle",
        "cross",
        "line-vertical",
        "line-horizontal",
      ],
    },
    Layers: folder({
      showGrid: false,
      showImage: false,
      showPixels: true,
      showShadow: true,
    }),

    Colour: folder({
      useOriginalColour: true,
      pixelColour: {
        value: "#2a0034",
        render: (get) => get("Colour.useOriginalColour") === false,
      },
      bgColour: "#d8bda7",
    }),
    Input: folder({
      inputType: {
        value: "video",
        options: ["video", "webcam", "img"],
      },
      image: {
        render: (get) => get("Input.inputType") === "img",
        image: "./frida-square.jpg",
      },
    }),
  });

  const url = values.inputType === "img" ? values.image : null;

  useImageCanvas(url, (canvas) => {
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

      {values.inputType === "video" && (
        <VideoCanvas showVideo={false} setFrame={setFrame} grabInterval={80} />
      )}

      {values.inputType === "webcam" && (
        <WebcamCanvas showVideo={false} setFrame={setFrame} grabInterval={80} />
      )}
    </div>
  );
}
