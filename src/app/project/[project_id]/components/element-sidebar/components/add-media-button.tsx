import { Button } from "@/components/ui/button";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import useScenesStore from "@/store/scenes-store";
import {
  Image as ImageIcon,
  Link2 as Link,
  ArrowUpFromLine as Upload,
  Video as VideoIcon,
} from "lucide-react";
import { useState } from "react";
import { MediaType } from "../hooks/use-handle-add-elements";
import AddMediaByUploadDialog from "./add-media-by-upload-dialog";
import AddMediaByUrlDialog from "./add-media-by-url-dialog";

export interface AddVideoButtonProps {
  mediaType: MediaType;
  handleMediaUpload: (mediaType: MediaType, src: string) => void;
}

export default function AddMediaButton({
  mediaType,
  handleMediaUpload,
}: AddVideoButtonProps) {
  const selectedSceneId = useScenesStore((state) => state.selectedSceneId);

  const [uploadFromComputerNonce, setUploadFromComputerNonce] = useState(0);
  const [uploadByUrl, setUploadByUrl] = useState(false);

  const handleUploadFromComputer = () => {
    if (!selectedSceneId) return;
    setUploadByUrl(false);
    setUploadFromComputerNonce(Date.now());
  };

  const handleUploadByUrl = () => {
    if (!selectedSceneId) return;
    setUploadByUrl(true);
  };

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={!selectedSceneId}
            className="size-14 flex flex-col items-center justify-center gap-1"
          >
            {mediaType === "image" ? (
              <>
                <ImageIcon />
                <span className="text-xs leading-none">Image</span>
              </>
            ) : (
              <>
                <VideoIcon />
                <span className="text-xs leading-none">Video</span>
              </>
            )}
          </Button>
        </MenubarTrigger>
        <MenubarContent side="right">
          <MenubarItem onSelect={handleUploadFromComputer}>
            <Upload /> Upload from computer
          </MenubarItem>
          <MenubarItem onSelect={handleUploadByUrl}>
            <Link /> By URL
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <AddMediaByUploadDialog
        nonce={uploadFromComputerNonce}
        mediaType={mediaType}
        onUpload={(src) => handleMediaUpload(mediaType, src)}
      />
      <AddMediaByUrlDialog
        open={uploadByUrl}
        onOpenChange={setUploadByUrl}
        mediaType={mediaType}
        onUpload={(src) => handleMediaUpload(mediaType, src)}
      />
    </>
  );
}
