"use client";

import { Button } from "@/components/ui/button";
import PropertiesPanel from "@/components/ui/properties-panel";
import RemotionPlayer from "@/components/ui/remotion-player";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/ui/sidebar";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-screen h-screen flex flex-col">
      <header className="flex justify-center items-center h-12">header</header>
      <Separator orientation="horizontal" />
      <div className="flex-1 flex flex-row justify-center items-center overflow-auto">
        <div className="flex-none w-[20%] h-full">
          <Sidebar />
        </div>
        <Separator orientation="vertical" />
        <div className="flex-1 flex flex-col overflow-y-scroll relative h-full">
          <RemotionPlayer />
          <Separator orientation="horizontal" />
        </div>
        <Separator orientation="vertical" />
        <div className="flex-none w-[20%] h-full overflow-y-auto">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
