"use client";

import Layer from "@/components/layer";
import { App } from "@/components/nodes";
import Skew from "@/components/Skew";
import axios from "axios";
import React, { useEffect } from "react";

export default function Home() {
  const [curNode, setCurNode] = React.useState(null);
  useEffect(() => {
    axios
      .post("/api/location", {
        user_prompt:
          "Find opportunities for aspiring Software Engineers near Irvine across Hackathons, Clubs, and Volunteer Projects that help college students build real skills, grow their careers, and meet new people",
        location: "Irvine",
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <>
      {!curNode && (
        <div
          className="flex flex-col items-center justify-center w-full h-fit bg-gradient-to-b from-blue-950 to-blue-900"
          onClick={() => setCurNode(1)}
        >
          <div className="relative w-[600px] h-[1000px] mt-[100px]">
            <Skew className={"absolute top-[200px] left-0 w-[600px] h-[600px]"}>
              <Layer />
            </Skew>
            <Skew className={"absolute top-[100px] left-0 w-[600px] h-[600px]"}>
              <Layer />
            </Skew>
            <Skew className={"absolute top-0 left-0 w-[600px] h-[600px]"}>
              <Layer />
            </Skew>
          </div>
        </div>
      )}
      {curNode && (
        <div className="w-screen h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex items-center justify-center">
          <Layer />
        </div>
      )}
    </>
  );
}
