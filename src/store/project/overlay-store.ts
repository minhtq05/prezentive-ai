import { SceneComponent, SceneMedia, SceneText } from "@/types/scenes";
import { create } from "zustand";

export type OverlayStoreState = {
  visibleOverlayId: string | null;
  overlayObject: SceneText | SceneMedia | null;
};
export type OverlayStoreActions = {
  showOverlay: (object: SceneText | SceneMedia) => void;
  hideOverlay: () => void;
  updateOverlayProperty: <T extends SceneComponent, K extends keyof T>(
    property: K,
    value: T[K]
  ) => void;
  getOverlayData: () => SceneText | SceneMedia | null;
  reset: () => void;
};

export type OverlayStore = OverlayStoreState & OverlayStoreActions;

const initialOverlayState: OverlayStoreState = {
  visibleOverlayId: null,
  overlayObject: null,
};

const useOverlayStore = create<OverlayStore>((set, get) => ({
  ...initialOverlayState,

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

      if (state.overlayObject.type === "scene-text") {
        return {
          ...state,
          overlayObject: {
            ...state.overlayObject,
            [property]: value,
          } as SceneText,
        };
      } else if (state.overlayObject.type === "scene-media") {
        return {
          ...state,
          overlayObject: {
            ...state.overlayObject,
            [property]: value,
          } as SceneMedia,
        };
      } else return state;
    }),

  getOverlayData: () => {
    return get().overlayObject;
  },

  reset: () => set(() => ({ visibleOverlayId: null, overlayObject: null })),
}));

export default useOverlayStore;
