import { ArrowRight, Play, Zap, ShieldCheck, MessageCircle, Mail, Star, Quote, Clapperboard } from "lucide-react";
import Reveal from "./Reveal";
import ToolsMarquee from "./ToolsMarquee";
import { services, projects, steps, reviews } from "../data";

export const Hero = () => (
  <section id="inicio" className="relative overflow-hidden">
  <div className="relative mx-auto flex min-h-screen max-w-[1800px] flex-col pt-16 max-sm:min-h-svh">
    <img src="/images/hero.webp" alt="Editor de video trabajando en su laptop dentro de un estudio con paneles acústicos y cámaras" width={1350} height={1800} fetchPriority="high"
      className="animate-fadehero absolute inset-y-0 right-0 h-full w-full object-cover object-[60%_45%] md:w-3/5 [mask-image:linear-gradient(to_left,black_55%,transparent)] " />
    <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-ink to-transparent max-[1800px]:hidden" />
    <div className="wrap relative my-auto w-full text-slate-50 max-sm:my-0 max-sm:flex max-sm:flex-1 max-sm:py-6 sm:py-14 md:py-16">
      <div className="max-w-xl lg:max-w-3xl flex flex-col max-sm:w-full max-sm:justify-between">
        <div>

          <p className="animate-rise text-d text-brand font-bold">Hola, soy un profesional en</p>
          <h1 className="animate-rise text-3xl font-bold lg:font-extrabold leading-tight text-white [animation-delay:.15s] md:text-6xl">
            Edición de video <span className="block text-3xl font-extrabold md:text-6xl">que convierte ideas en <span className="font-script text-5xl text-brand md:text-6xl">historias</span></span>
          </h1>
          

        </div>

        <div>
          <p className="mt-5 animate-rise text-slate-300 [animation-delay:.3s]">Creo videos de alta calidad para marcas, negocios y creadores, desde contenido corto hasta ediciones cinematográficas. Hagamos realidad tu visión.</p>

        

        
        <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:.45s]">
          <a href="#contacto" className="btn-primary">Contrátame <ArrowRight size={16} /></a>
          <a href="#portafolio" className="btn-ghost"><Play size={16} /> Ver mi trabajo</a>
        </div>
        <ul className="mt-10 flex animate-rise flex-wrap gap-6 text-sm [animation-delay:.6s]">
          {[[Zap,"Entrega puntual","Siempre a tiempo"],[ShieldCheck,"Alta calidad","Resultados pro"],[MessageCircle,"Comunicación clara","Proceso fluido"]].map(([I,a,b]) => { const Icon = I as typeof Zap; return (
            <li key={a as string} className="flex items-center gap-2"><Icon className="text-brand" size={20} /><span><b className="block text-white">{a as string}</b><span className="text-slate-400">{b as string}</span></span></li>); })}
        </ul>
        </div>
      </div>
    </div>
    {/** 
    <ToolsMarquee />*/}
    <p aria-hidden className="absolute bottom-16 right-16 hidden -rotate-6 animate-float font-script text-4xl text-brand/90 lg:block">Mejores videos,<br />mayor impacto</p>
  </div></section>
);

export const Services = () => (
  <section id="servicios" className="flex items-center bg-white py-12 lg:py-20">
    <div className="wrap grid w-full items-center gap-12 lg:grid-cols-[1fr_1.6fr]">
      <Reveal dir="left">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand mb-4">
              <span aria-hidden className="h-px w-10 bg-brand/60" /> Mis servicios<span aria-hidden className="h-px w-10 bg-brand/60" />
        </p>
        {/** 
        <p className="text-xl font-bold text-navy">Qué hago</p>*/}
        <h2 className="mt-2 text-4xl font-bold text-ink">Servicios de edición de video</h2>
        <p className="mt-2 font-medium text-navy text-lg">Cortes limpios. Imágenes que enganchan. Resultados reales.</p>
        <p className="mt-4 text-slate-500">Ofrezco edición profesional adaptada a tus necesidades: redes sociales, YouTube o promoción de tu negocio. Me enfoco en calidad, creatividad y entrega a tiempo.</p>
        <a href="#contacto" className="btn-primary mt-6">Ver servicios <ArrowRight size={16} /></a>
      </Reveal>
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {services.map(({ icon: I, t, d }, i) => (
          <li key={t}><Reveal dir="zoom" delay={i * 90}><article className="card bg-navy h-full"><I className="mb-3 text-brand" /><h3 className="font-semibold text-white">{t}</h3><p className="text-sm text-slate-400">{d}</p></article></Reveal></li>
        ))}
      </ul>
    </div>
  </section>
);

