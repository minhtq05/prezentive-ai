import { PlayerRef } from "@remotion/player";
import { create } from "zustand";
import useScenesStore from "./scenes-store";
import { createRef, RefObject } from "react";

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
  setFrame: (frame: number) => void;
  setZoom: (zoom: number) => void;
  setLoop: (loop: boolean) => void;
  setPlayerRefElement: (playerRef: PlayerRef | null) => void;

  // Player controls
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seekTo: (frame: number) => void;
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

  // Actions
  setPlaying: (playing) => set({ playing }),
  setFrame: (frame) => set({ frame }),
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
    const { playerRef } = get();
    if (playerRef.current) {
      playerRef.current.play();
      set({ playing: true });
    }
  },

  pause: () => {
    const { playerRef } = get();
    if (playerRef.current) {
      playerRef.current.pause();
      set({ playing: false });
    }
  },

  togglePlayPause: () => {
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
    const { playerRef } = get();
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
      set({ frame });
    }
  },
}));

// Function to calculate and update durations
const syncWithScenesStore = (state = useScenesStore.getState()) => {
  const scenes = state.scenes;
  const selectedSceneId = state.selectedSceneId;

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
useScenesStore.subscribe(syncWithScenesStore);

// Immediately calculate durations with initial state
syncWithScenesStore();

export default usePlayerStore;
