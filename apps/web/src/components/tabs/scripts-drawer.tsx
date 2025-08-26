import { Textarea } from "@/components/ui/textarea";
import { scenesApi } from "@/lib/api";
import { useEditorStore } from "@/stores/editor-store";
import { SceneScript } from "@/types/editor";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ScriptsDrawer = () => {
  const [scripts, setScripts] = useState<SceneScript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
  const project = useEditorStore((state) => state.project);

  // Load scripts when component mounts
  useEffect(() => {
    if (project?.id) {
      loadScripts();
    }
  }, [project?.id]);

  const loadScripts = async () => {
    if (!project?.id) return;

    try {
      setIsLoading(true);
      const data = await scenesApi.fetchProjectScripts(project.id);
      setScripts(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load scripts"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateScript = async (sceneId: string, script: string) => {
    const originalScript = scripts.find((s) => s.id === sceneId)?.script?.text;
    if (originalScript === script) return;
    try {
      await scenesApi.updateSceneScript(sceneId, script);
      // Update local state
      setScripts((prev) =>
        prev.map((scene) =>
          scene.id === sceneId ? { ...scene, script: { text: script } } : scene
        )
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update script"
      );
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading scripts...</div>;
  }

  return (
    <div className="space-y-4">
      {/* <h4 className="font-medium">Scene Scripts</h4> */}

      {scripts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No scenes found. Add scenes to start writing scripts.
        </p>
      ) : (
        scripts.map((scene) => (
          <div
            key={scene.id}
            className="border rounded-lg p-3 space-y-2 hover:bg-accent/50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                Scene {scene.sceneNumber + 1}
              </label>
            </div>

            {editingScriptId === scene.id ? (
              <Textarea
                autoFocus
                placeholder="Write your script here..."
                defaultValue={scene.script?.text || ""}
                onBlur={(e) => {
                  // Update on blur and close editing
                  updateScript(scene.id, e.target.value);
                  setEditingScriptId(null);
                }}
                onKeyDown={(e) => {
                  // Update on Ctrl/Cmd + Enter
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                  // Cancel on Escape
                  if (e.key === "Escape") {
                    setEditingScriptId(null);
                    e.currentTarget.blur();
                  }
                }}
                className="min-h-[100px] resize-y"
                rows={4}
              />
            ) : (
              <p
                onClick={() => setEditingScriptId(scene.id)}
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors line-clamp-4 min-h-[60px] break-words"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical" as any,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  wordWrap: "break-word",
                }}
              >
                {scene.script?.text || "Click to add script..."}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ScriptsDrawer;
