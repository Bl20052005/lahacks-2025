export default async function getBackendLayers() {
  return {
    network: {
      nodes: [],
      edges: [],
      nodeData: [],
    },
    apps: {
      nodes: [],
      edges: [],
      nodeData: [],
    },
    goals: {
      nodes: [],
      edges: [],
      nodeData: [],
    },
  };

  const res = await fetch("/api/layers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch layers");
  }

  const data = await res.json();
  return data;
}
