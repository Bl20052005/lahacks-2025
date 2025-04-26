import React from "react";
import { Handle, Position } from "@xyflow/react";

// Custom node component for ReactFlow
const Node = ({ data }) => {
  // data: { title, content }
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #888",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <h3 style={{ margin: 0 }}>{data.title}</h3>
      {data.content && <div style={{ marginTop: 8 }}>{data.content}</div>}
      {/* Handles for connecting edges */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default Node;
