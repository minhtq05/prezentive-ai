"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import ElementSidebar from "@/components/element-sidebar";
import { Separator } from "@/components/ui/separator";
import PropertiesPanel from "@/components/properties-panel";
import RemotionPlayer from "@/components/remotion-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import KeyboardEventHandler from "@/components/keyboard-event-handler";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Tabs defaultValue="editor" className="gap-0 w-full h-full">
        <header className="flex justify-center items-center h-12">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="media-vault">Media Vault</TabsTrigger>
          </TabsList>
        </header>
        <Separator orientation="horizontal" />
        <TabsContent
          value="editor"
          className="flex-1 flex flex-col overflow-auto"
        >
          <div className="flex-1 flex flex-row justify-center items-center overflow-auto">
            <div className="w-16 flex flex-col h-full">
              <ElementSidebar />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-none w-[20%] h-full">
              <Sidebar />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-1 flex flex-col overflow-y-scroll relative h-full">
              <RemotionPlayer />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-none w-[20%] h-full overflow-y-auto">
              <PropertiesPanel />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="media-vault" className="flex flex-col items-center">
          Nothing's here yet
        </TabsContent>
      </Tabs>
      <KeyboardEventHandler />
    </div>
  );
}
