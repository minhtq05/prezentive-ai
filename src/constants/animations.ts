import {
  SceneAnimationKey,
  SceneInAnimationKey,
  SceneOutAnimationKey,
} from "@/types/scenes";
import { Animation, Fade, Scale } from "remotion-animated";

export const ANIMATION_DURATION = 10; // Duration of the animation in frames

export const animationsNames: { [key in SceneAnimationKey]: string } = {
  "zoom-in": "Zoom In",
  "zoom-out": "Zoom Out",
  "scale-in": "Scale In",
  "scale-out": "Scale Out",
  none: "None",
};

export const animationsInDict: {
  [key in SceneInAnimationKey]: (durationInFrames: number) => Animation[];
} = {
  "zoom-in": () => [Scale({ by: 1, initial: 10 })],
  "scale-in": () => [Scale({ by: 1, initial: 0.1, mass: 75 })],
  none: () => [],
};

export const animationsOutDict: {
  [key in SceneOutAnimationKey]: (durationInFrames: number) => Animation[];
} = {
  "zoom-out": (durationInFrames: number) => [
    Scale({ by: 10, initial: 1, start: durationInFrames - ANIMATION_DURATION }),
  ],
  "scale-out": (durationInFrames: number) => [
    Fade({ to: 0, start: durationInFrames - ANIMATION_DURATION }),
    Scale({ by: 0, start: durationInFrames - ANIMATION_DURATION, mass: 45 }),
  ],
  none: () => [],
};

export const animationsDict: {
  [key in SceneAnimationKey]: (durationInFrames: number) => Animation[];
} = {
  ...animationsInDict,
  ...animationsOutDict,
};
