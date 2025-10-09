// import { db, eq, inArray, schema, sql } from "@video/db";
import { minioClient } from "@video/storage";
import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware";

const upload = multer({ storage: multer.memoryStorage() });

export default async function getMediaRouter() {
  const mediaRouter: Router = Router();

  mediaRouter.use(authMiddleware);

  // GET /media/:filename - Fetch media file by filename
  mediaRouter.get("/retrieve/:filename", async (req, res) => {
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

  // TODO: Haven't tested this route
  // mediaRouter.get("/retrieve-multiple", async (req, res) => {
  //   const { filenames } = req.query;

  //   if (!Array.isArray(filenames) || filenames.length === 0) {
  //     return res
  //       .status(400)
  //       .send("Invalid request: filenames must be an array.");
  //   }

  //   try {
  //     const mediaFiles = await Promise.all(
  //       (filenames as string[]).map(async (filename) => {
  //         const dataStream = await minioClient.getObject(
  //           "mediaassets",
  //           filename
  //         );

  //         return new Promise<{
  //           filename: string;
  //           stream: Buffer;
  //         }>((resolve, reject) => {
  //           const chunks: Buffer[] = [];
  //           dataStream.on("data", (chunk) => chunks.push(chunk));
  //           dataStream.on("end", () =>
  //             resolve({ filename, stream: Buffer.concat(chunks) })
  //           );
  //           dataStream.on("error", (err) => reject(err));
  //         });
  //       })
  //     );

  //     res.json(mediaFiles);
  //   } catch (error) {
  //     console.error("Retrieve multiple media error:", error);
  //     res.status(500).send("Error retrieving media files.");
  //   }
  // });

  mediaRouter.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No files were uploaded.");
    }

    const file = req.file as Express.Multer.File; // Get the uploaded file

    const filename = `${Date.now()}-${file.originalname}`;
    try {
      await minioClient.putObject("mediaassets", filename, file.buffer);

      const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/media/retrieve/${filename}`; // URL to access the uploaded file
      res.json({ imageUrl: fileUrl });
    } catch (error) {
      console.error("Upload media error:", error);
      res.status(500).send("Error uploading media file.");
    }
  });

  mediaRouter.post("/delete", async (req, res) => {
    const { filenames } = req.body;

    if (!Array.isArray(filenames) || filenames.length === 0) {
      return res
        .status(400)
        .send("Invalid request: filenames must be an array.");
    }

    try {
      await Promise.all(
        (filenames as string[]).map((filename) =>
          minioClient.removeObject("mediaassets", filename)
        )
      );
      res.status(204).send("Media files deleted successfully.");
    } catch (error) {
      console.error("Delete media error:", error);
      res.status(500).send("Error deleting media files.");
    }
  });

  return mediaRouter;
}
