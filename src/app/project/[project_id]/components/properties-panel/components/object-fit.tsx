import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneMedia } from "@/types/scenes";
import { Maximize2, Minimize2, ScanFace } from "lucide-react";

export default function ObjectFit() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  const mediaObject = objectOverlay as SceneMedia;

  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">Object Fit</Label>
      <div className="grid grid-cols-3 border rounded-sm overflow-hidden h-16 shadow-xs">
        <Button
          variant={mediaObject.fit === "cover" ? "default" : "outline"}
          className="rounded-none border-0 h-full flex flex-col items-center gap-1"
          onClick={() =>
            updateOverlayProperty<SceneMedia, "fit">("fit", "cover")
          }
        >
          <Maximize2 className="size-4" />
          <span className="text-xs">Cover</span>
        </Button>
        <Button
          variant={mediaObject.fit === "contain" ? "default" : "outline"}
          className="rounded-none border-0 h-full flex flex-col items-center gap-1"
          onClick={() =>
            updateOverlayProperty<SceneMedia, "fit">("fit", "contain")
          }
        >
          <Minimize2 className="size-4" />
          <span className="text-xs">Contain</span>
        </Button>
        <Button
          variant={mediaObject.fit === "fill" ? "default" : "outline"}
          className="rounded-none border-0 h-full flex flex-col items-center gap-1"
          onClick={() =>
            updateOverlayProperty<SceneMedia, "fit">("fit", "fill")
          }
        >
          <ScanFace className="size-4" />
          <span className="text-xs">Fill</span>
        </Button>
      </div>
    </div>
  );
}
