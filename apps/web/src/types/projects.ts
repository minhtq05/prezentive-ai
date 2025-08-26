export interface Project {
  id: string;
  title: string;
  description: string;
  userId: string;
  isPublic: boolean;
  isTemplate: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastAccessedAt: Date | string;
  revisionCount: number;
  isDeleted: boolean;
  deletedAt: Date | string | null;
}

export interface ProjectOrientation {
  id: string;
  userId: string;
  width: number;
  height: number;
  fps: number;
  durationInSeconds: number;
}
