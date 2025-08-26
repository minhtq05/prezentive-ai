import { AbsoluteFill, Series } from "remotion";
import { Animated, Animation } from "remotion-animated";
import { ProjectOrientation, Scene } from "../types";
import { defaultAnimations } from "./animations";

const RemotionComponent = ({
  scenes,
  orientation,
}: {
  scenes: Scene[];
  orientation: ProjectOrientation;
}) => {
  const { fps } = orientation;

  return (
    <AbsoluteFill style={{ backgroundColor: "white", position: "relative" }}>
      <Series>
        {scenes.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInSeconds * fps}
          >
            {scene.sceneElements.map((element) => {
              if (element.elementData === undefined) {
                return null;
              }
              const { id, fromSecond, toSecond } = element;
              const { style, innerHTML, enterAnimation, exitAnimation } =
                element.elementData;
              const animations: Animation[] = [];
              if (enterAnimation) {
                animations.push(
                  ...defaultAnimations[enterAnimation]({
                    fromSecond,
                    animationDurationInSeconds: 2,
                    fps,
                  })
                );
              }
              if (exitAnimation) {
                animations.push(
                  ...defaultAnimations[exitAnimation]({
                    fromSecond: toSecond - 2,
                    animationDurationInSeconds: 2,
                    fps,
                  })
                );
              }

              return (
                <div
                  key={id}
                  id={id}
                  style={style}
                  className="select-none text-wrap wrap-anywhere"
                >
                  <AnimationsWrapper animations={animations}>
                    <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
                  </AnimationsWrapper>
                </div>
              );
            })}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

const AnimationsWrapper = ({
  children,
  animations,
}: {
  children?: React.ReactNode;
  animations: Animation[];
}) => {
  return <Animated animations={animations}>{children}</Animated>;
};

export default RemotionComponent;
