const getAvgBrightnessOfBlock = ({
  pixels,
  inputWidth,
  pixelsPerBlock = 100,
  blockCornerX = 0,
  blockCornerY = 0,
}) => {
  const totalPixels = pixelsPerBlock * pixelsPerBlock;

  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;

  for (let y = blockCornerY; y < blockCornerY + pixelsPerBlock; y++) {
    for (let x = blockCornerX; x < blockCornerX + pixelsPerBlock; x++) {
      const i = (y * inputWidth + x) * 4;

      if (i + 3 < pixels.length) {
        totalRed += pixels[i];
        totalGreen += pixels[i + 1];
        totalBlue += pixels[i + 2];
      }
    }
  }

  const brightness =
    totalRed * 0.2126 + totalGreen * 0.7152 + totalBlue * 0.0722;
  const decimalPercentage = 1 - brightness / (totalPixels * 255);

  return decimalPercentage;
};

export const getBlockData = (inputCanvas, pixelsPerBlock = 10) => {
  const { width: inputW, height: inputH } = inputCanvas;

  const cols = Math.round(inputW / pixelsPerBlock);
  const rows = Math.round(inputH / pixelsPerBlock);

  const inputCtx = inputCanvas.getContext("2d");
  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  let pixels = imgData.data;

  const blockData = [];

  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      const blockCornerX = x * pixelsPerBlock;
      const blockCornerY = y * pixelsPerBlock;

      const blockBrightness = getAvgBrightnessOfBlock({
        pixels,
        inputWidth: inputW,
        pixelsPerBlock,
        blockCornerX,
        blockCornerY,
      });

      row.push(blockBrightness);
    }
    blockData.push(row);
  }

  return blockData;
};

export const createBlockCanvas = ({
  blockData,
  blockSize = 10,
  showGrid = true,
  showBlocks,
  colour,
  useCircle,
}) => {
  const cols = blockData[0].length;
  const rows = blockData.length;

  const outWidth = cols * blockSize;
  const outHeight = rows * blockSize;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outWidth;
  outputCanvas.height = outHeight;
  const outputCtx = outputCanvas.getContext("2d");

  outputCtx.fillStyle = colour;
  const halfBlockSize = blockSize / 2;

  const canvasMiddle = { x: outWidth / 2, y: outHeight / 2 };

  for (let y = 0; y < rows; y++) {
    const row = blockData[y];
    for (let x = 0; x < cols; x++) {
      const blockCornerX = x * blockSize;
      const blockCornerY = y * blockSize;

      const blockMidX = blockCornerX + halfBlockSize;
      const blockMidY = blockCornerY + halfBlockSize;

      if (useCircle) {
        const isWithinCircle = checkIfPointIsInCircle(
          blockMidX,
          blockMidY,
          canvasMiddle.x,
          canvasMiddle.y,
          outHeight / 2
        );

        if (!isWithinCircle) continue;
      }

      if (showGrid) {
        outputCtx.fillStyle = "none";
        outputCtx.strokeStyle = "black";
        outputCtx.lineWidth = 0.4;
        outputCtx.strokeRect(blockCornerX, blockCornerY, blockSize, blockSize);
      }

      if (!showBlocks) continue;

      const blockBrightness = row[x];
      const brightnessSize = blockSize * blockBrightness;

      outputCtx.beginPath();

      outputCtx.arc(blockMidX, blockMidY, brightnessSize / 2, 0, Math.PI * 2);
      outputCtx.fill();

      outputCtx.closePath();
    }
  }

  return outputCanvas;
};

export const createBlockDifferenceCanvas = (
  blockData,
  prevBlockData,
  blockSize = 10,
  threshold = 0.2
) => {
  const cols = blockData[0].length;
  const rows = blockData.length;

  const outWidth = cols * blockSize;
  const outHeight = rows * blockSize;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outWidth;
  outputCanvas.height = outHeight;
  const outputCtx = outputCanvas.getContext("2d");

  let blockX, blockY;
  outputCtx.fillStyle = "black";
  const halfBlockSize = blockSize / 2;

  for (let y = 0; y < rows; y++) {
    const row = blockData[y];
    const prevBlockRow = prevBlockData[y];
    for (let x = 0; x < cols; x++) {
      // average the pixels in the area by looping through

      const blockCornerX = x * blockSize;
      const blockCornerY = y * blockSize;

      const blockBrightness = row[x];
      const prevBlockBrightness = prevBlockRow[x];
      const diff = Math.abs(blockBrightness - prevBlockBrightness);

      if (diff >= threshold) {
        // block width deterimined by brightness
        const brightnessSize = blockSize * blockBrightness;
        const offset = (blockSize - brightnessSize) / 2;

        // TODO this Block pos only works for vertical cetner alignment
        blockX = offset + blockCornerX;
        blockY = offset + blockCornerY;

        outputCtx.fillStyle = "black";

        outputCtx.beginPath();

        outputCtx.arc(
          blockX + halfBlockSize,
          blockY + halfBlockSize,
          brightnessSize / 2,
          0,
          Math.PI * 2
        );
        outputCtx.fill();

        outputCtx.closePath();
      } else {
        const redDotSize = 1;
        const offset = (blockSize - redDotSize) / 2;

        blockX = offset + blockCornerX;
        blockY = offset + blockCornerY;

        // outputCtx.fillStyle = "red";
        outputCtx.beginPath();

        outputCtx.arc(blockX, blockY, redDotSize, 0, Math.PI * 2);
        outputCtx.fill();

        outputCtx.closePath();
      }
    }
  }

  return outputCanvas;
};

const checkIfPointIsInCircle = (a, b, x, y, r) => {
  var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
  r *= r;
  if (dist_points < r) {
    return true;
  }
  return false;
};

export const getSquareCanvas = (inputCanvas) => {
  const outCanvas = document.createElement("canvas");
  const { width: inW, height: inH } = inputCanvas;
  const maxSize = inW > inH ? inH : inW;

  outCanvas.width = maxSize;
  outCanvas.height = maxSize;

  const xOffset = (inW - maxSize) / 2;
  const yOffset = (inH - maxSize) / 2;

  const ctx = outCanvas.getContext("2d");
  ctx.drawImage(
    inputCanvas,
    xOffset,
    yOffset,
    maxSize,
    maxSize,
    0,
    0,
    maxSize,
    maxSize
  );

  return outCanvas;
};
