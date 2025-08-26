"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { defaultAnimations } from "@/lib/animations";
import { useEditorStore } from "@/stores/editor-store";
import { SceneElement } from "@/types/editor";
import { Player } from "@remotion/player";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Trash2 } from "lucide-react";
import { CSSProperties, useEffect, useMemo } from "react";
import { flushSync } from "react-dom";
import Moveable, { MoveableProps } from "react-moveable";
import { AbsoluteFill, Series } from "remotion";
import { Animated, Animation } from "remotion-animated";

export const EditorPlayer = () => {
  const setPlayerRefElement = useEditorStore(
    (state) => state.setPlayerRefElement
  );
  const durationInSeconds = useEditorStore((state) => state.durationInSeconds);
  const { fps, width, height } = useEditorStore((state) => state.orientation);

  return (
    <div className="flex items-center justify-center aspect-video w-full max-h-full p-2">
      <div className="flex items-center justify-center aspect-video max-w-full h-full border-1">
        {durationInSeconds > 0 ? (
          <Player
            ref={setPlayerRefElement}
            component={RemotionComponent}
            // component={DemoComponent}
            durationInFrames={durationInSeconds * fps}
            compositionWidth={width}
            compositionHeight={height}
            fps={fps}
            className="remotion-player"
            style={{ width: "100%", position: "relative" }}
            acknowledgeRemotionLicense
          />
        ) : (
          <div>Create a new scene to start editing</div>
        )}
      </div>
    </div>
  );
};

const RemotionComponent = () => {
  const scenes = useEditorStore((state) => state.scenes);
  const { fps } = useEditorStore((state) => state.orientation);
  const selectedObjectId = useEditorStore(
    (state) => state.selectedObject?.id || null
  );
  const selectObject = useEditorStore((state) => state.selectObject);

  return (
    <AbsoluteFill
      style={{ backgroundColor: "white", position: "relative" }}
      onClick={() => selectObject(null)}
      onContextMenu={() => selectObject(null)}
    >
      <Series>
        {scenes.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInSeconds * fps}
          >
            {scene.sceneElements.map((element) => {
              if (selectedObjectId === element.id) {
                return null;
              }
              if (element.elementData === undefined) {
                return null;
              }
              const { id, fromSecond, toSecond } = element;
              const { style, innerHTML, enterAnimation, exitAnimation } =
                element.elementData;
              const animations: Animation[] = [];
              if (enterAnimation) {
                animations.push(
                  ...defaultAnimations[enterAnimation]({
                    fromSecond,
                    animationDurationInSeconds: 2,
                    fps,
                  })
                );
              }
              if (exitAnimation) {
                animations.push(
                  ...defaultAnimations[exitAnimation]({
                    fromSecond: toSecond - 2,
                    animationDurationInSeconds: 2,
                    fps,
                  })
                );
              }

              return (
                <div
                  key={id}
                  id={id}
                  style={style}
                  className="select-none text-wrap wrap-anywhere"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectObject(element);
                  }}
                  onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    selectObject(element);
                  }}
                >
                  <AnimationsWrapper animations={animations}>
                    <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
                  </AnimationsWrapper>
                </div>
              );
            })}
          </Series.Sequence>
        ))}
      </Series>
      <Overlay />
    </AbsoluteFill>
  );
};

// const DemoComponent = () => {
//   return (
//     <AbsoluteFill style={{ backgroundColor: "white" }}>
//       <Animated
//         style={{ position: "absolute", top: 1000, left: 1000 }}
//         animations={[
//           Scale({ by: 1, initial: 10 }),
//           Move({ y: -40, start: 50 }),
//           Move({ y: 40, start: 100 }),
//           Fade({ to: 0, start: 150 }),
//           Scale({ by: 0, start: 150, mass: 75 }),
//         ]}
//       >
//         <p
//           className="text-6xl text-black"
//           style={{ position: "absolute", top: 540, left: 960 }}
//         >
//           Testing
//         </p>
//       </Animated>
//     </AbsoluteFill>
//   );
// };

const MOVEABLE_CONFIGS: Partial<MoveableProps> = {
  draggable: true,
  edgeDraggable: true,
  throttleDrag: 1,

  startDragRotate: 0,
  throttleDragRotate: 0,
  zoom: 1.5,

  resizable: false,
  renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],

  snappable: true,
  snapDirections: {
    top: true,
    left: true,
    bottom: true,
    right: true,
    center: true,
    middle: true,
  },
  elementSnapDirections: {
    top: true,
    left: true,
    bottom: true,
    right: true,
    center: true,
    middle: true,
  },
  snapThreshold: 20,

  verticalGuidelines: [0, 960, 1920],
  horizontalGuidelines: [0, 540, 1080],
  checkInput: true,

  padding: 10,
};

