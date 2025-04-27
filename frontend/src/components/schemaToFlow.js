// Transforms a category/activity schema into initialNodes and initialEdges for React Flow
let id = 0;
const getId = () => `node_${id++}`;

/**
 * @param {Array} categories - The input schema (array of categories with activities)
 * @returns {{ initialNodes: Array, initialEdges: Array }}
 */
export function transformToFlowSchema(
  data,
  numNodesBefore = 0,
  ancestorId = null
) {
  id = numNodesBefore; // reset id counter for repeatable results
  let initialNodes = [];
  let nodeData = [];
  let initialEdges = [];

  console.log(data);

  data.forEach((datum, catIdx) => {
    // Optionally, add a category node (uncomment if you want category grouping)
    // const categoryNodeId = getId();
    // initialNodes.push({
    //   id: categoryNodeId,
    //   data: { label: category.category },
    //   position: { x: 250 * catIdx, y: yOffset },
    //   width: 172,
    //   height: 36,
    // });
    // initialEdges.push({
    //   id: `e${startNodeId}-${categoryNodeId}`,
    //   source: startNodeId,
    //   target: categoryNodeId,
    //   animated: false,
    //   markerEnd: { type: "arrowclosed" },
    // });
    const startNodeId = getId();
    initialNodes.push({
      id: startNodeId,
      data: {
        label: datum.header,
      },
      position: { x: 0, y: 0 },
      width: 350,
      height: 80,
    });

    nodeData.push({
      id: startNodeId,
      description: datum.header,
      header: datum.header,
      checkBox: [],
    });

    if (ancestorId) {
      initialEdges.push({
        id: `e${ancestorId}-${startNodeId}`,
        source: ancestorId,
        target: startNodeId,
        animated: false,
        markerEnd: { type: "arrowclosed" },
      });
    }

    datum.data.forEach((datumOfData, actIdx) => {
      const nodeId = getId();
      initialNodes.push({
        id: nodeId,
        data: {
          label: datumOfData.title,
        },
        position: { x: 0, y: 0 },
        width: 350,
        height: 80,
      });
      // If datumOfData does not have 'checkBox', add it with default value
      const nodeDatum = {
        id: nodeId,
        ...datumOfData,
      };
      if (!("checkBox" in datumOfData)) {
        nodeDatum.checkBox = [
          { checked: false, label: "Finished everything here!" },
        ];
      } else {
        nodeDatum.checkBox = datumOfData.checkBox.map((item) => {
          return {
            checked: false,
            label: item,
          };
        });
      }
      nodeData.push(nodeDatum);
      initialEdges.push({
        id: `e${startNodeId}-${nodeId}`,
        source: startNodeId,
        target: nodeId,
        animated: false,
        markerEnd: { type: "arrowclosed" },
      });
    });
  });

  return { initialNodes, initialEdges, nodeData };
}
