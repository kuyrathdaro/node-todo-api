import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();

if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    port: process.env.PORT || 3000,
    databaseURL: process.env.MONGO_DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    logs: {
        level: process.env.LOG_LEVEL || "silly"
    },
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10) || 20,
    },
    api: {
        prefix: '/api'
    },
    agendash: {
        user: process.env.AGENDASH_USER,
        password: process.env.AGENDASH_PASS
    },
    swagger: {
        user: process.env.SWAGGER_USER,
        password: process.env.SWAGGER_PASS
    },
    email: {
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        },
    }
}