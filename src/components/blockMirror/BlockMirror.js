import React, { useEffect, useRef } from "react";
import {
  createBlockCanvas,
  getBlockData,
  getSquareCanvas,
} from "../../logic/createBlockCanvas";
import styles from "./blockMirror.module.css";

export default function BlockMirror({
  frame,
  blockSize = 5,
  showImage = false,
  showGrid = false,
  showBlocks = true,
  showShadow = false,
  blocksAcross,
  blockColour,
  id,
  useCircle,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!frame.canvas) return;

    const squareCanvas = getSquareCanvas(frame.canvas);
    const imgRes = Math.round(squareCanvas.width / blocksAcross);

    const blockData = getBlockData(squareCanvas, imgRes);
    const blockCanvas = createBlockCanvas({
      blockData,
      blockSize,
      showGrid,
      showBlocks,
      blockColour,
      useCircle,
      showShadow,
    });

    const canvas = canvasRef.current;

    canvas.width = blockCanvas.width;
    canvas.height = blockCanvas.height;
    const ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showImage) {
      ctx.drawImage(
        squareCanvas,
        0,
        0,
        squareCanvas.width,
        squareCanvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    ctx.drawImage(blockCanvas, 0, 0);
  });

  const canvasStyle = showShadow
    ? { filter: "drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.5))" }
    : {};

  return (
    <div className={styles.blockMirror} id={id}>
      <canvas ref={canvasRef} style={canvasStyle} />
    </div>
  );
}
