"use client";

import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import {
  ElementSidebar,
  MenuButton,
  PropertiesPanel,
  RemotionPlayer,
  ScenesSidebar,
  SceneUpdatingStatus,
  SeekBar,
} from "./components";
import { useHandleKeyboardEvent, useProjectUpdateEffect } from "./hooks";

export default function ProjectEditorPage() {
  const { project_id: projectId } = useParams<{ project_id: string }>();

  // Initialize project data and set up auto-save
  useProjectUpdateEffect(projectId);
  useHandleKeyboardEvent();

  return (
    <div className="size-full flex">
      <div className="w-14 gap-[1px]">
        <MenuButton />
        <Separator />
        <ElementSidebar />
      </div>
      <Separator orientation="vertical" />
      <div className="flex-auto flex flex-col overflow-auto">
        <div className="flex flex-row items-center h-14 p-2">
          <SceneUpdatingStatus />
        </div>
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
      </div>
    </div>
  );
}
