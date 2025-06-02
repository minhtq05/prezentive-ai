"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioCards, RadioCardsItem } from "@/components/ui/radio-card";
import { animationsNames } from "@/constants/animations";
import {
  SCENE_IN_ANIMATIONS,
  SCENE_OUT_ANIMATIONS,
  SceneAnimation,
  SceneAnimationKey,
  SceneInAnimation,
  SceneInAnimationKey,
  SceneOutAnimation,
  SceneOutAnimationKey,
} from "@/types/scenes";
import { useState } from "react";

interface AnimationDialogProps {
  children: React.ReactNode;
  currentAnimations?: SceneAnimation[];
  onUpdateAnimations: (animations: SceneAnimation[]) => void;
}

export default function AnimationDialog({
  children,
  currentAnimations = [],
  onUpdateAnimations,
}: AnimationDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedInAnimation, setSelectedInAnimation] =
    useState<SceneInAnimation>(
      currentAnimations.find(
        (anim): anim is SceneInAnimation => anim.type === "animation-in"
      ) || { name: "none", type: "animation-in" }
    );
  const [selectedOutAnimation, setSelectedOutAnimation] =
    useState<SceneOutAnimation>(
      currentAnimations.find(
        (anim): anim is SceneOutAnimation => anim.type === "animation-out"
      ) || { name: "none", type: "animation-out" }
    );

  const handleUpdateAnimations = () => {
    const animations: SceneAnimation[] = [];
    if (selectedInAnimation.name !== "none")
      animations.push(selectedInAnimation);
    if (selectedOutAnimation.name !== "none")
      animations.push(selectedOutAnimation);

    onUpdateAnimations(animations);
    setOpen(false);
  };

  const handleCancel = () => {
    // Reset to current animations when canceling
    setSelectedInAnimation(
      currentAnimations.find(
        (anim): anim is SceneInAnimation => anim.type === "animation-in"
      ) || { name: "none", type: "animation-in" }
    );
    setSelectedOutAnimation(
      currentAnimations.find(
        (anim): anim is SceneOutAnimation => anim.type === "animation-out"
      ) || { name: "none", type: "animation-out" }
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Animations</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h4 className="mb-2 text-sm font-medium">Entrance Animation</h4>
            <RadioCards
              value={selectedInAnimation.name}
              onValueChange={(val) =>
                setSelectedInAnimation({
                  name: val,
                  type: "animation-in",
                } as SceneInAnimation)
              }
              className="grid grid-cols-2 gap-2"
            >
              {SCENE_IN_ANIMATIONS.map(
                (animationInKey: SceneInAnimationKey) => (
                  <RadioCardsItem value={animationInKey} id={animationInKey}>
                    <Label
                      htmlFor={animationInKey}
                      className="flex items-center"
                    >
                      <span className="mr-2">
                        {getAnimationIcon(animationInKey)}
                      </span>
                      {animationsNames[animationInKey]}
                    </Label>
                  </RadioCardsItem>
                )
              )}
            </RadioCards>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Exit Animation</h4>
            <RadioCards
              value={selectedOutAnimation.name}
              onValueChange={(val) =>
                setSelectedOutAnimation({
                  name: val,
                  type: "animation-out",
                } as SceneOutAnimation)
              }
              className="grid grid-cols-2 gap-2"
            >
              {SCENE_OUT_ANIMATIONS.map(
                (animationOutKey: SceneOutAnimationKey) => (
                  <RadioCardsItem value={animationOutKey} id={animationOutKey}>
                    <Label
                      htmlFor={animationOutKey}
                      className="flex items-center"
                    >
                      <span className="mr-2">
                        {getAnimationIcon(animationOutKey)}
                      </span>
                      {animationsNames[animationOutKey]}
                    </Label>
                  </RadioCardsItem>
                )
              )}
            </RadioCards>
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleUpdateAnimations}>Update Animations</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get appropriate icons for animations
function getAnimationIcon(animation: SceneAnimationKey): string {
  switch (animation) {
    case "zoom-in":
      return "🔍+";
    case "zoom-out":
      return "🔍-";
    case "scale-in":
      return "↗️";
    case "scale-out":
      return "↘️";
    case "none":
      return "❌";
    default:
      return "✨";
  }
}
