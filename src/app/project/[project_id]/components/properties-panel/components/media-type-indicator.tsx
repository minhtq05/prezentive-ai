import useOverlayStore from "@/store/project/overlay-store";
import { SceneMedia } from "@/types/scenes";
import { ImageIcon } from "lucide-react";

export interface MediaTypeIndicatorProps {
  className?: string;
}

export default function MediaTypeIndicator({
  className,
}: MediaTypeIndicatorProps) {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);
  const mediaObject = objectOverlay as SceneMedia;

  return (
    <div className={`flex items-center text-muted-foreground ${className}`}>
      <ImageIcon className="h-4 w-4 mr-1" />
      <span className="text-sm capitalize">{mediaObject.mediaType}</span>
    </div>
  );
}
