import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteProject, ProjectInfo, updateProject } from "../actions";

export interface EditProjectDialogProps {
  infoEditingProject: ProjectInfo | null;
  setInfoEditingProject: (projectInfo: ProjectInfo | null) => void;
}

export default function EditProjectDialog({
  infoEditingProject,
  setInfoEditingProject,
}: EditProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateProject = async () => {
    if (!infoEditingProject || !name.trim()) return;

    toast.promise(updateProject(infoEditingProject.id, name, description), {
      loading: "Updating project...",
      success: (data: ProjectInfo | null) => {
        if (data) {
          // TODO: update projects list locally or refetch
          return `Project "${data.name}" updated successfully!`;
        } else {
          // TODO: fetch projects again
          return "Failed to update project.";
        }
      },
    });

    setInfoEditingProject(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    toast.promise(deleteProject(projectId), {
      loading: "Deleting project...",
      success: (deleted: boolean) => {
        if (!deleted) {
          // TODO: fetch projects again
          return "Failed to delete project.";
        }
        // TODO: update projects list locally
        return `Project deleted successfully!`;
      },
    });

    setInfoEditingProject(null);
  };

  useEffect(() => {
    if (infoEditingProject) {
      setName(infoEditingProject.name || "");
      setDescription(infoEditingProject.description || "");
    } else {
      setName("");
      setDescription("");
    }
    setIsDeleting(false);
  }, [infoEditingProject]);

  return (
    <Fragment>
      <Dialog
        open={!!infoEditingProject && !isDeleting}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setInfoEditingProject(null);
          }
        }}
      >
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-1 justify-start">
              <Button
                onClick={() => {
                  if (infoEditingProject) {
                    setIsDeleting(true);
                  }
                }}
                variant="destructive"
              >
                <Trash size="sm" />
                Delete
              </Button>
            </div>
            <Button onClick={handleUpdateProject} disabled={!name.trim()}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              onClick={() => {
                setIsDeleting(false);
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (infoEditingProject) {
                  handleDeleteProject(infoEditingProject.id);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
