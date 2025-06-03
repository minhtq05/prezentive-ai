import { Separator } from "@/components/ui/separator";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Image } from "lucide-react";
import MenuButton from "./menu-button";

export default function EditorSidebar() {
  return (
    <div className="flex flex-col w-14 h-full justify-start">
      <MenuButton />

      <Separator />

      <TabsList
        variant="editor"
        className="flex flex-col w-14 h-full justify-start"
      >
        <div className="h-14 w-14">
          <TabsTrigger
            variant="editor"
            value="editor"
            className="h-full w-full text-pretty whitespace-normal"
          >
            <Box />
          </TabsTrigger>
        </div>

        <div className="h-14 w-14">
          <TabsTrigger
            variant="editor"
            value="media-vault"
            className="h-full w-full text-pretty whitespace-normal"
          >
            <Image />
          </TabsTrigger>
        </div>
      </TabsList>
    </div>
  );
}
