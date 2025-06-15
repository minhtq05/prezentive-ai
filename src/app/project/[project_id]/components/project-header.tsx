import useEditorStore from "@/store/project/editor-store";
import { SceneUpdatingStatus } from ".";

export default function ProjectHeader() {
  const ProjectInfo = useEditorStore((state) => state.projectInfo);

  return (
    <div className="flex items-center w-full">
      {ProjectInfo && (
        <div className="flex flex-col">
          <span className="font-semibold">{ProjectInfo.name}</span>
          <span className="text-sm text-muted-foreground">
            {ProjectInfo.description || "Workspace"}
          </span>
        </div>
      )}
      <div className="ml-auto flex items-center gap-2">
        <SceneUpdatingStatus />
      </div>
    </div>
  );
}
