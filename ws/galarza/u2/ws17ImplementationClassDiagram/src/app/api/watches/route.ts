import clientPromise from "@/lib/mongodb";
import { attachCategory } from "@/lib/watches";
import type { WatchSeed } from "@/types/watch";

export async function GET() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "watch_catalog";
  const collection = client.db(dbName).collection<WatchSeed>("watches");

  const docs = await collection.find({}).sort({ id: 1 }).toArray();

  const watches = docs.map((doc) =>
    attachCategory({
      id: doc.id,
      name: doc.name,
      description: doc.description,
      brand: doc.brand,
      cost: doc.cost,
      materials: doc.materials,
      imageUrl: doc.imageUrl
    })
  );

  return Response.json({ watches });
}
