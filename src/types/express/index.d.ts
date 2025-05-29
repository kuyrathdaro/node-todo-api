import { IUser } from "@/interfaces/IUser";

declare global {
  namespace Express {
    interface Request {
      token?: { _id: string }; // Adjust type as needed
      currentUser?: IUser;
    }
  }
}

export {};