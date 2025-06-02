import { Scene } from "@/types/scenes";
import { PlayerRef } from "@remotion/player";
import { createRef, RefObject } from "react";
import { create } from "zustand";
import useScenesStore from "./scenes-store";

export interface PlayerStore {
  // Player state
  playing: boolean;
  frame: number;
  zoom: number;
  loop: boolean;
  playerRef: RefObject<PlayerRef | null>;

  // Duration calculations that were previously in remotion-player.tsx
  totalDuration: number;
  durationInFrames: number;

  // Actions
  setPlaying: (playing: boolean) => void;
  setFrame: (frame: number) => void; // Use with caution, only use for low-level control
  setZoom: (zoom: number) => void;
  setLoop: (loop: boolean) => void;
  setPlayerRefElement: (playerRef: PlayerRef | null) => void;

  // Player controls
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seekTo: (frame: number) => void;

  // Enable animations in editing mode
  previewMode: boolean;
  setPreviewMode: (enable: boolean) => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  playing: false,
  frame: 0,
  zoom: 1,
  loop: false,
  playerRef: createRef<PlayerRef>(),
  totalDuration: 0,
  durationInFrames: 0,
  previewMode: true,

  // Actions
  setPlaying: (playing) => {
    // When playing is toggled, deselect any object
    useScenesStore.getState().selectObject(null);
    set({ playing });
  },
  setFrame: (frame) => {
    set({ frame, previewMode: true });
  },
  setZoom: (zoom) => set({ zoom }),
  setLoop: (loop) => set({ loop }),
  setPlayerRefElement: (playerRef) => {
    if (!playerRef) {
      return;
    }
    const newRef = createRef<PlayerRef>();
    newRef.current = playerRef;
    set({ playerRef: newRef });
  },

  // Player controls
  play: () => {
    useScenesStore.getState().selectObject(null);
    const { playerRef } = get();
    if (playerRef.current) {
      playerRef.current.play();
      set({ playing: true });
    }
  },

  pause: () => {
    useScenesStore.getState().selectObject(null);
    const { playerRef } = get();
    if (playerRef.current) {
      playerRef.current.pause();
      set({ playing: false });
    }
  },

  togglePlayPause: () => {
    useScenesStore.getState().selectObject(null);
    const { playing, playerRef } = get();
    if (playerRef.current) {
      if (playing) {
        playerRef.current.pause();
        set({ playing: false });
      } else {
        playerRef.current.play();
        set({ playing: true });
      }
    }
  },

  seekTo: (frame) => {
    useScenesStore.getState().selectObject(null);
    const { playerRef } = get();
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
      set({ frame, previewMode: true });
    }
  },

  setPreviewMode: (enable: boolean) =>
    set({
      previewMode: enable,
    }),
}));

const syncWithScenesStore = ({
  scenes,
  selectedSceneId,
}: {
  scenes: Scene[];
  selectedSceneId: string | null;
}) => {
  // Calculate total duration from all scenes
  const totalDuration = scenes.reduce(
    (acc, scene) => acc + scene.durationInFrames,
    0
  );

  // Calculate duration based on whether a scene is selected or not
  const selectedScene = scenes.find((scene) => scene.id === selectedSceneId);
  const durationInFrames = selectedScene
    ? selectedScene.durationInFrames
    : totalDuration;

  // Update the store
  usePlayerStore.setState({
    totalDuration,
    durationInFrames,
  });
};

// Subscribe to scenes store to update duration calculations
useScenesStore.subscribe(
  (state) => ({ scenes: state.scenes, selectedSceneId: state.selectedSceneId }),
  (current, _) => {
    syncWithScenesStore(current);
  }
);

// Immediately calculate durations with initial state
const { scenes, selectedSceneId } = useScenesStore.getState();
syncWithScenesStore({ scenes, selectedSceneId });

export default usePlayerStore;
