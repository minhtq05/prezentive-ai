import { RenderableRemotionComponent } from "./renderable-component";
import { defaultScenes } from "../constants";
import { Composition } from "remotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={"main-video"}
        component={RenderableRemotionComponent}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          previewMode: false,
          scenes: defaultScenes,
          handleSelectObject: () => {},
        }}
      />
    </>
  );
};
