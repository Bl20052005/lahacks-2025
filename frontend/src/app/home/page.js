"use client";

import { useEffect, useState } from "react";
import HomeLayers from "./HomeLayers";
import axios from "axios";

export default function Home() {
  const [layers, setLayers] = useState(null);
  useEffect(() => {
    const fetchLayers = async () => {
      const res = await axios.get(`/api/flowchart`);

      if (res.status !== 200) {
        throw new Error("Failed to fetch layers");
      }
      const data = res.data;
      setLayers(data);
    };
    fetchLayers();
  }, []);

  if (!layers) return <></>;

  return <HomeLayers initialLayers={layers} />;
}
