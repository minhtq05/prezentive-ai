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
import { Scene, SceneText, SceneMedia } from "@/types/scenes";

type Size = {
  width: number;
  height: number;
  left: number;
  top: number;
};

// If a pane has been moved, it will cause a layout shift without
// the window having been resized. Those UI elements can call this API to
// force an update
export const useElementSize = (
  ref: React.RefObject<HTMLElement | null>
): Size | null => {
  const [size, setSize] = useState<Size | null>(() => {
    if (!ref.current) {
      return null;
    }

    const rect = ref.current.getClientRects();
    if (!rect[0]) {
      return null;
    }

    return {
      width: rect[0].width as number,
      height: rect[0].height as number,
      left: rect[0].x as number,
      top: rect[0].y as number,
    };
  });

  const observer = useMemo(() => {
    if (typeof ResizeObserver === "undefined") {
      return null;
    }

    return new ResizeObserver((entries) => {
      const { target } = entries[0];
      const newSize = target.getClientRects();

      if (!newSize?.[0]) {
        setSize(null);
        return;
      }

      const { width } = newSize[0];

      const { height } = newSize[0];

      setSize({
        width,
        height,
        left: newSize[0].x,
        top: newSize[0].y,
      });
    });
  }, []);

  const updateSize = useCallback(() => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getClientRects();
    if (!rect[0]) {
      setSize(null);
      return;
    }

    setSize((prevState) => {
      const isSame =
        prevState &&
        prevState.width === rect[0].width &&
        prevState.height === rect[0].height &&
        prevState.left === rect[0].x &&
        prevState.top === rect[0].y;
      if (isSame) {
        return prevState;
      }

      return {
        width: rect[0].width as number,
        height: rect[0].height as number,
        left: rect[0].x as number,
        top: rect[0].y as number,
        windowSize: {
          height: window.innerHeight,
          width: window.innerWidth,
        },
      };
    });
  }, [ref]);

  useEffect(() => {
    if (!observer) {
      return;
    }

    const { current } = ref;
    if (current) {
      observer.observe(current);
    }

    return (): void => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [observer, ref, updateSize]);

  useEffect(() => {
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [updateSize]);

  return useMemo(() => {
    if (!size) {
      return null;
    }

    return { ...size, refresh: updateSize };
  }, [size, updateSize]);
};

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

const BAR_HEIGHT = 5;
const KNOB_SIZE = 12;
const VERTICAL_PADDING = 0;
const TRACK_HEIGHT = 24; // Height of each track

const findBodyInWhichDivIsLocated = (div: HTMLElement) => {
  let current = div;

  while (current.parentElement) {
    current = current.parentElement;
  }

  return current;
};

export const useHoverState = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const { current } = ref;
    if (!current) {
      return;
    }

    const onHover = () => {
      setHovered(true);
    };

    const onLeave = () => {
      setHovered(false);
    };

    const onMove = () => {
      setHovered(true);
    };

    current.addEventListener("mouseenter", onHover);
    current.addEventListener("mouseleave", onLeave);
    current.addEventListener("mousemove", onMove);

    return () => {
      current.removeEventListener("mouseenter", onHover);
      current.removeEventListener("mouseleave", onLeave);
      current.removeEventListener("mousemove", onMove);
    };
  }, [ref]);
  return hovered;
};

