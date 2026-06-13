import Image from "next/image";
import type { Watch } from "@/types/watch";

const badgeStyles: Record<Watch["category"], string> = {
  ECONOMIC: "bg-white/10 text-white/80",
  EXECUTIVE: "bg-amber-100/15 text-amber-100",
  EXCLUSIVE: "bg-[#d7c18a]/20 text-[#f4e4b2]",
  LUXURY: "bg-[#b58f3f]/20 text-[#f0d89b]",
  MULTIMILLIONAIRE: "bg-[#f7e7b3]/20 text-[#fff5d6]"
};

export default function WatchCard({ watch }: { watch: Watch }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/6 shadow-soft backdrop-blur-md transition hover:-translate-y-1 hover:border-amber-100/25">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={watch.imageUrl || "/watches/watch-1.jpg"}
          alt={watch.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-[#0b0f14]/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs tracking-[0.22em] text-white/85 uppercase backdrop-blur">
          Featured
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/50">{watch.brand}</p>
            <h3 className="mt-1 text-2xl font-semibold text-white">{watch.name}</h3>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[watch.category]}`}>
            {watch.category}
          </span>
        </div>

        <p className="min-h-12 text-sm leading-6 text-white/65">{watch.description}</p>

        <div className="flex flex-wrap gap-2">
          {watch.materials.map((material) => (
            <span
              key={material}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
            >
              {material}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-2xl font-semibold text-white">${watch.cost.toLocaleString("en-US")}</p>
          <div className="rounded-full bg-gradient-to-r from-[#bfa15a] to-[#f1dfb3] px-4 py-2 text-sm font-semibold text-[#171717]">
            View details
          </div>
        </div>
      </div>
    </article>
  );
}