const Overlay = () => {
  const overlay = useEditorStore((state) => state.overlay);
  const setOverlay = useEditorStore((state) => state.setOverlay);
  const setEditor = useEditorStore((state) => state.setRichTextEditor);
  const editor = useEditor({
    extensions: [StarterKit], // Document, Paragraph, Text,
    immediatelyRender: true,
    autofocus: "all",
    editorProps: {
      attributes: {
        class: "outline-[0px]",
      },
    },
    onBlur: ({ editor }) => {
      if (!overlay) return null;
      const content = editor.getHTML();
      if (overlay.elementData.innerHTML === content) return overlay;
      setOverlay({
        ...overlay,
        elementData: {
          ...overlay.elementData,
          innerHTML: content,
        },
      });
    },
  });
  const selectedObject = useEditorStore((state) => state.selectedObject);
  const updateElementInScene = useEditorStore(
    (state) => state.updateElementInScene
  );
  const setEnableAnimations = useEditorStore(
    (state) => state.setEnableAnimations
  );
  const scenes = useEditorStore((state) => state.scenes);

  useEffect(() => {
    setEditor(editor);
  }, [editor]);

  useEffect(() => {
    if (!overlay) return;
    editor.commands.setContent(overlay.elementData.innerHTML as string);
    editor.commands.focus("all");
  }, [overlay?.id]);

  // Function to find which scene contains the element
  const findSceneForElement = (elementId: string) => {
    return scenes.find((scene) =>
      scene.sceneElements.some((element) => element.id === elementId)
    );
  };

  useEffect(() => {
    setEnableAnimations(false);

    if (selectedObject) {
      if (overlay && selectedObject.id !== overlay.id) {
        // Commit changes for previous overlay
        const previousScene = findSceneForElement(overlay.id);
        if (previousScene) {
          updateElementInScene(previousScene.id, overlay.id, overlay);
        }
      }
      setOverlay(selectedObject);
    } else {
      if (overlay) {
        // Commit changes for current overlay before clearing
        const currentScene = findSceneForElement(overlay.id);
        if (currentScene) {
          updateElementInScene(currentScene.id, overlay.id, overlay);
        }
      }
      setOverlay(null);
    }
  }, [selectedObject, updateElementInScene, scenes, setEnableAnimations]);

  const providerValue = useMemo(() => ({ editor }), [editor]);

  const updateOverlay = (updates: Partial<SceneElement>) => {
    if (overlay) {
      setOverlay({ ...overlay, ...updates });
    }
  };

  if (!overlay || overlay.elementData === undefined) {
    return null;
  }

  const style = overlay.elementData.style as CSSProperties;

  return (
    <>
      <EditorContext.Provider value={providerValue}>
        <ElementWrapper>
          <EditorContent
            id={`${overlay.id}_overlay`}
            style={style}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.stopPropagation()}
            editor={editor}
          />
        </ElementWrapper>
      </EditorContext.Provider>
      <Moveable
        target={`#${overlay.id}_overlay`}
        onDrag={(e) => {
          e.target.style.left = `${e.left}px`;
          e.target.style.top = `${e.top}px`;
        }}
        onDragEnd={(e) => {
          if (!e.lastEvent) return;
          const newLeft = e.lastEvent.left;
          const newTop = e.lastEvent.top;

          // Update overlay with new position
          updateOverlay({
            elementData: {
              ...overlay.elementData,
              style: {
                ...overlay.elementData.style,
                left: `${newLeft}px`,
                top: `${newTop}px`,
              },
            },
          });
        }}
        flushSync={flushSync}
        {...MOVEABLE_CONFIGS}
      />
    </>
  );
};

const ElementWrapper = ({ children }: { children: React.ReactNode }) => {
  const overlay = useEditorStore((state) => state.overlay);
  const deleteElementFromScene = useEditorStore(
    (state) => state.deleteElementFromScene
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => deleteElementFromScene(overlay.id)}>
          <Trash2 />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const AnimationsWrapper = ({
  children,
  animations,
}: {
  children?: React.ReactNode;
  animations: Animation[];
}) => {
  const enableAnimations = useEditorStore((state) => state.enableAnimations);

  return (
    <Animated animations={enableAnimations ? animations : []}>
      {children}
    </Animated>
  );
};
