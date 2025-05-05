import useScenesStore from "@/store/scenes-store";
import { Scene, SceneAnimation } from "@/types/scenes";
import { Player, PlayerRef } from "@remotion/player";
import { useCallback, useMemo, useRef } from "react";
import { AbsoluteFill, Series, Img, OffthreadVideo } from "remotion";
import { Animated, Animation, Scale } from "remotion-animated";
import ObjectOverlay from "./object-overlay";
import { rgbaColorToString } from "@/lib/colors";
import { Separator } from "./ui/separator";
import { SeekBar } from "./seek-bar";
import usePlayerStore from "@/store/player-store";

const ANIMATION_DURATION = 10; // Duration of the animation in frames

const animationsDict: {
  [key in SceneAnimation]: (durationInFrames: number) => Animation;
} = {
  "zoom-in": (durationInFrames: number) => Scale({ by: 1, initial: 10 }),
  "zoom-out": (durationInFrames: number) =>
    Scale({ by: 10, initial: 1, start: durationInFrames - ANIMATION_DURATION }),
  "scale-in": (durationInFrames: number) =>
    Scale({ by: 1, initial: 0, mass: 75 }),
  "scale-out": (durationInFrames: number) =>
    Scale({ by: 0, start: durationInFrames - ANIMATION_DURATION, mass: 75 }),
};

function RemotionComponent({
  previewMode,
  scenes,
  handleSelectObject,
}: {
  previewMode: boolean;
  scenes: Scene[];
  handleSelectObject: (id: string | null) => void;
}) {
  const visibleOverlayId = useScenesStore((state) => state.selectedObjectId);

  const AnimationsWrapper = useCallback(
    ({
      children,
      animations,
      durationInFrames,
    }: {
      children: React.ReactNode;
      animations: SceneAnimation[];
      durationInFrames: number;
    }) => {
      return (
        <Animated
          animations={
            previewMode
              ? animations.map((animation) =>
                  animationsDict[animation](durationInFrames)
                )
              : []
          }
        >
          {children}
        </Animated>
      );
    },
    [previewMode]
  );

  // Use useMemo for scene components to prevent unnecessary re-renders
  const renderedScenes = useMemo(() => {
    return scenes.map((scene, index) => (
      <Series.Sequence key={index} durationInFrames={scene.durationInFrames}>
        <AbsoluteFill>
          {scene.components.map((component) => {
            // Handle SceneText components
            if (component.type === "scene-text") {
              const textComponent = component;
              return (
                <AnimationsWrapper
                  key={textComponent.id}
                  animations={component.animations}
                  durationInFrames={scene.durationInFrames}
                >
                  <div
                    style={{
                      visibility:
                        visibleOverlayId === textComponent.id
                          ? "hidden"
                          : "visible",
                      position: "absolute",
                      top: `${textComponent.top}px`,
                      left: `${textComponent.left}px`,
                      width: `${textComponent.width}px`,
                      height: `${textComponent.height}px`,
                      fontSize: `${textComponent.fontSize}px`,
                      fontFamily: textComponent.fontFamily,
                      color: rgbaColorToString(textComponent.color),
                      backgroundColor: rgbaColorToString(
                        textComponent.backgroundColor
                      ),
                      textAlign: textComponent.textAlign,
                      fontWeight: textComponent.fontWeight,
                      fontStyle: textComponent.fontStyle,
                      textDecoration: textComponent.textDecoration,
                      textTransform: textComponent.textTransform,
                      display: "flex",
                      alignItems:
                        textComponent.textAlignVertical === "top"
                          ? "flex-start"
                          : textComponent.textAlignVertical === "bottom"
                          ? "flex-end"
                          : "center",
                      justifyContent:
                        textComponent.textAlign === "left"
                          ? "flex-start"
                          : textComponent.textAlign === "right"
                          ? "flex-end"
                          : "center",
                      userSelect: "none",
                    }}
                    onClick={(e) => {
                      if (!previewMode) {
                        e.stopPropagation();
                        handleSelectObject(component.id);
                      }
                    }}
                  >
                    {textComponent.text ||
                      (!previewMode && (
                        <p className="text-zinc-500">Enter text here...</p>
                      ))}
                  </div>
                </AnimationsWrapper>
              );
            }
            // Handle SceneMedia components
            else if (component.type === "scene-media") {
              const mediaComponent = component;
              return (
                <AnimationsWrapper
                  key={mediaComponent.id}
                  animations={component.animations}
                  durationInFrames={scene.durationInFrames}
                >
                  <div
                    style={{
                      visibility:
                        visibleOverlayId === mediaComponent.id
                          ? "hidden"
                          : "visible",
                      position: "absolute",
                      top: `${mediaComponent.top}px`,
                      left: `${mediaComponent.left}px`,
                      width: `${mediaComponent.width}px`,
                      height: `${mediaComponent.height}px`,
                      overflow: "hidden",
                      userSelect: "none",
                      borderRadius: "4px",
                    }}
                    onClick={(e) => {
                      if (!previewMode) {
                        e.stopPropagation();
                        handleSelectObject(component.id);
                      }
                    }}
                  >
                    {mediaComponent.mediaType === "image" && (
                      <Img
                        src={mediaComponent.src}
                        alt={mediaComponent.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: mediaComponent.fit,
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    {mediaComponent.mediaType === "video" && (
                      <OffthreadVideo
                        src={mediaComponent.src}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: mediaComponent.fit,
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                        muted
                      />
                    )}
                    {mediaComponent.mediaType === "audio" && (
                      <div className="flex items-center justify-center w-full h-full bg-black/10">
                        <div className="text-center">
                          <p>Audio</p>
                          <p className="text-xs text-muted-foreground">
                            {mediaComponent.alt || "Audio file"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </AnimationsWrapper>
              );
            }
            return null;
          })}
        </AbsoluteFill>
      </Series.Sequence>
    ));
  }, [
    scenes,
    previewMode,
    visibleOverlayId,
    handleSelectObject,
    AnimationsWrapper,
  ]);

  return (
    <AbsoluteFill onClick={() => handleSelectObject(null)}>
      <Series>{renderedScenes}</Series>
      <ObjectOverlay />
    </AbsoluteFill>
  );
}

function RemotionTestingComponent() {
  return (
    <AbsoluteFill>
      <OffthreadVideo src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
    </AbsoluteFill>
  );
}

export default function RemotionPlayer() {
  // Get scenes and selectedSceneId from the store
  const scenes = useScenesStore((state) => state.scenes);
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const selectObject = useScenesStore((state) => state.selectObject);
  const setPlayerRefElement = usePlayerStore(
    (state) => state.setPlayerRefElement
  );

  // Find the selected scene based on the ID instead of the 'selected' property
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId),
    [scenes, selectedSceneId]
  );

  // Calculate the total duration
  const totalDuration = useMemo(
    () => scenes.reduce((acc, scene) => acc + scene.durationInFrames, 0),
    [scenes]
  );

  // Calculate durationInFrames for Player
  const durationInFrames = useMemo(
    () => (selectedScene ? selectedScene.durationInFrames : totalDuration),
    [selectedScene, totalDuration]
  );

  return (
    <>
      <Player
        ref={setPlayerRefElement}
        component={RemotionComponent}
        // component={RemotionTestingComponent}
        durationInFrames={durationInFrames}
        inputProps={{
          previewMode: selectedScene ? false : true,
          scenes: selectedScene ? [selectedScene] : scenes,
          handleSelectObject: selectObject,
        }}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{ width: "100%" }}
        acknowledgeRemotionLicense
      />
    </>
  );
}
