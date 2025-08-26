import { projectsApi, renderApi, scenesApi } from "@/lib/api";
import { RenderedVideo, Scene, SceneElement } from "@/types/editor";
import { Project, ProjectOrientation } from "@/types/projects";
import { PlayerRef } from "@remotion/player";
import { Editor } from "@tiptap/react";
import { createRef, RefObject } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { createComputed } from "zustand-computed";
import { devtools } from "zustand/middleware";

const api = {
  fetchScenesFromProject: scenesApi.fetchScenesFromProject,
  fetchProjectMetadata: projectsApi.fetchProject,
  fetchProjectOrientation: scenesApi.fetchProjectOrientation,
  addScene: scenesApi.addScene,
  deleteScene: scenesApi.deleteScene,
  addElementToScene: scenesApi.addElementToScene,
  updateElement: scenesApi.updateElement,
  deleteElement: scenesApi.deleteElement,
  renderProject: renderApi.renderProject,
  fetchRenderedVideos: renderApi.fetchRenderedVideos,
};

interface EditorStore {
  isInitializing: boolean;

  project: Project | null;
  metadata: Omit<Project, "id" | "userId"> | null;
  orientation: Omit<ProjectOrientation, "id" | "userId"> | null;
  scenes: Scene[];

  playerRef: RefObject<PlayerRef>;

  frame: number;
  playing: boolean;

  enableAnimations: boolean;

  selectedObject: SceneElement | null;

  overlay: SceneElement | null;
  setOverlay: (overlay: SceneElement | null) => void;

  richTextEditor: Editor | null;

  tab: string | null;

  renderedVideos: RenderedVideo[] | null;

  initializeProject: (id: string) => Promise<void>;
  setPlayerRefElement: (playerRef: PlayerRef | null) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;

  addScene: (scene: Omit<Scene, "id">, index?: number) => void;
  deleteScene: (sceneId: string) => void;
  addElementToScene: (
    sceneId: string,
    element: Omit<SceneElement, "id">
  ) => void;

  updateElementInScene: (
    sceneId: string,
    elementId: string,
    updates: Partial<SceneElement>
  ) => void;

  deleteElementFromScene: (elementId: string) => void;

  selectObject: (object: SceneElement | null) => void;

  setRichTextEditor: (editor: Editor | null) => void;

  seekTo: (frame: number) => void;
  seekToScene: (sceneNumber: number) => void;

  setEnableAnimations: (enable: boolean) => void;
  setTab: (tab: string | null) => void;

  renderProject: () => Promise<void>;

  loadRenderedVideos: () => Promise<void>;
}

interface EditorComputedStore {
  durationInSeconds: number;
  currentSceneNumber: number | null;
  currentScene: Scene | null;
}

const computed = createComputed(
  (state: EditorStore): EditorComputedStore => ({
    durationInSeconds: state.scenes.reduce(
      (acc, scene) => acc + scene.durationInSeconds,
      0
    ),

    currentSceneNumber: (() => {
      let sum = 0;

      const { frame, orientation } = state;
      if (frame === null || orientation === null) return null;

      const { fps } = orientation;

      for (let i = 0; i < state.scenes.length; i++) {
        const scene = state.scenes[i];
        sum += scene.durationInSeconds * fps;

        if (sum >= frame) {
          return i;
        }
      }
      return null;
    })(),

    currentScene: (() => {
      let sum = 0;

      const { frame, orientation } = state;
      if (frame === null || orientation === null) return null;

      const { fps } = orientation;

      for (let i = 0; i < state.scenes.length; i++) {
        const scene = state.scenes[i];
        sum += scene.durationInSeconds * fps;

        if (sum >= frame) {
          return scene;
        }
      }
      return null;
    })(),
  })
);

