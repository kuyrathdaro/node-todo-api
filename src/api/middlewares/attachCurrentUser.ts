import { Container } from "typedi";
import mongoose from "mongoose";
import { IUser } from "@/interfaces/IUser";
import { Logger } from "winston";
import { Request, NextFunction, Response } from "express";

const attachCurrentUser = async (
  req: Request & { token?: { _id: string }; currentUser?: IUser },
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
    delete currentUser.password; // Remove sensitive data
    delete currentUser.salt; // Remove sensitive data
    req.currentUser = currentUser;
    next();
  } catch (err) {
    logger.error("🔥 Error attaching user to req: %o", err);
    next(err);
  }
};

export default attachCurrentUser;
