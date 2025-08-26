import { Composition, getInputProps } from "remotion";
import { ProjectOrientation, Scene } from "../types";
import RemotionComponent from "./components";

const inputProps: {
  scenes: Scene[];
  orientation: ProjectOrientation;
} = getInputProps();

export const RemotionRoot: React.FC = () => {
  const {
    scenes,
    orientation: { width, height, fps },
  } = inputProps;

  return (
    <Composition
      id="main-video"
      component={RemotionComponent}
      durationInFrames={scenes.reduce(
        (total, scene) => total + scene.durationInSeconds * fps,
        0
      )}
      fps={fps}
      width={width}
      height={height}
      defaultProps={{
        scenes: [],
        orientation: {
          width: 1920,
          height: 1080,
          fps: 30,
        } as ProjectOrientation,
      }}
    />
  );
};
