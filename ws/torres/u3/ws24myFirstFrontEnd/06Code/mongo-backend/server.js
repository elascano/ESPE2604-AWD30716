import cors from "cors";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import { students as seedStudents } from "./data/students.js";

const port = Number(process.env.PORT || 8080);
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGO_DATABASE || "american_latin_class";
const frontendOrigins = (process.env.FRONTEND_ORIGINS || "http://3.15.207.113,http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const client = new MongoClient(mongoUri);
await client.connect();

const db = client.db(databaseName);
const students = db.collection("students");

await students.createIndex({ public_key: 1 }, { unique: true });
await students.createIndex({ email: 1 }, { unique: true });
await seedIfEmpty();

const app = express();
app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    if (!origin || frontendOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin is not allowed by CORS"));
  }
}));

app.get("/", (request, response) => {
  response.json({
    project: "American Latin Class Mongo API",
    database: "MongoDB",
    health: "/api/health",
    endpoints: {
      public: ["/api/health", "/api/student-showcase", "/api/students-showcase", "/api/students/:id/report"]
    }
  });
});

app.get("/api/health", async (request, response) => {
  await db.command({ ping: 1 });
  response.json({
    status: "ok",
    database: "connected",
    engine: "mongodb",
    project: "American Latin Class"
  });
});

app.get("/api/student-showcase", async (request, response) => {
  const student = await students.findOne(
    { public_key: "mateo-vera", status: "active" },
    { projection: publicProjection() }
  ) ?? await students.findOne({ status: "active" }, { projection: publicProjection(), sort: { full_name: 1 } });

  if (!student) {
    response.status(404).json({ message: "No active student is available for the showcase." });
    return;
  }

  response.json({ data: serializeStudent(student) });
});

app.get("/api/students-showcase", async (request, response) => {
  const rows = await students
    .find({ status: "active" }, { projection: publicProjection() })
    .sort({ branch: 1, full_name: 1 })
    .toArray();

  response.json({
    count: rows.length,
    data: rows.map(serializeStudent)
  });
});

app.get("/api/students/:id/report", async (request, response) => {
  const query = ObjectId.isValid(request.params.id)
    ? { _id: new ObjectId(request.params.id) }
    : { public_key: request.params.id };

  const student = await students.findOne(query, { projection: publicProjection() });
  if (!student) {
    response.status(404).json({ message: "Student report was not found." });
    return;
  }

  response.json({
    data: {
      ...serializeStudent(student),
      report_generated_at: new Date().toISOString()
    }
  });
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ message: "The API could not complete the request." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`American Latin Class Mongo API listening on ${port}`);
});

function publicProjection() {
  return {
    public_key: 1,
    full_name: 1,
    email: 1,
    level: 1,
    branch: 1,
    scholarship_percent: 1,
    status: 1,
    comments: 1,
    schedule: 1,
    attendance_summary: 1
  };
}

function serializeStudent(student) {
  return {
    id: String(student._id),
    public_key: student.public_key,
    full_name: student.full_name,
    level: student.level,
    branch: student.branch,
    scholarship_percent: student.scholarship_percent,
    status: student.status,
    comments: student.comments,
    schedule: student.schedule || [],
    attendance_summary: student.attendance_summary || null
  };
}

async function seedIfEmpty() {
  const count = await students.countDocuments();
  if (count > 0) return;

  await students.insertMany(seedStudents.map((student) => ({
    ...student,
    created_at: new Date(),
    updated_at: new Date()
  })));
}
