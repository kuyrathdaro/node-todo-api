import { Service } from "typedi";
import { IUser } from "@/interfaces/IUser";
import config from "@/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: config.email.auth,
});

@Service()
export default class MailerService {
  constructor() {}

  public async sendWelcomeEmail(email: string, name: string) {
    let senderEmail: string = "admin@inbox.mailtrap.io";
    let emailSubject: string = "Welcome to node-todo-api";
    let emailText: string = `
        Dear ${name},
        Welcome to node-todo-api. 
        It's nothing here just ignore this.
        `;
    let emailHtml: string = `
        <h3>Dear ${name},</h3>
        <h4>Welcome to node-todo-api.</h4>
        <p>It's nothing here just ignore this.</p>
        `;

    const mailOptions = {
      from: senderEmail,
      to: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    };

    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        throw new Error(`Error while sending email : ${err}`);
      }
      return { delivered: 1, status: "ok", info: info };
    });
  }

  public startEmailSequence(sequence: string, user: Partial<IUser>) {
    if (!user.email) {
      throw new Error("No email provided");
    }
    // TODO: implement email sequence job
    return { delivered: 1, status: "ok" };
  }
}
