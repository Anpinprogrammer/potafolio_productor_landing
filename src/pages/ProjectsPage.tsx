import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PremiumServices from "../components/PremiumServices";
import SectionBadge from "../components/SectionBadge";

export default function ProjectsPage() {
  const [category, setCategory] = useState("Todos");
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
          <div role="group" aria-label="Filtrar proyectos por categoría" className="mt-6 flex snap-x snap-mandatory overflow-x-auto gap-2 pb-4 scrollbar-none">
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
        </div>
      </div>
      <PremiumServices collection="all" category={category} />
    </div>
  );
}
