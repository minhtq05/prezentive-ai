import { useProjectsStore } from "@/stores/projects-store";

export const useProjects = () => {
  const store = useProjectsStore();

  return {
    // State
    projects: store.projects,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    fetchProjects: store.fetchProjects,
    addProject: store.addProject,
    updateProject: store.updateProject,
    deleteProject: store.deleteProject,
    restoreProject: store.restoreProject,

    // Computed values
    availableProjects: store.projects.filter((p) => !p.isDeleted),
    deletedProjects: store.projects.filter((p) => p.isDeleted),
    publicProjects: store.projects.filter((p) => p.isPublic),
    privateProjects: store.projects.filter((p) => !p.isPublic),
    templates: store.projects.filter((p) => p.isTemplate),
    projectCount: store.projects.length,
  };
};
