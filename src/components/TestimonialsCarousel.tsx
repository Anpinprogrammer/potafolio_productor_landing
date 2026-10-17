import { useState } from "react";
import { Clapperboard, Pause, Play, Quote, Star } from "lucide-react";
import { reviews } from "../data";
import Reveal from "./Reveal";
import "./TestimonialsCarousel.css";

function ReviewAvatar({ src }: { src?: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();

  return (
    <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-brand/10 text-brand">
      {src && src !== failedSrc ? (
        <img src={src} alt="" width={40} height={40} loading="lazy" decoding="async"
          className="h-10 w-10 rounded-full object-cover" onError={() => setFailedSrc(src)} />
      ) : <Clapperboard size={20} strokeWidth={1.7} />}
    </span>
  );
}

export default function TestimonialsCarousel() {
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);

  return (
    <div className="min-w-0">
      <Reveal>
        <div className="testimonials-carousel" role="region" aria-label="Reseñas de clientes" tabIndex={0}
          onPointerDown={() => setHolding(true)} onPointerUp={() => setHolding(false)}
          onPointerCancel={() => setHolding(false)} onPointerLeave={() => setHolding(false)}>
          <div className="testimonials-carousel__track" style={{ animationDuration: `${reviews.length * 12}s`, animationPlayState: paused || holding ? "paused" : undefined }}>
            {[false, true].map((duplicate) => (
              <ul key={String(duplicate)} aria-hidden={duplicate ? true : undefined}
                className={`testimonials-carousel__group ${duplicate ? "testimonials-carousel__duplicate" : ""}`}>
                {reviews.map((review) => (
                  <li key={review.n} className="testimonials-carousel__item">
                    <figure className="flex h-full flex-col rounded-2xl border border-zinc-800 bg-panel/70 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
                      <Quote className="text-brand" size={20} aria-hidden="true" />
                      <span className="mt-3 flex gap-1 text-brand" role="img" aria-label="5 de 5 estrellas">
                        {Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill="currentColor" aria-hidden="true" />)}
                      </span>
                      <blockquote className="mt-3 text-sm leading-relaxed text-zinc-200">{review.q}</blockquote>
                      <figcaption className="mt-auto flex items-center gap-3 pt-5">
                        <ReviewAvatar src={review.avatar} />
                        <span className="min-w-0 text-sm">
                          <b className="block text-white">{review.n}</b>
                          <span className="text-slate-400">{review.r}</span>
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Reveal>
      <div className="mt-3 flex justify-end md:hidden motion-reduce:hidden">
        <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}
          aria-label={paused ? "Reanudar carrusel de reseñas" : "Pausar carrusel de reseñas"}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs text-zinc-300 transition-colors hover:bg-white/5 hover:text-white">
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {paused ? "Reanudar" : "Pausar para leer"}
        </button>
      </div>
    </div>
  );
}
