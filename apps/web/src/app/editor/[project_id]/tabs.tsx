import AnimationsDrawer from "@/components/tabs/animations-drawer";
import ScriptsDrawer from "@/components/tabs/scripts-drawer";
import StockDrawer from "@/components/tabs/stock-drawer";
import TextDrawer from "@/components/tabs/text-drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Animations } from "@/lib/icon";
import { useEditorStore } from "@/stores/editor-store";
import {
  Clapperboard,
  Folder,
  Image,
  Newspaper,
  ScrollText,
  Shapes,
  Type,
  X,
} from "lucide-react";
import { JSX } from "react";

export interface TabContent {
  icon: any;
  content: JSX.Element;
}

export const sidebarTabs: { [key: string]: TabContent } = {
  Scripts: {
    icon: ScrollText,
    content: <ScriptsDrawer />,
  },
  Gen: {
    icon: Clapperboard,
    content: <p>Image Gen Drawer</p>,
  },
  Uploads: {
    icon: Folder,
    content: <p>Uploads Drawer</p>,
  },
  Stock: {
    icon: Image,
    content: <StockDrawer />,
  },
  Text: {
    icon: Type,
    content: <TextDrawer />,
  },
  Shapes: {
    icon: Shapes,
    content: <p>Shapes Drawer</p>,
  },
  Templates: {
    icon: Newspaper,
    content: <p>Templates Drawer</p>,
  },
};

export const elementTabs: { [key: string]: TabContent } = {
  Animations: {
    icon: Animations,
    content: <AnimationsDrawer />,
  },
};

export const tabs = {
  ...sidebarTabs,
  ...elementTabs,
};

const EditorTabs = () => {
  const tab = useEditorStore((state) => state.tab);
  const setTab = useEditorStore((state) => state.setTab);

  return (
    <Tabs value={tab}>
      {Object.entries(tabs).map(([key, value]) => (
        <TabsContent key={key} value={key} asChild>
          <div className="w-84 p-4 mb-2 flex flex-col rounded-md bg-sidebar overflow-auto">
            <div className="flex justify-between items-center">
              <p className="flex gap-2 items-center font-semibold text-xl">
                <value.icon className="size-5" /> {key}
              </p>
              <Button variant="ghost" onClick={() => setTab(null)} size="sm">
                <X />
              </Button>
            </div>
            <div className="flex flex-col overflow-auto p-2">
              {value.content}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default EditorTabs;
