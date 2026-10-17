# Yamamoto Portfolio · Landing

Landing React + Vite. Las cards de `PremiumServices` y `Services` consultan los proyectos y servicios publicados en Sanity.

## Ejecutar

Con Node 22 o superior:

```sh
npm ci
npm run dev
npm test
npm run build
```

La configuración utiliza `VITE_PROJECT_ID` y `VITE_DATASET` en `.env`. No añadas tokens privados a variables `VITE_*`.
Para desarrollo usa `http://localhost:5173`, que ya está autorizado en el CORS de Sanity. Otros orígenes o dominios de despliegue deben estar autorizados en la configuración del proyecto.

## Páginas y navegación

React Router DOM gestiona `/` (landing) y `/proyectos` (portafolio completo). El header y el footer permanecen en el layout compartido; desde la página de proyectos los enlaces del header regresan a las secciones de inicio. «Volver al inicio», arriba a la izquierda, lleva a `/#inicio`.
Al recargar la landing se limpia el ancla de la sección anterior y se vuelve al hero antes de iniciar la bienvenida. La navegación interna y los enlaces directos a secciones siguen funcionando; recargar `/proyectos` conserva esa página.

Al seleccionar una sección desde la navegación se repiten sus entradas, incluso si ya se había visitado o se selecciona el mismo enlace. `sectionNavigation.ts` coordina el reinicio de `Reveal` y de las animaciones CSS del hero cuando entran en pantalla, sin remontar las secciones ni repetir consultas a Sanity. Se respetan las preferencias de movimiento reducido. En móvil, el menú libera el scroll antes de desplazarse; si la carga de contenido cambia la altura de secciones anteriores, se corrige la posición del destino hasta el siguiente gesto del usuario.

La landing consulta únicamente proyectos publicados con `featured == true`. «Ver todos los proyectos» abre `/proyectos`, que consulta todos los proyectos publicados, incluidos los no destacados, con el mismo orden editorial, cards y reproductor. La página completa muestra una columna en móvil, dos desde `md` y tres desde `xl`; no utiliza carrusel ni clones. La bienvenida del logo se ejecuta al cargar la landing, sin repetirse al navegar internamente desde el portafolio.

El servidor de producción debe resolver rutas como `/proyectos` con `index.html` (fallback de SPA), para permitir acceso directo y recargas. Vite ya lo hace durante desarrollo y preview.

## Introducción de marca

`BrandLogo.tsx` conserva `/images/logo.webp` y superpone luz mediante una máscara de su transparencia original. GSAP controla las cuatro fases: pausa inicial, reflejo sobre el cromado, bloom en el destello del lente y regreso al logo original. Las coordenadas del destello se definen respecto al archivo original en `src/lib/brand.ts`.

```tsx
<BrandLogo play duration={3.2} intensity={0.85} replayKey={0} />
```

`duration` ajusta los segundos de la secuencia, `intensity` la intensidad (0–1.5) y `play` activa la reproducción. Cambiar `replayKey` permite repetirla de forma explícita. Sin `play` se muestra únicamente la imagen estática, como en el header.

`LogoIntro.tsx` centra el logo sobre el fondo del hero y, al terminar, lo desplaza hasta las dimensiones y posición reales del header mientras revela la landing. Por defecto, la luz dura 2.2 s y el desplazamiento al header 0.8 s: 3 s en total. Admite ajustes de duración/intensidad y `travelDuration` para el desplazamiento. La bienvenida se reproduce en cada carga o recarga de la página, sin guardar una marca de vista. El botón «Omitir introducción» permite acceder inmediatamente al contenido.

Con `prefers-reduced-motion` se muestra directamente el logo original estático y el contenido. Las animaciones y los listeners se limpian al desmontar; una carga fallida no bloquea la página.
Las animaciones originales del hero permanecen pausadas durante la bienvenida y empiezan con sus retardos originales cuando el logo llega al header o se omite la introducción.

## Contenido conectado

### Servicios

`src/lib/services.ts` define el contrato y la consulta de documentos `service`, con nombre, descripción e icono. Respeta el campo `order` (menor primero), coloca los servicios sin orden al final y desempata por nombre e ID. Solo solicita documentos publicados, excluyendo borradores y versiones.

`src/lib/useServices.ts` gestiona carga, error, reintento, cancelación y actualización al regresar a la pestaña. `Services` en `Sections.tsx` muestra cards de igual altura con fondo zinc oscuro, iconos esmeralda y microinteracciones suaves. En escritorio, la columna editorial ocupa 4 de 12 columnas y la galería 8: tres cards por fila; en tablet se muestran dos y en móvil una. Renderiza todos los servicios publicados; los estados de carga, error y lista vacía no se sustituyen por servicios locales. Si una actualización falla se conservan las cards cargadas y se ofrece reintentar. `formatServiceTitle` corrige la presentación de los nombres editoriales conocidos (YouTube, Social Media, Motion Graphics, Color Grading y Audio), conservando los demás nombres de Sanity.

