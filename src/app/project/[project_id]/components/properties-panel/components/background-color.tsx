import ColorPicker from "@/components/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isColor, rgbaColorToHex, rgbaStringToColor } from "@/lib/colors";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";
import { useRef } from "react";
import { RgbaColor } from "react-colorful";

export default function BackgroundColor() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );
  const colorRef = useRef<HTMLInputElement>(null!);
  const alphaRef = useRef<HTMLInputElement>(null!);

  const textObject = objectOverlay as SceneText;

  if (colorRef.current && alphaRef.current) {
    colorRef.current.value = rgbaColorToHex(textObject.backgroundColor);
    alphaRef.current.value = String(
      (textObject.backgroundColor.a * 100).toFixed(2)
    );
  }

  const handleChangeColor = () => {
    const strColor = colorRef.current.value.trim();
    if (isColor(strColor)) {
      const rgb = rgbaStringToColor(strColor);
      const a = Math.min(
        100,
        Math.max(10, Number(alphaRef.current.value.trim())) / 100
      );
      const newColor = {
        ...rgb,
        a: isNaN(a) ? 1 : a,
      };
      updateOverlayProperty<SceneText, "backgroundColor">(
        "backgroundColor",
        newColor
      );
    } else {
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">
            Background Color
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 relative">
              <Input
                ref={colorRef}
                key={`${textObject.id}-background-color-rgb`}
                type="text"
                className="pl-9"
                defaultValue={rgbaColorToHex(textObject.backgroundColor)}
                onBlur={handleChangeColor}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleChangeColor();
                    e.currentTarget.blur();
                  }
                }}
              />
              <ColorPicker
                value={textObject.backgroundColor}
                onChange={(newColor: RgbaColor) => {
                  updateOverlayProperty<SceneText, "backgroundColor">(
                    "backgroundColor",
                    newColor
                  );
                }}
                className="size-6 rounded-full top-1/2 -translate-y-1/2 left-2 absolute"
              />
            </div>
            <Input
              ref={alphaRef}
              key={`${textObject.id}-text-background-color-alpha`}
              style={{ MozAppearance: "textfield" }} // should've work but nah
              type="number"
              min="10"
              max="100"
              defaultValue={String(
                (textObject.backgroundColor.a * 100).toFixed(2)
              )}
              onBlur={handleChangeColor}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChangeColor();
                  e.currentTarget.blur();
                }
              }}
            />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>Background color</TooltipContent>
    </Tooltip>
  );
}
