import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import config from "@/config";

export default async ({ app }) => {
    Sentry.init({
        dsn: config.sentry.dsn,
        environment: config.env,
        integrations: [
            nodeProfilingIntegration()
        ]
    });
    Sentry.setupExpressErrorHandler(app);
}