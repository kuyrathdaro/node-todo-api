import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { Container } from "typedi";
import middlewares from "@/api/middlewares";
import TodoService from "@/services/todo";
import { ITodoInputDTO } from "@/interfaces/ITodo";

const route = Router();

export default (app: Router) => {
  app.use("/todos", route);

  route.get(
    "/:id?",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      [Segments.PARAMS]: {
        id: Joi.string(),
      },
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const todoServiceInstance = Container.get(TodoService);
        if (req.params.id) {
          const todos = await todoServiceInstance.getTodoById(
            req.currentUser._id,
            req.params.id
          );
          return res.json({ todos }).status(200);
        } else {
          const todos = await todoServiceInstance.getAllTodos(
            req.currentUser._id
          );
          return res.json(todos).status(200);
        }
      } catch (err) {
        next(err);
      }
    }
  );

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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const todoServiceInstance = Container.get(TodoService);
        const result = await todoServiceInstance.createTodo(
          req.currentUser._id,
          req.body as ITodoInputDTO
        );
        return res.json(result).status(200).end();
      } catch (err) {
        next(err);
      }
    }
  );

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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const todoServiceInstance = Container.get(TodoService);
        const result = await todoServiceInstance.updateTodo(
          req.currentUser._id,
          req.params.id,
          req.body as ITodoInputDTO
        );
        return res.json(result).status(200).end();
      } catch (err) {
        next(err);
      }
    }
  );

  route.delete(
    "/:id",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      [Segments.PARAMS]: {
        id: Joi.string().required(),
      },
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const todoServiceInstance = Container.get(TodoService);
        const result = await todoServiceInstance.deleteTodo(
          req.currentUser._id,
          req.params.id
        );
        return res.json(result).status(200).end();
      } catch (err) {
        next(err);
      }
    }
  );
};
