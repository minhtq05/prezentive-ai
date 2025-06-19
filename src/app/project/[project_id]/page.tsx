"use client";

import Loader from "@/components/loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import useEditorStore from "@/store/project/editor-store";
import { useParams } from "next/navigation";
import {
  ElementSidebar,
  MenuButton,
  ProjectHeader,
  PropertiesPanel,
  RemotionPlayer,
  ScenesSidebar,
  SeekBar,
} from "./components";
import { useHandleKeyboardEvent, useProjectUpdateEffect } from "./hooks";

export default function ProjectEditorPage() {
  const { project_id: projectId } = useParams<{ project_id: string }>();

  const projectLoaded = useEditorStore((state) => state.loaded);
  // Initialize project data and set up auto-save
  useProjectUpdateEffect(projectId);
  useHandleKeyboardEvent();

  return (
    <div className="size-full flex">
      {!projectLoaded ? (
        <Loader size="lg" />
      ) : (
        <>
          <div className="w-16 h-full gap-[1px]">
            <MenuButton />
            <Separator />
            <ElementSidebar />
          </div>
          <Separator orientation="vertical" />
          <div className="flex-auto flex flex-col overflow-auto">
            <div className="flex-none flex items-center h-16 py-2 px-4">
              <ProjectHeader />
            </div>
            <Separator />
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel
                    defaultSize={14}
                    minSize={14}
                    maxSize={20}
                    className="min-w-50"
                  >
                    <PropertiesPanel />
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel
                    defaultSize={60}
                    className="flex items-center justify-center"
                  >
                    <RemotionPlayer />
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel
                    defaultSize={14}
                    minSize={12}
                    maxSize={18}
                    className="min-w-50"
                  >
                    <ScenesSidebar />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={35} minSize={35} maxSize={40}>
                <SeekBar />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </>
      )}
    </div>
  );
}
