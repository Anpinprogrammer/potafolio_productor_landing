import { ArrowLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PremiumServices from "../components/PremiumServices";
import SectionBadge from "../components/SectionBadge";

export default function ProjectsPage() {
  const [category, setCategory] = useState("Todos");
  const filtersRef = useRef<HTMLDivElement>(null);
  const [hasMoreFilters, setHasMoreFilters] = useState(false);
  useEffect(() => {
    const filters = filtersRef.current;
    if (!filters) return;
    const update = () => setHasMoreFilters(filters.scrollWidth - filters.clientWidth - filters.scrollLeft > 2);
    const observer = new ResizeObserver(update);
    observer.observe(filters);
    for (const child of filters.children) observer.observe(child);
    filters.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      filters.removeEventListener("scroll", update);
    };
  }, []);
  const categories = ["Todos", "Comerciales", "Reels & TikTok", "YouTube", "Documental / Viajes"];
  return (
    <div className="min-h-screen bg-ink pt-24 md:pt-28">
      <div className="pointer-events-none fixed inset-x-0 top-20 z-40 md:top-24">
        <div className="wrap">
          <Link to="/#portafolio" className="btn-secondary pointer-events-auto bg-ink/90">
            <ArrowLeft size={16} aria-hidden /> Volver
          </Link>
        </div>
      </div>
      <div className="wrap pt-20">
        <div className="pb-8">
          <SectionBadge text="Portafolio completo" theme="dark" />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
            Todos los <span className="font-script text-[2.38rem] font-normal text-lens md:text-[3.4rem]">proyectos</span>
          </h1>
          <p className="mt-4 max-w-full text-slate-400">Historias, marcas e ideas en movimiento. Explora cada proyecto y descubre el trabajo detrás de cada edición.</p>
          <div className="relative mt-6">
          <div ref={filtersRef} id="project-category-filters" role="group" aria-label="Filtrar proyectos por categoría" className="flex snap-x snap-mandatory overflow-x-auto gap-2 pb-4 scrollbar-none">
            {categories.map((item) => (
              <button key={item} type="button" aria-pressed={category === item}
                onClick={(event) => {
                  setCategory(item);
                  event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
                }}
                className={`shrink-0 snap-start rounded-full border px-5 py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4C7E] ${category === item ? "border-[#2B4C7E] bg-[#2B4C7E] text-white font-bold shadow-sm" : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-[#2B4C7E]"}`}>
                {item}
              </button>
            ))}
          </div>
          {hasMoreFilters && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-start bg-gradient-to-l from-ink via-ink/95 to-transparent pl-8">
              <button type="button" aria-label="Ver más filtros" aria-controls="project-category-filters"
                onClick={() => {
                  const filters = filtersRef.current;
                  if (!filters) return;
                  filters.scrollBy({ left: filters.clientWidth * 0.7, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
                }}
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#2B4C7E] bg-[#2B4C7E] text-white shadow-sm transition-colors hover:bg-[#3B629B]">
                <ChevronRight size={22} aria-hidden />
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
      <PremiumServices collection="all" category={category} />
    </div>
  );
}
