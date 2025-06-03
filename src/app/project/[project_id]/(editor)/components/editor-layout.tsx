"use client";

import ElementHeader from "@/components/element-header";
import PropertiesPanel from "@/components/properties-panel";
import RemotionPlayer from "@/components/remotion-player";
import ScenesSidebar from "@/components/scenes-sidebar";
import { SeekBar } from "@/components/seek-bar";
import { Separator } from "@/components/ui/separator";
import useScenesStore from "@/store/scenes-store";
import { Fragment } from "react";

export default function EditorLayout() {
  const scenesIsUpdating = useScenesStore((state) => state.scenesIsUpdating);

  return (
    <Fragment>
      <header className="flex flex-row h-14">
        <ElementHeader />
        {scenesIsUpdating && (
          <div className="flex items-center justify-center gap-1 w-14 h-14 text-sm text-primary">
            Saving...
          </div>
        )}
      </header>

      <Separator />

      <div className="flex-1 flex flex-row justify-center items-center overflow-hidden">
        <div className="flex-none w-fit h-full">
          <ScenesSidebar />
        </div>

        <Separator orientation="vertical" />

        <div className="flex-1 flex flex-col overflow-y-scroll relative h-full items-center justify-center">
          <RemotionPlayer />
        </div>

        <Separator orientation="vertical" />

        <div className="flex-none w-80 h-full overflow-y-auto">
          <PropertiesPanel />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="flex flex-col relative h-72 overflow-auto">
        <SeekBar />
      </div>
    </Fragment>
  );
}
