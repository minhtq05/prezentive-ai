import useOverlayStore from "@/store/project/overlay-store";
import { SceneMedia } from "@/types/scenes";

export default function MediaInfo() {
  const objectOverlay = useOverlayStore((state) => state.overlayObject);

  const mediaObject = objectOverlay as SceneMedia;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs">
        <div className="font-medium">Type:</div>
        <div className="capitalize italic">{mediaObject.mediaType}</div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div className="font-medium">Dimensions:</div>
        <div className="italic">
          {mediaObject.width} × {mediaObject.height}px
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div className="font-medium">Alt Text:</div>
        <div className="italic">{`"${mediaObject.alt}"`}</div>
      </div>
    </div>
  );
}
