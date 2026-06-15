import type { WatchCategory, WatchSeed } from "@/types/watch";

export function getWatchCategory(cost: number): WatchCategory {
  if (cost < 200) return "ECONOMIC";
  if (cost < 1000) return "EXECUTIVE";
  if (cost < 5000) return "EXCLUSIVE";
  if (cost < 15000) return "LUXURY";
  return "MULTIMILLIONAIRE";
}

export function attachCategory(watch: WatchSeed) {
  return {
    ...watch,
    category: getWatchCategory(watch.cost),
  };
}

export const categoryDescriptions: Record<WatchCategory, string> = {
  ECONOMIC: "Accessible watches with clean style and essential features.",
  EXECUTIVE: "Balanced pieces for daily wear and professional elegance.",
  EXCLUSIVE: "Refined watches with premium materials and stronger presence.",
  LUXURY: "High-end timepieces designed for collectors and prestige.",
  MULTIMILLIONAIRE: "Ultra-exclusive watches reserved for exceptional showcases.",
};

export const materialDescriptions: Record<string, string> = {
  "Stainless Steel": "Durable and classic metal finish.",
  Leather: "Soft strap with a traditional premium look.",
  Silicone: "Flexible material for sport and comfort.",
  Aluminum: "Lightweight and modern structure.",
  Gold: "Precious metal used in luxury pieces.",
  Silver: "Bright refined metal with elegant appearance.",
  Bronze: "Vintage-inspired alloy with character.",
  Titanium: "Strong and lightweight premium material.",
  "Sapphire Crystal": "Scratch-resistant crystal used in premium watches.",
  Glass: "Clear protective surface for the dial.",
  "Carbon Fiber": "Advanced lightweight material with a technical look.",
  Rubber: "Practical and durable material for active use.",
  Diamond: "Luxury accent material used in elite models.",
  Platinum: "Rare precious metal for exceptional timepieces.",
};

export function slugifyCategory(category: WatchCategory) {
  return category.toLowerCase();
}

export function normalizeCategory(input: string): WatchCategory | null {
  const value = input.trim().toUpperCase();
  const allowed: WatchCategory[] = [
    "ECONOMIC",
    "EXECUTIVE",
    "EXCLUSIVE",
    "LUXURY",
    "MULTIMILLIONAIRE",
  ];
  return allowed.includes(value as WatchCategory) ? (value as WatchCategory) : null;
}
