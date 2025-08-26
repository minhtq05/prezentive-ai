import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { getFrameFromX, PIXELS_PER_SECOND } from "@/lib/frame";
import { useEditorStore } from "@/stores/editor-store";
import { Scene } from "@/types/editor";
import { convert } from "html-to-text";
import { Pause, Play, Trash2 } from "lucide-react";
import { useMemo, useRef } from "react";

const EditorTimeline = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);
  const scenes = useEditorStore((state) => state.scenes);
  const durationInSeconds = useEditorStore((state) => state.durationInSeconds);
  const frame = useEditorStore((state) => state.frame);
  const { fps } = useEditorStore((state) => state.orientation);
  const currentSceneNumber = useEditorStore(
    (state) => state.currentSceneNumber
  );
  const playing = useEditorStore((state) => state.playing);
  const toggle = useEditorStore((state) => state.toggle);
  const deleteScene = useEditorStore((state) => state.deleteScene);

  const playheadPosition = useMemo(() => {
    return (frame * PIXELS_PER_SECOND) / fps + currentSceneNumber * 24;
  }, [frame, durationInSeconds]);

  return (
    <div className="size-full rounded-md bg-sidebar flex flex-col gap-2 p-4">
      <div className="flex-none w-full relative flex justify-center">
        <Button onClick={() => toggle()}>
          {playing ? <Pause /> : <Play />}
        </Button>
      </div>
      <div
        ref={ref}
        className="flex-auto relative min-h-fit flex overflow-x-auto"
      >
        <div
          ref={containerRef}
          className="relative flex m-4 mt-8 gap-[24px]"
          // onClick={(e) => handleMoveFrame(e.clientX)}
        >
          <div
            className="absolute w-8 h-6 -translate-x-4 -translate-y-7 bg-primary rounded-sm flex justify-center"
            style={{ left: playheadPosition }}
          >
            <p className="text-primary-foreground">
              {(frame / fps).toFixed(1)}
            </p>
          </div>
          <div
            className="absolute top-0 h-full w-px bg-primary"
            style={{ left: playheadPosition }}
          />
          {scenes.map((scene, index) => (
            <SceneFilm
              key={scene.id}
              scene={scene}
              active={currentSceneNumber === index}
              onDelete={() => deleteScene(scene.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SceneFilm = ({
  scene,
  active,
  onDelete,
}: {
  scene: Scene;
  active: boolean;
  onDelete: () => void;
}) => {
  const sceneWidth = scene.durationInSeconds * PIXELS_PER_SECOND;

  return (
    <div className="flex flex-col gap-1">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            style={{ width: sceneWidth }}
            className={`flex-none h-22 border-2 border-solid rounded-md relative bg-primary/5 ${
              active ? "border-primary" : "border-primary/10"
            }`}
            onClick={(e) => {
              const {
                scenes,
                durationInSeconds,
                pause,
                seekTo,
                orientation: { fps },
              } = useEditorStore.getState();
              let currentDurationInSeconds = 0;

              for (let i = 0; i < scenes.length; i++) {
                if (scenes[i].id === scene.id) {
                  break;
                }
                currentDurationInSeconds += scenes[i].durationInSeconds;
              }

              const posLeft = e.currentTarget.getBoundingClientRect().left;

              pause();

              seekTo(
                getFrameFromX(
                  currentDurationInSeconds * PIXELS_PER_SECOND +
                    (e.clientX - posLeft),
                  durationInSeconds,
                  fps
                )
              );
            }}
          >
            Scene
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onDelete}>
            <Trash2 />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="grow h-9 max-h-fit w-full overflow-auto flex flex-col gap-1">
        {!scene.sceneElements.length && (
          <div className="w-full h-8 bg-primary/2 border-1 border-primary/10 border-dashed rounded-sm flex items-center p-4">
            No elements
          </div>
        )}
        {scene.sceneElements.map((element) => {
          return (
            <div
              style={{ width: sceneWidth }}
              className="h-9 bg-primary/5 border-1 border-primary/10 rounded-sm flex items-center p-4 whitespace-nowrap overflow-hidden text-ellipsis"
              key={element.id}
            >
              {convert(element.elementData?.innerHTML) ||
                element.elementData?.type}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditorTimeline;
