import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";
import { Underline } from "lucide-react";

export default function TextUnderline() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={
            (objectOverlay as SceneText).textDecoration === "underline"
              ? "default"
              : "outline"
          }
          className="h-8 w-full"
          onClick={() =>
            updateOverlayProperty<SceneText, "textDecoration">(
              "textDecoration",
              (objectOverlay as SceneText).textDecoration === "underline"
                ? "none"
                : "underline"
            )
          }
        >
          <Underline className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Underline</TooltipContent>
    </Tooltip>
  );
}
