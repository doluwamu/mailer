import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./utils/mongodbConnection.js";
import errorHandler from "./error/errorHandler.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const PORT = process.env.PORT || "7777";
const NODE_ENV = process.env.NODE_ENV;
const app = express();

//setting up app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connecting to DB
// dbConnection();

app.get("/", (req, res, next) => {
  return res.json("Hello world");
});

// Routes
app.use("/api/v1/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  await dbConnection();
  console.log(`Server running on port ${PORT}`);
});
