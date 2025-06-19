import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";
import { Strikethrough } from "lucide-react";

export default function TextStrikethrough() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={
            (objectOverlay as SceneText).textDecoration === "line-through"
              ? "default"
              : "outline"
          }
          className="h-8 w-full"
          onClick={() =>
            updateOverlayProperty<SceneText, "textDecoration">(
              "textDecoration",
              (objectOverlay as SceneText).textDecoration === "line-through"
                ? "none"
                : "line-through"
            )
          }
        >
          <Strikethrough className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Strikethrough</TooltipContent>
    </Tooltip>
  );
}
