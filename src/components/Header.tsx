import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "../data";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => { const f = () => setSolid(scrollY > 40); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);

  // Menú móvil: sin scroll de fondo, se cierra con Escape y al pasar a escritorio
  useEffect(() => {
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
      <header className={`fixed inset-x-0 top-0 z-[60] transition duration-300 ${solid || open ? "bg-ink/90 backdrop-blur border-b border-white/10" : ""}`}>
        <div className="wrap flex h-16 items-center justify-between">
          <a href="#inicio" className="flex items-center font-bold text-white" aria-label="Yamamoto, inicio">
            {/* El archivo trae aire transparente alrededor (el logotipo ocupa el 63% del alto),
                así que con h-14 el logotipo visible queda a ~35px dentro de la barra de 64px. */}
            <img src="/images/logo.webp" alt="" width={2127} height={739} className="h-14 w-auto" />
          </a>
          <nav aria-label="Principal" className="hidden gap-8 text-sm md:flex">
            {nav.map(([l, h]) => <a key={h} href={h} className="text-slate-300 transition hover:text-white">{l}</a>)}
          </nav>
          <a href="#contacto" className="btn-ghost hidden md:inline-flex">Trabajemos juntos</a>
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
                  <a href={h} onClick={() => setOpen(false)}
                    className="text-3xl font-extrabold tracking-tight text-white transition duration-300 hover:text-brand active:text-brand">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#contacto" onClick={() => setOpen(false)}
              className="btn-primary animate-modalin" style={{ animationDelay: `${0.05 * nav.length}s` }}>
              Trabajemos juntos
            </a>
          </div>
        </nav>
      )}
    </>
  );
}
