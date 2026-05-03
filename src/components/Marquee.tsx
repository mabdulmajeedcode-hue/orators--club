const items = [
  "Debates", "Elocution", "MJ MUN", "ORATORIA", "Speakers' Forum", "Since 2003", "MJCET",
];

const Marquee = () => {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="bg-background border-y border-border overflow-hidden py-4">
      <div className="flex whitespace-nowrap animate-marquee">
        {loop.map((t, i) => (
          <span key={i} className="mx-8 font-display font-semibold text-2xl text-primary tracking-wide">
            {t} <span className="text-primary/60 ml-8">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;