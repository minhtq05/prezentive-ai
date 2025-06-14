import useEditorStore from "@/store/editor-store";
import { SceneUpdatingStatus } from ".";

export default function ProjectHeader() {
  const currentProjectInfo = useEditorStore(
    (state) => state.currentProjectInfo
  );

  return (
    <div className="flex items-center w-full">
      {currentProjectInfo && (
        <div className="flex flex-col">
          <span className="font-semibold">{currentProjectInfo.name}</span>
          <span className="text-sm text-muted-foreground">
            {currentProjectInfo.description || "Workspace"}
          </span>
        </div>
      )}
      <div className="ml-auto flex items-center gap-2">
        <SceneUpdatingStatus />
      </div>
    </div>
  );
}
