import { RgbaColor } from "react-colorful";

// Sample data structure for scenes
export type Scene = {
  id: string;
  durationInFrames: number;
  title: string;
  components: SceneComponent[];
};

export const SCENE_IN_ANIMATIONS: SceneInAnimationKey[] = [
  "zoom-in",
  "scale-in",
  "none",
];

export type SceneInAnimationKey = "zoom-in" | "scale-in" | "none";
export type SceneInAnimation = {
  name: SceneInAnimationKey;
  type: "animation-in";
};

export const SCENE_OUT_ANIMATIONS: SceneOutAnimationKey[] = [
  "zoom-out",
  "scale-out",
  "none",
];

export type SceneOutAnimationKey = "zoom-out" | "scale-out" | "none";
export type SceneOutAnimation = {
  name: SceneOutAnimationKey;
  type: "animation-out";
};

export type SceneAnimationKey = SceneInAnimationKey | SceneOutAnimationKey;
export type SceneAnimation = SceneInAnimation | SceneOutAnimation;

export type SceneBaseObject = {
  id: string;
  from: number;
  to: number;
  top: number;
  left: number;
  width: number;
  height: number;
  animations: SceneAnimation[];
};

export type SceneText = SceneBaseObject & {
  type: "scene-text";
  text: string;
  fontSize: number;
  fontFamily: string;
  color: RgbaColor;
  backgroundColor: RgbaColor;
  textAlign: "left" | "center" | "right";
  textAlignVertical: "top" | "center" | "bottom";
  fontWeight: "normal" | "bold" | "bolder" | "lighter";
  fontStyle: "normal" | "italic" | "oblique";
  textDecoration: "none" | "underline" | "line-through";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
};

export type SceneMedia = SceneBaseObject & {
  type: "scene-media";
  mediaType: "image" | "video" | "audio";
  src: string;
  alt: string;
  fit: "cover" | "contain" | "fill";
};

export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type SceneComponent = SceneText | SceneMedia;
