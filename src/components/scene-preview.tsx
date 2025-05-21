import { rgbaColorToString } from "@/lib/colors";
import { Scene, SceneMedia } from "@/types/scenes";
import {
  Image as ImageIcon,
  Music as MusicIcon,
  Video as VideoIcon,
} from "lucide-react";

export interface ScenePreviewProps {
  scene: Scene;
}

// Helper to render a scaled-down template preview
export const ScenePreview = ({ scene }: ScenePreviewProps) => {
  return (
    <div
      className="relative mx-auto aspect-video"
      style={{ width: "240px", height: "135px" }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: "scale(0.125)", // Scale from 1920x1080 to 240x135
          transformOrigin: "top left",
          width: "1920px",
          height: "1080px",
        }}
      >
        {renderScenePreview(scene)}
      </div>
    </div>
  );
};

// Generic scene renderer that maps actual components from a scene template
const renderScenePreview = (scene: Scene) => {
  return (
    <div
      style={{
        width: "1920px",
        height: "1080px",
        background: "white",
        position: "relative",
      }}
    >
      {scene.components.map((component) => {
        // Currently only handling SceneText components
        if (component.type === "scene-text") {
          const textComponent = component;
          return (
            <div
              key={textComponent.id}
              style={{
                position: "absolute",
                top: `${textComponent.top}px`,
                left: `${textComponent.left}px`,
                width: `${textComponent.width}px`,
                height: `${textComponent.height}px`,
                fontSize: `${textComponent.fontSize}px`,
                fontFamily: textComponent.fontFamily,
                color: rgbaColorToString(textComponent.color),
                backgroundColor: rgbaColorToString(
                  textComponent.backgroundColor
                ),
                textAlign: textComponent.textAlign,
                fontWeight: textComponent.fontWeight,
                fontStyle: textComponent.fontStyle,
                textDecoration: textComponent.textDecoration,
                textTransform: textComponent.textTransform,
                overflow: "hidden",
                display: "flex",
                alignItems:
                  textComponent.textAlignVertical === "top"
                    ? "flex-start"
                    : textComponent.textAlignVertical === "bottom"
                    ? "flex-end"
                    : "center",
                justifyContent:
                  textComponent.textAlign === "left"
                    ? "flex-start"
                    : textComponent.textAlign === "right"
                    ? "flex-end"
                    : "center",
              }}
            >
              {textComponent.text}
            </div>
          );
        } else if (component.type === "scene-media") {
          const mediaComponent = component as SceneMedia;
          return (
            <div
              key={mediaComponent.id}
              style={{
                position: "absolute",
                top: `${mediaComponent.top}px`,
                left: `${mediaComponent.left}px`,
                width: `${mediaComponent.width}px`,
                height: `${mediaComponent.height}px`,
                backgroundColor: "rgba(240, 240, 240, 0.5)",
                border: "1px dashed #aaa",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mediaComponent.mediaType === "image" && (
                <ImageIcon size={48} color="#666" />
              )}
              {mediaComponent.mediaType === "video" && (
                <VideoIcon size={48} color="#666" />
              )}
              {mediaComponent.mediaType === "audio" && (
                <MusicIcon size={48} color="#666" />
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
