import { Composition } from "remotion";
import { defaultScenes } from "../constants";
import { RenderableRemotionComponent } from "./renderable-component";

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
