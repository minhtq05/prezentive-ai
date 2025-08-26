// import { db, eq, inArray, schema, sql } from "@video/db";
import { minioClient } from "@video/storage";
import { Router } from "express";
import { authMiddleware } from "../middleware";

export default async function getMediaRouter() {
  const mediaRouter: Router = Router();

  mediaRouter.use(authMiddleware);

  // GET /media/:filename - Fetch media file by filename
  mediaRouter.get("/:filename", async (req, res) => {
    const { filename } = req.params;

    // Inside the Express route's try block
    res.setHeader("Content-Type", "application/octet-stream"); // Or the actual content type of the file
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="download.${filename.split(".").pop()}"`
    );

    const dataStream = await minioClient.getObject("mediaassets", filename);
    dataStream.pipe(res);
    dataStream.on("error", (err) => {
      console.error("Stream media error:", err);
      res.status(500).send("Error streaming media file.");
    });
  });

  return mediaRouter;
}
