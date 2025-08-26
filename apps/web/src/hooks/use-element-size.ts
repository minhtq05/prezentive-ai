import React, { useCallback, useEffect, useMemo, useState } from "react";

type Size = {
  width: number;
  height: number;
  left: number;
  top: number;
};

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
      width: rect[0].width as number,
      height: rect[0].height as number,
      left: rect[0].x as number,
      top: rect[0].y as number,
    };
  });

  const observer = useMemo(() => {
    if (typeof ResizeObserver === "undefined") {
      return null;
    }

    return new ResizeObserver((entries) => {
      const { target } = entries[0];
      const newSize = target.getClientRects();

      if (!newSize?.[0]) {
        setSize(null);
        return;
      }

      const { width } = newSize[0];

      const { height } = newSize[0];

      setSize({
        width,
        height,
        left: newSize[0].x,
        top: newSize[0].y,
      });
    });
  }, []);

  const updateSize = useCallback(() => {
    if (!ref.current) {
      return;
    }

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
        width: rect[0].width as number,
        height: rect[0].height as number,
        left: rect[0].x as number,
        top: rect[0].y as number,
        windowSize: {
          height: window.innerHeight,
          width: window.innerWidth,
        },
      };
    });
  }, [ref]);

  useEffect(() => {
    if (!observer) {
      return;
    }

    const { current } = ref;
    if (current) {
      observer.observe(current);
    }

    return (): void => {
      if (current) {
        observer.unobserve(current);
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

    return { ...size, refresh: updateSize };
  }, [size, updateSize]);
};
