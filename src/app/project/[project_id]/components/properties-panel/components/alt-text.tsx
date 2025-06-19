import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneMedia } from "@/types/scenes";
import { useRef } from "react";

export default function AltText() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  const ref = useRef<HTMLInputElement>(null!);

  const mediaObject = objectOverlay as SceneMedia;

  if (ref.current) {
    ref.current.value = mediaObject.alt || "";
  }

  const handleCommitChange = () => {
    const newAltText = ref.current.value;
    updateOverlayProperty<SceneMedia, "alt">("alt", newAltText);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">Alt</Label>
      <Input
        ref={ref}
        key={`alt-text-${mediaObject.id}`}
        defaultValue={mediaObject.alt || ""}
        className="h-8 w-full"
        onBlur={handleCommitChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCommitChange();
            e.currentTarget.blur(); // Remove focus to trigger onBlur
          }
        }}
        placeholder="Description..."
      />
    </div>
  );
}
