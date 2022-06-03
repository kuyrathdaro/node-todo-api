import { Container } from "typedi";
import loggerInstance from "./logger";
import agendaFactory from "./agenda";

export default async ({
  mongoConnection,
  models,
}: {
  mongoConnection: any;
  models: { name: string; model: any }[];
}) => {
  try {
    models.forEach((m) => {
      Container.set(m.name, m.model);
    });

    const agendaInstance = agendaFactory({ mongoConnection });

    Container.set("agendaInstance", agendaInstance);
    Container.set("logger", loggerInstance);

    loggerInstance.info("Agenda injected into container");
    return { agenda: agendaInstance };
  } catch (err) {
    loggerInstance.error("Error on dependency injector loader: %o", err);
    throw err;
  }
};
