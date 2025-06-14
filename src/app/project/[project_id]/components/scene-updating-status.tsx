import useScenesStore from "@/store/scenes-store";

export default function SceneUpdatingStatus() {
  const scenesIsUpdating = useScenesStore((state) => state.scenesIsUpdating);

  return (
    scenesIsUpdating && (
      <div className="flex items-center justify-center gap-1 w-14 h-14 text-sm text-primary">
        Saving...
      </div>
    )
  );
}
