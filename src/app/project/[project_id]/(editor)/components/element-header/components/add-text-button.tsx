import { Button } from "@/components/ui/button";
import useScenesStore from "@/store/scenes-store";
import { Type as TextIcon } from "lucide-react";

export interface AddTextButtonProps {
  handleAddText: () => void;
}

export default function AddTextButton({ handleAddText }: AddTextButtonProps) {
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleAddText}
      disabled={!selectedSceneId}
      className="h-12 w-12 flex items-center justify-center"
    >
      <TextIcon />
    </Button>
  );
}
