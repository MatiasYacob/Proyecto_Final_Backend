import mongoose from "mongoose";
import config from "./config.js";
import { Devlogger } from "./logger_CUSTOM.js";

export default class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
    }

    // Implementación Singleton
    static getInstance() {
        if (this.#instance) {
            Devlogger.info("Ya se ha abierto una conexión a MongoDB.");
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.mongoUrl);
            Devlogger.info("Conectado con éxito a MongoDB usando Mongoose.");
        } catch (error) {
            Devlogger.error("No se pudo conectar a la BD usando Mongoose: " + error);
            Devlogger.info("mongoURL: " + config.mongoUrl);
            Devlogger.info("puerto: " + config.port);
            process.exit(1);
        }
    }
};
