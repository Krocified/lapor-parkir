// Load environment variables from root directory
require("dotenv").config({ path: "../.env" });

const fastify = require("fastify")({
  logger: {
    level: process.env.NODE_ENV === "production" ? "warn" : "info",
  },
});

const { getReportsCollection } = require("./db");

// Register CORS
fastify.register(require("@fastify/cors"), {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL || true
      : true,
});

// Health check
fastify.get("/", async (request, reply) => {
  try {
    // Test database connection
    const collection = await getReportsCollection();
    const count = await collection.countDocuments();

    return {
      message: "Lapor Parkir API is running!",
      environment: process.env.NODE_ENV || "development",
      port: process.env.PORT || 3000,
      database: "MongoDB Atlas",
      reports_count: count,
      uptime: process.uptime(),
    };
  } catch (error) {
    return {
      message: "Lapor Parkir API is running!",
      environment: process.env.NODE_ENV || "development",
      port: process.env.PORT || 3000,
      database: "Connection failed",
      error: error.message,
    };
  }
});

// Get all reports
fastify.get("/api/reports", async (request, reply) => {
  try {
    const collection = await getReportsCollection();
    const reports = await collection.find({}).sort({ timestamp: -1 }).toArray();
    return { reports };
  } catch (error) {
    console.error("Error fetching reports:", error);
    reply.code(500);
    return { error: "Failed to fetch reports" };
  }
});

// Create a new report
fastify.post("/api/reports", async (request, reply) => {
  const { licensePlate, violations, location, notes } = request.body;

  if (!licensePlate || !violations || violations.length === 0) {
    reply.code(400);
    return { error: "License plate and violations are required" };
  }

  try {
    const collection = await getReportsCollection();
    const now = new Date();

    const newReport = {
      plateNumber: licensePlate, // Frontend expects plateNumber
      licensePlate, // Keep for API consistency
      plateType: "regular", // Default plate type
      violations,
      location: {
        address: location || "Unknown location",
      },
      notes: notes || "",
      timestamp: now.toISOString(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      createdAt: now,
    };

    const result = await collection.insertOne(newReport);

    // Add the MongoDB _id as id for frontend compatibility
    const savedReport = {
      id: result.insertedId.toString(),
      ...newReport,
    };

    reply.code(201);
    return savedReport;
  } catch (error) {
    console.error("Error creating report:", error);
    reply.code(500);
    return { error: "Failed to create report" };
  }
});

// Get a specific report
fastify.get("/api/reports/:id", async (request, reply) => {
  const { id } = request.params;

  try {
    const collection = await getReportsCollection();
    const { ObjectId } = require("mongodb");

    const report = await collection.findOne({ _id: new ObjectId(id) });

    if (!report) {
      reply.code(404);
      return { error: "Report not found" };
    }

    // Convert _id to id for frontend compatibility
    const responseReport = {
      id: report._id.toString(),
      ...report,
    };
    delete responseReport._id;

    return responseReport;
  } catch (error) {
    console.error("Error fetching report:", error);
    reply.code(404);
    return { error: "Report not found" };
  }
});

// Delete a report
fastify.delete("/api/reports/:id", async (request, reply) => {
  const { id } = request.params;

  try {
    const collection = await getReportsCollection();
    const { ObjectId } = require("mongodb");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      reply.code(404);
      return { error: "Report not found" };
    }

    reply.code(204);
    return;
  } catch (error) {
    console.error("Error deleting report:", error);
    reply.code(500);
    return { error: "Failed to delete report" };
  }
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("💀 SIGTERM received, shutting down gracefully...");
  await fastify.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("💀 SIGINT received, shutting down gracefully...");
  await fastify.close();
  process.exit(0);
});

// For Vercel serverless deployment
if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    await fastify.ready();
    fastify.server.emit("request", req, res);
  };
} else {
  // Traditional server
  const start = async () => {
    try {
      const port = process.env.PORT || 3000;
      const host = process.env.HOST || "0.0.0.0";

      await fastify.listen({ port, host });

      console.log(`🚀 Server running on ${host}:${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `📧 Support: ${process.env.SUPPORT_EMAIL || "Not configured"}`
      );
      console.log(`🔗 GitHub: ${process.env.GITHUB_URL || "Not configured"}`);

      if (process.env.FRONTEND_URL) {
        console.log(`📱 Frontend: ${process.env.FRONTEND_URL}`);
      }
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

  start();
}
