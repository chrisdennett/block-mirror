import React, { useEffect, useRef } from "react";
import { createBlockCanvas, getBlockData } from "../../logic/createBlockCanvas";
import styles from "./blockMirror.module.css";

export default function BlockMirror({
  frame,
  blockSize = 5,
  showImage = false,
  showGrid = false,
  blocksAcross,
  colour,
  id,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!frame.canvas) return;

    const imgRes = Math.round(frame.canvas.width / blocksAcross);

    const blockData = getBlockData(frame.canvas, imgRes);
    const blockCanvas = createBlockCanvas(
      blockData,
      blockSize,
      showGrid,
      colour
    );

    const canvas = canvasRef.current;
    canvas.width = blockCanvas.width;
    canvas.height = blockCanvas.height;
    const ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showImage) {
      ctx.drawImage(
        frame.canvas,
        0,
        0,
        frame.canvas.width,
        frame.canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    ctx.drawImage(blockCanvas, 0, 0);
  });

  return (
    <div className={styles.blockMirror} id={id}>
      <canvas ref={canvasRef} />
    </div>
  );
}
