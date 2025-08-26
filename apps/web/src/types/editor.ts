import { CSSProperties } from "react";

export interface Scene {
  id: string;
  // title: string;
  // createdAt: Date;
  // updatedAt: Date;
  // userId: string;
  // projectId: string;
  // notes: string;
  // backgroundType: string;
  // backgroundColor: string;
  // backgroundGradientStart: string;
  // backgroundGradientEnd: string;
  // backgroundGradientAngle: number;
  // backgroundImageUrl: string;
  // backgroundImageFit: string;
  // transitionType: string;
  // transitionDuration: number;
  // isHidden: boolean;
  // isLocked: boolean;
  durationInSeconds: number;
  sceneElements: SceneElement[];
  script?: { text: string } | null;
}

// export interface TextFormatting {
//   elementType: string;
//   elementId: string;
//   userId: string;
//   fontFamily: string;
//   fontSize: number;
//   fontWeight: string;
//   fontStyle: string;
//   textColor: string;
//   backgroundColor: string;
//   isUnderlined: boolean;
//   isStrikethrough: boolean;
//   textTransform: string;
//   textAlign: string;
//   textAlignVertical: string;
//   lineHeight: number;
//   letterSpacing: number;
//   isHyperlink: boolean;
//   hyperlinkUrl: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export type SceneElement = {
//   id: string;
//   userId: string;
//   sceneId: string;
//   elementNumber: number;
//   xPosition: string;
//   yPosition: string;
//   width: string;
//   height: string;
//   rotation: string;
//   opacity: string;
//   borderWidth: number;
//   borderColor: string;
//   borderStyle: string;
//   shadowEnabled: boolean;
//   shadowBlur: number;
//   shadowOffsetX: number;
//   shadowOffsetY: number;
//   shadowColor: string;
//   elementData: unknown;
//   fromSecond: number;
//   toSecond: number;
//   isLocked: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// } & (TextFormatting | null);
export interface SceneElement {
  id: string;
  elementData: SceneElementData;
  fromSecond: number;
  toSecond: number;
}

export interface SceneElementData {
  innerHTML: string;
  type: string;
  style: CSSProperties;
  enterAnimation: string | null;
  exitAnimation: string | null;
}

export interface SceneScript {
  id: string;
  sceneNumber: number;
  script: {
    text: string;
  } | null;
}

export interface RenderedVideo {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  filename: string;
  createdAt: Date;
  fileSizeBytes: number;
  metadata: {
    durationInSeconds: number;
  };
}