export const useEditorStore = create<EditorStore>()(
  devtools(
    computed((set, get) => ({
      isInitializing: false,

      project: null,
      metadata: null,
      orientation: null,
      fps: 0,
      width: 0,
      height: 0,

      scenes: [],
      currentSceneNumber: 0,

      playerRef: createRef<PlayerRef>(),

      frame: 0,
      playing: false,

      enableAnimations: false,

      selectedObject: null,

      overlay: null,

      richTextEditor: null,

      tab: null,

      renderedVideos: null,

      initializeProject: async (projectId) => {
        set({ isInitializing: true });
        try {
          const project = await api.fetchProjectMetadata(projectId);
          const orientation = await api.fetchProjectOrientation(projectId);
          const scenes = await api.fetchScenesFromProject(projectId);
          set({
            project: project,
            metadata: { ...project },
            orientation: { ...orientation },
            scenes,
          });
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load project"
          );
        } finally {
          set({
            isInitializing: false,
          });
        }
      },

      setPlayerRefElement: (playerRef) => {
        if (!playerRef) {
          return;
        }
        const newRef = createRef<PlayerRef>();
        newRef.current = playerRef;
        set({ playerRef: newRef });
      },

      play: () => {
        get().selectObject(null);
        get().playerRef.current.play();
      },

      pause: () => {
        get().selectObject(null);
        get().playerRef.current.pause();
      },

      toggle: () => {
        get().selectObject(null);
        set({ enableAnimations: true });
        get().playerRef.current.toggle();
      },

      addScene: async (scene, index) => {
        try {
          const newScene = { ...scene, id: `scenes_${uuidv4()}` };
          set((state) => ({
            scenes: index
              ? state.scenes
                  .slice(0, index)
                  .concat(newScene)
                  .concat(state.scenes.slice(index))
              : [...state.scenes, newScene],
          }));
          await api.addScene(get().project.id, newScene, index);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to add scene"
          );
        }
      },

      deleteScene: async (sceneId) => {
        try {
          const state = get();
          const { scenes, currentSceneNumber } = state;

          // Find the index of the scene being deleted
          const deletedSceneIndex = scenes.findIndex(
            (scene) => scene.id === sceneId
          );

          // Update the local state first (optimistic update)
          set((state) => ({
            scenes: state.scenes.filter((scene) => scene.id !== sceneId),
          }));

          // Handle seeking if the current scene is being deleted
          if (currentSceneNumber === deletedSceneIndex) {
            const updatedScenes = scenes.filter(
              (scene) => scene.id !== sceneId
            );

            if (updatedScenes.length > 0) {
              // If there's a next scene at the same index, seek to it
              if (deletedSceneIndex < updatedScenes.length) {
                get().seekToScene(deletedSceneIndex);
              }
              // Otherwise, seek to the previous scene
              else if (deletedSceneIndex > 0) {
                get().seekToScene(deletedSceneIndex - 1);
              }
              // If it was the only scene, seek to the beginning
              else {
                get().seekToScene(0);
              }
            } else {
              get().seekTo(0); // No scenes left, reset frame
            }
          }

          // Then sync with the server
          await api.deleteScene(sceneId);
        } catch (error) {
          // Restore original scenes by re-fetching from project
          const projectId = get().project?.id;
          if (projectId) {
            try {
              const scenes = await api.fetchScenesFromProject(projectId);
              set({ scenes });
            } catch {
              // If refetch fails, show error
            }
          }
          toast.error(
            error instanceof Error ? error.message : "Failed to delete scene"
          );
        }
      },

      addElementToScene: async (sceneId, element) => {
        try {
          const newElement = { ...element, id: `scene_elements_${uuidv4()}` };

          // Update the local state first
          set((state) => ({
            scenes: state.scenes.map((scene) =>
              scene.id === sceneId
                ? {
                    ...scene,
                    sceneElements: [...scene.sceneElements, newElement],
                  }
                : scene
            ),
          }));

          // Then sync with the server
          await api.addElementToScene(sceneId, newElement);
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to add element to scene"
          );
          // Revert the local state on error by removing the element we just added
          set((state) => ({
            scenes: state.scenes.map((scene) =>
              scene.id === sceneId
                ? {
                    ...scene,
                    sceneElements: scene.sceneElements.slice(0, -1), // Remove the last element
                  }
                : scene
            ),
          }));
        }
      },

      updateElementInScene: (sceneId, elementId, updates) => {
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  sceneElements: scene.sceneElements.map((element) =>
                    element.id === elementId
                      ? { ...element, ...updates }
                      : element
                  ),
                }
              : scene
          ),
        }));

        // Sync with server
        api.updateElement(elementId, updates).catch((error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to update element"
          );
          // TODO: Consider reverting the local state on error
        });
      },

      deleteElementFromScene: async (elementId) => {
        try {
          // Clear selectedObject if it's the element being deleted
          const state = get();
          if (state.selectedObject?.id === elementId) {
            set({ selectedObject: null });
          }

          // Update the local state first (optimistic update)
          set((state) => ({
            scenes: state.scenes.map((scene) => ({
              ...scene,
              sceneElements: scene.sceneElements.filter(
                (element) => element.id !== elementId
              ),
            })),
          }));

          // Then sync with the server
          await api.deleteElement(elementId);
        } catch (error) {
          // Re-fetch scenes from project to ensure data consistency
          const projectId = get().project?.id;
          if (projectId) {
            try {
              const scenes = await api.fetchScenesFromProject(projectId);
              set({ scenes });
            } catch {
              // If refetch fails, keep current state
            }
          }
          toast.error(
            error instanceof Error ? error.message : "Failed to delete element"
          );
        }
      },

      selectObject: (object) => {
        set({ selectedObject: object });
      },

      setRichTextEditor: (editor) => {
        set({ richTextEditor: editor });
      },

      setOverlay: (overlay) => {
        set({ overlay });
      },

      seekTo: (frame) => {
        get().selectObject(null);
        set({ enableAnimations: true });
        get().playerRef.current.seekTo(frame);
      },

      seekToScene: (sceneNumber) => {
        const state = get();
        const { scenes, orientation } = state;

        if (!orientation || sceneNumber < 0 || sceneNumber >= scenes.length) {
          return;
        }

        // Sum durations from scenes[0] to scenes[sceneNumber - 1]
        let totalDuration = 0;
        for (let i = 0; i < sceneNumber; i++) {
          totalDuration += scenes[i].durationInSeconds;
        }

        // Calculate frame = totalDuration * fps
        const targetFrame = totalDuration * orientation.fps;

        // Update frame state and seek player
        get().seekTo(targetFrame);
      },

      setEnableAnimations: (enable: boolean) => {
        set({ enableAnimations: enable });
      },

      setTab: (tab: string | null) => {
        set({ tab });
      },

      renderProject: async () => {
        const renderPromise = async () => {
          const projectId = get().project?.id;
          if (!projectId) {
            throw new Error("No project selected");
          }
          await api.renderProject(projectId);
          set({ renderedVideos: null });
          await get().loadRenderedVideos();
        };

        toast.promise(renderPromise(), {
          loading: "Rendering project...",
          success: "Render completed successfully!",
          error: (error) =>
            error instanceof Error ? error.message : "Failed to render project",
        });
      },

      loadRenderedVideos: async () => {
        try {
          const projectId = get().project?.id;
          if (!projectId) {
            toast.error("No project selected");
            return;
          }
          const renderedVideos = await api.fetchRenderedVideos(projectId);
          set({ renderedVideos });
        } catch (error) {
          set({ renderedVideos: [] });
          toast.error(error.message || "Failed to load rendered videos");
        }
      },
    })),
    {
      name: "editor-store",
    }
  )
);
