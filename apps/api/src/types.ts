import { CSSProperties } from "react";

export interface Scene {
  id: string;
  durationInSeconds: number;
  sceneElements: SceneElement[];
  script?: { text: string } | null;
}

export interface SceneElement {
  id: string;
  elementData: SceneElementData;
  fromSecond: number;
  toSecond: number;
}

export interface SceneTextData {
  type: "text";
  innerHTML: string;
  style: CSSProperties;
  enterAnimation: string | null;
  exitAnimation: string | null;
}

export interface SceneImageData {
  type: "image";
  src: string;
  style: CSSProperties;
  enterAnimation: string | null;
  exitAnimation: string | null;
}

export interface SceneVideoData {
  type: "video";
  src: string;
  style: CSSProperties;
  enterAnimation: string | null;
  exitAnimation: string | null;
}

export type SceneElementData = SceneTextData | SceneImageData | SceneVideoData;

export interface ProjectOrientation {
  id: string;
  userId: string;
  width: number;
  height: number;
  fps: number;
  durationInSeconds: number;
}
