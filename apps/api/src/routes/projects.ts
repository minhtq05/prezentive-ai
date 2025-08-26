import { db, eq, inArray, schema, sql } from "@video/db";
import { Router } from "express";
import { authMiddleware } from "../middleware";

export default async function getProjectsRouter() {
  const projectsRouter: Router = Router();

  projectsRouter.use(authMiddleware);

  // GET /projects - Fetch all projects for the authenticated user
  projectsRouter.get("/", async (req, res) => {
    try {
      const projects = await db
        .select()
        .from(schema.projects)
        .orderBy(schema.projects.updatedAt);

      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).send("Failed to fetch projects");
    }
  });

  // POST /projects - Create a new project
  projectsRouter.post("/", async (req, res) => {
    try {
      const { title, description, isPublic, isTemplate, fps, orientation } =
        req.body;
      const userId = (req as any).user.id;

      // Basic validation
      if (title && typeof title !== "string") {
        return res.status(400).send("Title must be a string");
      }
      if (description && typeof description !== "string") {
        return res.status(400).send("Description must be a string");
      }

      const { width, height } =
        orientation === "landscape"
          ? { width: 1920, height: 1080 }
          : { width: 1080, height: 1920 };

      const [project] = await db
        .insert(schema.projects)
        .values({
          title: title || "Untitled Project",
          description: description || "",
          userId,
          isPublic: Boolean(isPublic),
          isTemplate: Boolean(isTemplate),
        })
        .returning();

      await db.insert(schema.projectsOrientation).values({
        projectId: project.id,
        userId,
        width,
        height,
        fps: fps || 30,
        durationInSeconds: 0,
      });

      res.status(200).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).send("Failed to create project");
    }
  });

  // GET /projects/:id - Fetch a specific project
  projectsRouter.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send("Project ID is required");
      }

      const [project] = await db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.id, id));

      if (!project) {
        return res.status(404).send("Project not found");
      }

      res.status(200).json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).send("Failed to fetch project");
    }
  });

  // POST /projects/:id - Update a project metadata
  projectsRouter.post("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, isPublic, isTemplate } = req.body;

      const [updatedProject] = await db
        .update(schema.projects)
        .set({
          title,
          description,
          isPublic,
          isTemplate,
          updatedAt: new Date(),
        })
        .where(eq(schema.projects.id, id))
        .returning();

      if (!updatedProject) {
        return res.status(404).send("Project not found");
      }

      res.status(200).json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).send("Failed to update project");
    }
  });

  // GET /projects/:id/orientation - Get project orientation
  projectsRouter.get("/:id/orientation", async (req, res) => {
    try {
      const { id } = req.params;

      const [orientation] = await db
        .select()
        .from(schema.projectsOrientation)
        .where(eq(schema.projectsOrientation.projectId, id));

      if (!orientation) {
        return res.status(404).send("Project orientation not found");
      }

      res.status(200).json(orientation);
    } catch (error) {
      console.error("Error fetching project orientation:", error);
      res.status(500).send("Failed to fetch project orientation");
    }
  });

  // POST /projects/:id/orientation - Create or update project orientation
  projectsRouter.post("/:id/orientation", async (req, res) => {
    try {
      const { id } = req.params;
      const { width, height, fps, durationInSeconds } = req.body;
      const userId = (req as any).user.id;

      // Check if orientation exists
      const [existingOrientation] = await db
        .select()
        .from(schema.projectsOrientation)
        .where(eq(schema.projectsOrientation.projectId, id));

      let orientation;

      if (existingOrientation) {
        // Update existing orientation
        [orientation] = await db
          .update(schema.projectsOrientation)
          .set({
            width,
            height,
            fps,
            durationInSeconds,
          })
          .where(eq(schema.projectsOrientation.projectId, id))
          .returning();
      } else {
        // Create new orientation
        [orientation] = await db
          .insert(schema.projectsOrientation)
          .values({
            projectId: id,
            userId,
            width,
            height,
            fps: fps || 30,
            durationInSeconds: durationInSeconds || 0,
          })
          .returning();
      }

      res.status(200).json(orientation);
    } catch (error) {
      console.error("Error creating/updating project orientation:", error);
      res.status(500).send("Failed to create/update project orientation");
    }
  });

  // POST /projects/:id/delete - Delete a project (soft delete)
  projectsRouter.post("/:id/delete", async (req, res) => {
    try {
      const { id } = req.params;

      const [deletedProject] = await db
        .update(schema.projects)
        .set({
          isDeleted: true,
          deletedAt: new Date(),
        })
        .where(eq(schema.projects.id, id))
        .returning();

      if (!deletedProject) {
        return res.status(404).send("Project not found");
      }

      res.status(200).json(deletedProject);
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).send("Failed to delete project");
    }
  });

  // POST /projects/:id/restore - Restore a project (undelete)
  projectsRouter.post("/:id/restore", async (req, res) => {
    try {
      const { id } = req.params;

      const [restoredProject] = await db
        .update(schema.projects)
        .set({
          isDeleted: false,
          deletedAt: null,
        })
        .where(eq(schema.projects.id, id))
        .returning();

      if (!restoredProject) {
        return res.status(404).send("Project not found");
      }

      res.status(200).json(restoredProject);
    } catch (error) {
      console.error("Error restoring project:", error);
      res.status(500).send("Failed to restore project");
    }
  });

  // GET projects/:id/scenes - Get all scenes for a project
  projectsRouter.get("/:id/scenes", async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch all scenes for the project with their scripts
      const scenes = await db
        .select({
          id: schema.scenes.id,
          durationInSeconds: schema.scenes.durationInSeconds,
          script: schema.sceneScripts.script,
        })
        .from(schema.scenes)
        .leftJoin(
          schema.sceneScripts,
          eq(schema.scenes.id, schema.sceneScripts.sceneId)
        )
        .where(eq(schema.scenes.projectId, id))
        .orderBy(schema.scenes.sceneNumber);

      // Fetch all scene elements for these scenes
      const sceneIds = scenes.map((scene) => scene.id);
      let sceneElements: any[] = [];
      if (sceneIds.length > 0) {
        sceneElements = await db
          .select({
            id: schema.sceneElements.id,
            sceneId: schema.sceneElements.sceneId,
            elementData: schema.sceneElements.elementData,
            fromSecond: schema.sceneElements.fromSecond,
            toSecond: schema.sceneElements.toSecond,
          })
          .from(schema.sceneElements)
          .where(inArray(schema.sceneElements.sceneId, sceneIds));
      }

      // Attach scene elements to each scene
      const scenesWithElements = scenes.map((scene) => ({
        ...scene,
        sceneElements: sceneElements.filter((el) => el.sceneId === scene.id),
      }));

      res.status(200).json(scenesWithElements);
    } catch (error) {
      console.error("Error fetching scenes", error);
      res.status(500).send("Failed to fetch scenes");
    }
  });

  // POST /projects/:id/scenes - Create a new scene
  projectsRouter.post("/:id/scenes", async (req, res) => {
    try {
      const { id } = req.params;
      const { id: sceneId, sceneNumber, script } = req.body;
      const userId = (req as any).user.id;

      // If sceneNumber is not provided, get the next available number
      let nextSceneNumber = sceneNumber;

      if (nextSceneNumber === undefined) {
        const lastScene = await db
          .select({ sceneNumber: schema.scenes.sceneNumber })
          .from(schema.scenes)
          .where(eq(schema.scenes.projectId, id))
          .orderBy(sql`${schema.scenes.sceneNumber} DESC`)
          .limit(1);

        nextSceneNumber =
          lastScene.length > 0 ? lastScene[0].sceneNumber + 1 : 0;
      }

      // Create the scene
      const [scene] = await db
        .insert(schema.scenes)
        .values({
          projectId: id,
          id: sceneId,
          userId,
          sceneNumber: nextSceneNumber,
        })
        .returning();

      // Create a default script for the scene
      const [sceneScript] = await db
        .insert(schema.sceneScripts)
        .values({
          sceneId: scene.id,
          userId,
          script: { text: script || "" },
        })
        .returning();

      // Return the scene with the script attached
      const sceneWithScript = {
        ...scene,
        script: sceneScript.script,
      };

      res.status(200).json(sceneWithScript);
    } catch (error) {
      console.error("Error creating scene:", error);
      res.status(500).send("Failed to create scene");
    }
  });

  // POST /projects/scenes/:sceneId - Update a scene
  projectsRouter.post("/scenes/:sceneId", async (req, res) => {
    try {
      const { sceneId } = req.params;
      const updateData = req.body;

      const [updatedScene] = await db
        .update(schema.scenes)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(schema.scenes.id, sceneId))
        .returning();

      if (!updatedScene) {
        return res.status(404).send("Scene not found");
      }

      res.status(200).json(updatedScene);
    } catch (error) {
      console.error("Error updating scene:", error);
      res.status(500).send("Failed to update scene");
    }
  });

  // POST /projects/scenes/:sceneId/delete - Delete a scene
  projectsRouter.post("/scenes/:sceneId/delete", async (req, res) => {
    try {
      const { sceneId } = req.params;

      const [deletedScene] = await db
        .delete(schema.scenes)
        .where(eq(schema.scenes.id, sceneId))
        .returning();

      if (!deletedScene) {
        return res.status(404).send("Scene not found");
      }

      res.status(200).json(deletedScene);
    } catch (error) {
      console.error("Error deleting scene:", error);
      res.status(500).send("Failed to delete scene");
    }
  });

  // POST /projects/scenes/:sceneId/elements - Add element to a scene
  projectsRouter.post("/scenes/:sceneId/elements", async (req, res) => {
    try {
      const { sceneId } = req.params;
      const {
        id: elementId,
        elementData,
        fromSecond,
        toSecond,
        elementNumber,
      } = req.body;
      const userId = (req as any).user.id;

      // Verify scene exists and belongs to user
      const [scene] = await db
        .select()
        .from(schema.scenes)
        .where(eq(schema.scenes.id, sceneId));

      if (!scene) {
        return res.status(404).send("Scene not found");
      }

      // If elementNumber is not provided, get the next available number
      let nextElementNumber = elementNumber;

      if (nextElementNumber === undefined) {
        const lastElement = await db
          .select({ elementNumber: schema.sceneElements.elementNumber })
          .from(schema.sceneElements)
          .where(eq(schema.sceneElements.sceneId, sceneId))
          .orderBy(sql`${schema.sceneElements.elementNumber} DESC`)
          .limit(1);

        nextElementNumber =
          lastElement.length > 0 ? lastElement[0].elementNumber + 1 : 0;
      }

      const [element] = await db
        .insert(schema.sceneElements)
        .values({
          id: elementId,
          userId,
          sceneId,
          elementNumber: nextElementNumber,
          elementData: elementData || {},
          fromSecond: fromSecond || 0,
          toSecond: toSecond || -1,
        })
        .returning();

      res.status(200).json(element);
    } catch (error) {
      console.error("Error adding element to scene:", error);
      res.status(500).send("Failed to add element to scene");
    }
  });

  // POST /projects/scenes/elements/:elementId - Update an element
  projectsRouter.post("/scenes/elements/:elementId", async (req, res) => {
    try {
      const { elementId } = req.params;
      const updateData = req.body;
      const userId = (req as any).user.id;

      // Verify element exists and belongs to user
      const [existingElement] = await db
        .select()
        .from(schema.sceneElements)
        .where(eq(schema.sceneElements.id, elementId));

      if (!existingElement) {
        return res.status(404).send("Element not found");
      }

      if (existingElement.userId !== userId) {
        return res.status(403).send("Unauthorized to update this element");
      }

      const [updatedElement] = await db
        .update(schema.sceneElements)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(schema.sceneElements.id, elementId))
        .returning();

      if (!updatedElement) {
        return res.status(404).send("Element not found");
      }

      res.status(200).json(updatedElement);
    } catch (error) {
      console.error("Error updating element:", error);
      res.status(500).send("Failed to update element");
    }
  });

  // POST /projects/scenes/elements/:elementId/delete - Delete an element
  projectsRouter.post(
    "/scenes/elements/:elementId/delete",
    async (req, res) => {
      try {
        const { elementId } = req.params;
        const userId = (req as any).user.id;

        // Verify element exists and belongs to user
        const [existingElement] = await db
          .select()
          .from(schema.sceneElements)
          .where(eq(schema.sceneElements.id, elementId));

        if (!existingElement) {
          return res.status(404).send("Element not found");
        }

        if (existingElement.userId !== userId) {
          return res.status(403).send("Unauthorized to delete this element");
        }

        const [deletedElement] = await db
          .delete(schema.sceneElements)
          .where(eq(schema.sceneElements.id, elementId))
          .returning();

        if (!deletedElement) {
          return res.status(404).send("Element not found");
        }

        res.status(200).json(deletedElement);
      } catch (error) {
        console.error("Error deleting element:", error);
        res.status(500).send("Failed to delete element");
      }
    }
  );

  // Implement deleting element function here

  // GET /projects/:id/scripts - Get all scripts for scenes in a project
  projectsRouter.get("/:id/scripts", async (req, res) => {
    try {
      const { id } = req.params;

      // Use LEFT JOIN to get all scenes with their scripts and return all sceneScripts properties
      const scenesWithScripts = await db
        .select({
          id: schema.scenes.id,
          sceneNumber: schema.scenes.sceneNumber,
          script: schema.sceneScripts.script,
          createdAt: schema.sceneScripts.createdAt,
          updatedAt: schema.sceneScripts.updatedAt,
          userId: schema.sceneScripts.userId,
        })
        .from(schema.scenes)
        .leftJoin(
          schema.sceneScripts,
          eq(schema.scenes.id, schema.sceneScripts.sceneId)
        )
        .where(eq(schema.scenes.projectId, id))
        .orderBy(schema.scenes.sceneNumber);

      res.status(200).json(scenesWithScripts);
    } catch (error) {
      console.error("Error fetching scripts:", error);
      res.status(500).send("Failed to fetch scripts");
    }
  });

  // POST /projects/scenes/:sceneId/script - Create or update script for a scene
  projectsRouter.post("/scenes/:sceneId/script", async (req, res) => {
    try {
      const { sceneId } = req.params;
      const { script } = req.body;
      const userId = (req as any).user.id;

      // Verify scene exists and belongs to user
      const [scene] = await db
        .select()
        .from(schema.scenes)
        .where(eq(schema.scenes.id, sceneId));

      if (!scene) {
        return res.status(404).send("Scene not found");
      }

      if (scene.userId !== userId) {
        return res
          .status(403)
          .send("Unauthorized to update this scene's script");
      }

      // Check if script exists
      const [existingScript] = await db
        .select()
        .from(schema.sceneScripts)
        .where(eq(schema.sceneScripts.sceneId, sceneId));

      let updatedScript;

      if (existingScript) {
        // Update existing script
        [updatedScript] = await db
          .update(schema.sceneScripts)
          .set({
            script: { text: script },
            updatedAt: new Date(),
          })
          .where(eq(schema.sceneScripts.sceneId, sceneId))
          .returning();
      } else {
        // Create new script
        [updatedScript] = await db
          .insert(schema.sceneScripts)
          .values({
            sceneId,
            userId,
            script: { text: script },
          })
          .returning();
      }

      res.status(200).json(updatedScript);
    } catch (error) {
      console.error("Error updating script:", error);
      res.status(500).send("Failed to update script");
    }
  });

  return projectsRouter;
}
