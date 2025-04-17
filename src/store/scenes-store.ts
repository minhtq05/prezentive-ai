import { Scene, SceneComponent, SceneText, SceneMedia } from "@/types/scenes";
import { create } from "zustand";
import { v4 as uuid } from "uuid";
import {
  createSectionTitleLayout,
  createTitleAndContentLayout,
  createTitleAndTwoImagesLayout,
  createTitleLayout,
} from "@/lib/scenes-layout";
import useOverlayStore from "./overlay-store";

export interface ScenesStore {
  scenes: Scene[];
  selectedSceneId: string | null;
  selectedObjectId: string | null;
  addScene: (scene: Scene) => void;
  deleteScene: (id: string) => void;
  selectScene: (id: string | null) => void;
  selectObject: (id: string | null) => void;
  getSelectedObject: () => SceneComponent | null;
  commitOverlayChanges: () => void;
}

const useScenesStore = create<ScenesStore>((set, get) => ({
  scenes: [
    createTitleLayout(),
    createTitleAndContentLayout(),
    createSectionTitleLayout(),
    createTitleAndTwoImagesLayout(),
  ],
  selectedSceneId: null,
  selectedObjectId: null,
  addScene: (scene) =>
    set((state) => {
      return {
        scenes: [...state.scenes, scene],
      };
    }),
  deleteScene: (id) =>
    set((state) => ({
      scenes: state.scenes.filter((scene) => scene.id !== id),
    })),
  selectScene: (id) => {
    // Commit any pending changes before changing scenes
    get().commitOverlayChanges();

    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === id
          ? { ...scene, selected: true }
          : { ...scene, selected: false }
      ),
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
      const selectedObject = get().getSelectedObject();
      if (selectedObject) {
        useOverlayStore.getState().showOverlay(selectedObject as SceneText);
      }
    } else {
      useOverlayStore.getState().hideOverlay();
    }
  },
  getSelectedObject: () => {
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
        scenes: updatedScenes,
      };
    });
  },
}));

export default useScenesStore;
