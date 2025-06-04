"use client";

import { Separator } from "@/components/ui/separator";
import useScenesStore from "@/store/scenes-store";
import { Fragment } from "react";
import ElementHeader from "./element-header";
import PropertiesPanel from "./properties-panel";
import RemotionPlayer from "./remotion-player";
import ScenesSidebar from "./scenes-sidebar";
import { SeekBar } from "./seek-bar";

export default function EditorLayout() {
  return (
    <Fragment>
      <header className="flex flex-row h-14">
        <ElementHeader />
        <SceneUpdatingStatus />
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

function SceneUpdatingStatus() {
  const scenesIsUpdating = useScenesStore((state) => state.scenesIsUpdating);

  return (
    scenesIsUpdating && (
      <div className="flex items-center justify-center gap-1 w-14 h-14 text-sm text-primary">
        Saving...
      </div>
    )
  );
}
