import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";
import { Italic } from "lucide-react";

export default function FontStyle() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={
            (objectOverlay as SceneText).fontStyle === "italic"
              ? "default"
              : "outline"
          }
          className="h-8 w-full"
          onClick={() =>
            updateOverlayProperty<SceneText, "fontStyle">(
              "fontStyle",
              (objectOverlay as SceneText).fontStyle === "italic"
                ? "normal"
                : "italic"
            )
          }
        >
          <Italic className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Italic</TooltipContent>
    </Tooltip>
  );
}
