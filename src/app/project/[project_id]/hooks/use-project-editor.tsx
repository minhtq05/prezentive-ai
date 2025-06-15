"use client";

import useEditorStore from "@/store/project/editor-store";
import useOverlayStore from "@/store/project/overlay-store";
import usePlayerStore from "@/store/project/player-store";
import useScenesStore from "@/store/project/scenes-store";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { getProjectById, updateProjectElements } from "../actions";

export default function useProjectEditor(projectId: string) {
  const scenes = useScenesStore((state) => state.scenes);
  const fillScenes = useScenesStore((state) => state.fillScenes);
  const scenesNonce = useScenesStore((state) => state.scenesNonce);
  const setScenesIsUpdating = useScenesStore(
    (state) => state.setScenesIsUpdating
  );
  const scenesReset = useScenesStore((state) => state.reset);

  const debouncedScenesNonce = useDebounce(scenesNonce, 300);

  const isFirstRender = useEditorStore((state) => state.isFirstRender);
  const setIsFirstRender = useEditorStore((state) => state.setIsFirstRender);
  const setProjectId = useEditorStore((state) => state.setProjectId);
  const setProjectInfo = useEditorStore((state) => state.setProjectInfo);
  const setLoaded = useEditorStore((state) => state.setLoaded);
  const editorReset = useEditorStore((state) => state.reset);

  const overlayReset = useOverlayStore((state) => state.reset);

  const playerReset = usePlayerStore((state) => state.reset);

  useEffect(() => {
    // Use the editor store's reset function
    setProjectId(projectId);

    // Fetch project data or perform any setup needed for the project
    const fetchProjectById = async () => {
      const project = await getProjectById(projectId);
      if (!project) {
        console.error("Failed to fetch project data");
        return;
      }
      setProjectInfo({
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
      setLoaded(true);
    };

    fetchProjectById();

    return () => {
      editorReset();
      scenesReset();
      overlayReset();
      playerReset();
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
