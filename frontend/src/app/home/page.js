"use server";

import HomeLayers from "./HomeLayers";
import getBackendLayers from "./getBackendLayers";

export default async function Home() {
  const layers = await getBackendLayers();

  return <HomeLayers initialLayers={layers} />;
}
