import { Router } from "express";
import * as swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const route = Router();
const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "node-todo-api",
            version: "1.0.0"
        }
    },
    apis: ["./src/api/routes/*.ts"]
});

export default (app: Router) => {
    app.use("/docs", route);
    route.get("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}