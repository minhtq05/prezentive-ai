"use client";

import ElementHeader from "@/components/element-header";
import KeyboardEventHandler from "@/components/keyboard-event-handler";
import PropertiesPanel from "@/components/properties-panel";
import RemotionPlayer from "@/components/remotion-player";
import ScenesSidebar from "@/components/scenes-sidebar";
import { SeekBar } from "@/components/seek-bar";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useEditorStore from "@/store/editor-store";
import useScenesStore from "@/store/scenes-store";
import { useDebounce } from "@uidotdev/usehooks";
import { Box, Image, Layers2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getProjectById, updateProjectElements } from "./actions";

export default function ProjectEditorPage() {
  const { project_id: projectId } = useParams<{ project_id: string }>();
  const scenesIsUpdating = useScenesStore((state) => state.scenesIsUpdating);

  useProjectUpdateEffect(projectId);

  return (
    <div className="w-screen h-screen flex flex-col">
      <Tabs defaultValue="editor" className="flex flex-row gap-0 w-full h-full">
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
        <Separator orientation="vertical" />
        <TabsContent
          value="editor"
          className="flex-auto flex flex-col overflow-auto"
        >
          <header className="flex flex-row h-14">
            <ElementHeader />
            {scenesIsUpdating && (
              <div className="flex items-center justify-center gap-1 w-14 h-14 text-sm text-primary">
                Saving...
              </div>
            )}
          </header>

          <Separator />

          <div className="flex-1 flex flex-row justify-center items-center overflow-hidden">
            <div className="flex-none w-fit h-full">
              <ScenesSidebar />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-1 flex flex-col overflow-y-scroll relative h-full items-center justify-center">
              <RemotionPlayer />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-none w-80 h-full overflow-y-auto">
              <PropertiesPanel />
            </div>
          </div>

          <Separator orientation="horizontal" />

          <div className="flex flex-col relative h-72 overflow-auto">
            <SeekBar />
          </div>
        </TabsContent>
        <TabsContent value="media-vault" className="flex flex-col items-center">
          Nothing&apos;s here yet
        </TabsContent>
      </Tabs>
      <KeyboardEventHandler />
    </div>
  );
}

function useProjectUpdateEffect(projectId: string) {
  const scenes = useScenesStore((state) => state.scenes);
  const fillScenes = useScenesStore((state) => state.fillScenes);
  const scenesNonce = useScenesStore((state) => state.scenesNonce);
  const setScenesIsUpdating = useScenesStore(
    (state) => state.setScenesIsUpdating
  );
  const debouncedScenesNonce = useDebounce(scenesNonce, 300);

  const resetForNewProject = useEditorStore(
    (state) => state.resetForNewProject
  );

  useEffect(() => {
    // Use the editor store's resetForNewProject function
    resetForNewProject(projectId);

    // Fetch project data or perform any setup needed for the project
    const fetchProjectById = async () => {
      const project = await getProjectById(projectId);
      if (!project) {
        console.error("Failed to fetch project data");
        return;
      }
      try {
        fillScenes(JSON.parse(project.elements));
      } catch (error) {
        console.error("Error parsing project elements:", error);
      }
    };
    if (projectId !== undefined) {
      fetchProjectById();
    }
  }, [projectId, resetForNewProject]);

  useEffect(() => {
    setScenesIsUpdating(true);
    updateProjectElements(projectId, JSON.stringify(scenes)).finally(() => {
      setScenesIsUpdating(false);
    });
  }, [debouncedScenesNonce]);
}

function MenuButton() {
  return (
    <Menubar className="shadow-none border-none h-14 w-14 p-0">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="h-14 w-14 flex items-center justify-center rounded-none"
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
