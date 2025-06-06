"use client";

import { animationsDict } from "@/constants/animations";
import { rgbaColorToString } from "@/lib/colors";
import usePlayerStore from "@/store/player-store";
import useScenesStore from "@/store/scenes-store";
import { Scene, SceneAnimation } from "@/types/scenes";
import { Player } from "@remotion/player";
import { useCallback, useMemo } from "react";
import { AbsoluteFill, Img, OffthreadVideo, Series } from "remotion";
import { Animated } from "remotion-animated";
import ObjectOverlay from "./object-overlay";

function RemotionComponent({ scenes }: { scenes: Scene[] }) {
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const selectedObjectId = useScenesStore((state) => state.selectedObjectId);
  const selectObject = useScenesStore((state) => state.selectObject);
  const previewMode = usePlayerStore((state) => state.previewMode);

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
              ? animations.reduce((acc, animation) => {
                  acc.push(...animationsDict[animation.name](durationInFrames));
                  return acc;
                }, [] as any[])
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
                        selectedObjectId === textComponent.id
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
                      if (selectedSceneId) {
                        e.stopPropagation();
                        selectObject(component.id);
                      }
                    }}
                  >
                    {textComponent.text ||
                      (!previewMode && (
                        <p className="text-zinc-500 font-semibold whitespace-nowrap">
                          Enter text here
                        </p>
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
                        selectedObjectId === mediaComponent.id
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
                      if (selectedSceneId) {
                        e.stopPropagation();
                        selectObject(component.id);
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
  }, [scenes, previewMode, selectedObjectId, selectObject, AnimationsWrapper]);

  return (
    <AbsoluteFill
      style={{ backgroundColor: "white" }}
      onClick={() => {
        if (selectedSceneId) {
          selectObject(null);
        }
      }}
    >
      <Series>{renderedScenes}</Series>
      <ObjectOverlay />
    </AbsoluteFill>
  );
}

export default function RemotionPlayer() {
  // Get scenes and selectedSceneId from the store
  const scenes = useScenesStore((state) => state.scenes);
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
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
    <div className="flex items-center justify-center aspect-video w-full max-h-full">
      <div className="flex items-center justify-center aspect-video max-w-full h-full border-primary/75 border-1 overflow-hidden">
        {durationInFrames > 0 ? (
          <Player
            ref={setPlayerRefElement}
            component={RemotionComponent}
            // component={RemotionTestingComponent}
            durationInFrames={durationInFrames}
            inputProps={{
              scenes: selectedScene ? [selectedScene] : scenes,
            }}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            style={{ width: "100%" }}
            acknowledgeRemotionLicense
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-zinc-500">No scenes available</p>
          </div>
        )}
      </div>
    </div>
  );
}
