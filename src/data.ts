import { Youtube, Smartphone, Megaphone, Wand2, Palette, AudioLines, Lightbulb, MessagesSquare, Scissors, Rocket, Plane, Zap, Clapperboard } from "lucide-react";
export const nav = [["Inicio","#inicio"],["Portafolio","#portafolio"],["Servicios","#servicios"],["Sobre mí","#sobre-mi"],["Proceso", "#proceso"], ["Reseñas","#testimonial"]];
export const services = [
  { icon: Youtube, t: "Edición para YouTube", d: "Formato largo y corto" },
  { icon: Smartphone, t: "Reels y redes sociales", d: "Instagram, TikTok y Shorts" },
  { icon: Megaphone, t: "Comerciales y anuncios", d: "Promos y videos de marca" },
  { icon: Wand2, t: "Motion graphics", d: "Animación de texto e intros" },
  { icon: Palette, t: "Color grading", d: "Look cinematográfico" },
  { icon: AudioLines, t: "Mejora de audio", d: "Sonido limpio y claro" },
];
export const projects = [
  { t: "Vlog de viaje", tag: "Viaje · Cine · Vlog", time: "1:12", g: "from-emerald-500/60 to-sky-700/60" },
  { t: "Promo de producto", tag: "Anuncios · Motion", time: "0:45", g: "from-amber-500/50 to-stone-800" },
  { t: "Reel fitness", tag: "Redes · Rápido", time: "0:56", g: "from-fuchsia-600/50 to-slate-900" },
  { t: "Corto cinematográfico", tag: "Historia · Color", time: "1:30", g: "from-orange-500/50 to-indigo-900" },
];
export const steps = [
  { icon: Lightbulb, t: "Comparte tu idea", d: "Cuéntame tu proyecto, referencias y requisitos." },
  { icon: MessagesSquare, t: "Planificación", d: "Te propongo el mejor enfoque y los tiempos." },
  { icon: Scissors, t: "Edición y revisiones", d: "Creo el borrador y aplico tus cambios." },
  { icon: Rocket, t: "Entrega final", d: "Recibes tu video listo y a tiempo." },
];
export type Review = {
  n: string;
  r: string;
  q: string;
  avatar?: string;
};

export const reviews: Review[] = [
  { n: "Sarah Khan", r: "Creadora de contenido", q: "¡Increíble trabajo! Las ediciones fueron creativas y llegaron a tiempo." },
  { n: "Ali Raza", r: "Dueño de negocio", q: "Muy profesional y fácil de trabajar. Entendió mi visión a la perfección." },
  { n: "Zainab Malik", r: "YouTuber", q: "Gran comunicación y calidad de primer nivel. Volveré a contratarlo." },
];
export const tools = ["Adobe Premiere Pro","After Effects","DaVinci Resolve","CapCut","Filmora"];
export const logos = [
  { src: "/images/carrousel/premierpro.svg", alt: "Adobe Premiere Pro" },
  { src: "/images/carrousel/capcut.png", alt: "CapCut" },
  { src: "/images/carrousel/davinci.png", alt: "DaVinci Resolve" },
];
// Fotos: Unsplash (licencia libre, uso comercial). Ver public/images/servicios/CREDITOS.txt
// `video`: ruta del video de cada card. Ahora todas apuntan al video de prueba;
// para darle su propio video a cada card, cambia solo esa cadena (p. ej. "/videos/vlog-de-viaje.mp4").
export const VIDEO_TEST = "/videos/video_test.mp4";
export const premiumServices = [
  {
    icon: Plane, category: "Viaje", duration: "1:12", title: "Vlog de viaje",
    keywords: ["Explora", "Descubre", "Cuenta tu historia"],
    description: "Videos que capturan la esencia de cada lugar, experiencias y momentos únicos.",
    pills: ["Viaje", "Cine", "Vlog"],
    accent: "#2ed3bd", tint: 0, video: VIDEO_TEST,
    image: "/images/servicios/1-viaje.webp", position: "56% 45%",
  },
  {
    icon: Megaphone, category: "Anuncios", duration: "0:45", title: "Promo de producto",
    keywords: ["Idea", "Producción", "Resultados"],
    description: "Videos publicitarios que destacan lo mejor de tu marca y convierten en resultados.",
    pills: ["Anuncios", "Producto", "Motion"],
    accent: "#f0a23c", tint: 0.14, video: VIDEO_TEST,
    image: "/images/servicios/2-anuncios.webp", position: "50% 45%",
  },
  {
    icon: Zap, category: "Redes", duration: "0:56", title: "Reel fitness",
    keywords: ["Energía", "Movimiento", "Impacto"],
    description: "Contenido dinámico y de alto impacto para tus redes sociales.",
    pills: ["Redes", "Fitness", "Rápido"],
    accent: "#9d7bff", tint: 0.5, video: VIDEO_TEST,
    image: "/images/servicios/3-redes.webp", position: "50% 42%",
  },
  {
    icon: Clapperboard, category: "Historia", duration: "1:30", title: "Corto cinematográfico",
    keywords: ["Historias", "Emoción", "Arte"],
    description: "Narrativas visuales que inspiran y dejan huella.",
    pills: ["Historia", "Cine", "Color"],
    accent: "#c98b4b", tint: 0.22, video: VIDEO_TEST,
    image: "/images/servicios/4-historia.webp", position: "46% 50%",
  },
];
