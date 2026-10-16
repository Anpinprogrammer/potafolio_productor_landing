import { logos } from "../data";

// Item 64px + 24px gap = 88px pitch. The visible box is exactly 3 slots wide
// (2 pitches + 1 item = 240px), so exactly three logos are fully visible at any
// moment. The set is repeated so each half of the track is far wider than the
// box, which keeps the loop seamless.
const half = [...logos, ...logos, ...logos, ...logos];
const track = [...half, ...half];

export default function ToolsMarquee({ className = " wrap relative z-10 mt-auto w-full pb-8 sm:mt-0" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Herramientas que domino</p>
      <ul className="sr-only">{logos.map(l => <li key={l.src}>{l.alt}</li>)}</ul>
      <div aria-hidden="true" className="w-60 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee">
          {track.map((l, i) => (
            <img key={i} src={l.src} alt="" width={64} height={64} loading="lazy" draggable={false}
              className="mr-6 h-12 w-12 shrink-0 rounded-2xl object-contain ring-1 ring-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
