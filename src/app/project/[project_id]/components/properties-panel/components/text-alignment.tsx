import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";
import {
  AlignCenter,
  AlignCenterVertical,
  AlignEndVertical,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
} from "lucide-react";

export default function TextAlignment() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">Text Alignment</Label>
      <div className="flex border rounded-sm overflow-hidden h-8 shadow-xs">
        <Button
          variant={
            (objectOverlay as SceneText).textAlign === "left"
              ? "default"
              : "outline"
          }
          className="flex-1 rounded-none border-0 h-full w-8"
          onClick={() =>
            updateOverlayProperty<SceneText, "textAlign">("textAlign", "left")
          }
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={
            (objectOverlay as SceneText).textAlign === "center"
              ? "default"
              : "outline"
          }
          className="flex-1 rounded-none border-0 h-full w-8"
          onClick={() =>
            updateOverlayProperty<SceneText, "textAlign">("textAlign", "center")
          }
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={
            (objectOverlay as SceneText).textAlign === "right"
              ? "default"
              : "outline"
          }
          className="flex-1 rounded-none border-0 h-full w-8"
          onClick={() =>
            updateOverlayProperty<SceneText, "textAlign">("textAlign", "right")
          }
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
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
          <AlignStartVertical className="h-4 w-4" />
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
          <AlignCenterVertical className="h-4 w-4" />
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
          <AlignEndVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
