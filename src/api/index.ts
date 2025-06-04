import { Router } from "express";
import agendash from "./routes/agendash";
import auth from "./routes/auth";
import user from "./routes/user";
import todo from "./routes/todo";

export default () => {
  const app = Router();

  agendash(app);
  auth(app);
  user(app);
  todo(app);

  return app;
};
