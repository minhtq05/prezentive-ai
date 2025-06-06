import { Button } from "@/components/ui/button";
import useScenesStore from "@/store/scenes-store";
import { Film as VideoIcon } from "lucide-react";
import { useState } from "react";
import AddMediaDialog from "./add-media-dialog";

export interface AddVideoButtonProps {
  handleMediaUpload: (mediaType: "image" | "video", src: string) => void;
}

export default function AddVideoButton({
  handleMediaUpload,
}: AddVideoButtonProps) {
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);

  const [isOpen, setIsOpen] = useState(false);

  const handleAddVideo = () => {
    if (!selectedSceneId) return;
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAddVideo}
        disabled={!selectedSceneId}
        className="size-12 flex flex-col items-center justify-center gap-0.5"
      >
        <VideoIcon />
        <span className="text-xs leading-none">Video</span>
      </Button>
      <AddMediaDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        mediaType="video"
        onUpload={(src) => handleMediaUpload("video", src)}
      />
    </>
  );
}
