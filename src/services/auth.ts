import { Service, Inject } from "typedi";
import { Logger } from "winston";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import MailerService from "./mailer";
import config from "@/config";
import { IUser, IUserInputDTO } from "@/interfaces/IUser";
import {
  EventDispatcher,
  EventDispatcherInterface,
} from "@/decorators/eventDispatcher";
import events from "@/subscribers/events";
import { UserModel } from "@/models/user";
import { AuthError } from "@/utils/auth.error";

@Service()
export default class AuthService {
  constructor(
    @Inject("userModel") private userModel: UserModel,
    private mailer: MailerService,
    @Inject("logger") private logger: Logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
  ) {}

  public async signUp(userInputDTO: IUserInputDTO): Promise<{ user: Partial<IUser>; token: string }> {
    this.logger.silly("Checking if user already exists");

    const existingUser = await this.userModel.findOne({ email: userInputDTO.email });
    if (existingUser) {
      throw new AuthError("User already exists", 409);
    }

    this.logger.silly("Hashing password");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userInputDTO.password, salt);

    this.logger.silly("Creating user in DB");
    const userRecord = await this.userModel.create({
      ...userInputDTO,
      salt,
      password: hashedPassword,
    });

    if (!userRecord) {
      throw new AuthError("User could not be created", 500);
    }

    this.logger.silly("Generating JWT token");
    const token = this.generateToken(userRecord);

    this.logger.silly("Sending welcome email");
    await this.mailer.sendWelcomeEmail(userRecord.email, userRecord.name);

    this.logger.silly("Dispatching signUp event");
    this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

    const user = userRecord.toObject();
    delete user.password;
    delete user.salt;

    return { user, token };
  }

  public async signIn(email: string, password: string): Promise<{ user: Partial<IUser>; token: string }> {
    this.logger.silly(`Finding user by email: ${email}`);

    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) {
      throw new AuthError("User not registered", 401);
    }

    this.logger.silly("Comparing passwords");
    const isPasswordValid = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordValid) {
      throw new AuthError("Invalid password", 401);
    }

    this.logger.silly("Password valid, generating token");
    const token = this.generateToken(userRecord);

    const user = userRecord.toObject();
    delete user.password;
    delete user.salt;

    return { user, token };
  }

  public async logout(user: IUser): Promise<void> {
    this.logger.silly(`Logout for user: ${user.email}`);
    // Placeholder: You might implement token blacklisting or session management
  }

  private generateToken(user: IUser): string {
    const expiresInDays = 60;
    const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;

    this.logger.silly(`Signing JWT for userId: ${user._id}`);

    return jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        exp,
      },
      config.jwtSecret,
      { algorithm: "HS256" }
    );
  }
}
