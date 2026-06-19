import { MongoClient } from "mongodb";
import { students } from "./data/students.js";

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGO_DATABASE || "american_latin_class";

const client = new MongoClient(mongoUri);

try {
  await client.connect();
  const db = client.db(databaseName);
  const collection = db.collection("students");

  await collection.createIndex({ public_key: 1 }, { unique: true });
  await collection.createIndex({ email: 1 }, { unique: true });

  for (const student of students) {
    await collection.updateOne(
      { public_key: student.public_key },
      { $set: { ...student, updated_at: new Date() }, $setOnInsert: { created_at: new Date() } },
      { upsert: true }
    );
  }

  console.log(`Seeded ${students.length} students into ${databaseName}.students`);
} finally {
  await client.close();
}
