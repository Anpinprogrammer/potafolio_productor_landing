# Yamamoto Portfolio · Landing

Landing React + Vite. El contenido de las cards de `PremiumServices` se consultan desde los proyectos publicados en Sanity.

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

## Contenido conectado

- Título y nombre de la categoría.
- Descripción; para proyectos anteriores se admite la sinopsis.
- Texto destacado (`tagline`) y servicios relacionados, mostrados de forma independiente. Se conservan los servicios de proyectos antiguos.
- Etiquetas (`tags`), duración, marca de destacado y fecha editorial cuando están configuradas.
- Portada, texto alternativo y punto de enfoque/recorte de Sanity. El CDN genera una imagen para cada proporción del diseño, sin modificar el original.
- Video externo de YouTube/Vimeo, URL directa MP4/WebM o archivo subido a Sanity; se mantiene la lectura del antiguo `videoUrl`.

Los iconos y colores siguen siendo los definidos en `src/data.ts`. Las portadas y los videos se obtienen del proyecto publicado en Sanity; no se sustituyen por medios de demostración cuando faltan. Si no hay video válido, el botón de reproducción queda deshabilitado.
Las presentaciones locales se asocian por categoría, con coincidencia de título/slug o posición como alternativa para categorías nuevas.

`src/lib/portfolio.ts` contiene la consulta y el contrato de los proyectos. La consulta respeta el orden editorial de Sanity, excluye borradores/versiones y usa `perspective: 'published'`.
`src/lib/portfolioCards.ts` adapta el contenido al diseño existente, conservando los iconos locales. `src/lib/portfolioMedia.ts` genera las portadas con `@sanity/image-url` y resuelve los reproductores de video.
`src/lib/usePortfolioProjects.ts` gestiona carga, error, reintento y cancelación; vuelve a consultar al regresar a la pestaña de la landing.

Publica los cambios en Studio y recarga la landing o vuelve a su pestaña. El CDN puede tardar en reflejar la publicación; los borradores no se muestran.
Si no hay proyectos publicados aparece un estado vacío. Si falla la primera carga, aparece un botón de reintento, sin sustituir los proyectos por datos de demostración.
El carrusel admite cero, uno o varios proyectos; solo muestra flechas y clones cuando hay más de uno.

YouTube y Vimeo se muestran en un iframe de su reproductor oficial; los MP4/WebM se reproducen con `<video>`. Se conserva el giro horizontal en móvil y el cierre del modal. Los enlaces de YouTube mantienen el instante inicial (`t`/`start`) y los de Vimeo el hash de videos no listados. Hay un enlace para abrir el video en su proveedor si sus permisos impiden reproducirlo dentro de otra página. En YouTube, una apertura cinematográfica mantiene la portada en movimiento durante la carga: obturador, barridos de luz, encuadre y título del proyecto. Al llegar el evento de reproducción de la API oficial, se retira con un barrido de 520 ms. `VideoOpening.tsx` y su CSS aíslan estos efectos del resto de la página; la preferencia de movimiento reducido utiliza una portada estática y salida inmediata. Si el navegador bloquea autoplay se revela el reproductor para poder iniciarlo manualmente; también existe un respaldo temporal para evitar una portada permanente. El tiempo de autoocultado de los controles nativos lo determina YouTube.

Las pruebas comprueban contenido, conservación de iconos, consultas publicadas, formatos de video, URLs inválidas y recortes/hotspot de las portadas. Se validaron en navegador las cuatro portadas reales, el reproductor de YouTube, un MP4 de prueba, el giro móvil y los errores de archivo.
