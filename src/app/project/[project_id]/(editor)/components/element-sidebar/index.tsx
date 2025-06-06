"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddImageButton, AddTextButton, AddVideoButton } from "./components";
import { useHandleAddElements } from "./hooks";

export default function ElementSidebar() {
  const { handleAddText, handleMediaUpload } = useHandleAddElements();

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-1 p-1 bg-white">
        <Tooltip>
          <TooltipTrigger asChild>
            <AddTextButton handleAddText={handleAddText} />
          </TooltipTrigger>
          <TooltipContent side="right">Add Text</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <AddImageButton handleMediaUpload={handleMediaUpload} />
          </TooltipTrigger>
          <TooltipContent side="right">Add Image</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <AddVideoButton handleMediaUpload={handleMediaUpload} />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Video</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
