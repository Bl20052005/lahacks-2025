import React from "react";

const Skew = ({ children, className, style}) => {
  return (
    <div
      style={{
        ...style,
        transform: "rotateX(40deg) rotateY(5deg) rotate(20deg)", // Skew the container to create a parallelogram effect
        opacity: 0.6,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Skew;
