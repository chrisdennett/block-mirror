import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import {
  createBlockCanvas,
  createBlockDifferenceCanvas,
  getBlockData
} from "../logic/createBlockCanvas";
// import { createSmallCanvas } from "../logic/createSmallCanvas";

export const WebcamMirror = ({ showVideo = false }) => {
  const [prevBlockData, setPrevBlockData] = useState(null);

  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  useAnimationFrame(() => onFrameUpdate());

  const onFrameUpdate = () => {
    if (!webcamRef || !webcamRef.current) return;
    const frameCanvas = webcamRef.current.getCanvas();
    if (frameCanvas) {
      if (!canvasRef || !canvasRef.current) return;
      const screenCanvas = canvasRef.current;

      const blockData = getBlockData(frameCanvas, 10);
      let blockCanvas;

      if (prevBlockData) {
        blockCanvas = createBlockDifferenceCanvas(blockData, prevBlockData, 10);
      } else {
        blockCanvas = createBlockCanvas(blockData, 10);
      }

      setPrevBlockData(blockData);

      const ctx = screenCanvas.getContext("2d");
      screenCanvas.width = blockCanvas.width;
      screenCanvas.height = blockCanvas.height;
      ctx.drawImage(blockCanvas, 0, 0);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} />

      <Webcam
        audio={false}
        height={320}
        style={!showVideo && { position: "fixed", left: -10000 }}
        ref={webcamRef}
        mirrored={true}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
    </div>
  );
};

const videoConstraints = {
  width: 800,
  height: 600,
  facingMode: "user"
};
