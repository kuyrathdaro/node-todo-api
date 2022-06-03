import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import AuthService from "@/services/auth";
import { IUserInputDTO } from "@/interfaces/IUser";
import middlewares from "@/api/middlewares";
import { celebrate, Joi } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/signup",
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.signUp(
          req.body as IUserInputDTO
        );
        return res.status(201).json({ user, token });
      } catch (err) {
        return next(err);
      }
    }
  );

  route.post(
    "/signin",
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.signIn(
          email,
          password
        );
        return res.json({ user, token }).status(200);
      } catch (err) {
        next(err);
      }
    }
  );

  route.post(
    "/signout",
    middlewares.isAuth,
    (req: Request, res: Response, next: NextFunction) => {
      try {
        //TODO: authServiceInstance.signOut(req.user) do some clever stuff
        return res.status(200).end();
      } catch (err) {
        next(err);
      }
    }
  );
};
