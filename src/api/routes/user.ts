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
      try {
        res.status(200).json({ user: req.currentUser });
      } catch (err) {
        next(err);
      }
    }
  );

  route.patch(
    "/me",
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userServiceInstance = Container.get(UserService);
        const userRecord = await userServiceInstance.updateUser(
          req.currentUser._id,
          req.body as IUserInputDTO
        );
        res.status(201).json({ userRecord });
      } catch (err) {
        next(err);
      }
    }
  );
};
