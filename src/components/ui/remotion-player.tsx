import useScenesStore from "@/store/scenes-store";
import { Scene } from "@/types/scenes";
import { Player } from "@remotion/player";
import { useMemo } from "react";
import { AbsoluteFill, Series } from "remotion";
import ObjectOverlay from "./object-overlay";
import { rgbaColorToString } from "@/lib/colors";

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

  return (
    <AbsoluteFill onClick={() => handleSelectObject(null)}>
      <Series>
        {scenes.map((scene, index) => (
          <Series.Sequence
            key={index}
            durationInFrames={scene.durationInFrames}
          >
            <AbsoluteFill>
              {scene.components.map((component) => {
                // Currently only handling SceneText components
                if (component.type === "scene-text") {
                  const textComponent = component;
                  return (
                    <div
                      key={textComponent.id}
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
                        // overflow: "hidden",
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
                      // contentEditable={!previewMode}
                      onClick={(e) => {
                        if (!previewMode) {
                          e.stopPropagation();
                          handleSelectObject(component.id);
                        }
                      }}
                    >
                      {textComponent.text || (
                        <p className="text-zinc-500">Enter text here...</p>
                      )}
                    </div>
                  );
                }
                // Could add handling for SceneMedia components here in the future
                return null;
              })}
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>
      <ObjectOverlay />
    </AbsoluteFill>
  );
}

export default function RemotionPlayer() {
  // Get scenes and selectedSceneId from the store
  const scenes = useScenesStore((state) => state.scenes);
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const selectObject = useScenesStore((state) => state.selectObject);

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

  return (
    <Player
      component={RemotionComponent}
      durationInFrames={
        selectedScene ? selectedScene.durationInFrames : totalDuration
      }
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
  );
}
