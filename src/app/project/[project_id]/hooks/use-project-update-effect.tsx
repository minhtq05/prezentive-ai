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
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId
  );
  const setCurrentProjectInfo = useEditorStore(
    (state) => state.setCurrentProjectInfo
  );
  const reset = useEditorStore((state) => state.reset);

  useEffect(() => {
    // Use the editor store's reset function
    setCurrentProjectId(projectId);

    // Fetch project data or perform any setup needed for the project
    const fetchProjectById = async () => {
      const project = await getProjectById(projectId);
      if (!project) {
        console.error("Failed to fetch project data");
        return;
      }
      setCurrentProjectInfo({
        id: project.id,
        name: project.name,
        description: project.description,
        created_at: project.created_at,
        modified_at: project.modified_at,
      });
      try {
        fillScenes(JSON.parse(project.elements));
      } catch (error) {
        console.error("Error parsing project elements:", error);
      }
    };
    fetchProjectById();

    return () => {
      reset();
    };
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
