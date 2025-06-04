import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { Container } from "typedi";
import middlewares from "@/api/middlewares";
import TodoService from "@/services/todo";
import { ITodoInputDTO } from "@/interfaces/ITodo";
import { IUser } from "@/interfaces/IUser";

const route = Router();

export default (app: Router) => {
  app.use("/todos", route);

  /**
   * @swagger
   * tags:
   *   name: Todos
   *   description: Todo management
   */

  /**
   * @swagger
   * /api/todos:
   *   get:
   *     summary: Get all todos for the current user
   *     tags:
   *       - Todos
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of todos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 todos:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Todo'
   *       401:
   *         description: Unauthorized
   */

  route.get(
    "/",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      try {
        const todoServiceInstance = Container.get(TodoService);
        const todos = await todoServiceInstance.getAllTodos(
          req.currentUser._id
        );
        res.status(200).json(todos);
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @swagger
   * /api/todos/{id}:
   *   get:
   *     summary: Get a todo by ID
   *     tags: [Todos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Todo ID
   *     responses:
   *       200:
   *         description: A single todo
   */
  route.get(
    "/:id",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      [Segments.PARAMS]: {
        id: Joi.string(),
      },
    }),
    async (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      try {
        let todos;
        const todoServiceInstance = Container.get(TodoService);
        if (req.params.id) {
          todos = await todoServiceInstance.getTodoById(
            req.currentUser._id,
            req.params.id
          );
        }
        if (!todos) {
          res.status(404).json({ message: "Todo not found" });
        }
        res.json({ todos }).status(200);
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @swagger
   * /api/todos:
   *   post:
   *     summary: Create a new todo
   *     tags: [Todos]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - description
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               status:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Todo created
   */
  route.post(
    "/",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.bool(),
      }),
    }),
    async (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      try {
        const todoServiceInstance = Container.get(TodoService);
        const result = await todoServiceInstance.createTodo(
          req.currentUser._id,
          req.body as ITodoInputDTO
        );
        res.json(result).status(200);
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @swagger
   * /api/todos/{id}:
   *   patch:
   *     summary: Update a todo
   *     tags: [Todos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Todo ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               status:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Todo updated
   */
  route.patch(
    "/:id",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      [Segments.PARAMS]: {
        id: Joi.string().required(),
      },
      body: Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        status: Joi.bool(),
      }),
    }),
    async (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      try {
        const todoServiceInstance = Container.get(TodoService);
        const result = await todoServiceInstance.updateTodo(
          req.currentUser._id,
          req.params.id,
          req.body as ITodoInputDTO
        );
        res.json(result).status(200).end();
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @swagger
   * /api/todos/{id}:
   *   delete:
   *     summary: Delete a todo
   *     tags: [Todos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Todo ID
   *     responses:
   *       200:
   *         description: Todo deleted
   */
  route.delete(
    "/:id",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      [Segments.PARAMS]: {
        id: Joi.string().required(),
      },
    }),
    async (
      req: Request & { token?: { _id: string }; currentUser?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      try {
        const todoServiceInstance = Container.get(TodoService);
        const result = await todoServiceInstance.deleteTodo(
          req.currentUser._id,
          req.params.id
        );
        res.json(result).status(200);
      } catch (err) {
        next(err);
      }
    }
  );

  return app;
};
