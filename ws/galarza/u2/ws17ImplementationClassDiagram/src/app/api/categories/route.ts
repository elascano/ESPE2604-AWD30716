import clientPromise from "@/lib/mongodb";
import {
  attachCategory,
  categoryDescriptions,
  slugifyCategory,
} from "@/lib/watches";
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
      imageUrl: doc.imageUrl,
    })
  );

  const categories = ["ECONOMIC", "EXECUTIVE", "EXCLUSIVE", "LUXURY", "MULTIMILLIONAIRE"] as const;

  return Response.json({
    categories: categories.map((category) => ({
      name: category,
      slug: slugifyCategory(category),
      description: categoryDescriptions[category],
      count: watches.filter((watch) => watch.category === category).length,
      url: `/api/categories/${slugifyCategory(category)}`,
    })),
  });
}
