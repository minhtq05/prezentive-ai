import { minioClient } from "@video/storage";
import cors from "cors";
import { Router } from "express";

export default async function getMediaServeRouter() {
  const mediaServeRouter: Router = Router();

  // TODO: unsafe file serving, consider authenticating remotion browser only.
  // CORS middleware that only allows localhost:3003
  mediaServeRouter.use(
    cors({
      origin: "http://localhost:3003",
      methods: ["GET"],
      credentials: false,
    })
  );

  // GET /media-serve/:filename - Serve media files for Remotion rendering
  mediaServeRouter.get("/:filename", async (req, res) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).send("Filename is required");
      }

      // Set appropriate headers for media streaming
      const ext = filename.split(".").pop()?.toLowerCase();

      switch (ext) {
        case "mp4":
        case "webm":
          res.setHeader("Content-Type", "video/mp4");
          break;
        case "jpg":
        case "jpeg":
          res.setHeader("Content-Type", "image/jpeg");
          break;
        case "png":
          res.setHeader("Content-Type", "image/png");
          break;
        case "gif":
          res.setHeader("Content-Type", "image/gif");
          break;
        case "webp":
          res.setHeader("Content-Type", "image/webp");
          break;
        default:
          res.setHeader("Content-Type", "application/octet-stream");
      }

      // Load the full file from MinIO storage
      const dataStream = await minioClient.getObject("mediaassets", filename);

      // Read all data into memory
      const chunks: Buffer[] = [];

      dataStream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      dataStream.on("error", (err) => {
        console.error("Error loading media file:", err);
        if (!res.headersSent) {
          res.status(404).send("Media file not found");
        }
      });

      dataStream.on("end", () => {
        try {
          // Combine all chunks into a single buffer
          const fileBuffer = Buffer.concat(chunks);

          // Set content length header
          res.setHeader("Content-Length", fileBuffer.length);

          // Send the complete file
          res.send(fileBuffer);

          console.log(
            `Successfully served media file: ${filename} (${fileBuffer.length} bytes)`
          );
        } catch (error) {
          console.error("Error sending media file:", error);
          if (!res.headersSent) {
            res.status(500).send("Error processing media file");
          }
        }
      });
    } catch (error) {
      console.error("Error serving media file:", error);
      if (!res.headersSent) {
        res.status(500).send("Error serving media file");
      }
    }
  });

  return mediaServeRouter;
}
