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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import { formatDate } from "@/lib/date";
import {
  AlertCircle,
  Calendar,
  Eye,
  Lock,
  LucideRotateCcw,
} from "lucide-react";

const RecentlyDeletedPage = () => {
  const { deletedProjects, restoreProject, error, isLoading } = useProjects();

  const handleRestoreProject = async (id: string) => {
    if (confirm("Are you sure you want to restore this project?")) {
      await restoreProject(id);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <h2>Recently Deleted</h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <h3>Projects</h3>
          {error && (
            <Alert variant="destructive" className="flex items-center">
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
          ) : !error && deletedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <p>Nothing's here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {deletedProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-md transition-shadow cursor-pointer shadow-none"
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
                          handleRestoreProject(project.id);
                        }}
                        className="text-muted-foreground"
                      >
                        <LucideRotateCcw />
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
        <Separator orientation="horizontal" />
        <div>
          <h3>Media</h3>
          <div className="flex flex-col items-center justify-center gap-2">
            <p>Nothing's here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyDeletedPage;
