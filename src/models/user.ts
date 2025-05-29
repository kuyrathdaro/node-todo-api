import { IUser } from "@/interfaces/IUser";
import mongoose, { Model, Document } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a full name"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    password: String,
    salt: String,

    role: {
      type: String,
      default: "user",
    },

    todos: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Todo",
    },
  },
  { timestamps: true }
);

export type UserModel = Model<IUser & Document>;
export default mongoose.model<IUser & Document>("User", UserSchema);