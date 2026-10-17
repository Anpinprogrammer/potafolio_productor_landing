import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import LogoIntro from "./components/LogoIntro";
import WhatsAppButton from "./components/WhatsAppButton";
import PremiumServices from "./components/PremiumServices";
import { Hero, Services, About, Process, Testimonials, Contact, Footer } from "./components/Sections";
import ProjectsPage from "./pages/ProjectsPage";
import { keepSectionAligned, replaySection } from "./lib/sectionNavigation";

export default function App() {
  const { pathname, hash, key: navigationKey } = useLocation();
  const previousPath = useRef(pathname);
  const logoRef = useRef<HTMLSpanElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [introActive, setIntroActive] = useState(() =>
    pathname === "/" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [contentVisible, setContentVisible] = useState(!introActive);
  const reveal = useCallback(() => setContentVisible(true), []);
  const finishIntro = useCallback(() => {
    setContentVisible(true);
    setIntroActive(false);
  }, []);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    shell.inert = introActive;
    if (!introActive) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { shell.inert = false; document.body.style.overflow = overflow; };
  }, [introActive]);

  useEffect(() => {
    if (introActive) return;
    const changedPage = previousPath.current !== pathname;
    previousPath.current = pathname;
    let stopReplay: (() => void) | undefined;
    let stopAlignment: (() => void) | undefined;
    // Espera a que el menú móvil se desmonte y restaure el scroll antes de navegar.
    const frame = requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      if (target) {
        const section = target.closest("section") ?? target;
        stopReplay = replaySection(section);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduced || changedPage ? "instant" : "smooth" });
        stopAlignment = keepSectionAligned(section);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    });
    return () => { cancelAnimationFrame(frame); stopReplay?.(); stopAlignment?.(); };
  }, [pathname, hash, navigationKey, introActive]);

  useEffect(() => {
    document.title = pathname === "/proyectos" ? "Todos los proyectos · Yamamoto" : "Yamamoto · Producción audiovisual";
  }, [pathname]);

  return (<>
    <div ref={shellRef} className={`site-shell ${contentVisible ? "site-shell--visible" : ""} ${introActive ? "site-shell--intro-active" : ""}`}>
      <Header logoRef={logoRef} hideLogo={introActive} />
      <main className="site-content">
        <Routes>
          <Route path="/" element={<><Hero /><PremiumServices /><Services /><About /><Process /><Testimonials /><Contact /></>} />
          <Route path="/proyectos" element={<ProjectsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer /><WhatsAppButton />
    </div>
    {introActive && <LogoIntro targetRef={logoRef} onReveal={reveal} onComplete={finishIntro} />}
  </>);
}
