"use client";

import React, { useCallback, useState } from "react";
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

// Helper to generate unique node ids
let id = 0;
const getId = () => `node_${id++}`;

const initialNodes = [
  {
    id: getId(),
    data: { label: "Start Node" },
    position: { x: 0, y: 0 },
    width: 172,
    height: 36,
  },
  {
    id: getId(),
    data: { label: "End Node" },
    position: { x: 0, y: 0 },
    width: 172,
    height: 36,
  },
  {
    id: getId(),
    data: { label: "End Node" },
    position: { x: 0, y: 0 },
    width: 172,
    height: 36,
  },
  {
    id: getId(),
    data: { label: "End Node" },
    position: { x: 0, y: 0 },
    width: 172,
    height: 36,
  },
];

const initialCheckMarkItems = [
  { item: "example question", checked: false },
  { item: "example question", checked: false },
  { item: "example question", checked: false },
];

// Add an edge from Start Node to End Node with an arrow
const initialEdges = [
  {
    id: "e0-1",
    source: "node_0",
    target: "node_1",
    animated: false,
    markerEnd: { type: "arrowclosed" },
  },
  {
    id: "e0-2",
    source: "node_0",
    target: "node_2",
    animated: false,
    markerEnd: { type: "arrowclosed" },
  },
  {
    id: "e0-3",
    source: "node_0",
    target: "node_3",
    animated: true,
    markerEnd: { type: "arrowclosed" },
  },
];

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 272;
const nodeHeight = 66;

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
  const layoutedEdges = getLayoutedElements(initialNodes, initialEdges).edges;
  const layoutedNodes = getLayoutedElements(initialNodes, initialEdges).nodes;

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  console.log(edges, nodes);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Checkmark state (will eventually be per-node and from backend)
  const [checkMarkItems, setCheckMarkItems] = useState(initialCheckMarkItems);

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
        height: "600px",
        position: "relative",
        background: "#f0f0f0",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={initialEdges}
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
            bgcolor: "background.paper",
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
            <h2 style={{ margin: 0 }}>
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
              <IconButton onClick={() => setModalOpen(false)}>x</IconButton>
            </Box>
          </Box>
          <Box sx={{ flex: 1, mt: 2 }}>
            {/* Modal content goes here */}
            {selectedNode &&
              checkMarkItems.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    id={`check-${index}`}
                    checked={item.checked}
                    onChange={() => handleCheck(index)}
                  />
                  <label htmlFor={`check-${index}`} style={{ marginLeft: 8 }}>
                    {item.item}
                  </label>
                </div>
              ))}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Layer;
