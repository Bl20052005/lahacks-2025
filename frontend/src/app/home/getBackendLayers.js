import axios from "axios";

export default async function getBackendLayers() {
  console.log(localStorage.getItem("user_info"));
  const res = await axios.post(`${process.env.API_URL}/api/flowchart`);

  if (res.status !== 200) {
    throw new Error("Failed to fetch layers");
  }
  const data = res.data;
  return data;
}
