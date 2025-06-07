import { Button } from "@/components/ui/button";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import useScenesStore from "@/store/scenes-store";
import { Type as TextIcon } from "lucide-react";

export interface AddTextButtonProps {
  handleAddText: () => void;
}

export default function AddTextButton({ handleAddText }: AddTextButtonProps) {
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);

  return (
    <MenubarMenu>
      <MenubarTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={!selectedSceneId}
          className="size-12 flex flex-col items-center justify-center gap-1"
        >
          <TextIcon />
          <span className="text-xs leading-none">Text</span>
        </Button>
      </MenubarTrigger>
      <MenubarContent side="right">
        <MenubarItem onSelect={handleAddText}>Heading</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}
