import config from "./config";
import logger from "./loaders/logger";
import createApp from "./app";

(async () => {
  const app = await createApp();

  app
    .listen(config.port, () => {
      logger.info(`Server listening on port ${config.port}`);
    })
    .on("error", (err) => {
      logger.error(err);
      process.exit(1);
    });
})();
