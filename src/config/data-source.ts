import { DataSource } from "typeorm";
import {
    Coin
} from "../entity"
import { ENV } from "./env";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: ENV.DB_HOST,
    port: parseInt(ENV.DB_PORT),
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_DATABASE,
    synchronize: false,  // Warning: Disable global synchronization if including tables which managed seperately
    logging: false,
    entities: [
        Coin,
    ],
    // migrations: ["src/migration/**/*.ts"],
    // subscribers: ["src/subscriber/**/*.ts"],
    migrations: [],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false,
    },
});
