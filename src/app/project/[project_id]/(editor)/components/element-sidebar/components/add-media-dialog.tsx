"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddMediaByUrlDialog from "./add-media-by-url-dialog";
import AddMediaByUploadDialog from "./add-media-by-upload-dialog";

type MediaType = "image" | "video";

interface AddMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: MediaType;
  onUpload: (src: string, file?: File) => void;
}

export default function AddMediaDialog({
  open,
  onOpenChange,
  mediaType,
  onUpload,
}: AddMediaDialogProps) {
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleUrlUpload = (src: string) => {
    onUpload(src);
    handleClose();
  };

  const handleFileUpload = (src: string, file: File) => {
    onUpload(src, file);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Media</DialogTitle>
          <DialogDescription>
            Add {mediaType === "image" ? "an image" : "a video"} from URL or
            your device
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="url" className="w-full" onValueChange={(value) => setActiveTab(value as "url" | "upload")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="mt-4">
            <AddMediaByUrlDialog 
              mediaType={mediaType}
              onUpload={handleUrlUpload}
            />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <AddMediaByUploadDialog
              mediaType={mediaType}
              onUpload={handleFileUpload}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
