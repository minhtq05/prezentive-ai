import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";
import { useRef } from "react";

export default function FontSize() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  const textObject = objectOverlay as SceneText;

  const ref = useRef<HTMLInputElement>(null!);

  if (ref.current) {
    ref.current.value = String(textObject.fontSize);
  }

  const handleCommitChange = () => {
    const newFontSize = Math.min(999, Math.max(0, Number(ref.current.value)));
    updateOverlayProperty<SceneText, "fontSize">("fontSize", newFontSize);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">Font Size</Label>
      <Input
        ref={ref}
        key={`${textObject.id}-font-size`}
        type="number"
        defaultValue={textObject.fontSize}
        onBlur={handleCommitChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCommitChange();
            ref.current.blur();
          }
        }}
      />
    </div>
  );
}
