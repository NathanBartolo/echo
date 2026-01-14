// MongoDB connection setup
// Connects to MongoDB using Mongoose on app startup

const mongoose = require("mongoose");

// Initialize database connection
// Reads MONGO_URI from environment variables
// Exits process if connection fails to prevent app from running without DB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
