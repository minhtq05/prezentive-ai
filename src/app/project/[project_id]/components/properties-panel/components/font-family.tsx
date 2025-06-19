import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";

export default function FontFamily() {
  const overlayObject = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">Font Family</Label>
      <Select
        value={(overlayObject as SceneText).fontFamily}
        onValueChange={(value) =>
          updateOverlayProperty<SceneText, "fontFamily">("fontFamily", value)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Font Family" />
        </SelectTrigger>
        <SelectGroup>
          <SelectContent>
            <SelectItem value="sans-serif">Sans Serif</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="monospace">Monospace</SelectItem>
          </SelectContent>
        </SelectGroup>
      </Select>
    </div>
  );
}
