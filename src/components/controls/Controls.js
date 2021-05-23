import React, { useEffect } from "react";
import { folder, Leva, useControls } from "leva";
import { useQueryParams, NumberParam, StringParam } from "use-query-params";

export default function Controls({ showControls, onChange }) {
  const [query, setQuery] = useQueryParams({
    canvasShape: StringParam,
    blocksAcross: NumberParam,
  });

  const [, set] = useControls(() => ({
    canvasShape: {
      value: "square",
      options: ["circle", "square"],
      onChange: (option) => setQuery({ canvasShape: option }),
    },
    blocksAcross: {
      value: 42,
      min: 1,
      max: 200,
      onChange: (value) => setQuery({ blocksAcross: value }),
    },
  }));

  const values = useControls({
    // canvasShape: {
    //   value: "square",
    //   options: ["circle", "square"],
    // },
    // blocksAcross: {
    //   value: 42,
    //   min: 1,
    //   max: 200,
    // },

    pixelShape: {
      value: "spindle-vertical",
      options: [
        "circle",
        "square",
        "triangle",
        "star",
        "cross",
        "line-vertical",
        "line-horizontal",
        "beaded-curtain-1",
        "beaded-curtain-2",
        "insect-legs",
        "spindle-vertical",
        "spindle-horizontal",
      ],
    },

    lineThickness: {
      value: 2,
      min: 1,
      max: 10,
      render: (get) =>
        get("pixelShape") === "line-vertical" ||
        get("pixelShape") === "line-horizontal",
    },

    ColsRows: folder({
      showEveryXCols: {
        value: 1,
        step: 1,
        min: 1,
        max: 10,
      },
      showEveryXRows: {
        value: 1,
        step: 1,
        min: 1,
        max: 10,
      },
    }),

    Layers: folder({
      showGrid: false,
      showImage: false,
      imageTransparency: {
        value: 0.5,
        min: 0.1,
        max: 1,
        render: (get) => get("Layers.showImage") === true,
      },
      showPixels: true,
      showShadow: true,
    }),

    Colour: folder({
      useOriginalColour: false,
      pixelColour: {
        value: "#6d5972",
        render: (get) => get("Colour.useOriginalColour") === false,
      },
      bgColour: "#ddccde",
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

  useEffect(() => {
    const updatedKeys = Object.keys(query);
    if (updatedKeys.length > 0) {
      const updates = {};
      for (let key of updatedKeys) {
        if (query[key]) {
          updates[key] = query[key];
        }
      }

      // set the controls based on the query
      set(updates);

      // update the app based on the query
      onChange({ ...values, ...updates });
    }
  }, [query]);

  return <Leva hidden={!showControls} {...values} />;
}
