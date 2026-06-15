import clientPromise from "@/lib/mongodb";
import { materialDescriptions } from "@/lib/watches";
import type { WatchSeed } from "@/types/watch";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const watchId = Number(id);

  if (Number.isNaN(watchId)) {
    return Response.json({ message: "Invalid watch id" }, { status: 400 });
  }

  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "watch_catalog";
  const collection = client.db(dbName).collection<WatchSeed>("watches");

  const doc = await collection.findOne({ id: watchId });

  if (!doc) {
    return Response.json({ message: "Watch not found" }, { status: 404 });
  }

  return Response.json({
    watchId: doc.id,
    name: doc.name,
    materials: doc.materials.map((material) => ({
      name: material,
      description: materialDescriptions[material] || "Premium watch material.",
    })),
  });
}
