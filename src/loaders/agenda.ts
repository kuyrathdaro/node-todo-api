import Agenda from "agenda";
import config from "@/config";

export default ({ mongoConnection }) => {
  return new Agenda({
    mongo: mongoConnection,
    db: {
      address: config.databaseURL,
      collection: config.agenda.dbCollection,
    },
    processEvery: config.agenda.pooltime,
    maxConcurrency: config.agenda.concurrency,
  });
};
