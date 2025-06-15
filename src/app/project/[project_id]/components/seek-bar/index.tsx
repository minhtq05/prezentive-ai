"use client";

import React, { useEffect, useMemo, useRef } from "react";

import { Separator } from "@/components/ui/separator";
import { useElementSize } from "@/hooks/use-element-size";
import { useHoverState } from "@/hooks/use-hover-state";
import usePlayerStore from "@/store/project/player-store";
import { useMeasure } from "@uidotdev/usehooks";
import ControlPanel from "./components/control-panel";
import Ruler from "./components/ruler";
import { default as ScenesBackground } from "./components/scenes-background";
import useSeekBar from "./hooks/use-seek-bar";

export const PLAYHEAD_WIDTH = 1; // Width of the playhead indicator
export const TRACK_HEIGHT = 32; // Height of each track

const SeekBar: React.FC<{
  inFrame?: number | null;
  outFrame?: number | null;
}> = ({ inFrame, outFrame }) => {
  // Get values from player store
  const durationInFrames = usePlayerStore((state) => state.durationInFrames);
  const frame = usePlayerStore((state) => state.frame);
  const zoom = usePlayerStore((state) => state.zoom);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const barHovered = useHoverState(containerRef);
  const size = useElementSize(containerRef);

  const [seekBarRef, { width: seekBarWidth }] = useMeasure();
  const containerWidth = usePlayerStore((state) => state.containerWidth);

  useEffect(() => {
    // Update container width in player store when size changes
    if (size?.width) {
      usePlayerStore.setState({ containerWidth: size.width });
    }
  }, [size?.width]);

  const { onPointerDown } = useSeekBar({
    containerRef,
    width: containerWidth,
    size,
  });

  // Calculate current playhead position
  const playheadPosition = useMemo(() => {
    const pixelsPerFrame =
      (containerWidth - PLAYHEAD_WIDTH) / Math.max(1, durationInFrames);
    return frame * pixelsPerFrame;
  }, [frame, durationInFrames, containerWidth]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <ControlPanel />

      {/* Seek bar with ruler */}
      <div className="flex-1 flex relative overflow-auto">
        {/* Interactive seek bar */}
        <div ref={seekBarRef} className="h-full w-full overflow-auto">
          <div
            style={{
              width: (seekBarWidth ?? 0) * zoom,
            }}
            className="h-full"
          >
            <div
              ref={containerRef}
              onPointerDown={onPointerDown}
              className="relative flex flex-col w-full h-full cursor-pointer select-none touch-none"
            >
              <Ruler />

              {/* Seek Bar */}
              <div className="relative h-3 overflow-hidden">
                <div className="absolute h-1 top-1 bg-gray-300 w-full">
                  <div
                    className="absolute h-1 bg-gray-200 opacity-60"
                    style={{
                      width: `${
                        (((outFrame ?? durationInFrames - 1) - (inFrame ?? 0)) /
                          durationInFrames) *
                        100
                      }%`,
                      marginLeft: `${
                        ((inFrame ?? 0) / durationInFrames) * 100
                      }%`,
                    }}
                  />
                  <div
                    className="absolute h-1 bg-black"
                    style={{
                      width: `${
                        ((frame - (inFrame ?? 0)) / durationInFrames) * 100
                      }%`,
                      marginLeft: `${
                        ((inFrame ?? 0) / durationInFrames) * 100
                      }%`,
                    }}
                  />
                </div>
                <div
                  className={`absolute h-3 w-3 rounded-full bg-primary shadow border border-white -ml-1.5 transition-opacity duration-100 ${
                    barHovered ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    left: playheadPosition,
                  }}
                />
              </div>
              <Separator />
              {/* Timeline tracks */}
              <div className="flex-auto flex flex-col overflow-scroll">
                {/* Scene backgrounds */}
                <div className="flex-auto flex flex-row relative w-full">
                  <ScenesBackground />
                  <div
                    style={{ width: PLAYHEAD_WIDTH }}
                    className="bg-primary/10"
                  />
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
    </div>
  );
};

export default SeekBar;
