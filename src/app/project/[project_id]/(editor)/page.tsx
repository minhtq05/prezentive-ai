"use client";

import KeyboardEventHandler from "@/components/keyboard-event-handler";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useParams } from "next/navigation";

// Import our extracted components
import EditorLayout from "./components/editor-layout";
import EditorSidebar from "./components/editor-sidebar";
import useProjectUpdateEffect from "./hooks/use-project-update-effect";

/**
 * Main editor page component for the presentation project
 * Organizes the UI layout and loads project data
 */
export default function ProjectEditorPage() {
  const { project_id: projectId } = useParams<{ project_id: string }>();

  // Initialize project data and set up auto-save
  useProjectUpdateEffect(projectId);

  return (
    <div className="w-screen h-screen flex flex-col">
      <Tabs defaultValue="editor" className="flex flex-row gap-0 w-full h-full">
        {/* Left sidebar with navigation icons */}
        <EditorSidebar />

        <Separator orientation="vertical" />

        {/* Main editor tab content */}
        <TabsContent
          value="editor"
          className="flex-auto flex flex-col overflow-auto"
        >
          <EditorLayout />
        </TabsContent>

        {/* Media vault tab content - placeholder for now */}
        <TabsContent value="media-vault" className="flex flex-col items-center">
          Nothing&apos;s here yet
        </TabsContent>
      </Tabs>

      {/* Global keyboard shortcuts handler */}
      <KeyboardEventHandler />
    </div>
  );
}
