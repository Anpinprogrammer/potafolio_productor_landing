import { useEffect, useLayoutEffect, useRef, useState, type Ref } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "../data";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Header({ logoRef, hideLogo = false }: { logoRef?: Ref<HTMLSpanElement>; hideLogo?: boolean } = {}) {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState("#inicio");
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame: number | null = null;

    const update = () => {
      frame = null;
      setSolid(!isHome || window.scrollY > 40);
      if (!isHome) { setActiveSection("#portafolio"); return; }
      // Sanity puede reemplazar una sección al cargar: mide siempre los nodos actuales.
      const sections = nav.flatMap(([, href]) => {
        const element = document.getElementById(href.slice(1));
        return element ? [{ href, element }] : [];
      });
      // Detecta la sección en la zona de lectura, por debajo de la barra fija.
      const readingLine = (headerRef.current?.getBoundingClientRect().bottom ?? 64)
        + Math.min(160, window.innerHeight * 0.18);
      let current = sections[0]?.href;
      for (const section of sections) {
        if (section.element.getBoundingClientRect().top <= readingLine) current = section.href;
      }
      // Contacto también se activa cuando es demasiado corto para alcanzar esa zona.
      if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1]?.href;
      }
      if (current) setActiveSection(current);
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    const main = document.querySelector("main");
    const contentObserver = new MutationObserver(scheduleUpdate);
    if (main) {
      observer.observe(main);
      contentObserver.observe(main, {childList: true, subtree: true});
    }
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
      contentObserver.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [isHome]);

  useEffect(() => { setOpen(false); }, [pathname, hash]);

  // Menú móvil: sin scroll de fondo, se cierra con Escape y al pasar a escritorio
  useLayoutEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => { if (mq.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <>
      <header ref={headerRef} className={`fixed inset-x-0 top-0 z-[60] transition duration-300 ${solid || open ? "bg-ink/90 backdrop-blur border-b border-white/10" : ""}`}>
        <div className="wrap flex h-16 items-center justify-between">
          <Link to="/#inicio" className="flex items-center font-bold text-white" aria-label="Yamamoto, inicio" style={{ opacity: hideLogo ? 0 : 1 }}>
            {/* El archivo trae aire transparente alrededor (el logotipo ocupa el 63% del alto),
                así que con h-14 el logotipo visible queda a ~35px dentro de la barra de 64px. */}
            <BrandLogo ref={logoRef} className="h-12 md:h-14 lg:h-16 w-auto" />
          </Link>
          <nav aria-label="Principal" className="hidden gap-8 text-sm md:flex">
            {nav.map(([label, href]) => {
              const active = activeSection === href;
              return (
                <Link key={href} to={!isHome && href === "#portafolio" ? "/proyectos" : `/${href}`} aria-current={active ? "location" : undefined}
                  className={`group relative py-2 transition-colors duration-300 focus-visible:rounded-sm ${active ? "text-white" : "text-slate-300 hover:text-white"}`}>
                  {label}
                  <span aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-center rounded-full bg-gradient-to-r from-white/40 via-white to-white/40 shadow-[0_2px_10px_rgba(255,255,255,0.2)] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${active ? "scale-x-100 opacity-100" : "scale-x-50 opacity-0 group-hover:scale-x-75 group-hover:opacity-40"}`} />
                </Link>
              );
            })}
          </nav>
          <Link to="/#contacto" className="btn-ghost hidden md:inline-flex">Trabajemos juntos</Link>
          <button type="button" onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}
            className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-white transition duration-300 hover:bg-white/10 md:hidden">
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </header>

      {/* Menú móvil a pantalla completa: los items quedan centrados en la pantalla */}
      {open && (
        <nav aria-label="Menú principal"
          className="fixed inset-0 z-[55] animate-fadein overflow-y-auto bg-ink/95 backdrop-blur-xl md:hidden">
          <div className="flex min-h-full flex-col items-center justify-center gap-9 px-8 py-16">
            <ul className="flex flex-col items-center gap-6">
              {nav.map(([l, h], i) => (
                <li key={h} className="animate-modalin" style={{ animationDelay: `${0.05 * i}s` }}>
                  <Link to={!isHome && h === "#portafolio" ? "/proyectos" : `/${h}`} aria-current={activeSection === h ? "location" : undefined} onClick={() => setOpen(false)}
                    className="text-3xl font-extrabold tracking-tight text-white transition duration-300 hover:text-brand active:text-brand">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/#contacto" onClick={() => setOpen(false)}
              className="btn-primary animate-modalin" style={{ animationDelay: `${0.05 * nav.length}s` }}>
              Trabajemos juntos
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
