import Layer from "@/components/layer";
import { App } from "@/components/nodes";
import Skew from "@/components/Skew";
import React from "react";

export default function Home() {
  return (
    <div className="relative w-full h-[600px] max-md:hidden">
      <div className="absolute top-[160px] left-[80px] w-[600px] h-[600px]">
        <Skew>
          <div className="w-[600px] h-[600px]">
            <App />
          </div>
        </Skew>
      </div>
      <div className="absolute top-[80px] left-[40px] w-[600px] h-[600px]">
        <Skew>
          <Layer />
        </Skew>
      </div>
      <div className="absolute top-0 left-0 w-[600px] h-[600px]">
        <Skew>
          <Layer />
        </Skew>
      </div>
    </div>
  );
}
