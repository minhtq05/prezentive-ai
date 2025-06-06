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
    <Menubar className="shadow-none border-none h-12 w-12 p-0">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="h-full w-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground active:bg-primary active:text-primary-foreground"
          >
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
