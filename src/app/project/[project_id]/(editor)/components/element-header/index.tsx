"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddImageButton from "./components/add-image-button";
import AddTextButton from "./components/add-text-button";
import AddVideoButton from "./components/add-video-button";
import { useHandleAddElements } from "./hooks/use-handle-add-elements";

export default function ElementHeader() {
  const { handleAddText, handleMediaUpload } = useHandleAddElements();

  return (
    <div className="flex flex-row items-center gap-2 p-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AddTextButton handleAddText={handleAddText} />
          </TooltipTrigger>
          <TooltipContent side="bottom">Add Text</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <AddImageButton handleMediaUpload={handleMediaUpload} />
          </TooltipTrigger>
          <TooltipContent side="bottom">Add Image</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <AddVideoButton handleMediaUpload={handleMediaUpload} />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Add Video</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
