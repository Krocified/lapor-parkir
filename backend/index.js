const fastify = require("fastify")({
  logger: true,
});

// Register CORS
fastify.register(require("@fastify/cors"), {
  origin: true,
});

// In-memory storage (replace with database later)
let reports = [];
let nextId = 1;

// Health check
fastify.get("/", async (request, reply) => {
  return { message: "Lapor Parkir API is running!" };
});

// Get all reports
fastify.get("/api/reports", async (request, reply) => {
  return { reports };
});

// Create a new report
fastify.post("/api/reports", async (request, reply) => {
  const { licensePlate, violations, location, notes } = request.body;

  if (!licensePlate || !violations || violations.length === 0) {
    reply.code(400);
    return { error: "License plate and violations are required" };
  }

  const now = new Date();
  const newReport = {
    id: nextId++,
    plateNumber: licensePlate,
    licensePlate,
    plateType: "regular",
    violations,
    location: {
      address: location || "Unknown location",
    },
    notes: notes || "",
    timestamp: now.toISOString(),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
  };

  reports.unshift(newReport);
  reply.code(201);
  return newReport;
});

// Get a specific report
fastify.get("/api/reports/:id", async (request, reply) => {
  const { id } = request.params;
  const report = reports.find((r) => r.id === parseInt(id));

  if (!report) {
    reply.code(404);
    return { error: "Report not found" };
  }

  return report;
});

// Delete a report
fastify.delete("/api/reports/:id", async (request, reply) => {
  const { id } = request.params;
  const index = reports.findIndex((r) => r.id === parseInt(id));

  if (index === -1) {
    reply.code(404);
    return { error: "Report not found" };
  }

  reports.splice(index, 1);
  reply.code(204);
  return;
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
