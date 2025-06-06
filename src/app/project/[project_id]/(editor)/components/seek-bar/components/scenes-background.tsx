import { cn } from "@/lib/utils";
import usePlayerStore from "@/store/player-store";
import useScenesStore from "@/store/scenes-store";
import { SceneMedia, SceneText } from "@/types/scenes";
import {
  Image as ImageIcon,
  Music as MusicIcon,
  Type as TypeIcon,
  Video as VideoIcon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { PLAYHEAD_WIDTH, TRACK_HEIGHT } from "..";

const trackStyle =
  "rounded-md overflow-hidden flex items-center gap-1 px-3 mx-1 text-xs";
const trackTextStyle =
  "flex items-center text-xs tracking-wider truncate w-full max-w-full";

const textTracksColor = "bg-cornflower-blue text-white";
const imageTracksColor = "bg-purple-blue text-white";
const videoTracksColor = "bg-coral text-white";
const audioTracksColor = "bg-orange text-black";

export default function ScenesBackground() {
  const scenes = useScenesStore((state) => state.scenes);
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId) || null,
    [scenes, selectedSceneId]
  );
  const durationInFrames = usePlayerStore((state) => state.durationInFrames);
  const containerWidth = usePlayerStore((state) => state.containerWidth);

  // Function to render scenes backgrounds in the timeline
  const renderSceneBackgrounds = useCallback(() => {
    return (selectedScene === null ? scenes : [selectedScene]).map((scene) => {
      const pixelsPerFrame =
        (containerWidth - PLAYHEAD_WIDTH) / Math.max(1, durationInFrames);
      const sceneWidth = scene.durationInFrames * pixelsPerFrame;

      // Extract components from the scene
      const textComponents: SceneText[] = [];
      const mediaComponents: SceneMedia[] = [];

      for (const component of scene.components) {
        if (component.type === "scene-text") {
          textComponents.push(component);
        } else if (component.type === "scene-media") {
          mediaComponents.push(component);
        }
      }

      const result = (
        <div
          className="h-full bg-secondary/5 flex flex-col gap-1 box-border border-l-1 border-primary/10"
          style={{
            width: sceneWidth,
          }}
        >
          {/* Scene Title */}
          <div className="px-1 text-[10px] truncate w-fit bg-black/10">
            {scene.title}
          </div>

          {/* Text Components Track */}
          <div className="relative flex flex-col gap-1">
            {textComponents.map((component) => (
              <div
                key={`text-${component.id}`}
                className={cn(trackStyle, textTracksColor)}
                style={{ height: TRACK_HEIGHT }}
              >
                <TypeIcon size={12} />
                <div className={trackTextStyle}>{component.text}</div>
              </div>
            ))}
          </div>

          {/* Media Components Track */}
          <div className="relative flex flex-col gap-1">
            {mediaComponents.map((component) => (
              <div
                key={`media-${component.id}`}
                className={cn(
                  trackStyle,
                  component.mediaType === "image" && imageTracksColor,
                  component.mediaType === "video" && videoTracksColor,
                  component.mediaType === "audio" && audioTracksColor
                )}
                style={{ height: TRACK_HEIGHT }}
              >
                {component.mediaType === "image" ? (
                  <ImageIcon size={12} />
                ) : component.mediaType === "video" ? (
                  <VideoIcon size={12} />
                ) : (
                  <MusicIcon size={12} />
                )}
                <div className={trackTextStyle}>{component.src || "Media"}</div>
              </div>
            ))}
          </div>
        </div>
      );

      return result;
    });
  }, [selectedScene, scenes, containerWidth, durationInFrames]);

  return <>{renderSceneBackgrounds()}</>;
}
