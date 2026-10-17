import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PremiumServices from "../components/PremiumServices";
import SectionBadge from "../components/SectionBadge";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-ink pt-24 md:pt-28">
      <div className="pointer-events-none fixed inset-x-0 top-20 z-40 md:top-24">
        <div className="wrap">
          <Link to="/#inicio" className="btn pointer-events-auto border border-white/60 bg-[#fbfaf8]/90 text-sm text-ink shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-md hover:bg-white">
            <ArrowLeft size={16} aria-hidden className="text-brand" /> Volver al inicio
          </Link>
        </div>
      </div>
      <div className="wrap pt-20">
        <div className="pb-8">
          <SectionBadge text="Portafolio completo" theme="dark" />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Todos los <span className="font-script text-brand">proyectos</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400">Historias, marcas e ideas en movimiento. Explora cada proyecto y descubre el trabajo detrás de cada edición.</p>
        </div>
      </div>
      <PremiumServices collection="all" />
    </div>
  );
}
