"use client";

import AnimationDialog from "@/components/animation-dialog";
import ColorPicker from "@/components/color-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { animationsNames } from "@/constants/animations";
import { cn } from "@/lib/utils";
import useOverlayStore from "@/store/overlay-store";
import useScenesStore from "@/store/scenes-store";
import { SceneMedia, SceneText } from "@/types/scenes";
import { RgbaColor } from "react-colorful";

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

  // Only handle text and media components for now
  if (
    overlayObject.type !== "scene-text" &&
    overlayObject.type !== "scene-media"
  ) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4">
        <p className="text-center">Selected object type is not supported yet</p>
      </div>
    );
  }

  // Render different properties based on object type
  if (overlayObject.type === "scene-text") {
    const textObject = overlayObject as SceneText;
    const inputClasses =
      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

    return (
      <div className="h-full overflow-y-auto p-4">
        <h3 className="font-medium mb-4">Text Properties</h3>
        <div className="space-y-6">
          {/* Text Content */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Text Content</label>
            <Textarea
              className="w-full min-h-[100px] p-2 border rounded-sm bg-background"
              value={textObject.text}
              onChange={(e) => {
                updateOverlayProperty<SceneText, "text">(
                  "text",
                  e.target.value
                );
              }}
            />
          </div>

          <Separator /> */}
          {/* Font Properties */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Properties</label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">
                  Font Size
                </label>
                <Input
                  type="number"
                  value={textObject.fontSize}
                  onChange={(e) => {
                    updateOverlayProperty<SceneText, "fontSize">(
                      "fontSize",
                      Number(e.target.value)
                    );
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
                    updateOverlayProperty<SceneText, "fontFamily">(
                      "fontFamily",
                      value
                    )
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

                    updateOverlayProperty<SceneText, "color">(
                      "color",
                      newColor
                    );
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
                    updateOverlayProperty<SceneText, "color">("color", {
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
                    updateOverlayProperty<SceneText, "color">("color", {
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
                    updateOverlayProperty<SceneText, "color">("color", {
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
                    updateOverlayProperty<SceneText, "color">("color", {
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
                    updateOverlayProperty<SceneText, "backgroundColor">(
                      "backgroundColor",
                      newColor
                    );
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
                    updateOverlayProperty<SceneText, "backgroundColor">(
                      "backgroundColor",
                      {
                        ...textObject.backgroundColor,
                        r: parseInt(e.target.value),
                      }
                    );
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
                    updateOverlayProperty<SceneText, "backgroundColor">(
                      "backgroundColor",
                      {
                        ...textObject.backgroundColor,
                        g: parseInt(e.target.value),
                      }
                    );
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
                    updateOverlayProperty<SceneText, "backgroundColor">(
                      "backgroundColor",
                      {
                        ...textObject.backgroundColor,
                        b: parseInt(e.target.value),
                      }
                    );
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
                    updateOverlayProperty<SceneText, "backgroundColor">(
                      "backgroundColor",
                      {
                        ...textObject.backgroundColor,
                        a: parseInt(e.target.value),
                      }
                    );
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
                <div className="flex border rounded-sm mt-1 overflow-hidden">
                  <Button
                    variant={
                      textObject.textAlign === "left" ? "default" : "outline"
                    }
                    className="flex-1 rounded-none border-0"
                    onClick={() =>
                      updateOverlayProperty<SceneText, "textAlign">(
                        "textAlign",
                        "left"
                      )
                    }
                  >
                    <span className="i-lucide-align-left" />
                  </Button>
                  <Button
                    variant={
                      textObject.textAlign === "center" ? "default" : "outline"
                    }
                    className="flex-1 rounded-none border-0"
                    onClick={() =>
                      updateOverlayProperty<SceneText, "textAlign">(
                        "textAlign",
                        "center"
                      )
                    }
                  >
                    <span className="i-lucide-align-center" />
                  </Button>
                  <Button
                    variant={
                      textObject.textAlign === "right" ? "default" : "outline"
                    }
                    className="flex-1 rounded-none border-0"
                    onClick={() =>
                      updateOverlayProperty<SceneText, "textAlign">(
                        "textAlign",
                        "right"
                      )
                    }
                  >
                    <span className="i-lucide-align-right" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">
                  Vertical
                </label>
                <div className="flex border rounded-sm mt-1 overflow-hidden">
                  <Button
                    variant={
                      textObject.textAlignVertical === "top"
                        ? "default"
                        : "outline"
                    }
                    className="flex-1 rounded-none border-0"
                    onClick={() =>
                      updateOverlayProperty<SceneText, "textAlignVertical">(
                        "textAlignVertical",
                        "top"
                      )
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
                      updateOverlayProperty<SceneText, "textAlignVertical">(
                        "textAlignVertical",
                        "center"
                      )
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
                      updateOverlayProperty<SceneText, "textAlignVertical">(
                        "textAlignVertical",
                        "bottom"
                      )
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
                  ) =>
                    updateOverlayProperty<SceneText, "fontWeight">(
                      "fontWeight",
                      value
                    )
                  }
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
                    updateOverlayProperty<SceneText, "fontStyle">(
                      "fontStyle",
                      value
                    )
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
                  onValueChange={(
                    value: "none" | "underline" | "line-through"
                  ) =>
                    updateOverlayProperty<SceneText, "textDecoration">(
                      "textDecoration",
                      value
                    )
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
                  ) =>
                    updateOverlayProperty<SceneText, "textTransform">(
                      "textTransform",
                      value
                    )
                  }
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
            <p className="text-xs text-muted-foreground mb-2">
              Current animations: {textObject.animations.length === 0 && "None"}
            </p>
            {textObject.animations.length > 0 && (
              <div className="space-y-1">
                {textObject.animations.map((animation, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-1 border-input px-2 py-1 rounded-md"
                  >
                    <span className="text-sm">
                      {animationsNames[animation.name]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <AnimationDialog
            currentAnimations={textObject.animations}
            onUpdateAnimations={(animations) => {
              updateOverlayProperty<SceneText, "animations">(
                "animations",
                animations
              );
            }}
          >
            <Button variant="outline" size="sm" className="w-full">
              Update Animations
            </Button>
          </AnimationDialog>
        </div>
      </div>
    );
  } else {
    // Media properties
    const mediaObject = overlayObject as SceneMedia;

    return (
      <div className="h-full overflow-y-auto p-4">
        <h3 className="font-medium mb-4">Media Properties</h3>
        <div className="space-y-6">
          {/* Media Info */}
          <div className="space-y-2">
            <Card className="shadow-xs rounded-md py-4 gap-y-2">
              <CardHeader className="px-4">
                <CardTitle>Media Information</CardTitle>
              </CardHeader>
              <CardContent className="px-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-medium">Type:</div>
                  <div className="capitalize">{mediaObject.mediaType}</div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="font-medium">Dimensions:</div>
                  <div>
                    {mediaObject.width} × {mediaObject.height}px
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="font-medium">Alt Text:</div>
                  <div className="text-sm text-muted-foreground">
                    {mediaObject.alt || "No alt text"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Fit */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Options</label>
            <div>
              <label className="text-xs text-muted-foreground">
                Object Fit
              </label>
              <Select
                value={mediaObject.fit}
                onValueChange={(value: "cover" | "contain" | "fill") =>
                  updateOverlayProperty<SceneMedia, "fit">("fit", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Object Fit" />
                </SelectTrigger>
                <SelectGroup>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="fill">Fill</SelectItem>
                  </SelectContent>
                </SelectGroup>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Alt Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Accessibility</label>
            <div>
              <label className="text-xs text-muted-foreground">Alt Text</label>
              <Input
                value={mediaObject.alt}
                onChange={(e) => {
                  updateOverlayProperty<SceneMedia, "alt">(
                    "alt",
                    e.target.value
                  );
                }}
                placeholder="Describe this media..."
              />
            </div>
          </div>

          <Separator />

          {/* Animation */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Animations</label>
            <p className="text-xs text-muted-foreground mb-2">
              Current animations:{" "}
              {mediaObject.animations.length === 0 && "None"}
            </p>
            {mediaObject.animations.length > 0 && (
              <div className="space-y-1">
                {mediaObject.animations.map((animation, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-1 border-input px-2 py-1 rounded-md"
                  >
                    <span className="text-sm">
                      {animationsNames[animation.name]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <AnimationDialog
            currentAnimations={mediaObject.animations}
            onUpdateAnimations={(animations) => {
              updateOverlayProperty<SceneMedia, "animations">(
                "animations",
                animations
              );
            }}
          >
            <Button variant="outline" size="sm" className="w-full">
              Update Animations
            </Button>
          </AnimationDialog>
        </div>
      </div>
    );
  }
}
