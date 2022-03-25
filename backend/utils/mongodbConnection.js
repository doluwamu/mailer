import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB_URL;

const dbConnection = async () => {
  try {
    mongoose.connect(
      DB_URL,
      {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 50000,
      },
      () => console.log("Connection to DB successful")
    );
  } catch (error) {
    console.log("Connection to DB unsuccessful", error);
  }
};

export default dbConnection;
