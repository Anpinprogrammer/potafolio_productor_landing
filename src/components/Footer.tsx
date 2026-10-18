import { Link } from "react-router-dom";
import { Instagram, Youtube, Linkedin } from "lucide-react";
import BrandLogo from "./BrandLogo";
import WhatsAppIcon from "./WhatsAppIcon";
import { nav } from "../data";
import { MESSAGE, PHONE } from "../utils";

function VimeoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.977 6.416c-.105 2.338-1.738 5.54-4.894 9.605-3.264 4.243-6.026 6.365-8.288 6.365-1.4 0-2.583-1.293-3.552-3.88L3.97 7.84c-.36-1.293-.75-1.94-1.17-1.94-.09 0-.72.378-1.89 1.132L0 5.575l3.515-3.133C5.1 1.072 6.29.352 7.083.28c1.876-.18 3.03 1.103 3.463 3.848.468 2.962.793 4.805.973 5.529.54 2.457 1.135 3.686 1.784 3.686.505 0 1.263-.797 2.274-2.392 1.01-1.596 1.551-2.81 1.624-3.643.144-1.378-.397-2.067-1.624-2.067-.578 0-1.173.132-1.785.396 1.186-3.885 3.45-5.773 6.79-5.665 2.477.072 3.642 1.686 3.495 4.844z" />
    </svg>
  );
}

// Sustituir las páginas generales por los perfiles oficiales cuando estén disponibles.
const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
  { label: "YouTube", href: "https://www.youtube.com/", icon: Youtube },
  { label: "Vimeo", href: "https://vimeo.com/", icon: VimeoIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
  { label: "WhatsApp", href: `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`, icon: WhatsAppIcon },
];

const linkClassName = "rounded-sm text-zinc-400 transition-colors duration-300 hover:text-brand focus-visible:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none";

export default function Footer() {
  const scrollToTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  };

  return (
    <footer className="border-t border-zinc-800/80 bg-ink py-10 text-sm text-zinc-400 md:border-zinc-800/60 md:pb-8 md:pt-12">
      <div className="wrap">
        <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8">
          <div className="flex-1 min-w-0">
            <Link to="/#inicio" aria-label="Yamamoto, inicio" className={`inline-block ${linkClassName}`}>
              <BrandLogo className="h-12 w-auto lg:h-14" />
            </Link>
            <p className="mt-3 max-w-sm leading-relaxed">
              Edición y producción audiovisual enfocada en contar historias con calidad cinematográfica.
            </p>
          </div>

          <div className="flex flex-1 justify-between flex-col md:flex-row gap-6 md:gap-0">
            <div className="flex-1">
              <nav aria-labelledby="footer-navigation-title">
                <h2 id="footer-navigation-title" className="mb-3 text-xs font-semibold tracking-wider text-zinc-500">NAVEGACIÓN</h2>
                <ul className="flex flex-col items-start gap-3">
                  {nav.filter(([, href]) => href !== "#proceso").map(([label, href]) => (
                    <li key={href}>
                      <Link to={`/${href}`} className={linkClassName}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

          <div className="min-w-0 flex-1">
            <h2 id="footer-social-title" className="mb-1 md:mb-3 text-xs font-semibold tracking-wider text-zinc-500">SÍGUEME</h2>
            <ul aria-labelledby="footer-social-title" className="flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" title={label}
                    aria-label={`${label} (abre en una pestaña nueva)`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-zinc-400 transition-all duration-300 hover:text-brand focus-visible:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none md:rounded-full md:border md:border-zinc-800 md:bg-zinc-900/80 md:p-2.5 md:hover:border-brand md:hover:bg-brand/20 md:hover:text-white md:focus-visible:border-brand md:focus-visible:bg-brand/20 md:focus-visible:text-white">
                    <span aria-hidden="true"><Icon className="h-5 w-5" /></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-zinc-900 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-zinc-500">© 2026 Yamamoto. Todos los derechos reservados.</p>
          <button type="button" onClick={scrollToTop} className={`shrink-0 text-sm text-zinc-400 ${linkClassName}`}>
            Volver arriba ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
