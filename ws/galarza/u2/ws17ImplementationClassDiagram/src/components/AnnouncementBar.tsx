const messages = [
  "Limited editions available now",
  "Free worldwide insured shipping",
  "New arrivals in pearl gold finishes",
  "Curated craftsmanship for collectors"
];

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden border-y border-white/10 bg-white/5">
      <div className="animate-[marquee_22s_linear_infinite] whitespace-nowrap py-2 text-sm tracking-[0.28em] text-white/70 uppercase">
        {messages.map((message, index) => (
          <span key={message} className="mx-10">
            {index % 2 === 0 ? "✦" : "◆"} {message}
          </span>
        ))}
      </div>
    </div>
  );
}
