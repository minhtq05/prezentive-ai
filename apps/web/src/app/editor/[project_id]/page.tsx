"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useTimeLine from "@/hooks/use-timeline";
import { useEditorStore } from "@/stores/editor-store";
import { useParams } from "next/navigation";
import { startTransition, useEffect } from "react";
import EditorHeader from "./header";
import { EditorPlayer } from "./player";
import Sidebar from "./sidebar";
import EditorTabs from "./tabs";
import EditorTimeline from "./timeline";
import EditorToolbar from "./toolbar";

const EditorPage = () => {
  const _params = useParams<{ project_id: string }>();

  const projectId = useEditorStore((state) => state.project?.id);
  const isInitializing = useEditorStore((state) => state.isInitializing);
  const initializeProject = useEditorStore((state) => state.initializeProject);
  useTimeLine();

  useEffect(() => {
    startTransition(async () => {
      if (!projectId || projectId !== _params.project_id) {
        await initializeProject(_params.project_id);
      }
    });
  }, [_params.project_id, projectId, initializeProject]);

  if (isInitializing) {
    return (
      <div className="size-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (projectId) {
    return (
      <div className="size-full flex">
        <div className="flex-auto flex flex-col overflow-auto">
          <EditorHeader />
          <EditorToolbar />
          <div className="flex-auto flex overflow-auto">
            <div className="flex-auto flex flex-col overflow-auto">
              <ResizablePanelGroup direction="vertical" className="size-full">
                <ResizablePanel defaultSize={70} minSize={20}>
                  <div className="size-full flex items-center justify-center overflow-auto">
                    <EditorPlayer />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} className="p-2 min-h-fit">
                  <EditorTimeline />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
            <EditorTabs />
            <Sidebar />
            {/* <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={10} minSize={8} maxSize={15}>
                <ScenesSidebar />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={70}>
                <EditorPlayer />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
                Properties Panel
              </ResizablePanel>
            </ResizablePanelGroup> */}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="size-full flex items-center justify-center">
        Error while loading project. Please try refreshing the page.
      </div>
    );
  }
};

export default EditorPage;
