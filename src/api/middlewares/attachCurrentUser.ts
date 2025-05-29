import { Container } from "typedi";
import mongoose from "mongoose";
import { IUser } from "@/interfaces/IUser";
import { Logger } from "winston";
import { Request, NextFunction, Response } from "express";

const attachCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger: Logger = Container.get("logger");

  try {
    const UserModel = Container.get("userModel") as mongoose.Model<
      IUser & mongoose.Document
    >;
    const userRecord = await UserModel.findById(req.token._id);

    if (!userRecord) {
      res.sendStatus(401);
      return;
    }
    const currentUser = userRecord.toObject();
    Reflect.deleteProperty(currentUser, "password");
    Reflect.deleteProperty(currentUser, "salt");
    req.currentUser = currentUser;
    next();
  } catch (err) {
    logger.error("🔥 Error attaching user to req: %o", err);
    next(err);
  }
};

export default attachCurrentUser;
