"use client";

import Layer from "@/components/layer";
import { App } from "@/components/nodes";
import Skew from "@/components/Skew";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "typewriter-effect";

export default function HomeLayers({ initialLayers }) {
  const [hovered, setHovered] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

  function layerStatesReducer(state, action) {
    const { type, layer, array, payload } = action;
    switch (type) {
      case "SET_ARRAY":
        const setUpdate = {
          ...state,
          [layer]: {
            ...state[layer],
            [array]: payload,
          },
        };
        axios.post("/api/flowchart", setUpdate);
        return setUpdate;
      case "ADD_ITEM":
        const addUpdate = {
          ...state,
          [layer]: {
            ...state[layer],
            [array]: [...state[layer][array], payload],
          },
        };
        axios.post("/api/flowchart", addUpdate);
        return addUpdate;
      case "REMOVE_ITEM":
        const removeUpdate = {
          ...state,
          [layer]: {
            ...state[layer],
            [array]: state[layer][array].filter((item, idx) =>
              typeof payload === "function"
                ? !payload(item, idx)
                : idx !== payload
            ),
          },
        };
        axios.post("/api/flowchart", removeUpdate);
        return removeUpdate;
      case "UPDATE_ITEM":
        const updateUpdate = {
          ...state,
          [layer]: {
            ...state[layer],
            [array]: state[layer][array].map((item, idx) =>
              typeof payload === "function" ? payload(item, idx) : item
            ),
          },
        };
        axios.post("/api/flowchart", updateUpdate);
        return updateUpdate;
      default:
        return state;
    }
  }

  const [layerStates, dispatchLayerStates] = React.useReducer(
    layerStatesReducer,
    initialLayers
  );

  // Layer positions for stacking
  const layerPositions = [200, 100, 0];

  // Animation variants
  const layerVariants = {
    hovered: {
      scale: 1.08,
      zIndex: 2,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    faded: {
      opacity: 0,
      transition: { duration: 0.4 },
    },
    selected: {
      scale: 1,
      opacity: 1,
      zIndex: 10,
      x: 0,
      y: 0,
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      borderRadius: 0,
      boxShadow: "none",
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  };

  return (
    <>
      <div className="bg-black">
        {selected === null && (
          <div className="flex flex-row justify-evenly w-full h-fit bg-gradient-to-b from-blue-950 to-blue-900 min-h-screen">
            <div className="relative w-[40%] h-screen flex flex-col justify-evenly">
              <div className="relative w-full ml-[30%]">
                <div className="w-fit h-fit"></div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5586b64e133ede7f47c86a12bda4f008444326c?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
                  className="object-contain absolute top-4 left-[13%] shrink-0 mt-5 w-6 aspect-square"
                  alt="Menu icon"
                />
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f889e319d79bf5e19de58793acb908f20457fb63?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
                  alt="Logo"
                  className="object-contain absolute top-0 left-0 z-10 max-w-full aspect-[2.95] w-[300px]"
                />
              </div>

              <div className="ml-16 mb-20">
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(
                        `<h1 style="color:white; font-size:2.5rem; font-weight:bold;">Loom - the most detailed guide you'll need</h1>`
                      )
                      .pauseFor(2000)
                      .typeString(
                        `<div style="color:white; font-size:1.5rem; margin-top:1.5rem;">with AI-powered suggestions, we'll ensure success!</div>`
                      )
                      .start();
                  }}
                  options={{
                    delay: 35,
                    html: true,
                    cursor: "",
                  }}
                />
              </div>
            </div>

            <div className="relative w-[600px] h-[1000px] mt-[100px] ml-[150px] min-w-[40%]">
              {Object.keys(layerStates).map((item, i) => (
                <Skew
                  key={i}
                  className="absolute top-0 left-0 w-[600px] h-[600px]"
                  style={{ top: layerPositions[i] }}
                >
                  <motion.div
                    key={i}
                    className={`absolute top-0 left-0 w-[520px] h-[600px]`}
                    custom={i}
                    variants={layerVariants}
                    initial="initial"
                    animate={
                      selected === null
                        ? hovered === item
                          ? "hovered"
                          : "initial"
                        : selected === item
                        ? "selected"
                        : "faded"
                    }
                    whileHover={selected === null ? "hovered" : false}
                    onHoverStart={() => setHovered(item)}
                    onHoverEnd={() => setHovered(null)}
                    onClick={() => setSelected(item)}
                  >
                    <Layer
                      {...layerStates[item]}
                      dispatchLayerStates={dispatchLayerStates}
                      layer={item}
                    />
                  </motion.div>
                </Skew>
              ))}
            </div>
          </div>
        )}
        {selected !== null && (
          <AnimatePresence>
            <motion.div
              key="fullscreen-layer"
              className="relative w-full h-[100vh] overflow-hidden bg-gradient-to-b from-blue-950 to-blue-900 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Layer
                {...layerStates[selected]}
                dispatchLayerStates={dispatchLayerStates}
                layer={selected}
              />
              <button
                onClick={() => setSelected(null)}
                className="text-white absolute top-0 left-0 p-4 m-4 bg-blue-800 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                &lt;
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
