import { Button } from "@/components/ui/button";
import useScenesStore from "@/store/scenes-store";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import AddMediaDialog from "./add-media-dialog";

export interface AddImageButtonProps {
  handleMediaUpload: (mediaType: "image" | "video", src: string) => void;
}

export default function AddImageButton({
  handleMediaUpload,
}: AddImageButtonProps) {
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);

  const [isOpen, setIsOpen] = useState(false);

  const handleAddImage = () => {
    if (!selectedSceneId) return;
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAddImage}
        disabled={!selectedSceneId}
        className="size-12 flex flex-col items-center justify-center gap-0.5"
      >
        <ImageIcon />
        <span className="text-xs leading-none">Image</span>
      </Button>
      <AddMediaDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        mediaType="image"
        onUpload={(src) => handleMediaUpload("image", src)}
      />
    </>
  );
}
