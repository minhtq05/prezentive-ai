"use client";

import { Menubar } from "@/components/ui/menubar";
import { AddMediaButton, AddTextButton } from "./components";
import { useHandleAddElements } from "./hooks";

export default function ElementSidebar() {
  const { handleAddText, handleMediaUpload } = useHandleAddElements();

  return (
    <Menubar className="w-full border-none flex-col items-center gap-1 p-1">
      <AddTextButton handleAddText={handleAddText} />
      <AddMediaButton mediaType="image" handleMediaUpload={handleMediaUpload} />
      <AddMediaButton mediaType="video" handleMediaUpload={handleMediaUpload} />
    </Menubar>
  );
}