export const SeekBar: React.FC<{
  durationInFrames: number;
  inFrame?: number | null;
  outFrame?: number | null;
  playerRef: React.RefObject<PlayerRef | null>;
}> = ({ durationInFrames, inFrame, outFrame, playerRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barHovered = useHoverState(containerRef);
  const size = useElementSize(containerRef);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [loop, setLoop] = useState(false);
  const scenes = useScenesStore((state) => state.scenes);
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);

  // local frame update when playerRef mounted
  useEffect(() => {
    const { current } = playerRef;
    if (!current) {
      return;
    }

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
    const { current } = playerRef;
    if (!current) {
      return;
    }

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

  // reset frame when selectedSceneId changes
  useEffect(() => {
    setFrame(0);
  }, [selectedSceneId]);

  const [dragState, setDragState] = useState<
    { dragging: false } | { dragging: true; wasPlaying: boolean }
  >({
    dragging: false,
  });

  const width = size?.width ?? 0;
  const scaledWidth = width * zoom;

  // Calculate time markers for the ruler
  const secondMarkers = useMemo(() => {
    const markers: { position: number; label: string }[] = [];
    const secondsCount = Math.ceil(durationInFrames / 30); // 30 frames per second
    const pixelsPerSecond = (30 * width) / Math.max(1, durationInFrames - 1);

    for (let i = 0; i <= secondsCount; i++) {
      markers.push({
        position: i * pixelsPerSecond,
        label: `${i}s`,
      });
    }

    return markers;
  }, [durationInFrames, width]);

  // Calculate frame markers for the ruler (just show every 5 frames)
  // const frameMarkers = useMemo(() => {
  //   const markers: number[] = [];
  //   const pixelsPerFrame = width / Math.max(1, durationInFrames - 1);

  //   for (let i = 0; i < durationInFrames; i += 5) {
  //     if (i % 30 !== 0) {
  //       // Skip second markers
  //       markers.push(i * pixelsPerFrame);
  //     }
  //   }

  //   return markers;
  // }, [durationInFrames, width]);

  // Function to get cumulative frame offset for a scene
  const getSceneFrameOffset = (sceneIndex: number) => {
    let offset = 0;
    for (let i = 0; i < sceneIndex; i++) {
      offset += scenes[i].durationInFrames;
    }
    return offset;
  };

  // Group components by type for the timeline tracks
  const trackComponents = useMemo(() => {
    const textComponents: {
      scene: Scene;
      component: SceneText;
      offset: number;
    }[] = [];
    const mediaComponents: {
      scene: Scene;
      component: SceneMedia;
      offset: number;
    }[] = [];
    const audioComponents: {
      scene: Scene;
      component: SceneMedia;
      offset: number;
    }[] = [];

    scenes.forEach((scene, index) => {
      const offset = getSceneFrameOffset(index);

      scene.components.forEach((component) => {
        if (component.type === "scene-text") {
          textComponents.push({
            scene,
            component: component as SceneText,
            offset,
          });
        } else if (component.type === "scene-media") {
          const mediaComponent = component as SceneMedia;
          if (mediaComponent.mediaType === "audio") {
            audioComponents.push({
              scene,
              component: mediaComponent,
              offset,
            });
          } else {
            mediaComponents.push({
              scene,
              component: mediaComponent,
              offset,
            });
          }
        }
      });
    });

    return { textComponents, mediaComponents, audioComponents };
  }, [scenes]);

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return;

    if (playing) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  }, [playing, playerRef]);

  const skipBackward = useCallback(() => {
    if (!playerRef.current) return;

    const currentFrame = playerRef.current.getCurrentFrame();
    const newFrame = Math.max(0, currentFrame - 150);
    playerRef.current.seekTo(newFrame);
  }, [playerRef]);

  const skipForward = useCallback(() => {
    if (!playerRef.current) return;

    const currentFrame = playerRef.current.getCurrentFrame();
    const newFrame = Math.min(durationInFrames - 1, currentFrame + 150);
    playerRef.current.seekTo(newFrame);
  }, [playerRef, durationInFrames]);

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
      playerRef.current.pause();
      playerRef.current.seekTo(_frame);
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
      playerRef.current.seekTo(_frame);
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
      playerRef.current.play();
    } else {
      playerRef.current.pause();
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

  // Function to render scenes backgrounds in the timeline
  const renderSceneBackgrounds = () => {
    let currentOffset = 0;

    return scenes.map((scene) => {
      const pixelsPerFrame = width / Math.max(1, durationInFrames - 1);
      const sceneWidth = scene.durationInFrames * pixelsPerFrame;
      const leftPosition = currentOffset * pixelsPerFrame;

      const isSelected = scene.id === selectedSceneId;
      const result = (
        <div
          key={scene.id}
          className={`absolute h-full ${
            // isSelected ? "bg-primary/10" : "bg-secondary/5"
            "bg-secondary/5"
          } border-l border-secondary`}
          style={{
            left: leftPosition,
            width: sceneWidth,
          }}
        >
          <div className="absolute top-0 left-0 px-1 text-[10px] truncate max-w-full bg-black/10">
            {scene.title}
          </div>
        </div>
      );

      currentOffset += scene.durationInFrames;
      return result;
    });
  };

  // Calculate current playhead position
  const playheadPosition = useMemo(() => {
    const pixelsPerFrame = width / Math.max(1, durationInFrames - 1);
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
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          className="relative h-5 bg-gray-100 cursor-pointer select-none touch-none"
        >
          {/* Ruler */}
          <div className="h-6 border-b border-t border-gray-200 bg-gray-50 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full">
              {/* {frameMarkers.map((marker, i) => (
                <div
                  key={`frame-${i}`}
                  className="absolute top-3 h-3 border-l border-gray-200"
                  style={{ left: marker }}
                />
              ))} */}
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
                    ((frame - (inFrame ?? 0)) / (durationInFrames - 1)) * 100
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
            <div className="absolute left-0 top-0 w-full h-full">
              {renderSceneBackgrounds()}
            </div>
            {/* Playhead */}
            <div
              className="absolute top-0 h-full w-px bg-primary z-50"
              style={{ left: playheadPosition }}
            />
            {/* Text track */}
            {/* <div className="relative h-6 flex items-center px-2 z-10">
          <div className="w-20 text-xs font-medium flex items-center gap-1">
            <TypeIcon size={12} />
            <span>Text</span>
          </div>
          <div className="flex-1 h-full relative">
            {trackComponents.textComponents.map((item, index) => {
              const pixelsPerFrame = width / Math.max(1, durationInFrames - 1);
              const startFrame = item.offset + item.component.from;
              const endFrame =
                item.offset +
                (item.component.to || item.scene.durationInFrames);
              const itemWidth = (endFrame - startFrame) * pixelsPerFrame;
              const leftPosition = startFrame * pixelsPerFrame;

              return (
                <div
                  key={`text-${item.component.id}`}
                  className="absolute top-1 h-4 rounded-sm bg-blue-200 border border-blue-300 overflow-hidden"
                  style={{
                    left: leftPosition,
                    width: Math.max(itemWidth, 4),
                  }}
                >
                  <div className="px-1 text-[8px] truncate w-full">
                    {item.component.text.substring(0, 20)}
                    {item.component.text.length > 20 ? "..." : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}
            {/* Image/Video track */}
            {/* <div className="relative h-6 flex items-center px-2 z-10 bg-gray-50/50">
          <div className="w-20 text-xs font-medium flex items-center gap-1">
            <ImageIcon size={12} />
            <span>Media</span>
          </div>
          <div className="flex-1 h-full relative">
            {trackComponents.mediaComponents.map((item, index) => {
              const pixelsPerFrame = width / Math.max(1, durationInFrames - 1);
              const startFrame = item.offset + item.component.from;
              const endFrame =
                item.offset +
                (item.component.to || item.scene.durationInFrames);
              const itemWidth = (endFrame - startFrame) * pixelsPerFrame;
              const leftPosition = startFrame * pixelsPerFrame;

              const isVideo = item.component.mediaType === "video";

              return (
                <div
                  key={`media-${item.component.id}`}
                  className={`absolute top-1 h-4 rounded-sm border overflow-hidden ${
                    isVideo
                      ? "bg-purple-200 border-purple-300"
                      : "bg-green-200 border-green-300"
                  }`}
                  style={{
                    left: leftPosition,
                    width: Math.max(itemWidth, 4),
                  }}
                >
                  <div className="px-1 text-[8px] truncate w-full flex items-center gap-1">
                    {isVideo ? <VideoIcon size={8} /> : <ImageIcon size={8} />}
                    <span>
                      {item.component.alt || (isVideo ? "Video" : "Image")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}
            {/* Audio track */}
            {/* <div className="relative h-6 flex items-center px-2 z-10">
          <div className="w-20 text-xs font-medium flex items-center gap-1">
            <MusicIcon size={12} />
            <span>Audio</span>
          </div>
          <div className="flex-1 h-full relative">
            {trackComponents.audioComponents.map((item, index) => {
              const pixelsPerFrame = width / Math.max(1, durationInFrames - 1);
              const startFrame = item.offset + item.component.from;
              const endFrame =
                item.offset +
                (item.component.to || item.scene.durationInFrames);
              const itemWidth = (endFrame - startFrame) * pixelsPerFrame;
              const leftPosition = startFrame * pixelsPerFrame;

              return (
                <div
                  key={`audio-${item.component.id}`}
                  className="absolute top-1 h-4 rounded-sm bg-yellow-200 border border-yellow-300 overflow-hidden"
                  style={{
                    left: leftPosition,
                    width: Math.max(itemWidth, 4),
                  }}
                >
                  <div className="px-1 text-[8px] truncate w-full flex items-center gap-1">
                    <MusicIcon size={8} />
                    <span>{item.component.alt || "Audio"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
