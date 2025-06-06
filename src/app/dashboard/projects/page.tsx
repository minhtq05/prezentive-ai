"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/time";
import { Ellipsis, FileIcon, LayoutGrid, List, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProjects, ProjectInfo } from "./actions";
import {
  EditProjectDialog,
  NewProjectDialog,
  ProjectSkeletons,
  ProjectsTable,
} from "./components";

export default function Projects() {
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [infoEditingProject, setInfoEditingProject] =
    useState<ProjectInfo | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Handle keyboard events for project selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProjectId) {
        setSelectedProjectId(null);
      } else if (e.key === "Enter" && selectedProjectId) {
        navigateToProject(selectedProjectId);
      }
    };

    // Handle clicks outside of project cards
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If clicking outside any card and a project is selected, deselect it
      if (selectedProjectId && !target.closest("[data-project-card]")) {
        setSelectedProjectId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedProjectId]);

  const handleFetchProjects = async () => {
    async function fetchProjects() {
      const projects = await getProjects();
      setProjects(projects);
    }
    setIsLoading(true);
    fetchProjects().finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    handleFetchProjects();
  }, []);

  const handleEditProject = (project: ProjectInfo) => {
    setInfoEditingProject(project);
  };

  const navigateToProject = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  return (
    <>
      <div className="flex items-center gap-2 justify-end w-full">
        <div>
          <Button
            size="icon"
            variant={viewMode === "grid" ? "outline" : "ghost"}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid size="sm" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "table" ? "outline" : "ghost"}
            onClick={() => setViewMode("table")}
          >
            <List size="sm" />
          </Button>
        </div>
        <div className="p-2 h-full">
          <Separator orientation="vertical" />
        </div>
        <Button variant="link" onClick={() => handleFetchProjects()}>
          Reload
        </Button>
        <Select>
          <SelectTrigger className="w-36" variant="ghost">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="date_created">Date created</SelectItem>
              <SelectItem value="date_modified">Date modified</SelectItem>
            </SelectGroup>
            <Separator />
            <SelectGroup>
              <SelectLabel>Order</SelectLabel>
              <SelectItem value="oldest_first">Oldest first</SelectItem>
              <SelectItem value="newest_first">Newest first</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <NewProjectDialog />
      </div>
      <div>
        {isLoading ? (
          <ProjectSkeletons view={viewMode} />
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p>No projects yet. Create your first project to get started.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="flex flex-row flex-wrap gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer hover:bg-accent/50 transition-colors gap-2 py-0 shadow-none overflow-hidden relative ${
                  selectedProjectId === project.id
                    ? "outline outline-2 outline-offset-2 outline-primary-500"
                    : ""
                }`}
                onClick={() => setSelectedProjectId(project.id)}
                data-project-card
              >
                <div className="aspect-video bg-muted/30 flex items-center justify-center border-b w-64">
                  <FileIcon className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <CardHeader className="relative px-4 pb-4 pt-2 flex flex-row">
                  <div className="flex flex-col gap-1 w-full">
                    <CardTitle className="relative text-sm">
                      {project.name}
                    </CardTitle>
                    {/* <CardDescription className="relative line-clamp-2 text-sm text-muted-foreground">
                  {project.description || "No description"}
                  </CardDescription> */}
                    <div className="text-xs text-muted-foreground flex flex-row gap-1">
                      <User className="w-4 h-4" />
                      {formatDate(project.modified_at)}
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                    >
                      <Ellipsis size="sm" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Selection overlay */}
                {selectedProjectId === project.id && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-10">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToProject(project.id);
                      }}
                    >
                      Open
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <ProjectsTable
            projects={projects}
            navigateToProject={navigateToProject}
          />
        )}
      </div>
      <EditProjectDialog
        infoEditingProject={infoEditingProject}
        setInfoEditingProject={setInfoEditingProject}
      />
    </>
  );
}
