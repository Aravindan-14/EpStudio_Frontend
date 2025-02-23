"use client";
import React, { useEffect, useState } from "react";
import paper1 from "../Assets/commenAssets/paper1.png"
function DraggablePaper({ children, initialPosition = { x: 0, y: 0 } }) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
      className="absolute cursor-move  rounded-lg p-4 select-none"
    >
      <img style={{ filter: "drop-shadow(.2rem .2rem 5px black)" }} className="h-80 w-96 absolute -z-10 top-0" src={paper1} alt="" />
      {children}
    </div>
  );
}

function DraggablePaperStory() {
  return (
    <div className="relative w-full h-[500px] ">
      <DraggablePaper initialPosition={{ x: 50, y: 50 }}>
        <div className="w-[200px]">
          <h2 className="text-lg font-bold mb-2">Draggable Paper</h2>
          <p className="text-gray-600">Drag me around!</p>
        </div>
      </DraggablePaper>

      <DraggablePaper initialPosition={{ x: 300, y: 100 }}>
        <div className="w-[200px]">
          <h3 className="text-lg font-bold mb-2">Another Paper</h3>
          <p className="text-gray-600">You can drag me too!</p>
        </div>
      </DraggablePaper>
    </div>
  );
}

export default DraggablePaper;