"use client";

import ElementSidebar from "@/components/element-sidebar";
import KeyboardEventHandler from "@/components/keyboard-event-handler";
import PropertiesPanel from "@/components/properties-panel";
import RemotionPlayer from "@/components/remotion-player";
import ScenesSidebar from "@/components/scenes-sidebar";
import { SeekBar } from "@/components/seek-bar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useScenesStore from "@/store/scenes-store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProjectById, updateProjectElements } from "./actions";

export default function Home() {
  const { project_id: projectId } = useParams<{ project_id: string }>();
  const scenes = useScenesStore((state) => state.scenes);
  const fillScenes = useScenesStore((state) => state.fillScenes);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Fetch project data or perform any setup needed for the project
    const fetchProjectById = async () => {
      const project = await getProjectById(projectId);
      if (!project) {
        console.error("Failed to fetch project data");
        return;
      }
      console.log("Project data:", project.elements);
      // Handle the project data as needed
      try {
        fillScenes(JSON.parse(project.elements));
      } catch (error) {
        console.error("Error parsing project elements:", error);
      }
    };
    if (projectId !== undefined) {
      fetchProjectById();
    }
  }, [projectId]);

  useEffect(() => {
    setIsUpdating(true);
    updateProjectElements(projectId, JSON.stringify(scenes)).finally(() => {
      setIsUpdating(false);
    });
  }, [scenes]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <Tabs defaultValue="editor" className="gap-0 w-full h-full">
        <header className="flex justify-center items-center h-12">
          {isUpdating ? "true" : "false"}
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="media-vault">Media Vault</TabsTrigger>
          </TabsList>
        </header>
        <Separator orientation="horizontal" />
        <TabsContent
          value="editor"
          className="flex-1 flex flex-col overflow-auto"
        >
          <div className="flex-1 flex flex-row justify-center items-center overflow-auto">
            <div className="w-16 flex flex-col h-full">
              <ElementSidebar />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-none w-[20%] h-full">
              <ScenesSidebar />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-1 flex flex-col overflow-y-scroll relative h-full items-center justify-center">
              <RemotionPlayer />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-none w-[20%] h-full overflow-y-auto">
              <PropertiesPanel />
            </div>
          </div>
          <Separator orientation="horizontal" />
          <div className="flex flex-col relative min-h-[300px]">
            <SeekBar />
          </div>
          {/* <SeekBar playerRef={playerRef} durationInFrames={durationInFrames} /> */}
        </TabsContent>
        <TabsContent value="media-vault" className="flex flex-col items-center">
          Nothing&apos;s here yet
        </TabsContent>
      </Tabs>
      <KeyboardEventHandler />
    </div>
  );
}
