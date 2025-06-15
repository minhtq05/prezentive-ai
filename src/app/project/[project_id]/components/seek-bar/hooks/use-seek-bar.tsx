import { Size } from "@/hooks/use-element-size";
import usePlayerStore from "@/store/project/player-store";
import { useCallback, useEffect, useState } from "react";
import { interpolate } from "remotion";

const getFrameFromX = (
  clientX: number,
  durationInFrames: number,
  width: number
) => {
  const pos = clientX;
  const frame = Math.round(
    interpolate(pos, [0, width], [0, Math.max(durationInFrames - 1, 0)], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  return frame;
};

const findBodyInWhichDivIsLocated = (div: HTMLElement) => {
  let current = div;

  while (current.parentElement) {
    current = current.parentElement;
  }

  return current;
};

export default function useSeekBar({
  containerRef,
  width,
  size,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  width: number;
  size: Size | null;
}) {
  const playerRef = usePlayerStore((state) => state.playerRef);
  const playing = usePlayerStore((state) => state.playing);
  const setPlaying = usePlayerStore((state) => state.setPlaying);
  const setFrame = usePlayerStore((state) => state.setFrame);
  const durationInFrames = usePlayerStore((state) => state.durationInFrames);
  const seekTo = usePlayerStore((state) => state.seekTo);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);

  // local frame update when playerRef mounted
  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const { current } = playerRef;
    const onFrameUpdate = () => {
      setFrame(current.getCurrentFrame());
    };

    current.addEventListener("frameupdate", onFrameUpdate);

    return () => {
      current.removeEventListener("frameupdate", onFrameUpdate);
    };
  }, [playerRef]);

  // play and pause event listeners
  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const { current } = playerRef;
    // event handler for play
    const onPlay = () => {
      setPlaying(true);
    };

    // event handler for pause
    const onPause = () => {
      setPlaying(false);
    };

    current.addEventListener("play", onPlay); // event listeners for play
    current.addEventListener("pause", onPause); // event listeners for pause

    return () => {
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
    };
  }, [playerRef]);

  const [dragState, setDragState] = useState<
    { dragging: false } | { dragging: true; wasPlaying: boolean }
  >({
    dragging: false,
  });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) {
        return;
      }

      if (!playerRef.current) {
        return;
      }

      const posLeft = containerRef.current?.getBoundingClientRect()
        .left as number;

      const _frame = getFrameFromX(
        e.clientX - posLeft,
        durationInFrames,
        width
      );
      pause();
      seekTo(_frame);
      setDragState({
        dragging: true,
        wasPlaying: playing,
      });
    },
    [durationInFrames, width, playerRef, playing]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!size) {
        throw new Error("Player has no size");
      }

      if (!dragState.dragging) {
        return;
      }

      if (!playerRef.current) {
        return;
      }

      const posLeft = containerRef.current?.getBoundingClientRect()
        .left as number;

      const _frame = getFrameFromX(
        e.clientX - posLeft,
        durationInFrames,
        size.width
      );
      seekTo(_frame);
    },
    [dragState.dragging, durationInFrames, playerRef, size]
  );

  const onPointerUp = useCallback(() => {
    setDragState({
      dragging: false,
    });
    if (!dragState.dragging) {
      return;
    }

    if (!playerRef.current) {
      return;
    }

    if (dragState.wasPlaying) {
      play();
    } else {
      pause();
    }
  }, [dragState, playerRef]);

  useEffect(() => {
    if (!dragState.dragging) {
      return;
    }

    const body = findBodyInWhichDivIsLocated(
      containerRef.current as HTMLElement
    );

    body.addEventListener("pointermove", onPointerMove);
    body.addEventListener("pointerup", onPointerUp);
    return () => {
      body.removeEventListener("pointermove", onPointerMove);
      body.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragState.dragging, onPointerMove, onPointerUp]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
