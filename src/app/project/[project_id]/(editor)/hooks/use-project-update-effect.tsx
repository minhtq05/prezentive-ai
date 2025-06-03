"use client";

import useEditorStore from "@/store/editor-store";
import useScenesStore from "@/store/scenes-store";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { getProjectById, updateProjectElements } from "../actions";

export default function useProjectUpdateEffect(projectId: string) {
  const scenes = useScenesStore((state) => state.scenes);
  const fillScenes = useScenesStore((state) => state.fillScenes);
  const scenesNonce = useScenesStore((state) => state.scenesNonce);
  const setScenesIsUpdating = useScenesStore(
    (state) => state.setScenesIsUpdating
  );
  const debouncedScenesNonce = useDebounce(scenesNonce, 300);

  const isFirstRender = useEditorStore((state) => state.isFirstRender);
  const setIsFirstRender = useEditorStore((state) => state.setIsFirstRender);
  const resetForNewProject = useEditorStore(
    (state) => state.resetNewProjectState
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
  }, [projectId]);

  useEffect(() => {
    if (isFirstRender || debouncedScenesNonce === 0) {
      setIsFirstRender(false);
      return;
    }
    setScenesIsUpdating(true);
    updateProjectElements(projectId, JSON.stringify(scenes)).finally(() => {
      setScenesIsUpdating(false);
    });
  }, [debouncedScenesNonce]);
}
