// src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Note Todo API",
      version: "1.0.0",
      description: "Express API with TypeScript and Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // replace with dynamic `config.port` if needed
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "AuthError" },
            message: { type: "string", example: "User not registered" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "60d0fe4f5311236168a109ca",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            role: {
              type: "string",
              example: "user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
          required: ["_id", "name", "email"],
        },
        UserInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Jane Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "jane.doe@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "securePassword123",
            },
          },
        },
        Todo: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "60d0fe4f5311236168a109cb",
            },
            title: {
              type: "string",
              example: "Sample Todo",
            },
            description: {
              type: "string",
              example: "This is a sample todo item.",
            },
            status: {
              type: "boolean",
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
          required: ["title", "description", "status"],
        },
      },
    },
  },
  apis: ["./src/api/routes/**/*.ts"], // adjust to your route paths
};

const swaggerSpec = swaggerJSDoc(options);

export default async ({ app }: { app: express.Application }) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
