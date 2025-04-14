"use client";

import { SceneText } from "@/types/scenes";
import useScenesStore from "@/store/scenes-store";
import useOverlayStore from "@/store/overlay-store";
import { Button } from "./button";
import { Separator } from "./separator";

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

  return (
    <div className="h-full overflow-y-auto p-4">
      <h3 className="font-medium mb-4">Text Properties</h3>

      <div className="space-y-6">
        {/* Text Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Text Content</label>
          <textarea
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
              <input
                type="number"
                className="w-full p-2 border rounded-sm bg-background"
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
              <select
                className="w-full p-2 border rounded-sm bg-background"
                value={textObject.fontFamily}
                onChange={(e) => {
                  updateOverlayProperty("fontFamily", e.target.value);
                }}
              >
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                className="w-8 h-8 rounded-sm"
                value={textObject.color}
                onChange={(e) => {
                  updateOverlayProperty("color", e.target.value);
                }}
              />
              <input
                type="text"
                className="flex-1 p-2 border rounded-sm bg-background"
                value={textObject.color}
                onChange={(e) => {
                  updateOverlayProperty("color", e.target.value);
                }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">
              Background Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                className="w-8 h-8 rounded-sm"
                value={textObject.backgroundColor}
                onChange={(e) => {
                  updateOverlayProperty("backgroundColor", e.target.value);
                }}
              />
              <input
                type="text"
                className="flex-1 p-2 border rounded-sm bg-background"
                value={textObject.backgroundColor}
                onChange={(e) => {
                  updateOverlayProperty("backgroundColor", e.target.value);
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
              <select
                className="w-full p-2 border rounded-sm bg-background mt-1"
                value={textObject.fontWeight}
                onChange={(e) =>
                  updateOverlayProperty("fontWeight", e.target.value as any)
                }
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="bolder">Bolder</option>
                <option value="lighter">Lighter</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Font Style
              </label>
              <select
                className="w-full p-2 border rounded-sm bg-background mt-1"
                value={textObject.fontStyle}
                onChange={(e) =>
                  updateOverlayProperty("fontStyle", e.target.value as any)
                }
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
                <option value="oblique">Oblique</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Text Decoration
              </label>
              <select
                className="w-full p-2 border rounded-sm bg-background mt-1"
                value={textObject.textDecoration}
                onChange={(e) =>
                  updateOverlayProperty("textDecoration", e.target.value as any)
                }
              >
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="line-through">Line Through</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Text Transform
              </label>
              <select
                className="w-full p-2 border rounded-sm bg-background mt-1"
                value={textObject.textTransform}
                onChange={(e) =>
                  updateOverlayProperty("textTransform", e.target.value as any)
                }
              >
                <option value="none">None</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="lowercase">lowercase</option>
                <option value="capitalize">Capitalize</option>
              </select>
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
