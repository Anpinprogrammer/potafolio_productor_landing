import idea from "../../public/images/proceso/idea.svg?raw";
import plan from "../../public/images/proceso/plan.svg?raw";
import edicion from "../../public/images/proceso/edicion.svg?raw";
import entrega from "../../public/images/proceso/entrega.svg?raw";
import "./ProcessIcon.css";

const icons = { idea, plan, edicion, entrega };

export default function ProcessIcon({ src }: { src: string }) {
  const name = src.split("/").pop()?.replace(".svg", "") as keyof typeof icons;
  // Solo SVG locales importados: conserva los archivos originales como fuente del dibujo.
  return <span aria-hidden="true" className={`process-icon-art process-icon-art--${name}`}
    dangerouslySetInnerHTML={{ __html: icons[name] }} />;
}
