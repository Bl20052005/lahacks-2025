import axios from "axios";

export default async function updateFlowchart(nodeData, nodes, edges) {
  // Collect titles and checked statements from nodes with at least one checked checkbox
  const updatedNodeData = nodeData
    .filter(
      (data) =>
        Array.isArray(data.checkBox) && data.checkBox.some((cb) => cb.checked)
    )
    .map((data) => ({
      title: data.title,
      checkedStatements: data.checkBox
        .filter((cb) => cb.checked)
        .map((cb) => cb.label),
    }))
    .reduce((acc, curr) => {
      return `${acc}${
        curr.title
      } has finished the following: ${curr.checkedStatements.join(", ")} `;
    }, "");

  await axios.post("/api/update-nodes", { steps: updatedNodeData });
}
