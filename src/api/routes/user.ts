import { Router, Request, Response, NextFunction } from "express";
import middlewares from "@/api/middlewares";
import { Container } from "typedi";
import { Logger } from "winston";
import UserService from "@/services/user";
import { IUserInputDTO } from "@/interfaces/IUser";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);

  route.get(
    "/me",
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling me endpoint");
      try {
        return res.json({ user: req.currentUser }).status(200);
      } catch (err) {
        logger.error("🔥 error: %o", err);
        return next(err);
      }
    }
  );

  route.patch(
    "/me",
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling me endpoint with body %o", req.body);
      try {
        const userServiceInstance = Container.get(UserService);
        const userRecord = await userServiceInstance.updateUser(
          req.currentUser._id,
          req.body as IUserInputDTO
        );
        res.status(201).json({ userRecord });
      } catch (err) {
        logger.error("🔥 error: %o", err);
        return next(err);
      }
    }
  );
};