export const Projects = () => (
  <section id="portafolio" className="bg-slate-50 py-24 text-slate-800">
    <div className="wrap grid gap-10 lg:grid-cols-[1fr_3fr]">
      <Reveal dir="left">
        <p className="text-sm font-semibold text-brand2">Mi trabajo</p>
        <h2 className="mt-2 text-4xl font-bold text-ink">Proyectos destacados</h2>
        <p className="mt-3 text-sm text-slate-600">Un vistazo a mis ediciones recientes: desde contenido social hasta videos de marca, dando vida a cada historia con creatividad y precisión.</p>
        <a href="#contacto" className="btn mt-6 border border-slate-300 text-ink hover:bg-slate-100">Ver portafolio completo <ArrowRight size={16} /></a>
      </Reveal>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {projects.map((p, i) => (
          <li key={p.t}><Reveal delay={i * 120}>
            <a href="#contacto" className="group block" aria-label={`Ver proyecto ${p.t}`}>
              <div className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${p.g} transition duration-500 group-hover:scale-105`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition group-hover:bg-brand"><Play size={16} /></span>
                <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 text-xs text-white">{p.time}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-ink">{p.t}</h3><p className="text-xs text-slate-500">{p.tag}</p>
            </a></Reveal></li>
        ))}
      </ul>
    </div>
  </section>
);

export const About = () => (
  <section id="sobre-mi" className="bg-navy py-12 lg:py-20">
    <div className="wrap mb-8 lg:mb-12">
      <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand mb-2">
        <span aria-hidden className="h-px w-10 bg-brand/60" /> Sobre mi<span aria-hidden className="h-px w-10 bg-brand/60" />
      </p>
    </div>
    <div className="wrap grid items-stretch gap-1 lg:gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <Reveal dir="right" className="relative h-full">
        {/* En móvil la imagen mantiene su proporción; a partir de lg su alto lo marca la columna de la derecha */}
        <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-2xl lg:aspect-auto lg:h-full">
          <img src="/images/about2.webp" alt="Retrato en blanco y negro del editor de video y creador audiovisual" width={933} height={1400} loading="lazy" className="absolute inset-0 h-[90%] lg:h-full w-[90%] lg:w-full object-cover lg:object-contain object-[50%_28%] grayscale-[0.2]" />
        </div>
        <p aria-hidden className="absolute lg:left-24 right-3 top-4 -rotate-6 font-script text-3xl text-brand animate-float">Edita.<br />Crea.<br />Inspira.</p>
      </Reveal>
      <Reveal delay={150} className="flex h-full flex-col justify-between gap-8">
        <div>
          <h2 className="text-4xl font-bold text-white">Hola, soy Alejandro Yamamoto</h2>
          <p className="mt-4 text-slate-300">Soy un editor apasionado con ojo para el detalle y amor por contar historias. Ayudo a marcas, creadores y negocios a convertir sus ideas en videos que conectan con su audiencia.</p>
        </div>
        <dl className="grid grid-cols-3 gap-4 text-center">
          {[["3+","Años de experiencia"],["100+","Proyectos completados"],["50+","Clientes felices"]].map(([n, l]) => <div key={l} className="card"><dt className="text-3xl font-extrabold text-white">{n}</dt><dd className="text-xs text-slate-400">{l}</dd></div>)}
        </dl>
        <div>
          <ToolsMarquee className="relative w-full" />
        </div>
      </Reveal>
    </div>
  </section>
);

export const Process = () => (
  <section className="bg-slate-50 py-24 text-slate-800" aria-labelledby="proceso">
    <div className="wrap">
      <Reveal><h2 id="proceso" className="text-4xl font-bold text-ink">Un proceso simple en 4 pasos</h2><p className="mt-2 text-slate-500">Conseguir tu video ideal es fácil. Solo sigue estos pasos.</p></Reveal>
      <ol className="mt-12 grid gap-8 md:grid-cols-4">
        {steps.map(({ icon: I, t, d }, i) => (
          <li key={t}><Reveal delay={i * 150}><div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand2"><I /></span><div><p className="text-xs font-bold text-brand2">0{i + 1}</p><h3 className="font-semibold text-ink">{t}</h3><p className="mt-1 text-sm text-slate-500">{d}</p></div></div></Reveal></li>
        ))}
      </ol>
    </div>
  </section>
);

export const Testimonials = () => (
  <section className="bg-gradient-to-br from-navy via-ink to-brand2/40 py-24">
    <div className="wrap grid gap-10 lg:grid-cols-[1fr_3fr]">
      <Reveal dir="left"><h2 className="text-4xl font-bold text-white">Lo que dicen mis clientes</h2><p className="mt-2 text-slate-400">Personas reales. Proyectos reales. Resultados reales.</p></Reveal>
      <ul className="grid gap-4 md:grid-cols-3">
        {reviews.map((r, i) => (
          <li key={r.n}><Reveal delay={i * 150} className="h-full"><figure className="card h-full"><Quote className="text-brand" size={18} />
            <blockquote className="mt-2 text-sm text-slate-300">{r.q}</blockquote>
            <figcaption className="mt-4 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/30 font-bold text-white">{r.n[0]}</span>
              <span className="text-sm"><b className="block text-white">{r.n}</b><span className="text-slate-400">{r.r}</span>
              <span className="flex text-amber-400" aria-label="5 de 5 estrellas">{Array.from({ length: 5 }, (_, k) => <Star key={k} size={12} fill="currentColor" />)}</span></span></figcaption></figure></Reveal></li>
        ))}
      </ul>
    </div>
  </section>
);

export const Contact = () => (
  <section id="contacto" className="bg-ink py-20">
    <Reveal className="wrap grid items-center gap-8 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
      <div><h2 className="text-3xl font-bold text-white">¿Listo para trabajar juntos?</h2><p className="mt-2 text-slate-400">¿Tienes un proyecto en mente? Hablemos y convirtamos tus ideas en videos increíbles.</p></div>
      <a href="mailto:pixelframe@gmail.com" className="flex items-center gap-3 text-slate-200 hover:text-white"><Mail className="text-brand" /><span>pixelframe@gmail.com<small className="block text-slate-500">Respuesta en 24 horas</small></span></a>
      <a href="https://wa.me/573001234567" className="flex items-center gap-3 text-slate-200 hover:text-white"><MessageCircle className="text-brand" /><span>+57 300 123 4567<small className="block text-slate-500">Disponible en WhatsApp</small></span></a>
      <a href="mailto:pixelframe@gmail.com" className="btn-primary justify-center">Contáctame <ArrowRight size={16} /></a>
    </Reveal>
  </section>
);

export const Footer = () => (
  <footer className="border-t border-white/10 bg-ink py-8 text-sm text-slate-500">
    <div className="wrap flex flex-col items-center justify-between gap-3 md:flex-row">
      <span className="flex items-center gap-2 font-semibold text-white"><Clapperboard className="text-brand" size={18} /> Yamamoto</span>
      <p>© {new Date().getFullYear()} Yamamoto. Todos los derechos reservados.</p>
    </div>
  </footer>
);
