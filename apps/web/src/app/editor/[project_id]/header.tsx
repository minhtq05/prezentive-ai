// import {
//   Menubar,
//   MenubarContent,
//   MenubarItem,
//   MenubarMenu,
//   MenubarTrigger,
// } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { Download, GalleryVerticalEnd, Play, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { API_BASE } from "@/lib/api";
import { formatDate } from "@/lib/date";
import { formatBytes } from "@/lib/format";
import { useEditorStore } from "@/stores/editor-store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditorHeader = () => {
  const metadata = useEditorStore((state) => state.metadata);

  return (
    <div className="p-2 flex gap-2 items-center">
      <HomeButton />
      <p className="font-semibold">{metadata.title}</p>
      <div className="ml-auto">
        <RenderButton />
      </div>
      {/* <Menubar className="!p-0 !gap-0 !border-0 shadow-none">
        <MenubarMenu>
          <MenubarTrigger>Insert</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Text</MenubarItem>
            <MenubarItem>Image</MenubarItem>
            <MenubarItem>Video</MenubarItem>
            <MenubarItem>Audio</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar> */}
    </div>
  );
};

function HomeButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="aspect-square" variant="ghost">
          <GalleryVerticalEnd />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Modify Metadata</DropdownMenuItem>
          <DropdownMenuItem>Modify Orientation</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Platform</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href="/projects">
            <DropdownMenuItem>Back to Projects</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RenderButton() {
  const renderedVideos = useEditorStore((state) => state.renderedVideos);
  const loadRenderedVideos = useEditorStore(
    (state) => state.loadRenderedVideos
  );
  const renderProject = useEditorStore((state) => state.renderProject);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    loadRenderedVideos();
  }, [loadRenderedVideos]);

  const handleRenderNew = () => {
    renderProject();
    setIsSheetOpen(false);
  };

  console.log(renderedVideos);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button size="sm">Render</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md p-4 gap-2">
        <p className="flex gap-2 items-center font-semibold text-xl">
          Project Renders
        </p>
        {/* <SheetHeader>
          <SheetTitle>Video Renders</SheetTitle>
        </SheetHeader> */}
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleRenderNew} className="w-full">
            Render New Video
          </Button>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Previous Renders
            </h3>
            {renderedVideos !== null ? (
              <div className="space-y-3">
                {renderedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{video.title}</h4>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Link href={`${API_BASE}/media/${video.filename}`}>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:text-destructive"
                          onClick={() =>
                            toast.error("Function not implemented")
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Date: {formatDate(video.createdAt)}</span>
                        <span>
                          Duration: {video.metadata.durationInSeconds} seconds
                        </span>
                      </div>
                      <div>Size: {formatBytes(video.fileSizeBytes)}</div>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground font-medium">
                  Total size:{" "}
                  {formatBytes(
                    renderedVideos.reduce(
                      (acc, video) => acc + video.fileSizeBytes,
                      0
                    )
                  )}
                </p>
              </div>
            ) : (
              <div>Fetching rendered videos...</div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EditorHeader;
