import axios from "axios";

export default async function getBackendLayers() {
  const res = await axios.get("/api/user-id", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    throw new Error("Failed to fetch layers");
  }

  const data = res.data;
  return data;
}