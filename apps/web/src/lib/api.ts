import { RenderedVideo, Scene, SceneElement } from "@/types/editor";
import { Project, ProjectOrientation } from "@/types/projects";
import axios from "axios";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
export const REMOTION_API_BASE =
  process.env.NEXT_PUBLIC_REMOTION_API_URL || "http://localhost:3002/api/";

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const remotionApiClient = axios.create({
  baseURL: REMOTION_API_BASE,
  withCredentials: true,
});

export const projectsApi = {
  async fetchProjects(): Promise<Project[]> {
    const res = await apiClient.get<Project[]>("/projects");
    return res.data;
  },

  async createProject(
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
  ): Promise<Project> {
    try {
      const res = await apiClient.post<Project>("/projects", project);
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to create new project");
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const res = await apiClient.post<Project>(`/projects/${id}`, updates);
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update project");
    }
  },

  async deleteProject(id: string): Promise<Project> {
    try {
      const res = await apiClient.post(`/projects/${id}/delete`);
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete project");
    }
  },

  async restoreProject(id: string): Promise<Project> {
    try {
      const res = await apiClient.post<Project>(`/projects/${id}/restore`);
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to restore project");
    }
  },

  async fetchProject(id: string): Promise<Project> {
    try {
      const res = await apiClient.get<Project>(`/projects/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch project");
    }
  },
};

export const scenesApi = {
  async fetchScenesFromProject(id: string): Promise<Scene[]> {
    try {
      const res = await apiClient.get<Scene[]>(`/projects/${id}/scenes`);
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch scenes");
    }
  },

  async fetchProjectOrientation(id: string): Promise<ProjectOrientation> {
    try {
      const res = await apiClient.get<ProjectOrientation>(
        `/projects/${id}/orientation`
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch project orientation");
    }
  },

  async addScene(
    projectId: string,
    scene: Scene,
    index: number
  ): Promise<Scene> {
    try {
      const res = await apiClient.post<Scene>(
        `/projects/${projectId}/scenes/`,
        { ...scene, sceneNumber: index }
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to add scene");
    }
  },

  async deleteScene(id: string): Promise<Scene> {
    try {
      const res = await apiClient.post<Scene>(`/projects/scenes/${id}/delete`);
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete scene");
    }
  },

  async addElementToScene(
    sceneId: string,
    element: SceneElement
  ): Promise<SceneElement> {
    try {
      const res = await apiClient.post<SceneElement>(
        `/projects/scenes/${sceneId}/elements`,
        element
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to add element to scene");
    }
  },

  async updateElement(
    elementId: string,
    updates: Partial<SceneElement>
  ): Promise<SceneElement> {
    try {
      const res = await apiClient.post<SceneElement>(
        `/projects/scenes/elements/${elementId}`,
        updates
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update element");
    }
  },

  async deleteElement(elementId: string): Promise<SceneElement> {
    try {
      const res = await apiClient.post<SceneElement>(
        `/projects/scenes/elements/${elementId}/delete`
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete element");
    }
  },

  async fetchProjectScripts(projectId: string): Promise<any[]> {
    try {
      const res = await apiClient.get<any[]>(`/projects/${projectId}/scripts`);
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch scripts");
    }
  },

  async updateSceneScript(sceneId: string, script: string): Promise<any> {
    try {
      const res = await apiClient.post<any>(
        `/projects/scenes/${sceneId}/script`,
        { script }
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update script");
    }
  },
};

export const renderApi = {
  async renderProject(projectId: string): Promise<any> {
    try {
      const res = await remotionApiClient.post<any>(`/render/${projectId}`, {
        responseType: "blob",
      });
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to render project");
    }
  },

  async fetchRenderedVideos(projectId: string): Promise<RenderedVideo[]> {
    try {
      const res = await remotionApiClient.get<RenderedVideo[]>(
        `/render/${projectId}`
      );
      return res.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch rendered videos");
    }
  },
};
