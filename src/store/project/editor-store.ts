import { create } from "zustand";
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
  currentProjectId: string | null;
  currentProjectInfo: ProjectInfo | null;
};

export type EditorStoreActions = {
  setIsFirstRender: (isFirstRender: boolean) => void;
  setCurrentProjectId: (currentProjectId: string | null) => void;
  setCurrentProjectInfo: (projectInfo: ProjectInfo | null) => void;
  reset: () => void;
};

export type EditorState = EditorStoreState & EditorStoreActions;

const editorStoreInitialState: EditorStoreState = {
  isFirstRender: true,
  currentProjectId: null,
  currentProjectInfo: null,
};

const useEditorStore = create<EditorState>((set) => ({
  ...editorStoreInitialState,

  setIsFirstRender: (isFirstRender) => set({ isFirstRender }),
  setCurrentProjectId: (currentProjectId) => set({ currentProjectId }),
  setCurrentProjectInfo: (projectInfo) =>
    set({ currentProjectInfo: projectInfo }),
  reset: () => {
    useScenesStore.getState().reset();
    set(editorStoreInitialState);
  },
}));

export default useEditorStore;
