import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";
import { Bold } from "lucide-react";

export default function FontWeight() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={
            (objectOverlay as SceneText).fontWeight === "bold"
              ? "default"
              : "outline"
          }
          className="h-8 w-full p-0"
          onClick={() =>
            updateOverlayProperty<SceneText, "fontWeight">(
              "fontWeight",
              (objectOverlay as SceneText).fontWeight === "bold"
                ? "normal"
                : "bold"
            )
          }
        >
          <Bold className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Bold</TooltipContent>
    </Tooltip>
  );
}
