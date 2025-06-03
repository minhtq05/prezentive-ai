import { Scene, SceneComponent, SceneText } from "@/types/scenes";
import { getTime } from "@/utils/time";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import useOverlayStore from "./overlay-store";

// TODO: add server action to update project data when scenes change

const scenesStoreInitialState: ScenesStoreState = {
  scenes: [],
  selectedSceneId: null,
  selectedObjectId: null,
  scenesNonce: 0,
  scenesIsUpdating: false,
};

export type ScenesStoreState = {
  scenes: Scene[];
  selectedSceneId: string | null;
  selectedObjectId: string | null;
  scenesNonce: number;
  scenesIsUpdating: boolean;
};

export type ScenesStoreActions = {
  fillScenes: (scenes: Scene[]) => void;
  addScene: (scene: Scene) => void;
  deleteScene: (id: string) => void;
  setScenesIsUpdating: (updating: boolean) => void;
  selectScene: (id: string | null) => void;
  selectObject: (id: string | null) => void;
  _getSelectedObject: () => SceneComponent | null;
  commitOverlayChanges: () => void;
  deleteSelectedComponent: () => void;
  updateSceneInfo: (
    id: string,
    title: string,
    durationInFrames: number
  ) => void;
  reset: () => void;
};

export type ScenesStore = ScenesStoreState & ScenesStoreActions;

const useScenesStore = create<ScenesStore>()(
  subscribeWithSelector((set, get) => ({
    ...scenesStoreInitialState,

    // First render, fill scenes with data fetched from the project
    fillScenes: (scenes: Scene[]) => {
      set({ scenes });
    },

    // User added scene, must POST update project data.
    addScene: (scene) => {
      set((state) => ({
        scenesNonce: Math.max(state.scenesNonce + 1, getTime()),
        scenes: [...state.scenes, scene],
      }));
    },

    // User deleted scene, must POST update project data.
    deleteScene: (id) =>
      set((state) => ({
        scenesNonce: Math.max(state.scenesNonce + 1, getTime()),
        scenes: state.scenes.filter((scene) => scene.id !== id),
      })),

    setScenesIsUpdating: (updating) => {
      set(() => ({
        scenesIsUpdating: updating,
      }));
    },

    selectScene: (id) => {
      // Commit any pending changes before changing scenes
      get().commitOverlayChanges();

      set(() => ({
        selectedSceneId: id,
        selectedObjectId: null, // Reset selected object when changing scenes
      }));

      // Hide the overlay when changing scenes
      useOverlayStore.getState().hideOverlay();
    },

    selectObject: (id) => {
      // Commit any pending changes before selecting a new object
      get().commitOverlayChanges();

      set(() => ({
        selectedObjectId: id,
      }));

      // Show overlay for the new selected object
      if (id) {
        const selectedObject = get()._getSelectedObject();
        // console.log("Selected Object:", id, selectedObject);
        if (selectedObject) {
          useOverlayStore.getState().showOverlay(selectedObject as SceneText);
        }
      } else {
        useOverlayStore.getState().hideOverlay();
      }
    },

    _getSelectedObject: () => {
      const state = get();
      const selectedScene = state.scenes.find(
        (scene) => scene.id === state.selectedSceneId
      );
      if (!selectedScene || !state.selectedObjectId) return null;
      return (
        selectedScene.components.find(
          (component) => component.id === state.selectedObjectId
        ) || null
      );
    },

    // Commit changes from the overlay to the selected component, must POST update project data.
    commitOverlayChanges: () => {
      const { visibleOverlayId, getOverlayData } = useOverlayStore.getState();
      const state = get();

      if (
        !visibleOverlayId ||
        !state.selectedObjectId ||
        visibleOverlayId !== state.selectedObjectId
      ) {
        return; // No overlay to commit or mismatch in selected object
      }

      const overlayData = getOverlayData();
      if (!overlayData) return;

      // Find the scene and component to update
      const selectedSceneIndex = state.scenes.findIndex(
        (scene) => scene.id === state.selectedSceneId
      );

      if (selectedSceneIndex === -1) return;

      const selectedScene = state.scenes[selectedSceneIndex];
      const componentIndex = selectedScene.components.findIndex(
        (component) => component.id === state.selectedObjectId
      );

      if (componentIndex === -1) return;

      // Create a new array of scenes with the updated component from overlay
      set((state) => {
        const updatedScenes = [...state.scenes];
        const updatedComponents = [
          ...selectedScene.components.slice(0, componentIndex),
          ...selectedScene.components.slice(componentIndex + 1),
        ];

        // Add the updated component with all overlay properties on top of the existing components for rendering
        updatedComponents.push(overlayData);

        updatedScenes[selectedSceneIndex] = {
          ...selectedScene,
          components: updatedComponents,
        };

        return {
          ...state,
          scenesNonce: Math.max(state.scenesNonce + 1, getTime()),
          scenes: updatedScenes,
        };
      });
    },

    // Delete the selected component from the selected scene, must POST update project data.
    deleteSelectedComponent: () => {
      const state = get();
      const { selectedSceneId, selectedObjectId } = state;

      // If no scene or object is selected, do nothing
      if (!selectedSceneId || !selectedObjectId) return;

      // Find the scene that contains the selected component
      const selectedSceneIndex = state.scenes.findIndex(
        (scene) => scene.id === selectedSceneId
      );

      if (selectedSceneIndex === -1) return;

      const selectedScene = state.scenes[selectedSceneIndex];

      // Filter out the selected component
      const updatedComponents = selectedScene.components.filter(
        (component) => component.id !== selectedObjectId
      );

      // Update the scenes array with the new components
      set((state) => {
        const updatedScenes = [...state.scenes];
        updatedScenes[selectedSceneIndex] = {
          ...selectedScene,
          components: updatedComponents,
        };

        return {
          ...state,
          scenesNonce: Math.max(state.scenesNonce + 1, getTime()),
          scenes: updatedScenes,
          selectedObjectId: null, // Clear the selected object
        };
      });

      // Hide the overlay
      useOverlayStore.getState().hideOverlay();
    },

    // User updates scene information and ensure components' "to" property is capped to the new duration
    // Must POST update project data.
    updateSceneInfo: (id, title, durationInFrames) => {
      set((state) => {
        const sceneIndex = state.scenes.findIndex((scene) => scene.id === id);
        if (sceneIndex === -1) return state;

        const updatedScene = {
          ...state.scenes[sceneIndex],
          title,
          durationInFrames,
        };

        // Cap the "to" property of each component to the new duration
        updatedScene.components = updatedScene.components.map((component) => ({
          ...component,
          to: Math.min(component.to || durationInFrames, durationInFrames),
        }));

        const updatedScenes = [...state.scenes];
        updatedScenes[sceneIndex] = updatedScene;

        return {
          ...state,
          scenesNonce: Math.max(state.scenesNonce + 1, getTime()),
          scenes: updatedScenes,
        };
      });
    },

    reset: () => set(scenesStoreInitialState),
  }))
);

export default useScenesStore;
