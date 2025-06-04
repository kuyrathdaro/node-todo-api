import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import AuthService from "@/services/auth";
import { IUserInputDTO, IUser } from "@/interfaces/IUser";
import middlewares from "@/api/middlewares";
import { celebrate, Joi } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: User management and profile
   */
  /**
   * @swagger
   * /api/auth/signup:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 token:
   *                   type: string
   */
  route.post(
    "/signup",
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      try {
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.signUp(
          req.body as IUserInputDTO
        );
        res.status(201).json({ user, token });
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @swagger
   * /api/auth/signin:
   *   post:
   *     summary: Sign in a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: User signed in successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 token:
   *                   type: string
   */
  route.post(
    "/signin",
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { email, password } = req.body;
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.signIn(
          email,
          password
        );
        res.status(200).json({ user, token });
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @swagger
   * /api/auth/signout:
   *   post:
   *     summary: Sign out a user
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully signed out
   *       401:
   *         description: Unauthorized
   */
  route.post(
    "/signout",
    middlewares.isAuth,
    (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      try {
        //TODO: authServiceInstance.signOut(req.user) do some clever stuff
        res.status(200).end();
      } catch (err) {
        next(err);
      }
    }
  );

  return app;
};
