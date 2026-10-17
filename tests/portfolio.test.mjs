import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchPortfolioProjects } from '../src/lib/portfolio.ts';
import { formatDuration, toPortfolioCards } from '../src/lib/portfolioCards.ts';
import { coverUrl, resolveVideo } from '../src/lib/portfolioMedia.ts';

const presets = ['Viaje', 'Anuncios', 'Redes', 'Historia'].map((category, index) => ({
  category, title: `Título local ${index}`, keywords: ['Texto local'], description: 'Descripción local',
  pills: ['Local'], duration: '1:12', icon: () => index, accent: `color-${index}`, tint: index,
  image: `/foto-${index}.webp`, video: `/video-${index}.mp4`, position: '50% 45%',
}));
const project = (fields = {}) => ({
  _id: 'project-1', title: 'Título de Sanity', slug: 'titulo-de-sanity',
  category: {title: 'Viajes', slug: 'viajes'}, description: 'Descripción publicada',
  tagline: 'Explora · Descubre · Crea', tags: ['Viaje', 'Cine'], serviceTitles: [], legacyServices: [],
  coverImage: {url: 'https://cdn.sanity.io/images/vrb9lndu/portafolio_productor/a967a3f1d2eafcc1e15cbb22a6287cc0b34be10a-800x1000.webp', alt: 'Portada desde Sanity', crop: null, hotspot: null},
  video: {sourceType: 'external', url: 'https://www.youtube.com/watch?v=l9WJ6PspaW4', durationSeconds: 72},
  featured: true, publishedAt: '2026-10-16T15:00:00Z', ...fields,
});

