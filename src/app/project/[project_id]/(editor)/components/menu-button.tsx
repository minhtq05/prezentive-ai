import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Layers2 } from "lucide-react";
import Link from "next/link";

export default function MenuButton() {
  return (
    <Menubar className="size-14 border-none p-1">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="ghost" className="size-full">
            <Layers2 />
          </Button>
        </MenubarTrigger>
        <MenubarContent className="ml-2">
          <MenubarItem>
            <Link href="/dashboard/projects">Back to projects</Link>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Files</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>New project</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Edit</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Undo</MenubarItem>
              <MenubarItem>Redo</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
