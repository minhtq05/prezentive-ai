"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

type MediaType = "image" | "video";

const supportedImageExtensions = ["jpg", "jpeg", "png", "svg"];
const supportedVideoExtensions = ["mp4", "mov"];

interface AddMediaByUploadDialogProps {
  nonce: number;
  mediaType: MediaType;
  onUpload: (src: string) => void;
}

export default function AddMediaByUploadDialog({
  nonce,
  mediaType,
  onUpload,
}: AddMediaByUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedExtensions =
    mediaType === "image" ? supportedImageExtensions : supportedVideoExtensions;

  // TODO: implement file validation with security best practices
  // For now, we only check the file extensions
  const validateFile = (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!supportedExtensions.includes(fileExtension)) {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }
    if (file.size > 100 * 1024 * 1024) {
      throw new Error("File size exceeds 100MB limit");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      try {
        validateFile(selectedFile);
        if (selectedFile) {
          const objectUrl = URL.createObjectURL(selectedFile);
          onUpload(objectUrl);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while uploading the file.");
        }
      }
      e.target.value = "";
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (nonce) {
      handleClickUpload();
    }
  }, [nonce]);

  return (
    <Input
      ref={fileInputRef}
      type="file"
      className="hidden"
      accept={supportedExtensions.map((ext) => `.${ext}`).join(",")}
      onChange={handleFileInput}
    />
  );
}
