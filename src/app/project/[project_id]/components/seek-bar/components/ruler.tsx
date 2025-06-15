import usePlayerStore from "@/store/project/player-store";
import { useMemo } from "react";
import { PLAYHEAD_WIDTH } from "..";

export default function Ruler() {
  const durationInFrames = usePlayerStore((state) => state.durationInFrames);
  const containerWidth = usePlayerStore((state) => state.containerWidth);

  // Calculate time markers for the ruler
  const secondMarkers = useMemo(() => {
    const markers: { width: number; label: string }[] = [];
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

    const markersCount =
      Math.floor(durationInFrames / (bestSeparation * 30)) - 1;
    const pixelsPerFrame =
      (containerWidth - PLAYHEAD_WIDTH) / Math.max(1, durationInFrames);

    const widthPerMarker = pixelsPerFrame * bestSeparation * 30;

    for (let i = 0; i <= markersCount; i++) {
      markers.push({
        width: widthPerMarker,
        label: `${i * bestSeparation}s`,
      });
    }

    return markers;
  }, [durationInFrames, containerWidth]);

  return (
    <div className="h-6 border-b border-t border-gray-200 relative overflow-hidden">
      <div className="flex flex-row h-full w-full overflow-hidden">
        {secondMarkers.map((marker, i) => (
          <div
            key={`second-${i}`}
            className="box-border top-0 h-full border-l border-gray-300"
            style={{ width: marker.width }}
          >
            <span className="text-[10px] ml-1 text-gray-500">
              {marker.label}
            </span>
          </div>
        ))}
        <div style={{ width: PLAYHEAD_WIDTH }} className="bg-gray-300" />
      </div>
    </div>
  );
}
