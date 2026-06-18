import clientPromise from "@/lib/mongodb";
import {
  attachCategory,
  categoryDescriptions,
  normalizeCategory,
} from "@/lib/watches";
import type { WatchSeed } from "@/types/watch";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const normalized = normalizeCategory(category);

  if (!normalized) {
    return Response.json({ message: "Invalid category" }, { status: 400 });
  }

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
      imageUrl: doc.imageUrl,
    })
  );

  const filtered = watches.filter((watch) => watch.category === normalized);

  return Response.json({
    category: normalized,
    description: categoryDescriptions[normalized],
    count: filtered.length,
    watches: filtered,
  });
}
