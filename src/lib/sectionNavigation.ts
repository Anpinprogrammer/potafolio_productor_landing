export const SECTION_REPLAY_EVENT = "yamamoto:section-replay";

export function sectionScrollDuration(distance: number) {
  return Math.min(4500, 650 + Math.abs(distance) * 0.45);
}

/** Mantiene una velocidad cómoda también al saltar varias secciones. */
export function scrollToSection(section: HTMLElement, onComplete: () => void) {
  const start = window.scrollY;
  const destination = () => {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const top = section.getBoundingClientRect().top + window.scrollY - padding - margin;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(top, max));
  };
  const duration = sectionScrollDuration(destination() - start);
  let frame: number | undefined;
  let startedAt: number | undefined;
  const events = ["wheel", "touchstart", "pointerdown"] as const;
  const stop = () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    events.forEach(event => window.removeEventListener(event, stop));
    window.removeEventListener("keydown", onKey);
  };
  const onKey = (event: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"].includes(event.key)) stop();
  };
  const tick = (now: number) => {
    startedAt ??= now;
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
    // Instant evita que el smooth nativo se reinicie en cada frame.
    window.scrollTo({ top: start + (destination() - start) * eased, behavior: "instant" });
    if (progress < 1) frame = requestAnimationFrame(tick);
    else { stop(); onComplete(); }
  };
  events.forEach(event => window.addEventListener(event, stop, { passive: true }));
  window.addEventListener("keydown", onKey);
  frame = requestAnimationFrame(tick);
  return stop;
}

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
