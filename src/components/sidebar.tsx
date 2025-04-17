"use client";

import useScenesStore from "@/store/scenes-store";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import DeleteSceneDialog from "./delete-scene-dialog";
import AddSceneDialog from "@/components/add-scene-dialog";
import { useMemo } from "react";

export default function Sidebar() {
  const scenes = useScenesStore((state) => state.scenes);
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const selectScene = useScenesStore((state) => state.selectScene);
  const addScene = useScenesStore((state) => state.addScene);
  const deleteScene = useScenesStore((state) => state.deleteScene);
  const totalDuration = useMemo(
    () => scenes.reduce((acc, scene) => acc + 150, 0),
    [scenes]
  );

  return (
    <div className="h-full w-full flex flex-col p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Scenes</h2>
        <AddSceneDialog onAddScene={addScene}>
          <Button variant="outline" size="sm">
            Add Scene
          </Button>
        </AddSceneDialog>
      </div>

      <Separator className="mb-4" />

      <div className="flex-1 overflow-y-auto space-y-2">
        <div
          className={cn(
            "p-3 rounded-md cursor-pointer transition-colors",
            selectedSceneId === null
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          )}
          onClick={() => selectScene(null)}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">Preview</span>
            <span className="text-xs opacity-70">{totalDuration} frames</span>
          </div>
        </div>
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className={cn(
              "p-3 rounded-md cursor-pointer transition-colors",
              scene.id === selectedSceneId
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            )}
            onClick={() => selectScene(scene.id)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{scene.title}</span>
              <span className="text-xs opacity-70">
                {scene.durationInFrames} frames
              </span>
            </div>
            {/* <p className="text-sm truncate mt-1 opacity-80">{scene.content}</p> */}

            {scene.id === selectedSceneId && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
