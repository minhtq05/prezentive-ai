"use client";

import { Button } from "./ui/button";
import {
  Type as TextIcon,
  Image as ImageIcon,
  Film as VideoIcon,
  Plus,
} from "lucide-react";
import useScenesStore from "@/store/scenes-store";
import { SceneText, SceneMedia } from "@/types/scenes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { v4 as uuidv4 } from "uuid";

export default function ElementSidebar() {
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const scenes = useScenesStore((state) => state.scenes);
  const selectObject = useScenesStore((state) => state.selectObject);

  // Find the selected scene
  const selectedScene = scenes.find((scene) => scene.id === selectedSceneId);

  // Handler for adding new text
  const handleAddText = () => {
    if (!selectedSceneId || !selectedScene) return;

    // Create a new text component
    const newText: SceneText = {
      id: uuidv4(),
      type: "scene-text",
      text: "New Text",
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

  // Handler for adding new image
  const handleAddImage = () => {
    if (!selectedSceneId || !selectedScene) return;

    // Create a new image component
    const newImage: SceneMedia = {
      id: uuidv4(),
      type: "scene-media",
      mediaType: "image",
      src: "https://9meters.com/wp-content/uploads/claude-logo.webp", // Placeholder image
      alt: "New Image",
      fit: "contain",
      from: 0,
      to: selectedScene.durationInFrames,
      top: 340, // Center vertically
      left: 560, // Center horizontally
      width: 800,
      height: 400,
      animations: [],
    };

    // Add the new component to the scene
    addComponentToScene(newImage);
  };

  // Handler for adding new video
  const handleAddVideo = () => {
    if (!selectedSceneId || !selectedScene) return;

    // Create a new video component
    const newVideo: SceneMedia = {
      id: uuidv4(),
      type: "scene-media",
      mediaType: "video",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video
      alt: "New Video",
      fit: "contain",
      from: 0,
      to: selectedScene.durationInFrames,
      top: 340, // Center vertically
      left: 560, // Center horizontally
      width: 800,
      height: 450,
      animations: [],
    };

    // Add the new component to the scene
    addComponentToScene(newVideo);
  };

  // Helper function to add a component to the selected scene
  const addComponentToScene = (component: SceneText | SceneMedia) => {
    useScenesStore.setState((state) => {
      const updatedScenes = state.scenes.map((scene) => {
        if (scene.id === selectedSceneId) {
          return {
            ...scene,
            components: [...scene.components, component],
          };
        }
        return scene;
      });

      return { scenes: updatedScenes };
    });

    // Select the newly added object
    selectObject(component.id);
  };

  return (
    <div className="h-full w-full flex flex-col items-center gap-4 py-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddText}
              disabled={!selectedSceneId}
              className="rounded-sm h-12 w-12 flex items-center justify-center"
            >
              <TextIcon className="!h-5 !w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Text</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddImage}
              disabled={!selectedSceneId}
              className="rounded-sm h-12 w-12 flex items-center justify-center"
            >
              <ImageIcon className="!h-5 !w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddVideo}
              disabled={!selectedSceneId}
              className="rounded-sm h-12 w-12 flex items-center justify-center"
            >
              <VideoIcon className="!h-5 !w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Video</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
