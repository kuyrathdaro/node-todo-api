import { Container } from "typedi";
import { Logger } from "winston";
import MailService from "@/services/mailer";

export default class EmailSequenceJob {
  public async handler(job: any, done: any): Promise<void> {
    const logger: Logger = Container.get("logger");

    try {
      logger.debug("✌️ Email Sequence Job triggered!");
      const { email, name }: { [key: string]: string } = job.attrs.data;
      const mailServiceInstance = Container.get(MailService);
      await mailServiceInstance.sendWelcomeEmail(email, name);
      done();
    } catch (err) {
      logger.error("🔥 Error with Email Sequence Job: %o", err);
      done(err);
    }
  }
}
