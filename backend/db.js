const { MongoClient } = require("mongodb");

let client;
let db;

async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db("lapor-parkir");

    console.log("✅ Connected to MongoDB Atlas");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

async function getReportsCollection() {
  const database = await connectToDatabase();
  return database.collection("reports");
}

async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  connectToDatabase,
  getReportsCollection,
  closeConnection,
};
