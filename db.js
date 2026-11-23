const mongoose = require("mongoose");

require("dotenv").config();

let connectionPromise;

function connectToDatabase() {
  const uri = process.env.MONGODB_URI || process.env.mongourl;
  if (!uri) {
    return Promise.reject(new Error("Set MONGODB_URI before starting the server"));
  }

  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
}

module.exports = { connectToDatabase };
