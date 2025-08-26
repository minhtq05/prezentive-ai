import { Animation, Fade, Scale } from "remotion-animated";

export interface AnimationProps {
  fromSecond: number;
  animationDurationInSeconds: number;
  fps: number;
}

export const defaultEnterAnimations: {
  [key: string]: (props: AnimationProps) => Animation[];
} = {
  ZoomIn: (props) => [
    Scale({
      by: 1,
      initial: 10,
      start: props.fromSecond * props.fps,
      duration: props.animationDurationInSeconds * props.fps,
    }),
  ],
  ScaleIn: (props) => [
    Scale({
      by: 1,
      initial: 0.1,
      mass: 75,
      start: props.fromSecond * props.fps,
      duration: props.animationDurationInSeconds * props.fps,
    }),
  ],
};

export const defaultExitAnimations: {
  [key: string]: (props: AnimationProps) => Animation[];
} = {
  ZoomOut: (props) => [
    Fade({
      to: 0,
      start: props.fromSecond * props.fps,
      duration: props.animationDurationInSeconds * props.fps,
    }),
    Scale({
      by: 10,
      initial: 1,
      start: props.fromSecond * props.fps,
      duration: props.animationDurationInSeconds * props.fps,
    }),
  ],
  ScaleOut: (props) => [
    Fade({
      to: 0,
      start: props.fromSecond * props.fps,
      duration: props.animationDurationInSeconds * props.fps,
    }),
    Scale({
      by: 0,
      mass: 45,
      start: props.fromSecond * props.fps,
      duration: props.animationDurationInSeconds * props.fps,
    }),
  ],
};

export const defaultAnimations: {
  [key: string]: (props: AnimationProps) => Animation[];
} = {
  ...defaultEnterAnimations,
  ...defaultExitAnimations,
};
