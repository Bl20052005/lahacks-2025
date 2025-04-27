import axios from "axios";

export default function updateFlowchart(method, data) {
  if (method === "GET") {
    axios
      .get("/api/flowchart", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data);
  }

  if (method === "POST") {
    axios.post("/api/flowchart", data).then((res) => res.data);
  }
}
