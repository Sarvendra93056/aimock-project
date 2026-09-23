const mongoose = require('mongoose');

// Cache database connection across serverless function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewai';

    cached.promise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongooseInstance) => {
        console.log(`[MongoDB Connected]: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn(`[MongoDB Connection Warning]: ${err.message}`);
        cached.promise = null;
        // Don't crash in serverless mode if remote URI isn't configured yet
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
  }

  return cached.conn;
};

module.exports = connectDB;
