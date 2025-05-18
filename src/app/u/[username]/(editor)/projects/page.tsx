"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  Ellipsis,
  FileIcon,
  Grid,
  List,
  Plus,
  Trash,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  ProjectInfo,
  updateProject,
} from "./actions";

export default function Projects() {
  const router = useRouter();
  const { userId } = useAuth();

  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [infoEditingProject, setInfoEditingProject] =
    useState<ProjectInfo | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
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

  useEffect(() => {
    async function fetchProjects() {
      const projects = await getProjects();
      setProjects(projects);
    }
    fetchProjects().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleCreateProject = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const newProject = await createProject(userId || "", name, description);
      if (newProject) {
        setProjects((prev) => [newProject, ...prev]);
        setName("");
        setDescription("");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditDialog = (project: ProjectInfo) => {
    setInfoEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description || "");
    setEditDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!infoEditingProject || !editName.trim()) return;

    setIsLoading(true);
    try {
      const updatedProject = await updateProject(
        infoEditingProject.id,
        editName,
        editDescription
      );
      if (updatedProject) {
        setProjects((prev) =>
          prev.map((proj) =>
            proj.id === updatedProject.id ? updatedProject : proj
          )
        );
        setEditDialogOpen(false);
        setInfoEditingProject(null);
        setEditName("");
        setEditDescription("");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      console.log(error);
      return dateString.split("T")[0] || "Unknown date";
    }
  };

  const navigateToProject = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full py-4">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant={viewMode === "grid" ? "default" : "ghost"}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "table" ? "default" : "ghost"}
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a name and description for your new project.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter project name"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter project description"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateProject}
                  disabled={!name.trim() || isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="px-4">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <p>No projects yet. Create your first project to get started.</p>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="flex flex-row flex-wrap gap-4 w-fit">
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
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditDialog(project);
                    }}
                    size="sm"
                    className="h-full"
                  >
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </CardHeader>

                {/* Selection overlay */}
                {selectedProjectId === project.id && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-10">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToProject(project.id);
                      }}
                      className="w-24"
                    >
                      Open
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Modified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => navigateToProject(project.id)}
                  >
                    <TableCell>{project.name}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {project.description || "No description"}
                    </TableCell>
                    <TableCell>{formatDate(project.created_at)}</TableCell>
                    <TableCell>{formatDate(project.modified_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the details of your project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter project name"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter project description"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-1 justify-start">
              <Button
                onClick={() => {
                  if (infoEditingProject) {
                    setEditDialogOpen(false);
                    setIsDeleting(true);
                  }
                }}
                variant="destructive"
                disabled={isLoading}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            <Button
              onClick={handleUpdateProject}
              disabled={!editName.trim() || isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleting(false)}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (infoEditingProject) {
                  handleDeleteProject(infoEditingProject.id);
                  setIsDeleting(false);
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
