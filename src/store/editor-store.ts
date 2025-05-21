import { create } from "zustand";

interface EditorState {
  isUpdating: boolean;
  isFirstRender: boolean;
  prevProjectId: string | undefined;
  setIsUpdating: (isUpdating: boolean) => void;
  setIsFirstRender: (isFirstRender: boolean) => void;
  setPrevProjectId: (prevProjectId: string | undefined) => void;
  resetForNewProject: (projectId: string) => void;
}

const useEditorStore = create<EditorState>((set) => ({
  isUpdating: false,
  isFirstRender: true,
  prevProjectId: undefined,

  setIsUpdating: (isUpdating) => set({ isUpdating }),
  setIsFirstRender: (isFirstRender) => set({ isFirstRender }),
  setPrevProjectId: (prevProjectId) => set({ prevProjectId }),

  resetForNewProject: (projectId) =>
    set((state) => {
      // Only reset if the project ID has changed
      if (
        state.prevProjectId !== undefined &&
        state.prevProjectId !== projectId
      ) {
        return {
          isFirstRender: true,
          prevProjectId: projectId,
        };
      }
      return { prevProjectId: projectId };
    }),
}));

export default useEditorStore;
