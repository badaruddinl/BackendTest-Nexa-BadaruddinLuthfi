import express, { Application } from "express";

import dotenv from "dotenv";
import { AppDataSource } from "models/config/database";
import appRoutes from "app/appRoutes";
dotenv.config();

const app: Application = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use("/api", appRoutes);
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) =>
    console.error("Error during Data Source initialization:", error)
  );
