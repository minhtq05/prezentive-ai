"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import { formatDate } from "@/lib/date";
import { AlertCircle, Calendar, Eye, Lock, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProjectsPage = () => {
  const router = useRouter();

  const {
    availableProjects,
    isLoading,
    error,
    projectCount,
    fetchProjects,
    deleteProject,
  } = useProjects();

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  const handleOpenProject = (id: string) => {
    router.push(`editor/${id}`);
  };

  return (
    <div className="p-8 flex flex-col gap-4">
      <h2>Projects</h2>
      <p className="text-muted-foreground">
        Manage and organize your projects ({projectCount} total)
      </p>

      {error && (
        <Alert variant="destructive" className="flex">
          <AlertCircle />
          <AlertDescription className="flex items-center justify-between">
            {/* {error} */}
            Error loading your projects. Please try again later.
          </AlertDescription>
          {/* <Button variant="ghost" onClick={clearError} className="ml-auto">
            Dismiss
          </Button> */}
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="h-[200px]">
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !error && availableProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <h3 className="text-lg font-semibold">No projects yet</h3>
          <p className="text-muted-foreground">
            Get started by creating your first video project.
          </p>
          <Link href="/projects/create-new-project">
            <Button>
              <Plus />
              Create Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {availableProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow cursor-pointer shadow-none"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenProject(project.id);
              }}
            >
              <CardHeader className="">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <CardTitle className="font-semibold truncate">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {project.isPublic ? (
                        <Badge variant="secondary" className="text-xs">
                          <Eye />
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Lock />
                          Private
                        </Badge>
                      )}
                      {project.isTemplate && (
                        <Badge variant="default" className="text-xs">
                          Template
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <CardDescription className="line-clamp-2">
                  {project.description || "No description provided"}
                </CardDescription>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Calendar className="size-3" />
                  Updated {formatDate(project.updatedAt)}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>v{project.revisionCount}</span>
                  <span>
                    Last accessed {formatDate(project.lastAccessedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
