import { SceneComponent, SceneText } from "@/types/scenes";
import { create } from "zustand";

export interface OverlayStore {
  visibleOverlayId: string | null;
  overlayObject: SceneText | null;
  showOverlay: (object: SceneText) => void;
  hideOverlay: () => void;
  updateOverlayProperty: <K extends keyof SceneText>(
    property: K,
    value: SceneText[K]
  ) => void;
  getOverlayData: () => SceneText | null;
}

const useOverlayStore = create<OverlayStore>((set, get) => ({
  visibleOverlayId: null,
  overlayObject: null,

  showOverlay: (object) =>
    set({
      visibleOverlayId: object.id,
      overlayObject: { ...object },
    }),

  hideOverlay: () =>
    set({
      visibleOverlayId: null,
      overlayObject: null,
    }),

  updateOverlayProperty: (property, value) =>
    set((state) => {
      if (!state.overlayObject) return state;

      return {
        ...state,
        overlayObject: {
          ...state.overlayObject,
          [property]: value,
        },
      };
    }),

  getOverlayData: () => {
    return get().overlayObject;
  },
}));

export default useOverlayStore;
