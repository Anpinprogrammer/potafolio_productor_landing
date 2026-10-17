export const SECTION_REPLAY_EVENT = "yamamoto:section-replay";

/** Compensa cambios de altura de Sanity sin interferir con el siguiente gesto del usuario. */
export function keepSectionAligned(section: HTMLElement) {
  const main = section.closest("main");
  if (!main) return;
  let top = section.getBoundingClientRect().top + window.scrollY;
  let frame: number | undefined;
  const observer = new ResizeObserver(() => {
    const nextTop = section.getBoundingClientRect().top + window.scrollY;
    if (Math.abs(nextTop - top) < 1) return;
    top = nextTop;
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = undefined;
      section.scrollIntoView({ behavior: "instant" });
    });
  });
  const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
  const stop = () => {
    observer.disconnect();
    if (frame !== undefined) cancelAnimationFrame(frame);
    events.forEach(event => window.removeEventListener(event, stop));
  };
  observer.observe(main);
  events.forEach(event => window.addEventListener(event, stop, { passive: true }));
  return stop;
}

/** Reinicia solo la presentación de la sección, conservando su contenido y estado. */
export function replaySection(section: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  section.dispatchEvent(new Event(SECTION_REPLAY_EVENT));
  // Las transiciones de Reveal se gestionan mediante el evento; los loops siguen su curso.
  const animations = section.getAnimations({ subtree: true }).filter(animation =>
    animation instanceof CSSAnimation && animation.effect?.getTiming().iterations !== Infinity
  );
  if (!animations.length) return;
  for (const animation of animations) {
    animation.currentTime = 0;
    animation.pause();
  }
  // La entrada no se consume durante el desplazamiento desde una sección lejana.
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    animations.forEach(animation => animation.play());
    observer.disconnect();
  }, { threshold: 0.15 });
  observer.observe(section);
  return () => {
    observer.disconnect();
    animations.forEach(animation => { if (animation.playState === "paused") animation.play(); });
  };
}