Los iconos usan un mapa explícito en `src/lib/serviceIcons.ts`, compatible con el selector del Studio. Si un servicio no tiene icono o contiene un valor desconocido se utilizan las tijeras de edición. Publica los cambios en el administrador y recarga o vuelve a la pestaña de la landing; el CDN puede tardar en reflejarlos.

Cada card es un botón accesible que abre `ServiceModal.tsx`. El diálogo nativo mantiene el foco dentro, bloquea el contenido de fondo y permite cerrar con la X, Escape o clic fuera; sus animaciones respetan movimiento reducido. Al cerrar se desmonta el iframe y se devuelve el foco a la card. «Cotizar este servicio» cierra el modal, libera el scroll y navega a Contacto, con foco en su título.

En Studio, cada servicio tiene `demoVideoUrl` («Video de demostración», YouTube/Vimeo) y `workflow` («Flujo de trabajo»). El enlace propio tiene prioridad; si falta, la consulta selecciona un video externo de un proyecto publicado que haga referencia al servicio, priorizando destacados y orden editorial. Si tampoco existe, se muestra un estado sin demo y sigue disponible la cotización. El flujo vacío usa una explicación general de referencias, primera versión, revisiones y entrega. Las URLs de los iframes se resuelven mediante la lista de proveedores permitidos de `resolveVideo`; siempre se ofrece abrir el video en su plataforma.

### Proyectos

- Título y nombre de la categoría.
- Descripción; para proyectos anteriores se admite la sinopsis.
- Texto destacado (`tagline`) y servicios relacionados, mostrados de forma independiente. Se conservan los servicios de proyectos antiguos.
- Etiquetas (`tags`), duración, marca de destacado y fecha editorial cuando están configuradas.
- Portada, texto alternativo y punto de enfoque/recorte de Sanity. El CDN genera una imagen para cada proporción del diseño, sin modificar el original.
- Video externo de YouTube/Vimeo, URL directa MP4/WebM o archivo subido a Sanity; se mantiene la lectura del antiguo `videoUrl`.

Los iconos y colores siguen siendo los definidos en `src/data.ts`. Las portadas y los videos se obtienen del proyecto publicado en Sanity; no se sustituyen por medios de demostración cuando faltan. Si no hay video válido, el botón de reproducción queda deshabilitado.
Las presentaciones locales se asocian por categoría, con coincidencia de título/slug o posición como alternativa para categorías nuevas.

`src/lib/portfolio.ts` contiene la consulta y el contrato de los proyectos. La consulta respeta el orden editorial de Sanity, excluye borradores/versiones y usa `perspective: 'published'`. El parámetro `featuredOnly` permite consultar solo destacados; `usePortfolioProjects({ featuredOnly: true })` lo activa para la landing.
`src/lib/portfolioCards.ts` adapta el contenido al diseño existente, conservando los iconos locales. `src/lib/portfolioMedia.ts` genera las portadas con `@sanity/image-url` y resuelve los reproductores de video.
`src/lib/usePortfolioProjects.ts` gestiona carga, error, reintento y cancelación; vuelve a consultar al regresar a la pestaña de la landing.

Publica los cambios en Studio y recarga la landing o vuelve a su pestaña. El CDN puede tardar en reflejar la publicación; los borradores no se muestran.
Si no hay proyectos publicados aparece un estado vacío. Si falla la primera carga, aparece un botón de reintento, sin sustituir los proyectos por datos de demostración.
El carrusel admite cero, uno o varios proyectos; solo muestra flechas y clones cuando hay más de uno.

YouTube y Vimeo se muestran en un iframe de su reproductor oficial; los MP4/WebM se reproducen con `<video>`. Se conserva el giro horizontal en móvil y el cierre del modal. Los enlaces de YouTube mantienen el instante inicial (`t`/`start`) y los de Vimeo el hash de videos no listados. Hay un enlace para abrir el video en su proveedor si sus permisos impiden reproducirlo dentro de otra página. En YouTube, una apertura cinematográfica mantiene la portada en movimiento durante la carga: obturador, barridos de luz, encuadre y título del proyecto. Al llegar el evento de reproducción de la API oficial, se retira con un barrido de 520 ms. `VideoOpening.tsx` y su CSS aíslan estos efectos del resto de la página; la preferencia de movimiento reducido utiliza una portada estática y salida inmediata. Si el navegador bloquea autoplay se revela el reproductor para poder iniciarlo manualmente; también existe un respaldo temporal para evitar una portada permanente. El tiempo de autoocultado de los controles nativos lo determina YouTube.

Las pruebas comprueban contenido, conservación de iconos, consultas publicadas, formatos de video, URLs inválidas y recortes/hotspot de las portadas. Se validaron en navegador las cuatro portadas reales, el reproductor de YouTube, un MP4 de prueba, el giro móvil y los errores de archivo.
