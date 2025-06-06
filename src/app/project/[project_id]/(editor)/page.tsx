"use client";

import { useParams } from "next/navigation";
import { EditorLayout, KeyboardEventHandler } from "./components";
import useProjectUpdateEffect from "./hooks/use-project-update-effect";

export default function ProjectEditorPage() {
  const { project_id: projectId } = useParams<{ project_id: string }>();

  // Initialize project data and set up auto-save
  useProjectUpdateEffect(projectId);

  return (
    <div className="w-screen h-screen flex flex-col">
      <EditorLayout />
      {/* Global keyboard shortcuts handler */}
      <KeyboardEventHandler />
    </div>
  );
}
