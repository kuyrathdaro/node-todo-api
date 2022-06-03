import config from "@/config";
import EmailSequenceJob from "@/jobs/emailSequence";
import Agenda from "agenda";

export default async({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    "send-mail",
    { priority: 10, concurrency: config.agenda.concurrency },
    new EmailSequenceJob().handler
  );

  agenda.start();
};
