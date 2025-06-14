"use client";

import useScenesStore from "@/store/scenes-store";
import { useEffect } from "react";

/**
 * Component that listens for keyboard events and handles component deletion
 * when Delete (Windows) or Backspace (Mac) is pressed
 */
export function useHandleKeyboardEvent() {
  const selectedObjectId = useScenesStore((state) => state.selectedObjectId);
  const deleteSelectedComponent = useScenesStore(
    (state) => state.deleteSelectedComponent
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if an object is selected and Delete (Windows) or Backspace (Mac) is pressed
      if (
        selectedObjectId &&
        (event.key === "Delete" || event.key === "Backspace")
      ) {
        // Ignore if the event originated from an input element
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          (event.target as HTMLElement).isContentEditable
        ) {
          return;
        }

        // Prevent default behavior (like browser back navigation on Mac)
        event.preventDefault();

        // Delete the selected component
        deleteSelectedComponent();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedObjectId, deleteSelectedComponent]);
}

export default useHandleKeyboardEvent;
