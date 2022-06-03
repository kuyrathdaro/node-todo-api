import { Container } from "typedi";
import mongoose from "mongoose";
import { IUser } from "@/interfaces/IUser";
import { Logger } from "winston";
import { NextFunction, Response } from "express";

const attachCurrentUser = async (
  req: any,
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
      return res.sendStatus(401);
    }
    const currentUser = userRecord.toObject();
    Reflect.deleteProperty(currentUser, "password");
    Reflect.deleteProperty(currentUser, "salt");
    req.currentUser = currentUser;
    return next();
  } catch (err) {
    logger.error("🔥 Error attaching user to req: %o", err);
    return next(err);
  }
};

export default attachCurrentUser;
