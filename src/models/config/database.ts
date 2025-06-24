import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Admin, AdminToken, Karyawan } from "./schemas";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_UNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [AdminToken, Admin, Karyawan],
  synchronize: false,
  logging: false,
  migrationsRun: false,
});
