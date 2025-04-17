"use client";

import { SceneText } from "@/types/scenes";
import useScenesStore from "@/store/scenes-store";
import useOverlayStore from "@/store/overlay-store";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { RgbaColor, RgbaColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import ColorPicker from "@/components/color-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TextVerticalAlignmentOption {
  value: "top" | "center" | "bottom";
  icon: React.ReactNode;
}

interface TextStyleOption {
  type: "weight" | "style" | "decoration" | "transform";
  value: string;
  label: string;
}

export default function PropertiesPanel() {
  const selectedObjectId = useScenesStore((state) => state.selectedObjectId);
  const visibleOverlayId = useOverlayStore((state) => state.visibleOverlayId);
  const overlayObject = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  if (!selectedObjectId || !visibleOverlayId || !overlayObject) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4">
        <p className="text-center">Select an object to change its properties</p>
      </div>
    );
  }

  // Only handle text components for now
  if (overlayObject.type !== "scene-text") {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4">
        <p className="text-center">Selected object type is not supported yet</p>
      </div>
    );
  }

  const textObject = overlayObject as SceneText;
  const inputClasses =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="h-full overflow-y-auto p-4">
      <h3 className="font-medium mb-4">Text Properties</h3>
      <div className="space-y-6">
        {/* Text Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Text Content</label>
          <Textarea
            className="w-full min-h-[100px] p-2 border rounded-sm bg-background"
            value={textObject.text}
            onChange={(e) => {
              updateOverlayProperty("text", e.target.value);
            }}
          />
        </div>

        <Separator />

        {/* Font Properties */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Font Properties</label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Font Size</label>
              <Input
                type="number"
                value={textObject.fontSize}
                onChange={(e) => {
                  updateOverlayProperty("fontSize", Number(e.target.value));
                }}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Font Family
              </label>
              <Select
                value={textObject.fontFamily}
                onValueChange={(value) =>
                  updateOverlayProperty("fontFamily", value)
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
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Color</label>
            <div className="grid grid-cols-5 gap-2 items-center">
              {/* RGBA color input */}
              <ColorPicker
                value={textObject.color}
                onChange={(newColor: RgbaColor) => {
                  // Convert hex to rgba

                  updateOverlayProperty("color", newColor);
                }}
                className="w-full h-9"
              />
              <Input
                type="number"
                min="0"
                max="255"
                className={cn(
                  "flex-1 p-2 border rounded-sm bg-background",
                  inputClasses
                )}
                value={textObject.color.r}
                onChange={(e) => {
                  updateOverlayProperty("color", {
                    ...textObject.color,
                    r: parseInt(e.target.value),
                  });
                }}
              />
              <Input
                type="number"
                min="0"
                max="255"
                className={cn(
                  "flex-1 p-2 border rounded-sm bg-background",
                  inputClasses
                )}
                value={textObject.color.g}
                onChange={(e) => {
                  updateOverlayProperty("color", {
                    ...textObject.color,
                    g: parseInt(e.target.value),
                  });
                }}
              />
              <Input
                type="number"
                min="0"
                max="255"
                className={cn(
                  "flex-1 p-2 border rounded-sm bg-background",
                  inputClasses
                )}
                value={textObject.color.b}
                onChange={(e) => {
                  updateOverlayProperty("color", {
                    ...textObject.color,
                    b: parseInt(e.target.value),
                  });
                }}
              />
              <Input
                type="number"
                min="0"
                max="255"
                className={cn(
                  "flex-1 p-2 border rounded-sm bg-background",
                  inputClasses
                )}
                value={textObject.color.a}
                onChange={(e) => {
                  updateOverlayProperty("color", {
                    ...textObject.color,
                    a: parseInt(e.target.value),
                  });
                }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">
              Background Color
            </label>
            <div className="grid grid-cols-5 gap-2 items-center">
              {/* RGBA color input */}
              <ColorPicker
                value={textObject.backgroundColor}
                onChange={(newColor: RgbaColor) => {
                  // Convert hex to rgba
                  updateOverlayProperty("backgroundColor", newColor);
                }}
                className="w-full h-9"
              />
              <Input
                type="number"
                min="0"
                max="255"
                className={cn(
                  "flex-1 p-2 border rounded-sm bg-background",
                  inputClasses
                )}
                value={textObject.backgroundColor.r}
                onChange={(e) => {
                  updateOverlayProperty("backgroundColor", {
                    ...textObject.backgroundColor,
                    r: parseInt(e.target.value),
                  });
                }}
              />
              <Input
                type="number"
                min="0"
                max="255"
                className={cn(
                  "flex-1 p-2 border rounded-sm bg-background",
                  inputClasses
                )}
                value={textObject.backgroundColor.g}
                onChange={(e) => {
                  updateOverlayProperty("backgroundColor", {
                    ...textObject.backgroundColor,
                    g: parseInt(e.target.value),
                  });
                }}
              />
              <Input
                type="number"
                min="0"
                max="255"
                className={cn(
                  "flex-1 p-2 border rounded-sm bg-background",
                  inputClasses
                )}
                value={textObject.backgroundColor.b}
                onChange={(e) => {
                  updateOverlayProperty("backgroundColor", {
                    ...textObject.backgroundColor,
                    b: parseInt(e.target.value),
                  });
                }}
              />
              <Input
                type="number"
                min="0"
                max="255"
                className={cn(
                  "flex-1 p-2 border rounded-sm bg-background",
                  inputClasses
                )}
                value={textObject.backgroundColor.a}
                onChange={(e) => {
                  updateOverlayProperty("backgroundColor", {
                    ...textObject.backgroundColor,
                    a: parseInt(e.target.value),
                  });
                }}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Text Alignment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Text Alignment</label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">
                Horizontal
              </label>
              <div className="flex border rounded-sm mt-1">
                <Button
                  variant={
                    textObject.textAlign === "left" ? "default" : "outline"
                  }
                  className="flex-1 rounded-none border-0"
                  onClick={() => updateOverlayProperty("textAlign", "left")}
                >
                  <span className="i-lucide-align-left" />
                </Button>
                <Button
                  variant={
                    textObject.textAlign === "center" ? "default" : "outline"
                  }
                  className="flex-1 rounded-none border-0"
                  onClick={() => updateOverlayProperty("textAlign", "center")}
                >
                  <span className="i-lucide-align-center" />
                </Button>
                <Button
                  variant={
                    textObject.textAlign === "right" ? "default" : "outline"
                  }
                  className="flex-1 rounded-none border-0"
                  onClick={() => updateOverlayProperty("textAlign", "right")}
                >
                  <span className="i-lucide-align-right" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Vertical</label>
              <div className="flex border rounded-sm mt-1">
                <Button
                  variant={
                    textObject.textAlignVertical === "top"
                      ? "default"
                      : "outline"
                  }
                  className="flex-1 rounded-none border-0"
                  onClick={() =>
                    updateOverlayProperty("textAlignVertical", "top")
                  }
                >
                  <span className="i-lucide-align-start-vertical" />
                </Button>
                <Button
                  variant={
                    textObject.textAlignVertical === "center"
                      ? "default"
                      : "outline"
                  }
                  className="flex-1 rounded-none border-0"
                  onClick={() =>
                    updateOverlayProperty("textAlignVertical", "center")
                  }
                >
                  <span className="i-lucide-align-center-vertical" />
                </Button>
                <Button
                  variant={
                    textObject.textAlignVertical === "bottom"
                      ? "default"
                      : "outline"
                  }
                  className="flex-1 rounded-none border-0"
                  onClick={() =>
                    updateOverlayProperty("textAlignVertical", "bottom")
                  }
                >
                  <span className="i-lucide-align-end-vertical" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Text Style */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Text Style</label>

          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">
                Font Weight
              </label>
              <Select
                // className="w-full p-2 border rounded-sm bg-background mt-1"
                required
                value={textObject.fontWeight}
                onValueChange={(
                  value: "normal" | "bold" | "bolder" | "lighter"
                ) => updateOverlayProperty("fontWeight", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Font Weight" />
                </SelectTrigger>
                <SelectGroup>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="bolder">Bolder</SelectItem>
                    <SelectItem value="lighter">Lighter</SelectItem>
                  </SelectContent>
                </SelectGroup>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Font Style
              </label>
              <Select
                value={textObject.fontStyle}
                onValueChange={(value: "normal" | "italic" | "oblique") =>
                  updateOverlayProperty("fontStyle", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Font Style" />
                </SelectTrigger>
                <SelectGroup>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="italic">Italic</SelectItem>
                    <SelectItem value="oblique">Oblique</SelectItem>
                  </SelectContent>
                </SelectGroup>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Text Decoration
              </label>
              <Select
                value={textObject.textDecoration}
                onValueChange={(value: "none" | "underline" | "line-through") =>
                  updateOverlayProperty("textDecoration", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Text Decoration" />
                </SelectTrigger>
                <SelectGroup>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="underline">Underline</SelectItem>
                    <SelectItem value="line-through">Line Through</SelectItem>
                  </SelectContent>
                </SelectGroup>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Text Transform
              </label>
              <Select
                value={textObject.textTransform}
                onValueChange={(
                  value: "none" | "uppercase" | "lowercase" | "capitalize"
                ) => updateOverlayProperty("textTransform", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Text Transform" />
                </SelectTrigger>
                <SelectGroup>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="uppercase">UPPERCASE</SelectItem>
                    <SelectItem value="lowercase">lowercase</SelectItem>
                    <SelectItem value="capitalize">Capitalize</SelectItem>
                  </SelectContent>
                </SelectGroup>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Animation */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Animations</label>
          <div className="p-2 border rounded-sm">
            <p className="text-xs text-muted-foreground">
              Current animations:{" "}
              {textObject.animations.length
                ? textObject.animations.join(", ")
                : "None"}
            </p>
            <Button variant="outline" size="sm" className="w-full mt-2">
              Add Animation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
