import { bundle } from "@remotion/bundler";
import {
  ensureBrowser,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";
import { db, eq, inArray, schema, sql } from "@video/db";
import { minioClient } from "@video/storage";
import { Router } from "express";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { authMiddleware } from "../middleware";
import { getFilesizeInBytes } from "../utils";

const { REMOTION_SERVE_URL, NEXT_PUBLIC_API_URL } = process.env;

export default async function getRendersRouter() {
  await ensureBrowser();

  const remotionBundleUrl = REMOTION_SERVE_URL
    ? REMOTION_SERVE_URL
    : await bundle({
        entryPoint: path.resolve("src/remotion/index.ts"),
        onProgress(progress) {
          console.info(`Bundling Remotion project: ${progress}%`);
        },
      });

  const renderRouter: Router = Router();

  renderRouter.use(authMiddleware);

  // GET /render/:projectId - Fetch all rendered videos for the user
  renderRouter.get("/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;

      const renderedVideos = await db
        .select({
          id: schema.renderedVideos.mediaId,
          userId: schema.renderedVideos.userId,
          projectId: schema.renderedVideos.projectId,
          title: schema.renderedVideos.title,
          filename: schema.mediaAssets.filename,
          createdAt: schema.mediaAssets.createdAt,
          fileSizeBytes: schema.mediaAssets.fileSizeBytes,
          metadata: schema.mediaAssets.metadata,
        })
        .from(schema.renderedVideos)
        .leftJoin(
          schema.mediaAssets,
          eq(schema.renderedVideos.mediaId, schema.mediaAssets.id)
        )
        .where(eq(schema.renderedVideos.projectId, projectId))
        .orderBy(sql`${schema.mediaAssets.createdAt} DESC`);

      res.status(200).json(renderedVideos);
    } catch (error) {
      console.error("Error fetching rendered videos:", error);
      res.status(500).send("Failed to fetch rendered videos");
    }
  });

  // POST /render/:projectId - Render a project to MP4 and store it in user's storage
  renderRouter.post("/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user.id;

      // Fetch project orientation
      const [orientation] = await db
        .select()
        .from(schema.projectsOrientation)
        .where(eq(schema.projectsOrientation.projectId, projectId));

      if (!orientation) {
        return res.status(404).send("Project orientation not found");
      }

      const scenes = await db
        .select({
          id: schema.scenes.id,
          durationInSeconds: schema.scenes.durationInSeconds,
        })
        .from(schema.scenes)
        .where(eq(schema.scenes.projectId, projectId))
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

      // Process scenes
      const processedScenes = scenesWithElements.map((scene) => ({
        ...scene,
        sceneElements: scene.sceneElements.map((element: any) => {
          const elementData = element.elementData;
          if (elementData.type === "image" || elementData.type === "video") {
            if (
              elementData.src &&
              elementData.src.startsWith(NEXT_PUBLIC_API_URL!)
            ) {
              // Extract filename from the original src
              const originalFilename = elementData.src.split("/").pop()!;
              const newSrc = `http://localhost:3002/api/media-serve/${originalFilename}`;

              return {
                ...element,
                elementData: {
                  ...elementData,
                  src: newSrc,
                },
              };
            }
          }
          return element;
        }),
      }));

      const inputProps = {
        scenes: processedScenes,
        orientation: {
          width: orientation.width,
          height: orientation.height,
          fps: orientation.fps,
        },
      };

      const composition = await selectComposition({
        serveUrl: remotionBundleUrl,
        id: "main-video",
        inputProps,
      });

      const mediaId = randomUUID();
      const filename = `${projectId}_${mediaId}.mp4`;

      await renderMedia({
        composition,
        serveUrl: remotionBundleUrl,
        codec: "h264",
        outputLocation: `out/${filename}`,
        inputProps,
        port: 3003,
      });

      await minioClient.fPutObject("mediaassets", filename, `out/${filename}`, {
        id: mediaId,
      });

      await db.insert(schema.mediaAssets).values({
        id: mediaId,
        userId: userId,
        filename: filename,
        fileType: "video",
        fileSizeBytes: getFilesizeInBytes(`out/${filename}`),
        metadata: {
          durationInSeconds: scenes.reduce(
            (total, scene) => total + scene.durationInSeconds,
            0
          ),
        },
      });

      await db.insert(schema.renderedVideos).values({
        mediaId,
        userId,
        projectId,
        title: `Render of Project ${projectId} at ${new Date().toISOString()}`,
      });

      res.status(200).json({
        message: "Render completed successfully",
        // outputPath: path.join(framesDir, "out.mp4"),
      });
    } catch (error) {
      console.error("Error rendering project:", error);
      res.status(500).send("Failed to render project");
    }
  });

  return renderRouter;
}
