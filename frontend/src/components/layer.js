"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import Node from "./Node";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import "./layer.css";
import axios from "axios";
import { transformToFlowSchema } from "./schemaToFlow";
import getNewFlowchart from "./getNewFlowchart";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 350;
const nodeHeight = 120;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const Layer = ({ nodes, edges, nodeData, dispatchLayerStates, layer }) => {
  // const [nodeData, setNodeData] = useState([]);
  const [n, setNodes, onNodesChange] = useNodesState(nodes);
  const [e, setEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    if (nodes.length == 0 && edges.length == 0 && nodeData.length == 0) {
      // fetchData();
      const username = localStorage.getItem("username");
      if (username) {
        fetchData(username);
      }
    }
  }, [nodes, edges, nodeData]);

  async function fetchData(username) {
    try {
      const response = await axios.post(
        "/api/begin",
        {
          theme: layer,
          username: username,
        },
        {
          timeout: 2000000, // 20 seconds
          signal: AbortSignal.timeout(200000),
        }
      );
      const parsedResponse = JSON.parse(response.data);
      console.log(response.data, parsedResponse);
      const { initialNodes, initialEdges, nodeData } = transformToFlowSchema(
        parsedResponse.data
      );
      const { nodes, edges } = getLayoutedElements(
        initialNodes,
        initialEdges,
        "TB"
      );

      dispatchLayerStates({
        type: "SET_ARRAY",
        layer: layer,
        array: "nodes",
        payload: nodes,
      });

      dispatchLayerStates({
        type: "SET_ARRAY",
        layer: layer,
        array: "edges",
        payload: edges,
      });

      dispatchLayerStates({
        type: "SET_ARRAY",
        layer: layer,
        array: "nodeData",
        payload: nodeData,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Checkbox handler (optimistic update)
  const handleCheck = (nodeIndex, checkIndex, nodeId) => {
    const updatedNodeData = nodeData.map((item, idx) => {
      if (idx === nodeIndex) {
        return {
          ...item,
          checkBox: item.checkBox.map((check, cIdx) => {
            if (cIdx === checkIndex) {
              return { ...check, checked: !check.checked };
            }
            return check;
          }),
        };
      }
      return item;
    });
    dispatchLayerStates({
      type: "SET_ARRAY",
      layer: layer,
      array: "nodeData",
      payload: updatedNodeData,
    });

    // Create a copy of the checkbox array with the toggled value
    const updatedCheckBox = nodeData[nodeIndex].checkBox.map((check, cIdx) => {
      if (cIdx === checkIndex) {
        return { ...check, checked: !check.checked };
      }
      return check;
    });

    // Check if all checkboxes are checked after the update
    const allChecked = updatedCheckBox.every((check) => check.checked);

    console.log(allChecked, updatedCheckBox);

    if (allChecked) {
      setModalOpen(false);
      // TODO: Backend API call to update the flowchart

      getNewFlowchart(nodeData, nodes, edges).then((result) => {
        console.log(result);
        const {
          initialNodes: newNodes,
          initialEdges: newEdges,
          nodeData: newNodeData,
        } = transformToFlowSchema(result.data, nodes.length, nodeId);

        console.log(newNodes, newEdges, newNodeData);

        const { nodes: finalNodes, edges: finalEdges } = getLayoutedElements(
          [...nodes, ...newNodes],
          [...edges, ...newEdges],
          "TB"
        );

        dispatchLayerStates({
          type: "SET_ARRAY",
          layer: layer,
          array: "nodes",
          payload: finalNodes,
        });

        dispatchLayerStates({
          type: "SET_ARRAY",
          layer: layer,
          array: "edges",
          payload: finalEdges,
        });

        dispatchLayerStates({
          type: "SET_ARRAY",
          layer: layer,
          array: "nodeData",
          payload: [...nodeData, ...newNodeData],
        });
      });
      // Uncomment the following line to send the updated node data to the backend
      // await axios.post("/api/updateFlowchart", { nodeData: updatedNodeData });
    }
  };

  // Open modal on node click
  const handleNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setModalOpen(true);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#001840",
        borderRadius: "8px",
        border: "2px solid #222",
        padding: "16px",
      }}
    >
      <button onClick={fetchData}>fetchData</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitViewOptions={{ padding: 0 }}
      ></ReactFlow>

      {modalOpen && (
        <Box
          component={motion.div}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: fullscreen ? "100%" : 400,
            maxWidth: "100%",
            bgcolor: "#010045",
            color: "#fff",
            boxShadow: 3,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            p: 2,
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ marginTop: "40px", fontSize: 20 }}>
              {selectedNode ? selectedNode.data.label : ""}
            </h2>
            <Box>
              <Button
                size="small"
                onClick={() => setFullscreen((f) => !f)}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
              <IconButton
                onClick={() => setModalOpen(false)}
                sx={{
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                }}
              >
                x
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ flex: 1, mt: 2 }}>
            {/* Modal content goes here */}
            {selectedNode &&
              nodeData.map((item, index) => {
                if (item.id !== selectedNode.id) return null;
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div key={item.id}>
                        <h3>{item?.description}</h3>
                        <a href={item?.link}>{item?.link}</a>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-start mt-4">
                      {item?.checkBox &&
                        item.checkBox.map((check, checkIndex) => {
                          return (
                            <div
                              key={checkIndex}
                              style={{ marginLeft: 8 }}
                              className="w-full"
                            >
                              <input
                                type="checkbox"
                                id={`check-${index}-${checkIndex}`}
                                checked={check.checked}
                                onChange={() =>
                                  handleCheck(index, checkIndex, item.id)
                                }
                              />
                              <label
                                htmlFor={`check-${index}-${checkIndex}`}
                                style={{ marginLeft: 8 }}
                              >
                                {check.label}
                              </label>
                            </div>
                          );
                        })}
                    </div>
                    {/* <input
                      type="checkbox"
                      id={`check-${index}`}
                      checked={item.checked}
                      onChange={() => handleCheck(index)}
                    />
                    <label htmlFor={`check-${index}`} style={{ marginLeft: 8 }}>
                      {item.item}
                    </label> */}
                  </div>
                );
              })}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Layer;
