import { Router, Request, Response, NextFunction } from "express";
import middlewares from "@/api/middlewares";
import { Container } from "typedi";
import { Logger } from "winston";
import UserService from "@/services/user";
import { IUserInputDTO, IUser } from "@/interfaces/IUser";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);

  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Authentication and authorization
   */

  /**
   * @swagger
   * /api/users/me:
   *   get:
   *     summary: Get current user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user profile
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   */
  route.get(
    "/me",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      const logger: Logger = Container.get("logger");
      try {
        res.status(200).json({ user: req.currentUser });
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @swagger
   * /api/users/me:
   *   patch:
   *     summary: Update current user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput'
   *     responses:
   *       200:
   *         description: Updated user data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  route.patch(
    "/me",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
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

  return app;
};
