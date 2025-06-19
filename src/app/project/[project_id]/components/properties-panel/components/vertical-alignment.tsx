import { Button } from "@/components/ui/button";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";
import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartVertical,
} from "lucide-react";

export default function VerticalAlignment() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  return (
    <div className="flex border rounded-sm overflow-hidden h-8 shadow-xs">
      <Button
        variant={
          (objectOverlay as SceneText).textAlignVertical === "top"
            ? "default"
            : "outline"
        }
        className="flex-1 rounded-none border-0 h-full w-8"
        onClick={() =>
          updateOverlayProperty<SceneText, "textAlignVertical">(
            "textAlignVertical",
            "top"
          )
        }
      >
        <AlignStartVertical className="size-4" />
      </Button>
      <Button
        variant={
          (objectOverlay as SceneText).textAlignVertical === "center"
            ? "default"
            : "outline"
        }
        className="flex-1 rounded-none border-0 h-full w-8"
        onClick={() =>
          updateOverlayProperty<SceneText, "textAlignVertical">(
            "textAlignVertical",
            "center"
          )
        }
      >
        <AlignCenterVertical className="size-4" />
      </Button>
      <Button
        variant={
          (objectOverlay as SceneText).textAlignVertical === "bottom"
            ? "default"
            : "outline"
        }
        className="flex-1 rounded-none border-0 h-full w-8"
        onClick={() =>
          updateOverlayProperty<SceneText, "textAlignVertical">(
            "textAlignVertical",
            "bottom"
          )
        }
      >
        <AlignEndVertical className="size-4" />
      </Button>
    </div>
  );
}
