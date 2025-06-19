"use client";

import useOverlayStore from "@/store/project/overlay-store";
import useScenesStore from "@/store/project/scenes-store";
import {
  BackgroundColor,
  FontFamily,
  FontSize,
  TextAlignment,
  TextColor,
} from "./components/";
import AltText from "./components/alt-text";
import Animations from "./components/animations";
import MediaInfo from "./components/media-info";
import ObjectFit from "./components/object-fit";
import TextStyle from "./components/text-style";

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
    return (
      <div className="h-full overflow-y-auto p-4">
        <p className="font-medium mb-4">Text Properties</p>
        <div className="space-y-4">
          {/* Font Properties */}
          <p className="text-sm font-medium">Font Properties</p>
          <div className="grid grid-cols-2 gap-2">
            <FontSize />
            <FontFamily />
          </div>
          <TextColor />
          <BackgroundColor />
          <TextAlignment />
          {/* Text Style */}
          <p className="text-sm font-medium">Text Style</p>
          <TextStyle />
          {/* Animation */}
          <p className="text-sm font-medium">Animations</p>
          <Animations />
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full overflow-y-auto p-4">
        <h3 className="font-medium mb-4">Media Properties</h3>
        <div className="space-y-4">
          {/* Media Info */}
          <p className="text-sm font-medium">Media Information</p>
          <MediaInfo />
          {/* Fit */}
          <p className="text-sm font-medium">Display Options</p>
          <ObjectFit />
          {/* Alt Text */}
          <AltText />
          <Animations />
        </div>
      </div>
    );
  }
}
