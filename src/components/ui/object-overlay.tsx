"use client";

import useOverlayStore from "@/store/overlay-store";
import { SceneText } from "@/types/scenes";
import React from "react";

export default function ObjectOverlay() {
  const { visibleOverlayId, overlayObject } = useOverlayStore();

  if (!visibleOverlayId || !overlayObject) {
    return null;
  }

  // Handle different types of objects
  switch (overlayObject.type) {
    case "scene-text":
      return <TextOverlay textObject={overlayObject as SceneText} />;
    default:
      return null;
  }
}

function TextOverlay({ textObject }: { textObject: SceneText }) {
  const textStyle: React.CSSProperties = {
    position: "absolute",
    top: `${textObject.top}px`,
    left: `${textObject.left}px`,
    fontSize: `${textObject.fontSize}px`,
    fontFamily: textObject.fontFamily,
    color: textObject.color,
    backgroundColor: textObject.backgroundColor,
    textAlign: textObject.textAlign,
    fontWeight: textObject.fontWeight,
    fontStyle: textObject.fontStyle,
    textDecoration: textObject.textDecoration,
    textTransform: textObject.textTransform,
    width: `${textObject.width}px`,
    height: `${textObject.height}px`,
    display: "flex",
    justifyContent:
      textObject.textAlign === "left"
        ? "flex-start"
        : textObject.textAlign === "right"
        ? "flex-end"
        : "center",
    alignItems:
      textObject.textAlignVertical === "top"
        ? "flex-start"
        : textObject.textAlignVertical === "bottom"
        ? "flex-end"
        : "center",
    padding: "8px",
    boxShadow: "0 0 0 2px rgba(30, 144, 255, 0.5)",
    borderRadius: "4px",
    zIndex: 1000,
    userSelect: "none", // Prevent text selection
    // transition: "all 0.1s ease", // Smooth transition for changes
  };

  return (
    <div style={textStyle} onClick={(e) => e.stopPropagation()}>
      {textObject.text || <p className="text-zinc-500">Enter text here...</p>}
    </div>
  );
}
