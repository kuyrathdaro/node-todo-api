import { Container } from "typedi";
import { EventSubscriber, On } from "event-dispatch";
import events from "./events";
import { IUser } from "@/interfaces/IUser";
import mongoose from "mongoose";
import { Logger } from "winston";

@EventSubscriber()
export default class UserSubscriber {
  @On(events.user.signIn)
  public onUserSignIn({ _id }: Partial<IUser>) {
    const logger: Logger = Container.get("logger");

    try {
      const UserModel = Container.get("UserModel") as mongoose.Model<
        IUser & mongoose.Document
      >;

      UserModel.updateOne({ _id }, { $set: { lastLogin: new Date() } });
    } catch (err) {
      logger.error(`🔥 Error on event ${events.user.signIn}: %o`, err);
      throw err;
    }
  }

  @On(events.user.signUp)
  public onUserSignUp({ name, email, _id }: Partial<IUser>) {
    const logger: Logger = Container.get("logger");

    try {
        //TODO: send welcome email to user
        //TODO: tracker tool when there is a new signup
    } catch (err) {
      logger.error(`🔥 Error on event ${events.user.signUp}: %o`, err);
      throw err;
    }
  }
}
