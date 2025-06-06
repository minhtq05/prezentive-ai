"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useRef, useState } from "react";

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
  const [url, setUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const supportedVideoExtensions = ["mp4", "mov", "webm"];

  const supportedExtensions =
    mediaType === "image" ? supportedImageExtensions : supportedVideoExtensions;

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);

    // Reset file and preview when URL is entered
    if (e.target.value) {
      setFile(null);
      setPreview(e.target.value);
    } else {
      setPreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    return supportedExtensions.includes(fileExtension);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];

      if (validateFile(droppedFile)) {
        handleFile(droppedFile);
      } else {
        alert(
          `Unsupported file type. Please use ${supportedExtensions.join(", ")}`
        );
      }
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (validateFile(selectedFile)) {
        handleFile(selectedFile);
      } else {
        alert(
          `Unsupported file type. Please use ${supportedExtensions.join(", ")}`
        );
        e.target.value = "";
      }
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    setUrl("");

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleUpload = () => {
    if (preview) {
      onUpload(preview, file || undefined);
      handleClose();
    }
  };

  const handleClose = () => {
    setUrl("");
    setFile(null);
    setPreview(null);
    setDragActive(false);
    onOpenChange(false);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Media</DialogTitle>
          <DialogDescription>
            Upload {mediaType === "image" ? "an image" : "a video"} from URL or
            your device
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">
              {mediaType === "image" ? "Image" : "Video"} URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={handleUrlChange}
              placeholder={`Enter ${mediaType} URL`}
            />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
              dragActive ? "border-primary bg-secondary/20" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleClickUpload}
          >
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={supportedExtensions.map((ext) => `.${ext}`).join(",")}
              onChange={handleFileInput}
            />
            <p>Drag and drop {mediaType} here or click to upload</p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: {supportedExtensions.join(", ")}
            </p>
          </div>

          {preview && (
            <div className="mt-4 border rounded-md p-2">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="flex justify-center">
                {mediaType === "image" ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-[200px] object-contain"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="max-w-full max-h-[200px]"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!preview}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
