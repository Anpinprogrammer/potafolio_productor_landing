import { useEffect, useState, type CSSProperties } from "react";
import "./VideoOpening.css";

// Debe coincidir con portfolio-reveal-out en VideoOpening.css.
const REVEAL_MS = 520;

type Props = {
  poster: string | null;
  title: string;
  category: string;
  accent: string;
  grain: string;
  ready: boolean;
  failed: boolean;
  reducedMotion: boolean;
};

/** Anima la espera y cede al video cuando llega la señal del reproductor. */
export default function VideoOpening({ poster, title, category, accent, grain, ready, failed, reducedMotion }: Props) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!ready) { setVisible(true); return; }
    const timer = window.setTimeout(() => setVisible(false), reducedMotion ? 0 : REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, [ready, reducedMotion]);
  if (!visible || failed || (ready && reducedMotion)) return null;

  return (
    <>
      {!ready && <span role="status" className="sr-only">Preparando el video: {title}</span>}
      <div aria-hidden="true" data-video-opening={ready ? "revealing" : "loading"}
        style={{ "--portfolio-accent": accent } as CSSProperties}
        className={`portfolio-opening ${ready ? "portfolio-opening--reveal" : "portfolio-opening--loading"}`}>
        <div className="portfolio-opening__scene">
          {poster && <img src={poster} alt="" className="portfolio-opening__poster" />}
          <div className="portfolio-opening__vignette" />
          <div className="portfolio-opening__grain" style={{ backgroundImage: grain }} />
          <div className="portfolio-opening__aura" />
          <div className="portfolio-opening__beam" />
          <div className="portfolio-opening__scan" />
        </div>
        <div className="portfolio-opening__matte portfolio-opening__matte--top" />
        <div className="portfolio-opening__matte portfolio-opening__matte--bottom" />
        <div className="portfolio-opening__frame">
          <span className="portfolio-opening__corner portfolio-opening__corner--tl" />
          <span className="portfolio-opening__corner portfolio-opening__corner--tr" />
          <span className="portfolio-opening__corner portfolio-opening__corner--bl" />
          <span className="portfolio-opening__corner portfolio-opening__corner--br" />
          <div className="portfolio-opening__header">
            <span>YAMAMOTO <span className="portfolio-opening__slash">/</span> FILM</span>
            <span className="portfolio-opening__signal"><i /> ESTRENO</span>
          </div>
          <div className="portfolio-opening__copy">
            <span className="portfolio-opening__category">{category}</span>
            <span className="portfolio-opening__title">{title}</span>
            <span className="portfolio-opening__rule" />
          </div>
          <div className="portfolio-opening__footer">
            <span>{ready ? "La historia comienza" : "Preparando tu película"}</span>
            <span className="portfolio-opening__track"><span /></span>
          </div>
        </div>
        <div className="portfolio-opening__shutter" />
        <div className="portfolio-opening__reveal-light" />
      </div>
    </>
  );
}
