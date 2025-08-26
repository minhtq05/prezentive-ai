import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  defaultEnterAnimations,
  defaultExitAnimations,
} from "@/lib/animations";
import { useEditorStore } from "@/stores/editor-store";
import { Check } from "lucide-react";
import { useMemo } from "react";

const AnimationsDrawer = () => {
  const overlay = useEditorStore((state) => state.overlay);
  const setOverlay = useEditorStore((state) => state.setOverlay);
  const currentScene = useEditorStore((state) => state.currentScene);
  const enterAnimation = useMemo(() => {
    if (!overlay?.elementData) return null;
    return overlay.elementData["enterAnimation"] || null;
  }, [overlay]);
  const exitAnimation = useMemo(() => {
    if (!overlay?.elementData) return null;
    return overlay.elementData["exitAnimation"] || null;
  }, [overlay]);

  const handleAnimationSelect = (animation: string, type: "enter" | "exit") => {
    if (!overlay) return;

    if (!currentScene) return;

    const updateKey = type === "enter" ? "enterAnimation" : "exitAnimation";

    setOverlay({
      ...overlay,
      elementData: {
        ...overlay.elementData,
        [updateKey]: animation,
      },
    });
  };

  if (!overlay) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Please select an element
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="enter">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enter">Enter</TabsTrigger>
          <TabsTrigger value="exit">Exit</TabsTrigger>
        </TabsList>

        <TabsContent value="enter" className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              key={`animation_None`}
              variant={enterAnimation === null ? "default" : "outline"}
              className="h-16 relative flex flex-col items-center justify-center"
              onClick={() => handleAnimationSelect(null, "enter")}
            >
              <span className="text-sm font-medium">None</span>
              {enterAnimation === null && (
                <Check className="absolute top-1 right-1 h-3 w-3" />
              )}
            </Button>
            {Object.keys(defaultEnterAnimations).map((animation) => {
              const isSelected = enterAnimation === animation;

              return (
                <Button
                  key={`animation_${animation}`}
                  variant={isSelected ? "default" : "outline"}
                  className="h-16 relative flex flex-col items-center justify-center"
                  onClick={() => handleAnimationSelect(animation, "enter")}
                >
                  <span className="text-sm font-medium">
                    {animation.replace(/([a-z](?=[A-Z]))/g, "$1 ")}
                  </span>
                  {isSelected && (
                    <Check className="absolute top-1 right-1 h-3 w-3" />
                  )}
                </Button>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="exit" className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              key={`animation_None`}
              variant={exitAnimation === null ? "default" : "outline"}
              className="h-16 relative flex flex-col items-center justify-center"
              onClick={() => handleAnimationSelect(null, "exit")}
            >
              <span className="text-sm font-medium">None</span>
              {exitAnimation === null && (
                <Check className="absolute top-1 right-1 h-3 w-3" />
              )}
            </Button>
            {Object.keys(defaultExitAnimations).map((animation) => {
              const isSelected = exitAnimation === animation;

              return (
                <Button
                  key={`animation_${animation}`}
                  variant={isSelected ? "default" : "outline"}
                  className="h-16 relative flex flex-col items-center justify-center"
                  onClick={() => handleAnimationSelect(animation, "exit")}
                >
                  <span className="text-sm font-medium">
                    {animation.replace(/([a-z](?=[A-Z]))/g, "$1 ")}
                  </span>
                  {isSelected && (
                    <Check className="absolute top-1 right-1 h-3 w-3" />
                  )}
                </Button>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimationsDrawer;
