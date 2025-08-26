import { useEditorStore } from "@/stores/editor-store";
import { useEffect } from "react";

const useTimeLine = () => {
  const playerRef = useEditorStore((state) => state.playerRef);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const { current } = playerRef;
    const onFrameUpdate = () => {
      useEditorStore.setState({ frame: current.getCurrentFrame() });
    };

    current.addEventListener("frameupdate", onFrameUpdate);

    return () => {
      current.removeEventListener("frameupdate", onFrameUpdate);
    };
  }, [playerRef]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const { current } = playerRef;

    const onPlay = () => {
      useEditorStore.setState({ playing: true, enableAnimations: true });
    };

    const onPause = () => {
      useEditorStore.setState({ playing: false });
    };

    current.addEventListener("play", onPlay);
    current.addEventListener("pause", onPause);

    return () => {
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
    };
  }, [playerRef]);
};

export default useTimeLine;
