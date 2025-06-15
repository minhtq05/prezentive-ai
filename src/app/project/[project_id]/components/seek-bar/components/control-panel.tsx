import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import usePlayerStore from "@/store/project/player-store";
import {
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

export default function ControlPanel() {
  const playing = usePlayerStore((state) => state.playing);
  const zoom = usePlayerStore((state) => state.zoom);
  const setZoom = usePlayerStore((state) => state.setZoom);
  const loop = usePlayerStore((state) => state.loop);
  const setLoop = usePlayerStore((state) => state.setLoop);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const playerRef = usePlayerStore((state) => state.playerRef);
  const seekTo = usePlayerStore((state) => state.seekTo);
  const durationInFrames = usePlayerStore((state) => state.durationInFrames);

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

  return (
    <div className="flex px-2 w-full h-10">
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

      <div className="flex justify-center items-center gap-2 w-4/10">
        <Button size="sm" variant="ghost" onClick={skipBackward}>
          <SkipBack size={10} />
        </Button>
        <Button size="sm" variant="ghost" onClick={togglePlayPause}>
          {playing ? <Pause size={10} /> : <Play size={10} />}
        </Button>
        <Button size="sm" variant="ghost" onClick={skipForward}>
          <SkipForward size={10} />
        </Button>
      </div>

      <div className="flex justify-end items-center gap-2 w-3/10">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            // axios
            //   .get("http://localhost:3000/api/render", {
            //     params: {
            //       compositionId: "main-video",
            //       inputProps: {
            //         previewMode: false,
            //         scenes: [],
            //         handleSelectObject: () => {},
            //       },
            //     },
            //   })
            //   .then((response) => {
            //     console.log("Render started", response.data);
            //   })
            //   .catch((error) => {
            //     console.error("Error starting render", error);
            //   });
            toast("Function not yet implemented", {
              description:
                "Video rendering is not yet implemented in this version.",
              duration: 10000,
              icon: "⚠️",
            });
          }}
        >
          Render
        </Button>
        <Button
          size="sm"
          variant={loop ? "default" : "ghost"}
          onClick={() => setLoop(!loop)}
          className="flex items-center gap-1"
        >
          <Repeat size={16} />
        </Button>
        {/* <div className="text-xs w-24 flex flex-row justify-end">
            Frame: {frame}/{durationInFrames - 1}
          </div> */}
      </div>
    </div>
  );
}
