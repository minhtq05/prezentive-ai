"use client";

import AddSceneDialog from "@/components/add-scene-dialog";
import { Button } from "@/components/ui/button";
import { rgbaColorToString } from "@/lib/colors";
import { cn } from "@/lib/utils";
import useScenesStore from "@/store/scenes-store";
import { Scene, SceneMedia } from "@/types/scenes";
import {
  Image as ImageIcon,
  Music as MusicIcon,
  Video as VideoIcon,
} from "lucide-react";
import { useMemo } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function ScenesSidebar() {
  const scenes = useScenesStore((state) => state.scenes);
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const selectScene = useScenesStore((state) => state.selectScene);
  const addScene = useScenesStore((state) => state.addScene);
  const deleteScene = useScenesStore((state) => state.deleteScene);
  const totalDuration = useMemo(
    () => scenes.reduce((acc, scene) => acc + scene.durationInFrames, 0),
    [scenes]
  );

  const CounterWrapper = ({
    index,
    children,
  }: {
    index: number;
    children: React.ReactNode;
  }) => {
    return (
      <div className="flex flex-row gap-2">
        <div className="text-sm text-muted-foreground">{index}</div>
        {children}
      </div>
    );
  };

  return (
    <div className="w-48 h-full flex flex-col gap-2 p-4 pb-2 overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-medium">Scenes</h2>
        <AddSceneDialog onAddScene={addScene}>
          <Button variant="ghost" size="sm">
            Add Scene
          </Button>
        </AddSceneDialog>
      </div>
      <ScrollArea className="flex-auto overflow-scroll" type="always">
        <div className="relative space-y-2 h-full">
          <CounterWrapper index={0}>
            <div
              className={cn(
                "w-36 p-2 rounded-sm cursor-pointer transition-colors hover:duration-0",
                selectedSceneId === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary"
              )}
              onClick={() => selectScene(null)}
            >
              <div className="flex flex-col aspect-video justify-center items-center gap-2">
                <span className="text-sm font-medium">Preview</span>
                <span className="text-xs opacity-70">
                  {totalDuration} frames
                </span>
              </div>
            </div>
          </CounterWrapper>
          {scenes.map((scene, index) => (
            <CounterWrapper key={scene.id} index={index + 1}>
              <div
                className={cn(
                  "w-36 aspect-video rounded-sm border-2 cursor-pointer transition-colors hover:duration-0 overflow-hidden",
                  scene.id === selectedSceneId
                    ? "border-primary"
                    : "border-secondary hover:border-primary/20"
                )}
                onClick={() => selectScene(scene.id)}
              >
                <ScenePreview scene={scene} />
                {/* <div className="flex flex-row w-full">
                  <span className="text-xs text-muted-foreground font-medium">
                  {scene.title}
                  </span>
                  <span className="text-xs opacity-70 ml-auto">
                  {scene.durationInFrames} frames
                  </span>
                  </div> */}

                {/* {scene.id === selectedSceneId && (
                <div className="flex justify-end mt-2">
                <DeleteSceneDialog
                sceneTitle={scene.title}
                onDelete={() => deleteScene(scene.id)}
                >
                <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  }}
                  >
                  Delete
                  </Button>
                  </DeleteSceneDialog>
                  </div>
                  )} */}
              </div>
            </CounterWrapper>
          ))}
        </div>
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}

interface ScenePreviewProps {
  scene: Scene;
}

// Helper to render a scaled-down template preview
const ScenePreview = ({ scene }: ScenePreviewProps) => {
  return (
    <div
      className="relative mx-auto aspect-video"
      style={{ width: "240px", height: "135px" }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: "scale(0.075)", // Scale from 1920x1080 to 144x81
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
