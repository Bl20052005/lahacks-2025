"use client";

import Layer from "@/components/layer";
import { App } from "@/components/nodes";
import Skew from "@/components/Skew";
import axios from "axios";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [hovered, setHovered] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

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
          <div className="flex flex-col items-center justify-center w-full h-fit bg-gradient-to-b from-blue-950 to-blue-900">
            <div className="relative w-[600px] h-[1000px] mt-[100px]">
              {[0, 1, 2].map((i) => (
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
                        ? hovered === i
                          ? "hovered"
                          : "initial"
                        : selected === i
                        ? "selected"
                        : "faded"
                    }
                    whileHover={selected === null ? "hovered" : false}
                    onHoverStart={() => setHovered(i)}
                    onHoverEnd={() => setHovered(null)}
                    onClick={() => setSelected(i)}
                  >
                    <Layer />
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
              <Layer />
              <button
                onClick={() => setSelected(null)}
                className="text-white absolute top-0 left-0"
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
