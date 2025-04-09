import { create } from "zustand";

// Sample data structure for scenes
export interface Scene {
  id: string;
  title: string;
  selected: boolean;
  content: string;
}

export interface ScenesStore {
  scenes: Scene[];
  selectedSceneId: string | null;
  addScene: (title: string) => void;
  deleteScene: (id: string) => void;
  selectScene: (id: string | null) => void;
}

const useScenesStore = create<ScenesStore>((set) => ({
  scenes: [
    {
      id: "1",
      title: "Introduction",
      selected: false,
      content: "Intro content",
    },
    {
      id: "2",
      title: "Key Features",
      selected: false,
      content: "Features content",
    },
    { id: "3", title: "Demo", selected: false, content: "Demo content" },
    {
      id: "4",
      title: "Conclusion",
      selected: false,
      content: "Conclusion content",
    },
  ],
  selectedSceneId: null,
  addScene: (title) =>
    set((state) => {
      const newId = (state.scenes.length + 1).toString();
      return {
        scenes: [
          ...state.scenes,
          { id: newId, title, selected: false, content: "" },
        ],
      };
    }),
  deleteScene: (id) =>
    set((state) => ({
      scenes: state.scenes.filter((scene) => scene.id !== id),
    })),
  selectScene: (id) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === id
          ? { ...scene, selected: true }
          : { ...scene, selected: false }
      ),
      selectedSceneId: id,
    })),
}));

export default useScenesStore;
