import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Play, Zap, ShieldCheck, MessageCircle, Mail, Clapperboard } from "lucide-react";
import Reveal from "./Reveal";
import SectionBadge from "./SectionBadge";
import WhatsAppIcon from "./WhatsAppIcon";
import TestimonialsCarousel from "./TestimonialsCarousel";
import ToolsMarquee from "./ToolsMarquee";
import { projects, steps } from "../data";
import { useServices } from "../lib/useServices";
import { getServiceIcon } from "../lib/serviceIcons";
import { formatServiceTitle, type Service } from "../lib/services";
import ServiceModal from "./ServiceModal";
import { PHONE, EMAIL, MESSAGE, formatearTelefono } from "../utils";
import "./Hero.css";
import "./BrandCards.css";

export const Hero = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    let active = true;
    const revealImage = async () => {
      try { await image.decode(); } catch { /* Algunos navegadores no permiten decodificar explícitamente. */ }
      if (active && image.naturalWidth > 0) setImageReady(true);
    };
    image.addEventListener("load", revealImage);
    if (image.complete && image.naturalWidth > 0) void revealImage();
    return () => { active = false; image.removeEventListener("load", revealImage); };
  }, []);

  return (
  <section id="inicio" className="relative overflow-hidden">
  <div className="relative mx-auto flex min-h-screen max-w-[1800px] flex-col pt-16 max-sm:min-h-svh">
    <img ref={imageRef} src="/images/hero.webp" alt="Editor de video trabajando en su laptop dentro de un estudio con paneles acústicos y cámaras" width={1350} height={1800} fetchPriority="high" decoding="async"
      className={`hero-image ${imageReady ? "hero-image--ready" : ""} absolute inset-y-0 right-0 h-full w-full object-cover object-[60%_45%] md:w-3/5 [mask-image:linear-gradient(to_left,black_55%,transparent)]`} />
    <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-ink to-transparent max-[1800px]:hidden" />
    <div className="wrap relative z-10 my-auto w-full text-slate-50 max-sm:my-0 max-sm:flex max-sm:flex-1 max-sm:py-6 sm:py-14 md:py-16">
      <div className="max-w-xl lg:max-w-3xl flex flex-col max-sm:w-full max-sm:justify-between">
        <div>

          <p className="mb-4 flex animate-rise items-center gap-2.5 text-sm font-medium tracking-wide text-zinc-400">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-brand motion-reduce:animate-none" />
            Hola, soy profesional en
          </p>
          <h1 className="animate-rise text-3xl font-bold lg:font-extrabold leading-tight text-white [animation-delay:.15s] md:text-6xl">
            Edición de video <span className="block text-3xl font-extrabold md:text-6xl">que convierte ideas en <span className="font-script text-5xl font-semibold text-lens md:text-6xl">historias</span></span>
          </h1>
          

        </div>

        <div>
          <p className="mt-5 animate-rise text-slate-300 [animation-delay:.3s]">Creo videos de alta calidad para marcas, negocios y creadores, desde contenido corto hasta ediciones cinematográficas. Hagamos realidad tu visión.</p>

        

        
        <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:.45s]">
          <a href="#contacto" className="btn-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">Contrátame <ArrowRight size={16} aria-hidden="true" /></a>
          <a href="#portafolio" className="btn-ghost"><Play size={16} aria-hidden="true" /> Ver mi trabajo</a>
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
    <p aria-hidden className="absolute bottom-16 right-16 z-10 hidden -rotate-6 animate-loadThenFloat font-script text-4xl text-blue-400 lg:block">Mejores videos,<br />mayor impacto</p>
  </div>
  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink md:h-56" />
  </section>
  );
};

