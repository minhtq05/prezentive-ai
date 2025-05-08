import { bundle } from "@remotion/bundler";
import {
  getCompositions,
  renderFrames,
  stitchFramesToVideo,
} from "@remotion/renderer";
import express from "express";
import next from "next";
import bodyParser from "body-parser";
import fs from "fs";
import os from "os";
import path from "path";
import { defaultScenes } from "./constants";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Custom routes can go here (optional)
  // Example: server.post('/api/data', (req, res) => { ... })

  server.get("/api/render", async (req, res) => {
    const compositionId = "main-video";
    const bundleLocation = await bundle(require.resolve("./remotion/index.ts"));

    const comps = await getCompositions(bundleLocation, {
      // You can pass custom input props that you can retrieve using getInputProps()
      // in the composition list. Use this if you want to dynamically set the duration or
      // dimensions of the video.
      inputProps: {
        previewMode: false,
        scenes: defaultScenes,
        handleSelectObject: () => {},
      },
    });

    const composition = comps.find((c) => c.id === compositionId);

    if (!composition) {
      res.status(404).send("Composition not found");
      return;
    }

    const framesDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), "remotion-")
    );

    console.log(`Rendering to ${framesDir}`);

    const { assetsInfo } = await renderFrames({
      composition: composition,
      // Path of the webpack bundle you have created
      // bundle: bundleLocation,
      // Get's called after bundling is finished and the
      // actual rendering starts.
      onStart: () => console.log("Rendering frames..."),
      onFrameUpdate: (f) => {
        // Log a message whenever 10 frames have rendered.
        if (f % 10 === 0) {
          console.log(`Rendered frame ${f}`);
        }
      },
      // How many CPU threads to use. `null` will use a sane default (half of the available threads)
      // See 'CLI options' section for concurrency options.
      concurrency: null,
      outputDir: framesDir,
      // React props passed to the root component of the sequence. Will be merged with the `defaultProps` of a composition.
      inputProps: {
        titleText: "Hello World",
      },
      // Can be either 'jpeg' or 'png'. JPEG is faster, but has no transparency.
      imageFormat: "jpeg",
      serveUrl: bundleLocation,
    });
    // Add this step if you want to make an MP4 out of the rendered frames.
    await stitchFramesToVideo({
      // Overwrite existing video
      force: true,
      // Possible overwrite of video metadata,
      // we suggest to just fill in the data from the
      // video variable
      fps: composition.fps,
      height: composition.height,
      width: composition.width,
      // Must match the value above for the image format
      // Pass in the desired output path of the video. Et voilà!
      outputLocation: path.join(framesDir, "out.mp4"),
      // FFMPEG pixel format
      pixelFormat: "yuv420p",
      // Information needed to construct audio correctly.
      assetsInfo,
      // Hook into the FFMPEG progress
      onProgress: () => undefined,
    });

    res.status(200).json({
      message: "Render started",
    });
  });

  // Let Next.js handle all other routes
  server.all(/(.*)/, (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});
