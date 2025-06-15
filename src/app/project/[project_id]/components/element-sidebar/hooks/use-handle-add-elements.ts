import useScenesStore from "@/store/project/scenes-store";
import { SceneMedia, SceneText } from "@/types/scenes";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export type MediaType = "image" | "video";

export function useHandleAddElements() {
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const scenes = useScenesStore((state) => state.scenes);
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId),
    [scenes, selectedSceneId]
  );
  const addComponentToScene = useScenesStore(
    (state) => state.addComponentToScene
  );

  const handleAddText = () => {
    if (!selectedSceneId || !selectedScene) return;

    // Create a new text component
    const newText: SceneText = {
      id: uuidv4(),
      type: "scene-text",
      text: "Add A Text",
      fontSize: 30,
      from: 0,
      to: selectedScene.durationInFrames,
      top: 400, // Center vertically
      left: 720, // Center horizontally (1920/2 - width/2)
      width: 480,
      height: 100,
      fontFamily: "serif",
      color: { r: 0, g: 0, b: 0, a: 1 }, // black
      backgroundColor: { r: 255, g: 255, b: 255, a: 0 }, // transparent
      textAlign: "center",
      textAlignVertical: "center",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textTransform: "none",
      animations: [],
    };

    // Add the new component to the scene
    addComponentToScene(newText);
  };

  const handleMediaUpload = (mediaType: MediaType, src: string) => {
    if (!selectedSceneId || !selectedScene) return;

    // Create a new media component
    const newMedia: SceneMedia = {
      id: uuidv4(),
      type: "scene-media",
      mediaType: mediaType,
      src: src,
      alt: mediaType === "image" ? "Uploaded Image" : "Uploaded Video",
      fit: "contain",
      from: 0,
      to: selectedScene.durationInFrames,
      top: 340, // Center vertically
      left: 560, // Center horizontally
      width: mediaType === "image" ? 800 : 800,
      height: mediaType === "image" ? 400 : 450,
      animations: [],
    };

    // Add the new component to the scene
    addComponentToScene(newMedia);
  };

  return { handleAddText, handleMediaUpload };
}
