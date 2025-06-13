import { create } from "zustand";
import usePlayerStore from "./player-store";
import useScenesStore from "./scenes-store";

export type ProjectInfo = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  modified_at: string;
};

export type EditorStoreState = {
  isFirstRender: boolean;
  currentProjectId: string | undefined;
  currentProjectInfo: ProjectInfo | null;
};

export type EditorStoreActions = {
  setIsFirstRender: (isFirstRender: boolean) => void;
  setCurrentProjectId: (currentProjectId: string | undefined) => void;
  setCurrentProjectInfo: (projectInfo: ProjectInfo | null) => void;
  resetNewProjectState: (projectId: string) => void;
};

export type EditorState = EditorStoreState & EditorStoreActions;

const editorStoreInitialState: EditorStoreState = {
  isFirstRender: true,
  currentProjectId: undefined,
  currentProjectInfo: null,
};

const useEditorStore = create<EditorState>((set) => ({
  ...editorStoreInitialState,

  setIsFirstRender: (isFirstRender) => set({ isFirstRender }),
  setCurrentProjectId: (currentProjectId) => set({ currentProjectId }),
  setCurrentProjectInfo: (projectInfo) =>
    set({ currentProjectInfo: projectInfo }),

  resetNewProjectState: (projectId) => {
    set((state) => {
      // Only reset if the project ID has changed
      if (
        state.currentProjectId !== undefined &&
        state.currentProjectId !== projectId
      ) {
        useScenesStore.getState().reset();
        usePlayerStore.getState().reset();
        return {
          isFirstRender: true,
          currentProjectId: projectId,
        };
      }
      return { currentProjectId: projectId };
    });
  },
}));

export default useEditorStore;