export const Services = () => {
  const { services, loading, error, retry } = useServices();
  const [selected, setSelected] = useState<{ service: Service; opener: HTMLButtonElement } | null>(null);
  const navigate = useNavigate();
  const dismiss = (quote: boolean) => {
    setSelected(null);
    if (quote) {
      navigate("/#contacto");
      requestAnimationFrame(() => {
        const heading = document.querySelector<HTMLElement>("#contacto h2");
        heading?.setAttribute("tabindex", "-1");
        heading?.focus({ preventScroll: true });
      });
    }
  };
  return (
    <section id="servicios" aria-labelledby="servicios-title" aria-busy={loading} className="bg-white py-16 lg:py-24">
      <div className="wrap grid w-full grid-cols-1 gap-10 lg:gap-12">
        <Reveal dir="left" className="min-w-0 max-w-3xl lg:mx-auto lg:flex lg:flex-col lg:items-center lg:text-center">
          <SectionBadge text="Mis servicios" theme="light" className="mb-5" />
          <h2 id="servicios-title" className="text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl lg:mb-4 lg:text-5xl lg:font-extrabold lg:text-zinc-900">
            Servicios de <span className="lg:hidden">edición de video</span><span className="font-script hidden lg:inline font-bold text-lens lg:text-[3.4rem]">Edición de Video</span>
          </h2>
          <p className="mt-5 text-lg font-medium leading-relaxed text-zinc-800 lg:mb-2 lg:mt-0">Cortes limpios. Imágenes que enganchan. Resultados reales.</p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 lg:mt-0 lg:max-w-xl">Ofrezco edición profesional adaptada a tus necesidades: redes sociales, YouTube o promoción de tu negocio. Me enfoco en calidad, creatividad y entrega a tiempo.</p>
        </Reveal>
        <div className="min-w-0">
          {(error || services.length === 0) && (
            <div className="flex min-h-[11rem] flex-col items-center justify-center gap-4 text-center text-sm text-slate-500" role={error ? "alert" : "status"}>
              <p>{loading ? "Cargando servicios…" : error ? "No pudimos actualizar los servicios." : "Pronto encontrarás nuevos servicios aquí."}</p>
              {error && !loading && <button type="button" onClick={retry} className="btn-primary-light">Volver a intentar</button>}
            </div>
          )}
          <ul className="flex snap-x snap-mandatory gap-2 md:gap-6 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:auto-rows-fr lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {services.map((service, i) => {
              const { _id, icon, title, description } = service;
              const Icon = getServiceIcon(icon);
              return (
                <li key={_id} className="w-[85%] min-w-[85%] shrink-0 snap-center sm:w-[45%] sm:min-w-[45%] lg:h-full lg:w-auto lg:min-w-0">
                  <Reveal dir="zoom" delay={i * 90} className="h-full">
                    <article className="group relative isolate flex h-full min-h-[15rem] flex-col overflow-hidden rounded-[28px] border border-zinc-800 bg-navy p-5 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg hover:shadow-brand/10 focus-within:border-brand focus-within:shadow-lg focus-within:shadow-brand/10 active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none xl:p-6">
                      <button type="button" aria-haspopup="dialog" aria-label={`Ver detalles de ${formatServiceTitle(title)}`}
                        onClick={(event) => {
                          const opener = event.currentTarget;
                          flushSync(() => setSelected({ service, opener }));
                        }}
                        className="absolute inset-0 z-10 cursor-pointer rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand" />
                      <div className="mb-6 flex items-center justify-between gap-4">
                        <span className="inline-flex shrink-0 rounded-full bg-brand/10 p-3 text-brand ring-1 ring-inset ring-brand transition-colors duration-300 group-hover:bg-brand/50 group-focus-within:bg-brand/50 motion-reduce:transition-none">
                          <Icon size={24} strokeWidth={1.7} aria-hidden />
                        </span>
                        <span aria-hidden="true" className="text-xl font-extrabold text-slate-300 tabular-nums tracking-tight">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <h3 className="break-words text-lg font-bold leading-snug tracking-tight text-zinc-50">{formatServiceTitle(title)}</h3>
                      <p className="mb-6 mt-2 break-words text-sm leading-relaxed text-zinc-300">{description}</p>
                      <div aria-hidden="true" className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <span className="rounded-full border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200 transition-colors duration-300 group-hover:border-brand group-hover:text-white group-focus-within:border-brand group-focus-within:text-white motion-reduce:transition-none">Conocer el servicio</span>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand ring-1 ring-inset ring-brand transition-colors duration-300 group-hover:bg-brand/50 group-focus-within:bg-brand/50 motion-reduce:transition-none">
                          <ArrowRight size={18} className="transition-transform duration-300 group-hover:-rotate-45 group-focus-within:-rotate-45 motion-reduce:transform-none motion-reduce:transition-none" />
                        </span>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          <Reveal className="mt-12 text-center">
            <p className="mb-4 text-sm leading-relaxed text-zinc-500">¿Tienes un proyecto especial en mente? Hablemos de tus requerimientos.</p>
            <Link to="/#contacto" className="group btn-primary-light mx-auto inline-flex items-center gap-3 rounded-full px-8 py-3.5">
              Reserva tu fecha
              <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:-rotate-45 group-focus-visible:-rotate-45 motion-reduce:transform-none motion-reduce:transition-none" />
            </Link>
          </Reveal>
        </div>
      </div>
      {selected && <ServiceModal service={selected.service} opener={selected.opener} onDismiss={dismiss} />}
    </section>
  );
};

export const Projects = () => (
  <section id="portafolio" className="bg-slate-50 py-24 text-slate-800">
    <div className="wrap grid gap-10 lg:grid-cols-[1fr_3fr]">
      <Reveal dir="left">
        <SectionBadge text="Mi trabajo" theme="light" />
        <h2 className="mt-2 text-4xl font-bold text-ink">Proyectos destacados</h2>
        <p className="mt-3 text-sm text-slate-600">Un vistazo a mis ediciones recientes: desde contenido social hasta videos de marca, dando vida a cada historia con creatividad y precisión.</p>
        <a href="#contacto" className="btn-secondary-light mt-6">Ver portafolio completo <ArrowRight size={16} /></a>
      </Reveal>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {projects.map((p, i) => (
          <li key={p.t}><Reveal delay={i * 120}>
            <a href="#contacto" className="group block" aria-label={`Ver proyecto ${p.t}`}>
              <div className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${p.g} transition duration-500 group-hover:scale-105`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition group-hover:bg-brand group-hover:text-white"><Play size={16} /></span>
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
      <SectionBadge text="Sobre mí" theme="dark" className="mb-2" />
    </div>
    <div className="wrap grid items-stretch gap-1 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <Reveal dir="right" className="relative h-full">
        {/* En móvil la imagen mantiene su proporción; a partir de lg su alto lo marca la columna de la derecha */}
        <div className="relative isolate aspect-[4/4.2] w-full overflow-hidden lg:aspect-auto lg:h-full [mask-image:radial-gradient(ellipse_65%_65%_at_50%_40%,black_50%,transparent_100%)]">
          {/* El aura llega a transparencia total arriba para evitar el corte del contenedor. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_14%)]">
            <div className="absolute bottom-0 left-1/2 h-[85%] w-[85%] -translate-x-1/2 scale-[1.08] opacity-70 blur-2xl  md:h-full md:w-full">
              <div className="absolute inset-0 bg-slate-300 [mask-image:url('/images/about2.webp')] [mask-size:cover] [mask-position:50%_28%] [mask-repeat:no-repeat] lg:[mask-size:contain]" />
            </div>
          </div>
          <img src="/images/about2.webp" alt="Retrato en blanco y negro del editor de video y creador audiovisual" width={933} height={1400} loading="lazy" className="absolute bottom-0 left-1/2 h-[85%] w-[85%] md:h-[90%] md:w-[90%] -translate-x-1/2 object-cover object-[50%_28%] grayscale-[0.2] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] lg:h-full lg:w-full lg:object-contain" />
        </div>
        <p aria-hidden className="absolute z-30 lg:left-24 right-3 top-4 -rotate-6 font-script text-3xl text-blue-400 animate-float">Edita.<br />Crea.<br />Inspira.</p>
      </Reveal>
      <Reveal delay={150} className="flex h-full flex-col justify-between gap-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 md:mt-0">Hola, soy Alejandro Yamamoto</h2>
          <p className="mt-4 text-slate-300">Soy un editor apasionado con ojo para el detalle y amor por contar historias. Ayudo a marcas, creadores y negocios a convertir sus ideas en videos que conectan con su audiencia.</p>
        </div>
        <dl className="grid grid-cols-3 gap-4 text-center">
          {[["3+","Años de experiencia"],["100+","Proyectos completados"],["50+","Clientes felices"]].map(([n, l]) => <div key={l} className="card"><dt className="text-3xl font-extrabold text-white">{n}</dt><dd className="text-xs text-slate-400">{l}</dd></div>)}
        </dl>
        <div className="flex flex-col items-center gap-5">
          <ToolsMarquee className="relative flex w-full flex-col items-center text-center" />
          <a href={`https://wa.me/${PHONE}?text=${encodeURIComponent("Hola, me gustaría recibir tu CV / Media Kit.")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-5 py-2.5 text-center text-sm font-medium text-zinc-200 transition-all duration-300 hover:border-brand hover:bg-brand/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none">
            Solicitar CV / Media Kit
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);

export const Process = () => (
  <section id="proceso" className="bg-white py-12 lg:py-20 text-zinc-900" aria-labelledby="proceso-title">
    <div className="wrap">
      <Reveal>
        <SectionBadge text="El proceso" theme="light" className="mb-4" />
        <h2 id="proceso-title" className="text-3xl md:text-4xl font-bold text-zinc-900">Un proceso simple en 4 pasos</h2><p className="mt-2 text-zinc-600">Conseguir tu video ideal es fácil. Solo sigue estos pasos.</p></Reveal>
      <ol className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: I, t, d }, i) => (
          <li key={t} className="h-full min-w-0">
            <Reveal delay={i * 120} className="h-full">
              <article className="group relative isolate flex h-full min-h-[16rem] flex-col overflow-hidden rounded-[28px] border border-zinc-800 bg-navy p-5 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10 motion-reduce:transform-none motion-reduce:transition-none xl:p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="inline-flex shrink-0 rounded-full bg-brand/10 p-3 text-brand ring-1 ring-inset ring-brand/20 transition-colors duration-300 group-hover:bg-brand/15 motion-reduce:transition-none">
                    <I size={24} strokeWidth={1.7} aria-hidden />
                  </span>
                  <span aria-hidden="true" className="text-xl font-extrabold text-brand tabular-nums tracking-tight">0{i + 1}</span>
                </div>
                <h3 className="break-words text-lg font-bold leading-snug tracking-tight text-zinc-50">{t}</h3>
                <p className="mt-2 break-words text-sm leading-relaxed text-zinc-300">{d}</p>
                <div aria-hidden="true" className="mt-auto pt-6">
                  <span className="bg-brand block h-0.5 w-10 rounded-full opacity-60 transition-all duration-300 group-hover:w-16 group-hover:opacity-100 motion-reduce:transition-none" />
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal className="mt-8 flex justify-center">
        <Link to="/#contacto" className="group btn-primary-light cta-pill mt-8 w-fit">
            Comenzar mi proyecto
            <span aria-hidden="true" className="cta-icon">
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:-rotate-45 group-focus-visible:-rotate-45 motion-reduce:transform-none motion-reduce:transition-none" />
            </span>
          </Link>
      </Reveal>
    </div>
  </section>
);

export const Testimonials = () => (
  <section id="testimonial" className="bg-gradient-to-br from-navy via-ink to-brand2/40 py-12 lg:py-20">
    <div className="wrap grid gap-10 lg:grid-cols-[1fr_3fr]">
      <Reveal dir="left">
      <SectionBadge text="Reseñas" theme="dark" className="mb-4" />
      <h2 className="text-3xl md:text-4xl font-bold text-white">Lo que dicen mis clientes</h2><p className="mt-2 text-slate-400">Personas reales. Proyectos reales. Resultados reales.</p></Reveal>
      <TestimonialsCarousel />
    </div>
  </section>
);

export const Contact = () => (
  <section id="contacto" aria-labelledby="contacto-title" className="bg-white py-12 text-slate-800 lg:py-16">
    <Reveal className="wrap">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="min-w-0">
          <SectionBadge text="Mi contacto" theme="light" className="mb-4" />
          <h2 id="contacto-title" className="text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl">¿Listo para trabajar juntos?</h2>
          <p className="mt-3 max-w-lg leading-relaxed text-zinc-600">¿Tienes un proyecto en mente? Hablemos y convirtamos tus ideas en videos increíbles.</p>
          <div className="mt-8 hidden justify-center lg:flex">
            <Link to="/#contacto" className="group btn-primary-light cta-pill w-fit">
              Agendar una llamada / Cotizar
              <span aria-hidden="true" className="cta-icon">
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:-rotate-45 group-focus-visible:-rotate-45 motion-reduce:transform-none motion-reduce:transition-none" />
              </span>
            </Link>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 auto-rows-fr gap-4 sm:grid-cols-2">
          <a href={`mailto:${EMAIL}`} className="group flex min-w-0 flex-col items-start rounded-2xl border border-zinc-200 bg-white p-5 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10 focus-visible:border-brand/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transform-none motion-reduce:transition-none">
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-full border border-brand/30 bg-brand/10 text-brand shadow-sm transition-colors duration-300 group-hover:border-brand/50 group-focus-visible:border-brand/50 motion-reduce:transition-none"><Mail size={22} aria-hidden="true" /></span>
            <span className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">Email</span>
            <span className="w-full break-words text-sm font-bold text-zinc-950 transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand motion-reduce:transition-none">{EMAIL}</span>
            <span className="mt-auto w-full pt-5 text-xs leading-relaxed text-zinc-600">Respuesta en menos de 24h</span>
          </a>
          <a href={`https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`} target="_blank" rel="noopener noreferrer" className="group flex min-w-0 flex-col items-start rounded-2xl border border-zinc-200 bg-white p-5 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10 focus-visible:border-brand/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transform-none motion-reduce:transition-none">
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-full border border-brand/30 bg-brand/10 text-brand shadow-sm transition-colors duration-300 group-hover:border-brand/50 group-focus-visible:border-brand/50 motion-reduce:transition-none"><WhatsAppIcon className="h-[22px] w-[22px]" /></span>
            <span className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">WhatsApp</span>
            <span className="text-sm font-bold text-zinc-950 transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand motion-reduce:transition-none">{formatearTelefono(PHONE)}</span>
            <span className="mt-auto w-full pt-5 text-xs leading-relaxed text-zinc-600">Atención directa por chat</span>
          </a>
        </div>
      </div>
      <div className="mt-12 flex justify-center lg:hidden">
        <Link to="/#contacto" className="group btn-primary-light cta-pill w-fit">
          Agendar una llamada / Cotizar
          <span aria-hidden="true" className="cta-icon">
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:-rotate-45 group-focus-visible:-rotate-45 motion-reduce:transform-none motion-reduce:transition-none" />
          </span>
        </Link>
      </div>
    </Reveal>
  </section>
);
