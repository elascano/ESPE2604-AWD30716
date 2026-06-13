type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-[0.35em] text-amber-200/80 uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-white/65">{description}</p>
    </div>
  );
}
