import "reflect-metadata";
import express from "express";
import config from "./config";
import logger from "./loaders/logger";
import loaders from "./loaders";

async function startServer() {
  const app = express();

  // Load middlewares, routes, DI, DB, etc.
  await loaders({ expressApp: app });

  const server = app.listen(config.port, () => {
    logger.info(`✅ Server listening on port ${config.port}`);
  });

  server.on("error", (err) => {
    logger.error("❌ Server error:", err);
    process.exit(1);
  });
}

startServer();
