import { auth } from "@video/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import getHealthRouter from "./routes/heath";
import getMediaRouter from "./routes/media";
import getProjectsRouter from "./routes/projects";

async function main() {
  const app = express();
  const port = 3001;

  app.all("/api/auth/*splat", toNodeHandler(auth));

  // Middleware to parse JSON
  app.use(express.json());

  // CORS middleware
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? "http://localhost:5000"
          : "http://localhost:3000", // Replace with your frontend's origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );

  app.use("/api/projects", await getProjectsRouter());
  app.use("/api/media", await getMediaRouter());
  app.use("/api/health", await getHealthRouter());

  app.get("/", (req, res) => {
    res.send("Video API Server");
  });

  app
    .listen(port, () => {
      console.log(`Video API server listening on port ${port}`);
    })
    .on("error", (err) => {
      console.error("Failed to start server:", err);
    });
}

main();
