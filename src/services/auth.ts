import { Service, Inject } from "typedi";
import { Logger } from "winston";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import MailerService from "./mailer";
import config from "@/config";
import { IUser, IUserInputDTO } from "@/interfaces/IUser";
import {
  EventDispatcher,
  EventDispatcherInterface,
} from "@/decorators/eventDispatcher";
import events from "@/subscribers/events";

@Service()
export default class AuthService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    private mailer: MailerService,
    @Inject("logger") private logger: Logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
  ) {}

  public async signUp(
    userInputDTO: IUserInputDTO
  ): Promise<{ user: Partial<IUser>; token: string }> {
    try {
      const salt = bcryptjs.genSaltSync(10);
      this.logger.silly("Hashing password");
      const hashedPassword = bcryptjs.hashSync(userInputDTO.password, salt);

      this.logger.silly("Create user db record");
      const userRecord = await this.userModel.create({
        ...userInputDTO,
        salt: salt,
        password: hashedPassword,
      });

      this.logger.silly("Generating JWT");
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error("User cannot be created");
      }

      this.logger.silly("Send welcome email");
      await this.mailer.sendWelcomeEmail(userRecord.email, userRecord.name);
      this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, "password");
      Reflect.deleteProperty(user, "salt");
      return { user, token };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async signIn(
    email: string,
    password: string
  ): Promise<{ user: Partial<IUser>; token: string }> {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) {
      throw new Error("User not registered");
    }

    this.logger.silly("Checking password");
    const validPassword = bcryptjs.compareSync(password, userRecord.password);
    if (validPassword) {
      this.logger.silly("Password is valid!");
      this.logger.silly("Generating JWT");
      const token = this.generateToken(userRecord);

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, "password");

      return { user, token };
    } else {
      throw new Error("Invalid Password");
    }
  }

  private async Logout(user: any) {
    //TODO: logout feature
  }

  private generateToken(user: any) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }
}
