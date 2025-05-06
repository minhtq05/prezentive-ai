"use client";

import useScenesStore from "@/store/scenes-store";
import type { PlayerRef } from "@remotion/player";
import {
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as MusicIcon,
  Type as TypeIcon,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { interpolate } from "remotion";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

import usePlayerStore from "@/store/player-store";
import { Size, useElementSize } from "@/hooks/use-element-size";
import { useHoverState } from "./seek-bar-temp";
import { useMeasure } from "@uidotdev/usehooks";
import { Scene, SceneMedia, SceneText } from "@/types/scenes";
import { cn } from "@/lib/utils";

const getFrameFromX = (
  clientX: number,
  durationInFrames: number,
  width: number
) => {
  const pos = clientX;
  const frame = Math.round(
    interpolate(pos, [0, width], [0, Math.max(durationInFrames - 1, 0)], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  return frame;
};

const findBodyInWhichDivIsLocated = (div: HTMLElement) => {
  let current = div;

  while (current.parentElement) {
    current = current.parentElement;
  }

  return current;
};

const BAR_HEIGHT = 5;
const KNOB_SIZE = 12;
const VERTICAL_PADDING = 0;
const TRACK_HEIGHT = 72; // Height of each track

export const SeekBar: React.FC<{
  inFrame?: number | null;
  outFrame?: number | null;
}> = ({ inFrame, outFrame }) => {
  // Get values from player store
  const durationInFrames = usePlayerStore((state) => state.durationInFrames);
  const playerRef = usePlayerStore((state) => state.playerRef);
  const playing = usePlayerStore((state) => state.playing);
  const setPlaying = usePlayerStore((state) => state.setPlaying);
  const frame = usePlayerStore((state) => state.frame);
  const setFrame = usePlayerStore((state) => state.setFrame);
  const zoom = usePlayerStore((state) => state.zoom);
  const setZoom = usePlayerStore((state) => state.setZoom);
  const loop = usePlayerStore((state) => state.loop);
  const seekTo = usePlayerStore((state) => state.seekTo);
  const setLoop = usePlayerStore((state) => state.setLoop);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const barHovered = useHoverState(containerRef);
  const size = useElementSize(containerRef);
  const scenes = useScenesStore((state) => state.scenes);
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);
  const selectedScene =
    scenes.find((scene) => scene.id === selectedSceneId) || null;

  const [seekBarRef, { width: seekBarWidth }] = useMeasure();
  const width = useMemo(() => size?.width ?? 0, [size?.width]);
  // const scaledWidth = width * zoom;

  const { skipBackward, skipForward, onPointerDown, secondMarkers } =
    useSeekBar({
      playerRef,
      containerRef,
      setFrame,
      setPlaying,
      seekTo,
      play,
      pause,
      durationInFrames,
      width,
      size,
      playing,
    });

  // reset frame when selectedSceneId changes
  useEffect(() => {
    setFrame(0);
  }, [selectedSceneId]);

  // Function to render scenes backgrounds in the timeline
  const renderSceneBackgrounds = () => {
    return (selectedScene === null ? scenes : [selectedScene]).map((scene) => {
      const pixelsPerFrame = width / Math.max(1, durationInFrames);
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
          key={scene.id}
          className={`h-full ${"bg-secondary/5"} flex flex-col gap-1 box-border border-l-1 border-primary/10`}
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
                className="h-6 rounded-xs bg-blue-200 border border-blue-300 overflow-hidden flex flex-row gap-1 items-center px-1 mx-1"
                title={component.text || "Text"}
              >
                <TypeIcon size={12} />
                <div className="text-[8px] truncate w-full max-w-[200px]">
                  {component.text}
                </div>
              </div>
            ))}
          </div>

          {/* Media Components Track */}
          <div className="relative flex flex-col gap-1">
            {mediaComponents.map((component) => (
              <div
                key={`media-${component.id}`}
                className={cn(
                  "h-6 rounded-xs border overflow-hidden flex flex-row gap-1 items-center px-1 mx-1",
                  component.mediaType === "image" &&
                    "border-green-300 bg-green-200",
                  component.mediaType === "video" &&
                    "border-red-300 bg-red-200 ",
                  component.mediaType === "audio" &&
                    "border-yellow-300 bg-yellow-200 "
                )}
                title={component.src || "Media"}
              >
                <div className="px-1 text-[8px] truncate w-full flex items-center">
                  {component.mediaType === "image" ? (
                    <ImageIcon size={12} />
                  ) : component.mediaType === "video" ? (
                    <VideoIcon size={12} />
                  ) : (
                    <MusicIcon size={12} />
                  )}
                  {component.src || "Media"}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      return result;
    });
  };

  // Calculate current playhead position
  const playheadPosition = useMemo(() => {
    const pixelsPerFrame = width / Math.max(1, durationInFrames);
    return frame * pixelsPerFrame;
  }, [frame, durationInFrames, width]);

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Control Panel */}
      <div className="w-full flex flex-row p-2">
        <div className="flex items-center gap-2 w-3/10">
          <ZoomOut size={16} />
          <Slider
            value={[zoom]}
            min={1}
            max={2}
            step={0.1}
            onValueChange={(value) => setZoom(value[0])}
            className="w-[120px]"
          />
          <ZoomIn size={16} />
          <span style={{ fontSize: "12px", marginLeft: "4px" }}>
            {zoom.toFixed(1)}x
          </span>
        </div>

        <div className="flex justify-center gap-2 w-4/10">
          <Button size="sm" variant="ghost" onClick={skipBackward}>
            <SkipBack size={16} />
          </Button>
          <Button size="sm" variant="outline" onClick={togglePlayPause}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button size="sm" variant="ghost" onClick={skipForward}>
            <SkipForward size={16} />
          </Button>
        </div>

        <div className="flex items-center w-3/10 justify-end">
          <Button
            size="sm"
            variant={loop ? "secondary" : "outline"}
            onClick={() => setLoop(!loop)}
            className="flex items-center gap-1"
          >
            <Repeat size={16} />
          </Button>
          <div className="ml-2 text-xs">
            Frame: {frame}/{durationInFrames - 1}
          </div>
        </div>
      </div>

      {/* Seek bar with ruler */}
      <div className="flex-1 relative overflow-x-scroll">
        {/* Interactive seek bar */}
        <div ref={seekBarRef} className="h-full w-full">
          <div
            style={{
              width: (seekBarWidth ?? 0) * zoom,
            }}
          >
            <div
              ref={containerRef}
              onPointerDown={onPointerDown}
              className="relative w-full h-full bg-gray-100 cursor-pointer select-none touch-none"
            >
              {/* Ruler */}
              <div className="h-6 border-b border-t border-gray-200 bg-gray-50 relative overflow-hidden">
                <div className="h-full overflow-hidden">
                  {secondMarkers.map((marker, i) => (
                    <div
                      key={`second-${i}`}
                      className="absolute top-0 h-full border-l border-gray-300"
                      style={{ left: marker.position }}
                    >
                      <span className="text-[10px] ml-1 text-gray-500">
                        {marker.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seek Bar */}
              <div className="relative h-5">
                <div className="absolute h-1 top-2 bg-gray-300 w-full">
                  <div
                    className="absolute h-1 bg-gray-200 opacity-60"
                    style={{
                      width: `${
                        (((outFrame ?? durationInFrames - 1) - (inFrame ?? 0)) /
                          (durationInFrames - 1)) *
                        100
                      }%`,
                      marginLeft: `${
                        ((inFrame ?? 0) / (durationInFrames - 1)) * 100
                      }%`,
                    }}
                  />
                  <div
                    className="absolute h-1 bg-black"
                    style={{
                      width: `${
                        ((frame - (inFrame ?? 0)) / (durationInFrames - 1)) *
                        100
                      }%`,
                      marginLeft: `${
                        ((inFrame ?? 0) / (durationInFrames - 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <div
                  className={`absolute h-3 w-3 rounded-full bg-primary shadow border border-white -ml-1.5 top-1 transition-opacity duration-100 ${
                    barHovered ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    left: Math.max(
                      0,
                      (frame / Math.max(1, durationInFrames - 1)) * width
                    ),
                  }}
                />
              </div>

              {/* Timeline tracks */}
              <div
                className="relative border-t border-gray-200 flex flex-col"
                style={{ height: TRACK_HEIGHT * 4 + 8 }}
              >
                {/* Scene backgrounds */}
                <div className="w-full h-full flex flex-row">
                  {renderSceneBackgrounds()}
                </div>
                {/* Playhead */}
                <div
                  className="absolute top-0 h-full w-px bg-primary z-50"
                  style={{ left: playheadPosition }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function useSeekBar({
  playerRef,
  containerRef,
  setFrame,
  setPlaying,
  seekTo,
  play,
  pause,
  durationInFrames,
  width,
  size,
  playing,
}: {
  playerRef: React.RefObject<PlayerRef | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setFrame: (frame: number) => void;
  setPlaying: (playing: boolean) => void;
  seekTo: (frame: number) => void;
  play: () => void;
  pause: () => void;
  durationInFrames: number;
  width: number;
  size: Size | null;
  playing: boolean;
}) {
  // local frame update when playerRef mounted
  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const { current } = playerRef;
    const onFrameUpdate = () => {
      setFrame(current.getCurrentFrame());
    };

    current.addEventListener("frameupdate", onFrameUpdate);

    return () => {
      current.removeEventListener("frameupdate", onFrameUpdate);
    };
  }, [playerRef]);

  // play and pause event listeners
  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const { current } = playerRef;
    // event handler for play
    const onPlay = () => {
      setPlaying(true);
    };

    // event handler for pause
    const onPause = () => {
      setPlaying(false);
    };

    current.addEventListener("play", onPlay); // event listeners for play
    current.addEventListener("pause", onPause); // event listeners for pause

    return () => {
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
    };
  }, [playerRef]);

  const skipBackward = useCallback(() => {
    if (!playerRef.current) return;

    const { current } = playerRef;
    const currentFrame = current.getCurrentFrame();
    const newFrame = Math.max(0, currentFrame - 150);
    seekTo(newFrame);
  }, [playerRef]);

  const skipForward = useCallback(() => {
    if (!playerRef.current) return;

    const { current } = playerRef;
    const currentFrame = current.getCurrentFrame();
    const newFrame = Math.min(durationInFrames - 1, currentFrame + 150);
    seekTo(newFrame);
  }, [playerRef, durationInFrames]);

  const [dragState, setDragState] = useState<
    { dragging: false } | { dragging: true; wasPlaying: boolean }
  >({
    dragging: false,
  });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) {
        return;
      }

      if (!playerRef.current) {
        return;
      }

      const posLeft = containerRef.current?.getBoundingClientRect()
        .left as number;

      const _frame = getFrameFromX(
        e.clientX - posLeft,
        durationInFrames,
        width
      );
      pause();
      seekTo(_frame);
      setDragState({
        dragging: true,
        wasPlaying: playing,
      });
    },
    [durationInFrames, width, playerRef, playing]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!size) {
        throw new Error("Player has no size");
      }

      if (!dragState.dragging) {
        return;
      }

      if (!playerRef.current) {
        return;
      }

      const posLeft = containerRef.current?.getBoundingClientRect()
        .left as number;

      const _frame = getFrameFromX(
        e.clientX - posLeft,
        durationInFrames,
        size.width
      );
      seekTo(_frame);
    },
    [dragState.dragging, durationInFrames, playerRef, size]
  );

  const onPointerUp = useCallback(() => {
    setDragState({
      dragging: false,
    });
    if (!dragState.dragging) {
      return;
    }

    if (!playerRef.current) {
      return;
    }

    if (dragState.wasPlaying) {
      play();
    } else {
      pause();
    }
  }, [dragState, playerRef]);

  useEffect(() => {
    if (!dragState.dragging) {
      return;
    }

    const body = findBodyInWhichDivIsLocated(
      containerRef.current as HTMLElement
    );

    body.addEventListener("pointermove", onPointerMove);
    body.addEventListener("pointerup", onPointerUp);
    return () => {
      body.removeEventListener("pointermove", onPointerMove);
      body.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragState.dragging, onPointerMove, onPointerUp]);

  // Calculate time markers for the ruler
  const secondMarkers = useMemo(() => {
    const markers: { position: number; label: string }[] = [];
    const timeSeparation = durationInFrames / (30 * 30); // keep under 30 markers in the timeline
    const acceptableSeparations = [
      0.1, // 0.1 second (3 frames)
      1, // 1 second (30 frames)
      2, // 2 seconds (60 frames)
      5, // 5 seconds (150 frames)
      10, // 10 seconds (300 frames)
      20, // 20 seconds (600 frames)
      30, // 30 seconds (900 frames)
      60, // 1 minute (1800 frames)
      120, // 2 minutes (3600 frames)
      300, // 5 minutes (9000 frames)
      600, // 10 minutes (18000 frames)
    ];

    let bestSeparation = -1;
    for (const separation of acceptableSeparations) {
      if (separation >= timeSeparation) {
        bestSeparation = separation;
        break;
      }
    }
    if (bestSeparation === -1) {
      bestSeparation = acceptableSeparations[acceptableSeparations.length - 1];
    }

    const markersCount = Math.floor(durationInFrames / (bestSeparation * 30));
    const pixelsPerFrame = width / Math.max(1, durationInFrames);

    for (let i = 0; i <= markersCount; i++) {
      markers.push({
        position: i * pixelsPerFrame * bestSeparation * 30,
        label: `${i * bestSeparation}s`,
      });
    }

    return markers;
  }, [durationInFrames, width]);

  return {
    skipBackward,
    skipForward,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    secondMarkers,
  };
}