test('renderiza contenido y medios de Sanity conservando iconos y colores locales', () => {
  const source = project();
  const [card] = toPortfolioCards([source], presets);
  assert.equal(card.id, source._id);
  assert.equal(card.title, source.title);
  assert.equal(card.category, 'Viajes');
  assert.equal(card.description, source.description);
  assert.deepEqual(card.keywords, ['Explora', 'Descubre', 'Crea']);
  assert.deepEqual(card.pills, ['Viaje', 'Cine']);
  assert.equal(card.duration, '1:12');
  assert.equal(card.imageAlt, 'Portada desde Sanity');
  assert.match(card.image, /^https:\/\/cdn\.sanity\.io\//);
  assert.equal(card.video.kind, 'embed');
  assert.match(card.video.url, /youtube-nocookie/);
  assert.equal(card.featured, true);
  assert.ok(card.publishedDate.includes('2026'));
  for (const property of ['icon', 'accent', 'tint']) {
    assert.equal(card[property], presets[0][property]);
  }
});

test('mantiene el icono de Historia aunque el orden de los proyectos cambie', () => {
  const [card] = toPortfolioCards([project({category: {title: 'Historia', slug: 'historia', icon: 'otro-icono'}})], presets);
  assert.equal(card.icon, presets[3].icon);
  assert.notEqual(card.image, presets[3].image);
});

test('un campo vacío de Sanity no recupera textos ficticios de las cards originales', () => {
  const [card] = toPortfolioCards([project({category: null, description: '', tagline: null, tags: [], coverImage: null, video: null, featured: false, publishedAt: null})], presets);
  assert.equal(card.category, 'Proyecto');
  assert.equal(card.description, '');
  assert.deepEqual(card.keywords, []);
  assert.deepEqual(card.pills, []);
  assert.equal(card.duration, null);
  assert.equal(card.image, null);
  assert.equal(card.video, null);
  assert.equal(card.publishedDate, null);
});

test('renderiza servicios en una lista independiente del texto destacado, incluidos los antiguos', () => {
  const [referenced] = toPortfolioCards([project({tagline: null, serviceTitles: ['Edición'], legacyServices: ['Anterior']})], presets);
  assert.deepEqual(referenced.services, ['Edición']);
  assert.deepEqual(referenced.keywords, []);
  const [legacy] = toPortfolioCards([project({tagline: null, legacyServices: ['Color']})], presets);
  assert.deepEqual(legacy.services, ['Color']);
});

test('acepta cero, uno o más de cuatro proyectos sin inventar cards', () => {
  assert.deepEqual(toPortfolioCards([], presets), []);
  assert.equal(toPortfolioCards([project()], presets).length, 1);
  const sources = Array.from({length: 6}, (_, index) => project({_id: String(index), category: null}));
  const cards = toPortfolioCards(sources, presets);
  assert.deepEqual(cards.map(({id}) => id), sources.map(({_id}) => _id));
  assert.equal(cards[5].icon, presets[1].icon);
});

test('la consulta solicita únicamente contenido publicado y permite cancelar la petición', async () => {
  const controller = new AbortController();
  let options;
  const expected = [project()];
  const client = {fetch: async (_query, _params, config) => { options = config; return expected; }};
  assert.equal(await fetchPortfolioProjects(client, controller.signal), expected);
  assert.equal(options.perspective, 'published');
  assert.equal(options.signal, controller.signal);
});

test('no convierte un error de red en una lista vacía de proyectos', async () => {
  const client = {fetch: async () => { throw new Error('Sin conexión'); }};
  await assert.rejects(fetchPortfolioProjects(client), /Sin conexión/);
});

test('la landing solicita destacados y la página completa incluye todos los proyectos publicados', async () => {
  const requests = [];
  const client = {fetch: async (query, params, options) => {
    requests.push({query, params, options});
    return [];
  }};
  await fetchPortfolioProjects(client, undefined, true);
  await fetchPortfolioProjects(client);
  assert.equal(requests[0].params.featuredOnly, true);
  assert.equal(requests[1].params.featuredOnly, false);
  for (const {query, options} of requests) {
    assert.match(query, /!\$featuredOnly \|\| featured == true/);
    assert.match(query, /drafts\.\*\*/);
    assert.match(query, /versions\.\*\*/);
    assert.equal(options.perspective, 'published');
  }
});

test('formatea duraciones y omite valores que no están disponibles', () => {
  assert.equal(formatDuration(72), '1:12');
  assert.equal(formatDuration(150), '2:30');
  assert.equal(formatDuration(605), '10:05');
  for (const value of [null, 0, -1, NaN]) assert.equal(formatDuration(value), null);
});


test('YouTube: admite enlaces normales, cortos, shorts y embed con el instante inicial', () => {
  for (const url of ['https://youtu.be/l9WJ6PspaW4', 'https://www.youtube.com/watch?v=l9WJ6PspaW4', 'https://youtube.com/shorts/l9WJ6PspaW4', 'https://www.youtube-nocookie.com/embed/l9WJ6PspaW4']) {
    const result = resolveVideo({sourceType: 'external', url, durationSeconds: null});
    assert.equal(result.kind, 'embed');
    assert.equal(new URL(result.url).hostname, 'www.youtube-nocookie.com');
    assert.match(result.url, /embed\/l9WJ6PspaW4/);
  }
  const result = resolveVideo({sourceType: 'external', url: 'https://youtube.com/watch?v=l9WJ6PspaW4&t=1m41s', durationSeconds: null});
  assert.equal(new URL(result.url).searchParams.get('start'), '101');
});

test('Vimeo: conserva el hash de los videos no listados', () => {
  for (const url of ['https://vimeo.com/123456789/abc123def', 'https://player.vimeo.com/video/123456789?h=abc123def']) {
    const result = resolveVideo({sourceType: 'external', url, durationSeconds: null});
    assert.equal(result.provider, 'Vimeo');
    assert.equal(new URL(result.url).searchParams.get('h'), 'abc123def');
  }
});

test('MP4/WebM y archivos subidos se entregan a video; los enlaces antiguos siguen funcionando', () => {
  for (const sourceType of ['direct', 'upload', 'legacy']) {
    const result = resolveVideo({sourceType, url: 'https://cdn.example.com/video.MP4?public=1', durationSeconds: 72});
    assert.equal(result.kind, 'file');
    assert.equal(result.url, 'https://cdn.example.com/video.MP4?public=1');
  }
  assert.equal(resolveVideo({sourceType: 'legacy', url: 'https://youtu.be/l9WJ6PspaW4', durationSeconds: null}).kind, 'embed');
});

test('no crea reproductores para URLs inválidas, incompletas o de proveedores ajenos', () => {
  assert.equal(resolveVideo(null), null);
  for (const url of [null, '', 'javascript:alert(1)', 'https://youtube.com.evil.test/watch?v=l9WJ6PspaW4', 'https://evil.test/embed/123', 'https://user:pass@vimeo.com/123', 'https://youtube.com/watch?v=bad-id']) {
    assert.equal(resolveVideo({sourceType: 'external', url, durationSeconds: null}), null);
  }
  assert.equal(resolveVideo({sourceType: 'upload', url: null, durationSeconds: 72}), null);
});

test('las portadas responden al hotspot y al recorte sin modificar el original', () => {
  const cover = {url: 'https://cdn.sanity.io/images/vrb9lndu/portafolio_productor/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1600x1000.jpg', alt: 'Portada', crop: null, hotspot: {x: .15, y: .5, width: .1, height: .1}};
  const before = structuredClone(cover);
  const left = new URL(coverUrl(cover, 800, 1000));
  const right = new URL(coverUrl({...cover, hotspot: {...cover.hotspot, x: .85}}, 800, 1000));
  assert.equal(left.searchParams.get('w'), '800');
  assert.equal(left.searchParams.get('h'), '1000');
  assert.ok(Number(right.searchParams.get('rect').split(',')[0]) > Number(left.searchParams.get('rect').split(',')[0]));
  const cropped = new URL(coverUrl({...cover, crop: {left: .1, right: .2, top: 0, bottom: .1}}, 800, 1000));
  const [x, , width] = cropped.searchParams.get('rect').split(',').map(Number);
  assert.ok(x >= 160 && x + width <= 1280);
  assert.deepEqual(cover, before);
  assert.equal(coverUrl(null, 800, 1000), null);
});
