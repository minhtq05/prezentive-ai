"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type Size = {
  width: number;
  height: number;
  left: number;
  top: number;
};

// If a pane has been moved, it will cause a layout shift without
// the window having been resized. Those UI elements can call this API to
// force an update
export const useElementSize = (
  ref: React.RefObject<HTMLElement | null>
): Size | null => {
  const [size, setSize] = useState<Size | null>(() => {
    if (!ref.current) {
      return null;
    }

    const rect = ref.current.getClientRects();
    if (!rect[0]) {
      return null;
    }

    return {
      width: rect[0].width,
      height: rect[0].height,
      left: rect[0].x,
      top: rect[0].y,
    };
  });

  const observer = useMemo(() => {
    // Check if ResizeObserver is available in the current environment
    if (typeof ResizeObserver === "undefined") {
      return null;
    }

    return new ResizeObserver(() => {
      if (ref.current) {
        const rect = ref.current.getClientRects();
        if (!rect[0]) {
          setSize(null);
          return;
        }

        setSize({
          width: rect[0].width,
          height: rect[0].height,
          left: rect[0].x,
          top: rect[0].y,
        });
      }
    });
  }, []);

  const updateSize = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getClientRects();
      if (!rect[0]) {
        setSize(null);
        return;
      }

      setSize((prevState) => {
        const isSame =
          prevState &&
          prevState.width === rect[0].width &&
          prevState.height === rect[0].height &&
          prevState.left === rect[0].x &&
          prevState.top === rect[0].y;
        if (isSame) {
          return prevState;
        }

        return {
          width: rect[0].width,
          height: rect[0].height,
          left: rect[0].x,
          top: rect[0].y,
        };
      });
    }
  }, [ref]);

  useEffect(() => {
    if (!observer || !ref.current) {
      return;
    }

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      } else {
        observer.disconnect();
      }
    };
  }, [observer, ref, updateSize]);

  useEffect(() => {
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [updateSize]);

  return useMemo(() => {
    if (!size) {
      return null;
    }

    return size;
  }, [size, updateSize]);
};
