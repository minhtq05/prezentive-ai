import { Router } from "express";

export default async function getHealthRouter() {
  const healthRouter: Router = Router();

  // GET /health - Health check endpoint
  healthRouter.get("/:message", async (req, res) => {
    const { message } = req.params;
    console.log(`Health check OK: ${message}`);
    res.status(200).send("OK");
  });

  return healthRouter;
}
