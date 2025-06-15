import { create } from "zustand";

export type ProjectInfo = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  modified_at: string;
};

export type EditorStoreState = {
  isFirstRender: boolean;
  projectId: string | null;
  projectInfo: ProjectInfo | null;
  loaded: boolean;
};

export type EditorStoreActions = {
  setIsFirstRender: (isFirstRender: boolean) => void;
  setProjectId: (currentProjectId: string | null) => void;
  setProjectInfo: (projectInfo: ProjectInfo | null) => void;
  setLoaded: (loaded: boolean) => void;
  reset: () => void;
};

export type EditorState = EditorStoreState & EditorStoreActions;

const editorStoreInitialState: EditorStoreState = {
  isFirstRender: true,
  projectId: null,
  projectInfo: null,
  loaded: false,
};

const useEditorStore = create<EditorState>((set) => ({
  ...editorStoreInitialState,

  setIsFirstRender: (isFirstRender) => set({ isFirstRender }),
  setProjectId: (currentProjectId) => set({ projectId: currentProjectId }),
  setProjectInfo: (projectInfo) => set({ projectInfo: projectInfo }),
  setLoaded: (loaded) => set({ loaded: loaded }),
  reset: () => {
    set(editorStoreInitialState);
  },
}));

export default useEditorStore;
