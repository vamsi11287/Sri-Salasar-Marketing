import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    throw new Error("MONGO_URI must be configured before starting the API.");
  }

  const connection = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log(
    `[MongoDB] Connected successfully: ${connection.connection.host} (DB: ${connection.connection.name})`
  );
  return connection;
};
