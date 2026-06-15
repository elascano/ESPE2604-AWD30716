export type WatchCategory =
  | "ECONOMIC"
  | "EXECUTIVE"
  | "EXCLUSIVE"
  | "LUXURY"
  | "MULTIMILLIONAIRE";

export type Watch = {
  id: number;
  name: string;
  description: string;
  brand: string;
  cost: number;
  materials: string[];
  imageUrl?: string;
  category: WatchCategory;
};

export type WatchSeed = Omit<Watch, "category">;
