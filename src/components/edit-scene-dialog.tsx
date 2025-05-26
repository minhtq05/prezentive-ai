"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scene } from "@/types/scenes";
import { useState } from "react";

interface EditSceneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scene: Scene;
  onUpdate: (id: string, name: string, durationInFrames: number) => void;
}

export default function EditSceneDialog({
  open,
  onOpenChange,
  scene,
  onUpdate,
}: EditSceneDialogProps) {
  const [title, setTitle] = useState<string>(scene.title || "");
  const [duration, setDuration] = useState<number>(scene.durationInFrames);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDuration = Math.max(0, duration);
    if (isNaN(newDuration) || newDuration <= 0) return;

    onUpdate(scene.id, title, newDuration);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Scene</DialogTitle>
          <DialogDescription>
            Update the title or duration of this scene.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (frames)
              </Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="col-span-3"
                type="number"
                min="1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
