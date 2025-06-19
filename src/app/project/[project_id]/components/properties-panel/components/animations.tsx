import { Label } from "@/components/ui/label";
import { RadioCards, RadioCardsItem } from "@/components/ui/radio-card";
import { animationsNames } from "@/constants/animations";
import useOverlayStore from "@/store/project/overlay-store";
import {
  SCENE_IN_ANIMATIONS,
  SCENE_OUT_ANIMATIONS,
  SceneAnimation,
  SceneComponent,
  SceneInAnimation,
  SceneInAnimationKey,
  SceneOutAnimation,
  SceneOutAnimationKey,
} from "@/types/scenes";

export default function Animations() {
  const overlayObject = useOverlayStore((state) => state.overlayObject)!;
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  // Find current animations by type
  const currentInAnimation = overlayObject.animations.find(
    (anim) => anim.type === "animation-in"
  ) as SceneInAnimation | undefined;
  const currentOutAnimation = overlayObject.animations.find(
    (anim) => anim.type === "animation-out"
  ) as SceneOutAnimation | undefined;

  // Update functions for animation changes
  const updateInAnimation = (animName: SceneInAnimationKey) => {
    // Remove any existing in animation
    const newAnimations: SceneAnimation[] = overlayObject.animations.filter(
      (anim) => anim.type !== "animation-in"
    );

    // Only add if it's not "none"
    if (animName !== "none") {
      const inAnim: SceneInAnimation = {
        name: animName,
        type: "animation-in",
      };
      newAnimations.push(inAnim);
    }

    updateOverlayProperty<SceneComponent, "animations">(
      "animations",
      newAnimations
    );
  };

  const updateOutAnimation = (animName: SceneOutAnimationKey) => {
    // Remove any existing out animation
    const newAnimations: SceneAnimation[] = overlayObject.animations.filter(
      (anim) => anim.type !== "animation-out"
    );

    // Only add if it's not "none"
    if (animName !== "none") {
      const outAnim: SceneOutAnimation = {
        name: animName,
        type: "animation-out",
      };
      newAnimations.push(outAnim);
    }

    updateOverlayProperty<SceneComponent, "animations">(
      "animations",
      newAnimations
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {/* Entrance Animations */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Entrance Animation
          </Label>
          <RadioCards
            value={currentInAnimation?.name || "none"}
            onValueChange={(value) =>
              updateInAnimation(value as SceneInAnimationKey)
            }
            className="grid grid-cols-2 gap-2"
          >
            {SCENE_IN_ANIMATIONS.map((animName) => (
              <RadioCardsItem
                key={animName}
                value={animName}
                className="flex items-center justify-center p-2 text-sm"
              >
                {animationsNames[animName]}
              </RadioCardsItem>
            ))}
          </RadioCards>
        </div>

        {/* Exit Animations */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Exit Animation
          </Label>
          <RadioCards
            value={currentOutAnimation?.name || "none"}
            onValueChange={(value) =>
              updateOutAnimation(value as SceneOutAnimationKey)
            }
            className="grid grid-cols-2 gap-2"
          >
            {SCENE_OUT_ANIMATIONS.map((animName) => (
              <RadioCardsItem
                key={animName}
                value={animName}
                className="flex items-center justify-center p-2 text-sm"
              >
                {animationsNames[animName]}
              </RadioCardsItem>
            ))}
          </RadioCards>
        </div>
      </div>
    </div>
  );
}
