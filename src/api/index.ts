import { Router } from "express";
import agendash from "./routes/agendash";
import auth from "./routes/auth";
import user from "./routes/user";
import todo from "./routes/todo";
import docs from "./routes/docs";

export default () => {
  const app = Router();

  docs(app);
  agendash(app);
  auth(app);
  user(app);
  todo(app);

  return app;
};
