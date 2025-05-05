"use client";

import { useEffect, useState } from "react";

export const useHoverState = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const { current } = ref;
    if (!current) {
      return;
    }

    const onHover = () => {
      setHovered(true);
    };

    const onLeave = () => {
      setHovered(false);
    };

    const onMove = () => {
      setHovered(true);
    };

    current.addEventListener("mouseenter", onHover);
    current.addEventListener("mouseleave", onLeave);
    current.addEventListener("mousemove", onMove);

    return () => {
      current.removeEventListener("mouseenter", onHover);
      current.removeEventListener("mouseleave", onLeave);
      current.removeEventListener("mousemove", onMove);
    };
  }, [ref]);
  return hovered;
};
