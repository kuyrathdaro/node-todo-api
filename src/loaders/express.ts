import express, { NextFunction, Request, response, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "@/config";
import routes from "@/api";
import dotenv from "dotenv";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";

const errorHandlerMiddleWare = (err: any, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = getErrorMessage(err);
  logErrorMessage(errorMessage);

  if (res.headersSent) {
    return next(err);
  }

  const errorResponse = {
    statusCode: getHttpStatusCode({ err, res }),
    body: undefined
  }

  if (NODE_ENV !== "production") {
    errorResponse.body = errorMessage;
  }

  res.status(errorResponse.statusCode);
  res.format({
    "application/json": () => {
      res.json({ message: errorResponse.body});
    },
    default: () => {
      res.type("text/plain").send(errorResponse.body);
    }
  });
  next();
}

function getErrorMessage(err: any) {
  if (err.stack) {
    return err.stack;
  }

  if (typeof err.toString() === "function") {
    return err.toString();
  }

  return "";
}

function logErrorMessage(err: any) {
  console.error(err);
}

function isErrorStatusCode(statusCode: number) {
  return statusCode >=400 && statusCode < 600;
}

function getHttpStatusCode({ err, res }) {
  const statusCodeFromError = err.status || err.statusCode;
  if (isErrorStatusCode(statusCodeFromError)) {
    return statusCodeFromError;
  }

  const statusCodeFromResponse = res.statusCode;
  if (isErrorStatusCode(statusCodeFromResponse)) {
    return statusCodeFromResponse;
  }
  
  return 500;
}

export default async ({ app }: { app: express.Application }) => {
  app.get("/status", (req: Request, res: Response) => {
    res.status(200).end();
  });
  app.head("/status", (req: Request, res: Response) => {
    res.status(200).end();
  });

  app.enable("trust proxy");
  app.disable("x-powered-by");

  app.use(cors());
  app.use(helmet());
  app.use(require("method-override")());

  app.use(express.json());

  app.use(config.api.prefix, routes());

  app.use(errorHandlerMiddleWare);
}
