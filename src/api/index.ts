import { Router } from "express";
import agendash from "./routes/agendash";
import auth from "./routes/auth";
import user from "./routes/user";
import todo from "./routes/todo";
import docs from "./routes/docs";

export default () => {
  const app = Router();

  auth(app);
  user(app);
  todo(app);
  agendash(app);
  docs(app);

  return app;
};
