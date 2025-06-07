"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MediaType } from "../hooks/use-handle-add-elements";

interface AddMediaByUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: MediaType;
  onUpload: (src: string) => void;
}

export default function AddMediaByUrlDialog({
  open,
  onOpenChange,
  mediaType,
  onUpload,
}: AddMediaByUrlDialogProps) {
  const [url, setUrl] = useState("");

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleUpload = () => {
    if (url) {
      onUpload(url);
      setUrl("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Insert {mediaType === "image" ? "Image" : "Video"}
          </DialogTitle>
        </DialogHeader>
        <Input
          id="url"
          value={url}
          onChange={handleUrlChange}
          placeholder={`Enter ${mediaType} URL`}
        />
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setUrl("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!url}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
