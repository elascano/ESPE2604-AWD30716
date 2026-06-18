export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0f14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-lg font-semibold tracking-wide text-white">Maison Horlogère</p>
          <p className="text-xs tracking-[0.2em] text-white/55 uppercase">
            Luxury watch catalogue
          </p>
        </div>

        <nav className="hidden gap-8 text-sm text-white/70 md:flex">
          <a href="#collection" className="transition hover:text-white">
            Collection
          </a>
          <a href="#categories" className="transition hover:text-white">
            Categories
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
        </nav>

        <a
          href="#collection"
          className="rounded-full border border-amber-200/35 bg-gradient-to-r from-[#bfa15a] to-[#f1dfb3] px-5 py-2 text-sm font-semibold text-[#151515] shadow-soft transition hover:scale-[1.02]"
        >
          Explore
        </a>
      </div>
    </header>
  );
}
