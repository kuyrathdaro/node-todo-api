import { Service, Inject } from "typedi";
import { IUser, IUserInputDTO } from "@/interfaces/IUser";
import bcryptjs from "bcryptjs";
import { Logger } from "winston";

@Service()
export default class UserService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("logger") private logger: Logger
  ) {}

  public async updateUser(
    userId: string,
    userInputDTO: IUserInputDTO
  ): Promise<any> {
    try {
      let updatedUser: Partial<IUser> = {};
      if (userInputDTO.password) {
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(userInputDTO.password, salt);

        updatedUser.password = hashedPassword;
        updatedUser.salt = salt;
      }

      const userRecord = await this.userModel.updateOne(
        { _id: userId },
        updatedUser
      );
      if (!userRecord) {
        throw new Error("Error updating user");
      }
      return userRecord;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
