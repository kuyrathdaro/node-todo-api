export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  salt: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
  role?: string; // Optional, default to 'user'
}
