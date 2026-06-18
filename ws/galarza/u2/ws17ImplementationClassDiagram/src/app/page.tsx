import { ArrowRight, Gem, ShieldCheck, Sparkles } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import SectionHeading from "@/components/SectionHeading";
import WatchCard from "@/components/WatchCard";
import { attachCategory } from "@/lib/watches";
import clientPromise from "@/lib/mongodb";
import type { WatchSeed } from "@/types/watch";

async function getWatches() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "watch_catalog";
  const collection = client.db(dbName).collection<WatchSeed>("watches");
  const docs = await collection.find({}).sort({ id: 1 }).toArray();

  return docs.map((doc) =>
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
}

export default async function HomePage() {
  const watches = await getWatches();

  const categoryCount = watches.reduce<Record<string, number>>((acc, watch) => {
    acc[watch.category] = (acc[watch.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen">
      <Navbar />
      <AnnouncementBar />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 text-xs tracking-[0.28em] text-amber-100 uppercase">
              <Sparkles className="h-4 w-4" />
              Curated luxury selection
            </p>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-white md:text-7xl">
              Watches crafted to feel like a private showcase.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              A refined landing page for elegant product presentation, powered by MongoDB
              and designed to highlight materials, brand identity, price, and calculated
              category.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#bfa15a] to-[#f1dfb3] px-6 py-3 font-semibold text-[#141414] shadow-soft transition hover:scale-[1.02]"
              >
                Browse collection <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 backdrop-blur transition hover:border-amber-100/30"
              >
                View categories
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Premium finish", value: "Pearl gold palette", icon: Gem },
                { label: "Live API", value: "/api/watches", icon: ShieldCheck },
                { label: "Elegant layout", value: "Card-style catalog", icon: Sparkles }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-md">
                    <Icon className="h-5 w-5 text-amber-100" />
                    <p className="mt-3 text-sm text-white/50">{item.label}</p>
                    <p className="mt-1 text-base font-medium text-white">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-5 shadow-soft backdrop-blur-md">
            <div className="relative overflow-hidden rounded-[26px]">
              <img
                src="/watches/watch-1.jpg"
                alt="Featured watch"
                className="h-[520px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[22px] border border-white/10 bg-black/35 p-5 backdrop-blur">
                <p className="text-xs tracking-[0.28em] text-amber-100 uppercase">Featured offer</p>
                <p className="mt-2 text-2xl font-semibold">Hand-finished collection</p>
                <p className="mt-2 text-sm text-white/70">
                  Front-end highlight only. No business rule changes, no category impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-6 pb-10">
        <SectionHeading
          eyebrow="Categories"
          title="Calculated by price, displayed with elegance."
          description="The category is derived from the watch cost in the backend, while the visual presentation remains polished and editorial."
        />

        <div className="grid gap-4 md:grid-cols-5">
          {["ECONOMIC", "EXECUTIVE", "EXCLUSIVE", "LUXURY", "MULTIMILLIONAIRE"].map((name) => (
            <div key={name} className="rounded-[24px] border border-white/10 bg-white/6 p-5 shadow-soft">
              <p className="text-sm tracking-[0.22em] text-white/45 uppercase">{name}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{categoryCount[name] || 0}</p>
              <p className="mt-1 text-sm text-white/55">items</p>
            </div>
          ))}
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading
          eyebrow="Collection"
          title="A catalog that feels like a boutique display."
          description="Cards float gently, materials stay visible, and each product keeps a luxurious editorial rhythm."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {watches.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-soft backdrop-blur-md">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs tracking-[0.35em] text-amber-100 uppercase">About</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Built for elegant product presentation, not heavy CRUD.
              </h2>
              <p className="mt-4 max-w-2xl text-white/65">
                The backend exposes clean URLs for the engineer to inspect, while the front-end
                acts like a refined product menu with strong visual hierarchy and simple data flow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/50">API URL</p>
                <p className="mt-2 font-mono text-sm text-amber-100">/api/watches</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/50">Health URL</p>
                <p className="mt-2 font-mono text-sm text-amber-100">/api/health</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/50">Database</p>
                <p className="mt-2 font-mono text-sm text-amber-100">MongoDB Atlas</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/50">Deployment</p>
                <p className="mt-2 font-mono text-sm text-amber-100">Vercel</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
