/**
 * The blue EU band on the left of a Danish license plate: twelve yellow
 * stars in a circle above "DK". Official EU colors.
 */
const EU_BLUE = "#003399";
const EU_YELLOW = "#ffcc00";

// A five-pointed star centered on 0,0 with outer radius 1.
const STAR = Array.from({ length: 10 }, (_, i) => {
  const radius = i % 2 === 0 ? 1 : 0.4;
  const angle = (Math.PI / 5) * i - Math.PI / 2;
  return `${(radius * Math.cos(angle)).toFixed(3)},${(radius * Math.sin(angle)).toFixed(3)}`;
}).join(" ");

const STAR_POSITIONS = Array.from({ length: 12 }, (_, i) => {
  const angle = (Math.PI / 6) * i;
  return { x: 12 + 8 * Math.cos(angle), y: 12 + 8 * Math.sin(angle) };
});

export function EuPlateBand() {
  return (
    <span
      aria-hidden
      className="flex w-11 shrink-0 flex-col items-center justify-center gap-0.5 self-stretch"
      style={{ backgroundColor: EU_BLUE }}
    >
      <svg viewBox="0 0 24 24" className="size-7">
        {STAR_POSITIONS.map(({ x, y }) => (
          <polygon
            key={`${x}-${y}`}
            points={STAR}
            fill={EU_YELLOW}
            transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(1.9)`}
          />
        ))}
      </svg>
      <span className="text-xs leading-none font-semibold text-white">DK</span>
    </span>
  );
}
