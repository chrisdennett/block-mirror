import React, { useEffect, useRef } from "react";
import {
  createBrightnessKeyCanvas,
  createBrightnessSizeBlockCanvas,
  getBlockData,
  getKeyBlockData,
  getSquareCanvas,
} from "../../logic/createBlockCanvas";
import styles from "./blockMirror.module.css";

export default function BlockMirror({
  frame,
  id,
  showImage,
  showShadow,
  blocksAcross,
  canvasShape,
  imageTransparency,
  effectType,
  ...rest
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!frame.canvas) return;

    const squareCanvas = getSquareCanvas(frame.canvas);
    const imgRes = Math.round(squareCanvas.width / blocksAcross);

    // make the block size the correct size to fit screen height
    const blockSize = Math.ceil(window.innerHeight / blocksAcross);
    let blockCanvas = null;

    if (effectType === "brightnessSize") {
      const blockData = getBlockData(squareCanvas, imgRes);
      blockCanvas = createBrightnessSizeBlockCanvas({
        blockData,
        blockSize,
        showShadow,
        canvasShape,

        ...rest,
      });
    } else if (effectType === "none") {
      const palleteSize = 16;
      const blockData = getBlockData(squareCanvas, imgRes, palleteSize);
      blockCanvas = createBrightnessKeyCanvas({
        blockData,
        blockSize,
        showShadow,
        canvasShape,
        palleteSize,
        ...rest,
      });
    }

    if (!blockCanvas) return null;

    const canvas = canvasRef.current;
    canvas.width = blockCanvas.width;
    canvas.height = blockCanvas.height;
    const ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (canvasShape === "circle") {
      const circleRadius = canvas.width / 2;
      const canvasMiddle = { x: circleRadius, y: circleRadius };
      ctx.beginPath();
      ctx.arc(canvasMiddle.x, canvasMiddle.y, circleRadius, 0, Math.PI * 2);
      ctx.clip();
    }

    if (showImage) {
      ctx.save();
      ctx.globalAlpha = imageTransparency;
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
