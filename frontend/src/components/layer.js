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

const Layer = () => {
  const [nodeData, setNodeData] = useState([]);

  function fetchData() {
    axios
      .post(
        "/api/location",
        {
          user_prompt:
            "Find opportunities for aspiring Software Engineers near Irvine across Hackathons, Clubs, and Volunteer Projects that help college students build real skills, grow their careers, and meet new people",
          location: "Irvine",
        },
        {
          timeout: 2000000, // 20 seconds
          signal: AbortSignal.timeout(200000),
        }
      )
      .then((response) => {
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
        setNodes(nodes);
        setEdges(edges);
        setNodeData(nodeData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Checkbox handler (optimistic update)
  const handleCheck = (index) => {
    setCheckMarkItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );

    // TODO: call backend API here
    // If all checkmarks are checked, close the modal
    const allChecked = checkMarkItems.every((item, i) =>
      i === index ? !item.checked : item.checked
    );
    if (allChecked) {
      setModalOpen(false);
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
                sx={{ color: "red", position: "absolute", top: "10px", left: "10px" }}
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
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div>
                      <div key={item.id}>
                        <h3>{item?.description}</h3>
                        <a href={item?.link}>{item?.link}</a>
                      </div>
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
