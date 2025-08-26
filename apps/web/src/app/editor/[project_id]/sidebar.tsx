import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { sidebarTabs } from "./tabs";

const Sidebar = () => {
  const tab = useEditorStore((state) => state.tab);
  const setTab = useEditorStore((state) => state.setTab);

  return (
    <div className="flex-none h-full flex pb-2">
      <div className="flex-none w-20 h-full flex flex-col items-center justify-center gap-2">
        {Object.entries(sidebarTabs).map(([key, value]) => (
          <Button
            key={key}
            onClick={() => setTab(key)}
            variant="ghost"
            className="size-16"
          >
            <p className="flex flex-col items-center gap-1">
              <value.icon className="size-5" />
              {key}
            </p>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
