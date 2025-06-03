import { create } from "zustand";
import usePlayerStore from "./player-store";
import useScenesStore from "./scenes-store";

interface EditorState {
  isFirstRender: boolean;
  prevProjectId: string | undefined;
  setIsFirstRender: (isFirstRender: boolean) => void;
  setPrevProjectId: (prevProjectId: string | undefined) => void;
  resetNewProjectState: (projectId: string) => void;
}

const useEditorStore = create<EditorState>((set) => ({
  isFirstRender: true,
  prevProjectId: undefined,

  setIsFirstRender: (isFirstRender) => set({ isFirstRender }),
  setPrevProjectId: (prevProjectId) => set({ prevProjectId }),

  resetNewProjectState: (projectId) => {
    set((state) => {
      // Only reset if the project ID has changed
      if (
        state.prevProjectId !== undefined &&
        state.prevProjectId !== projectId
      ) {
        useScenesStore.getState().reset();
        usePlayerStore.getState().reset();
        return {
          isFirstRender: true,
          prevProjectId: projectId,
        };
      }
      return { prevProjectId: projectId };
    });
  },
}));

export default useEditorStore;
