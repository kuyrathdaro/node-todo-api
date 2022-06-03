import { Document, Model } from "mongoose";
import { IUser } from "@/interfaces/IUser";
import { ITodo } from "@/interfaces/ITodo";

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }
  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type TodoModel = Model<ITodo & Document>;
  }
}
