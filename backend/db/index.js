import mongoose from "mongoose";

const DB_name = "lms";

const connectDb = async () => {
  const mongodbBaseUrl = (process.env.MONGODB_URL || "").replace(/\/+$/, "");
  if (!mongodbBaseUrl) {
    throw new Error("MONGODB_URL is required");
  }

  try {
    const connection = await mongoose.connect(
      `${mongodbBaseUrl}/${DB_name}`
    );
    if (connection) {
      console.log("Database connected successfully");
    }
    return connection;
  } catch (err) {
    console.log("Error while connecting to database", err);
    throw err;
  }
};

export default connectDb;
