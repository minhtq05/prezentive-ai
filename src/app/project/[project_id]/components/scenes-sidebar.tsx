"use client";

import AddSceneDialog from "@/components/add-scene-dialog";
import EditSceneDialog from "@/components/edit-scene-dialog";
import { ScenePreview } from "@/components/scene-preview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import useScenesStore from "@/store/project/scenes-store";
import { Scene } from "@/types/scenes";
import { useMemo, useState } from "react";

export default function ScenesSidebar() {
  const scenes = useScenesStore((state) => state.scenes);
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const selectScene = useScenesStore((state) => state.selectScene);
  const addScene = useScenesStore((state) => state.addScene);
  const deleteScene = useScenesStore((state) => state.deleteScene);
  const updateSceneInfo = useScenesStore((state) => state.updateSceneInfo);
  const totalDuration = useMemo(
    () => scenes.reduce((acc, scene) => acc + scene.durationInFrames, 0),
    [scenes]
  );

  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null);

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene);
  };

  const handleUpdateScene = (
    id: string,
    title: string,
    durationInFrames: number
  ) => {
    updateSceneInfo(id, title, durationInFrames);
    setEditingScene(null);
  };

  const handleConfirmDelete = () => {
    if (sceneToDelete) {
      deleteScene(sceneToDelete);
      setSceneToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteScene = (id: string) => {
    setSceneToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="w-52 h-full flex flex-col gap-2 p-4 pb-0 overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-medium">Scenes</h2>
        <AddSceneDialog onAddScene={addScene}>
          <Button variant="ghost" size="sm">
            Add Scene
          </Button>
        </AddSceneDialog>
      </div>
      <ScrollArea className="flex-1 overflow-scroll" type="always">
        <div className="relative space-y-2 h-full pb-2">
          <CounterWrapper index={0}>
            <div
              className={cn(
                "w-36 aspect-video rounded-sm cursor-pointer transition-colors hover:duration-0 flex flex-col justify-center items-center gap-1",
                selectedSceneId === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary"
              )}
              onClick={() => selectScene(null)}
            >
              <span className="text-sm font-medium">Preview</span>
              <span className="text-xs opacity-70">{totalDuration} frames</span>
            </div>
          </CounterWrapper>
          {scenes.map((scene, index) => (
            <CounterWrapper key={scene.id} index={index + 1}>
              <ContextMenu>
                <ContextMenuTrigger>
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
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleEditScene(scene);
                    }}
                  >
                    Edit Scene
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    variant="destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleDeleteScene(scene.id);
                    }}
                  >
                    Delete Scene
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </CounterWrapper>
          ))}
        </div>
        <ScrollBar />
      </ScrollArea>

      {/* Edit Scene Dialog */}
      {editingScene && (
        <EditSceneDialog
          scene={editingScene}
          open={!!editingScene}
          onOpenChange={(open) => {
            if (!open) setEditingScene(null);
          }}
          onUpdate={handleUpdateScene}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scene</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scene? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

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
