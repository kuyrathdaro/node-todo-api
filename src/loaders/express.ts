import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "@/config";
import routes from "@/api";
import dotenv from "dotenv";
import { errors as celebrateErrors } from "celebrate";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";

const errorHandlerMiddleWare = (err: any, req: Request, res: Response, next: NextFunction) => {
  let errorMessage: string;
  if (err.name === "ValidationError" || err.joi) {
    errorMessage = "Validation failed";
    err.status = 400;
  } else {
    errorMessage = getErrorMessage(err);
  }

  logErrorMessage(errorMessage);

  if (res.headersSent) return next(err);

  const statusCode = getHttpStatusCode({ err, res });
  res.status(statusCode);
  res.json({
  error: err.name || "InternalServerError",
  message: errorMessage,
});
};

function getErrorMessage(err: any): string {
  if (err.expose && err.message) return err.message; // for known safe messages
  if (err.message) return err.message;
  return "Unexpected error";
}


function logErrorMessage(err: any) {
  const env = process.env.NODE_ENV;
  if (env === "production") return;

  const message = err instanceof Error ? err.message : String(err);
  if (env === "test") {
    console.error(`[Test Error] ${message}`);
  } else {
    console.error(err); // full stack in dev
  }
}

function isErrorStatusCode(statusCode: number) {
  return statusCode >= 400 && statusCode < 600;
}

function getHttpStatusCode({ err, res }) {
  const codeFromErr = err.status || err.statusCode;
  if (isErrorStatusCode(codeFromErr)) return codeFromErr;
  const codeFromRes = res.statusCode;
  if (isErrorStatusCode(codeFromRes)) return codeFromRes;
  return 500;
}

export default async ({ app }: { app: express.Application }) => {
  app.get("/status", (req: Request, res: Response) => { res.status(200).end() });
  app.head("/status", (req: Request, res: Response) => { res.status(200).end() });

  app.enable("trust proxy");
  app.disable("x-powered-by");

  app.use(cors());
  app.use(helmet());
  app.use(require("method-override")());
  app.use(express.json());

  app.use(config.api.prefix, routes());

  app.use(celebrateErrors());
  app.use(errorHandlerMiddleWare);
};
