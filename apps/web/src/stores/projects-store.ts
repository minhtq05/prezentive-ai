import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { projectsApi } from "@/lib/api";
import { Project } from "@/types/projects";
import { toast } from "sonner";

const api = {
  fetchProjects: projectsApi.fetchProjects,
  createProject: projectsApi.createProject,
  updateProject: projectsApi.updateProject,
  deleteProject: projectsApi.deleteProject,
  restoreProject: projectsApi.restoreProject,
  fetchProject: projectsApi.fetchProject,
};

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  addProject: (
    project: Omit<
      Project,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "lastAccessedAt"
      | "revisionCount"
      | "isDeleted"
      | "deletedAt"
      | "userId"
    >
  ) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<Project>;
  restoreProject: (id: string) => Promise<Project>;
}

export const useProjectsStore = create<ProjectsState>()(
  devtools(
    (set, get) => ({
      projects: [],
      isLoading: false,
      error: null,

      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const projects = await api.fetchProjects();
          set({ projects, isLoading: false });
          toast.success("Projects fetched successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch projects";
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
        }
      },

      addProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          const newProject = await api.createProject(projectData);
          set((state) => ({
            projects: [...state.projects, newProject],
            isLoading: false,
          }));
          toast.success("Project created successfully");
          return newProject;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to add project";
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
          return null;
        }
      },

      updateProject: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedProject = await api.updateProject(id, updates);
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? { ...project, ...updatedProject } : project
            ),
            isLoading: false,
          }));
          toast.success("Project updated successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update project";
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
        }
      },

      deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const deletedProject = await api.deleteProject(id);
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? deletedProject : project
            ),
            isLoading: false,
          }));
          toast.success("Project deleted successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete project";
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
        }
      },

      restoreProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const restoredProject = await api.restoreProject(id);
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? restoredProject : project
            ),
            isLoading: false,
          }));
          toast.success("Project restored successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to restore project";
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
        }
      },
    }),
    {
      name: "projects-store",
    }
  )
);
