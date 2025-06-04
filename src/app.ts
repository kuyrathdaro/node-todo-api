import "reflect-metadata";
import express from "express";
import loaders from "./loaders";

export default async function createApp() {
  const app = express();
  await loaders({ expressApp: app });  // await loaders if async
  return app;
}
