"use client";

import useScenesStore from "@/store/scenes-store";
import { SceneMedia, SceneText } from "@/types/scenes";
import {
  Image as ImageIcon,
  Type as TextIcon,
  Film as VideoIcon,
} from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AddMediaDialog } from "./add-media-dialog";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function ElementHeader() {
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const scenes = useScenesStore((state) => state.scenes);
  const selectObject = useScenesStore((state) => state.selectObject);

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

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

  // Handler for opening image dialog
  const handleAddImage = () => {
    if (!selectedSceneId || !selectedScene) return;
    setIsImageDialogOpen(true);
  };

  // Handler for opening video dialog
  const handleAddVideo = () => {
    if (!selectedSceneId || !selectedScene) return;
    setIsVideoDialogOpen(true);
  };

  // Handler for handling media upload from dialog
  const handleMediaUpload = (mediaType: "image" | "video", src: string) => {
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
    <div className="flex flex-row items-center gap-2 p-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddText}
              disabled={!selectedSceneId}
              className="h-12 w-12 flex items-center justify-center"
            >
              <TextIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
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
              className="h-12 w-12 flex items-center justify-center"
            >
              <ImageIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
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
              className="h-12 w-12 flex items-center justify-center"
            >
              <VideoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Add Video</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Image Upload Dialog */}
      <AddMediaDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        mediaType="image"
        onUpload={(src) => handleMediaUpload("image", src)}
      />

      {/* Video Upload Dialog */}
      <AddMediaDialog
        open={isVideoDialogOpen}
        onOpenChange={setIsVideoDialogOpen}
        mediaType="video"
        onUpload={(src) => handleMediaUpload("video", src)}
      />
    </div>
  );
}
