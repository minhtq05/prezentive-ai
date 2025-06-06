import { Scene } from "@/types/scenes";
import { PlayerRef } from "@remotion/player";
import { createRef, RefObject } from "react";
import { create } from "zustand";
import useScenesStore from "./scenes-store";

const playerStoreInitialState: PlayerStoreState = {
  playing: false,
  frame: 0,
  zoom: 1,
  loop: false,
  playerRef: createRef<PlayerRef>(),
  totalDuration: 0,
  durationInFrames: 0,
  previewMode: true,
  containerWidth: 0,
};

export type PlayerStoreState = {
  // Player state
  playing: boolean;
  frame: number;
  zoom: number;
  loop: boolean;
  playerRef: RefObject<PlayerRef | null>;

  // Duration calculations that were previously in remotion-player.tsx
  totalDuration: number;
  durationInFrames: number;

  // Preview mode for animations
  // This is used to enable animations in editing mode
  previewMode: boolean;

  // Container width for the seek bar
  containerWidth: number;
};

export type PlayerStoreActions = {
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
  setPreviewMode: (enable: boolean) => void;

  // Container width setter
  setContainerWidth: (width: number) => void;

  reset: () => void;
};

export type PlayerStore = PlayerStoreState & PlayerStoreActions;

const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...playerStoreInitialState,
  // Actions
  setPlaying: (playing) => {
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
        useScenesStore.getState().selectObject(null);
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

  setContainerWidth: (width) => set({ containerWidth: width }),

  reset: () => set(playerStoreInitialState),
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

useScenesStore.subscribe(
  (state) => state.selectedObjectId,
  (selectedObjectId, _) => {
    if (selectedObjectId) {
      // If an object is selected, disable preview mode
      const { setPreviewMode, pause } = usePlayerStore.getState();
      setPreviewMode(false);
      pause();
    }
  }
);

// Immediately calculate durations with initial state
const { scenes, selectedSceneId } = useScenesStore.getState();
syncWithScenesStore({ scenes, selectedSceneId });

export default usePlayerStore;
