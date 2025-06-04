import { IUser } from '@/interfaces/IUser';

declare global {
  namespace Express {
    interface Request {
      token?: { _id: string }; // Or your full JWT payload interface
      currentUser?: IUser;
    }
  }
}