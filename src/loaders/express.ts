import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "@/config";
import routes from "@/api";

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

  app.use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error("Not Found");
    err["status"] = 404;
    next(err);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name == "UnauthorizedError") {
      return res.status(err.status).send({ message: err.message }).end();
    }
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
