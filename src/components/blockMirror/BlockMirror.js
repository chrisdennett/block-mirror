import React, { useEffect, useRef } from "react";
import {
  createBlockCanvas,
  getBlockData,
  getSquareCanvas,
} from "../../logic/createBlockCanvas";
import styles from "./blockMirror.module.css";

export default function BlockMirror({
  frame,
  id,
  showImage,
  showShadow,
  blocksAcross,
  ...rest
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!frame.canvas) return;

    const squareCanvas = getSquareCanvas(frame.canvas);
    const imgRes = Math.round(squareCanvas.width / blocksAcross);

    // make the block size the correct size to fit screen height
    const blockSize = window.innerHeight / blocksAcross;
    const blockData = getBlockData(squareCanvas, imgRes);
    const blockCanvas = createBlockCanvas({
      blockData,
      blockSize,
      showShadow,
      ...rest,
    });

    const canvas = canvasRef.current;
    canvas.width = blockCanvas.width;
    canvas.height = blockCanvas.height;
    const ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showImage) {
      ctx.save();
      if (canvasShape === "circle") {
        const circleRadius = canvas.width / 2;
        const canvasMiddle = { x: circleRadius, y: circleRadius };
        ctx.beginPath();
        ctx.arc(canvasMiddle.x, canvasMiddle.y, circleRadius, 0, Math.PI * 2);
        ctx.clip();
      }

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
      ctx.restore();
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
