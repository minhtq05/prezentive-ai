import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useOverlayStore from "@/store/project/overlay-store";
import { SceneText } from "@/types/scenes";
import {
  CaseLower,
  CaseSensitive,
  CaseUpper,
  MoreHorizontal,
  Type,
} from "lucide-react";

export default function TextTransformMenu() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  const textObject = objectOverlay as SceneText;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {/* Text Transform Controls */}
          <DropdownMenuItem
            onClick={() =>
              updateOverlayProperty<SceneText, "textTransform">(
                "textTransform",
                "none"
              )
            }
            className={textObject.textTransform === "none" ? "bg-accent" : ""}
          >
            <CaseSensitive className="h-4 w-4 mr-2" />
            Normal Case
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              updateOverlayProperty<SceneText, "textTransform">(
                "textTransform",
                "uppercase"
              )
            }
            className={
              textObject.textTransform === "uppercase" ? "bg-accent" : ""
            }
          >
            <CaseUpper className="h-4 w-4 mr-2" />
            UPPERCASE
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              updateOverlayProperty<SceneText, "textTransform">(
                "textTransform",
                "lowercase"
              )
            }
            className={
              textObject.textTransform === "lowercase" ? "bg-accent" : ""
            }
          >
            <CaseLower className="h-4 w-4 mr-2" />
            lowercase
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              updateOverlayProperty<SceneText, "textTransform">(
                "textTransform",
                "capitalize"
              )
            }
            className={
              textObject.textTransform === "capitalize" ? "bg-accent" : ""
            }
          >
            <Type className="h-4 w-4 mr-2" />
            Capitalize
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
