import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { SceneElementData } from "@/types/editor";
import { toast } from "sonner";

const TEMPLATES: { [key: string]: SceneElementData } = {
  title: {
    innerHTML: "Title",
    type: "text",
    style: {
      fontSize: 128,
      fontFamily: "Arial",
      width: 1000,
      color: "#000000",
      textAlign: "left",
      position: "absolute",
      left: "100px",
      top: 0,
    },
    enterAnimation: null,
    exitAnimation: null,
  },
  subtitle: {
    innerHTML: "Subtitle",
    type: "text",
    style: {
      fontSize: 96,
      fontFamily: "Arial",
      width: 800,
      color: "#000000",
      textAlign: "left",
      position: "absolute",
      left: "100px",
      top: "150px",
    },
    enterAnimation: null,
    exitAnimation: null,
  },
  bodyText: {
    innerHTML: "Body Text",
    type: "text",
    style: {
      fontSize: 80,
      fontFamily: "Arial",
      width: 600,
      color: "#000000",
      textAlign: "left",
      position: "absolute",
      left: "100px",
      top: "250px",
    },
    enterAnimation: null,
    exitAnimation: null,
  },
};

const TextDrawer = () => {
  const { currentScene, addElementToScene } = useEditorStore();

  const handleAddTextTemplate = (
    templateType: "title" | "subtitle" | "bodyText"
  ) => {
    if (!currentScene) {
      toast.error("No scene selected. Please select a scene first.");
      return;
    }

    const template = TEMPLATES[templateType];

    const textElement = {
      elementData: {
        type: "text",
        style: template.style,
        innerHTML: template.innerHTML,
        enterAnimation: template.enterAnimation,
        exitAnimation: template.exitAnimation,
      },
      fromSecond: 0,
      toSecond: currentScene.durationInSeconds,
    };

    addElementToScene(currentScene.id, textElement);
    toast.success(`${template.innerHTML} element added to scene!`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* <h4>Text Templates</h4> */}

        <Button
          onClick={() => handleAddTextTemplate("title")}
          className="w-full justify-start"
          variant="outline"
          disabled={!currentScene}
        >
          <div className="font-bold text-lg">Title</div>
        </Button>

        <Button
          onClick={() => handleAddTextTemplate("subtitle")}
          className="w-full justify-start"
          variant="outline"
          disabled={!currentScene}
        >
          <div className="font-semibold text-base">Subtitle</div>
        </Button>

        <Button
          onClick={() => handleAddTextTemplate("bodyText")}
          className="w-full justify-start"
          variant="outline"
          disabled={!currentScene}
        >
          <div className="font-normal text-sm">Body Text</div>
        </Button>
      </div>

      {!currentScene && (
        <p className="text-sm text-muted-foreground text-center">
          Select a scene to add text elements
        </p>
      )}
    </div>
  );
};

export default TextDrawer;
