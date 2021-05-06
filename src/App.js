import React, { useState } from "react";
import "./styles.css";
import { folder, Leva, useControls } from "leva";
import { WebcamMirror } from "./components/WebcamMirror";
import BlockMirror from "./components/blockMirror/BlockMirror";
import ImgPicker from "./components/imgPicker/ImgPicker";

export default function App() {
  const [frame, setFrame] = useState({ canvas: null, counter: 0 });

  const values = useControls({
    showGrid: false,
    showImage: false,
    block: "lightblue",
    blocksAcross: {
      value: 80,
      min: 1,
      max: 500,
    },
    blockSize: {
      value: 11,
      min: 2,
      max: 100,
    },

    // folder: folder({
    //   select: { value: "something", options: ["else"] },
    // }),
  });

  return (
    <div>
      <Leva {...values} />
      <div>Webcam, image, video options</div>

      <ImgPicker setFrame={setFrame} />

      <BlockMirror frame={frame} {...values} />

      <WebcamMirror showVideo={false} setFrame={setFrame} grabInterval={80} />

      <a href="https://www.pexels.com/video/jellyfish-swimming-inside-the-aquarium-5158727/">
        Video by 伍俊明 from Pexels
      </a>

      <a href="https://www.pexels.com/photo/red-crab-2235924/">
        Photo by rompalli harish from Pexels
      </a>
    </div>
  );
}
