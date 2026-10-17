import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {Scissors} from 'lucide-react';
import {fetchServices, formatServiceTitle, servicesQuery} from '../src/lib/services.ts';
import {getServiceIcon} from '../src/lib/serviceIcons.ts';

test('consulta servicios publicados con orden editorial y cancelación', async () => {
  const controller = new AbortController();
  const expected = [{_id: 'service-1', title: 'Edición', slug: 'edicion', description: '', icon: null}];
  const client = {fetch: async (query, params, options) => {
    assert.equal(query, servicesQuery);
    assert.match(query, /_type == "service"/);
    assert.match(query, /drafts\.\*\*/);
    assert.match(query, /versions\.\*\*/);
    assert.match(query, /order\(defined\(order\) desc, order asc, title asc, _id asc\)/);
    assert.equal(options.perspective, 'published');
    assert.equal(options.signal, controller.signal);
    return expected;
  }};
  assert.equal(await fetchServices(client, controller.signal), expected);
});

test('distingue una lista vacía de un error de conexión', async () => {
  assert.deepEqual(await fetchServices({fetch: async () => []}), []);
  await assert.rejects(fetchServices({fetch: async () => {throw new Error('Sin conexión');}}), /Sin conexión/);
});

test('todos los iconos del selector de Sanity tienen una correspondencia explícita', async () => {
  const schema = await readFile(new URL('../../portafolio_productor_admin/schemaTypes/shared/icons.ts', import.meta.url), 'utf8');
  const identifiers = [...schema.matchAll(/value: '([^']+)'/g)].map(match => match[1]);
  assert.ok(identifiers.length > 0);
  for (const icon of identifiers) {
    assert.ok(getServiceIcon(icon));
    if (icon !== 'scissors') assert.notEqual(getServiceIcon(icon), Scissors, icon);
  }
});

test('servicios sin icono o con valores desconocidos mantienen una card válida', () => {
  for (const value of [null, '', 'desconocido', 'constructor', '__proto__']) {
    assert.equal(getServiceIcon(value), Scissors);
  }
});

test('corrige los títulos editoriales y conserva los nuevos nombres de Sanity', () => {
  assert.equal(formatServiceTitle('Edicion youtube'), 'Edición para YouTube');
  assert.equal(formatServiceTitle(' EDICIÓN  PARA YOUTUBE '), 'Edición para YouTube');
  assert.equal(formatServiceTitle('Reels y redes sociales'), 'Social Media & Reels');
  assert.equal(formatServiceTitle('Color grading'), 'Color Grading');
  assert.equal(formatServiceTitle('Motion graphics'), 'Motion Graphics');
  assert.equal(formatServiceTitle('Mejora de audio'), 'Mejora de Audio');
  assert.equal(formatServiceTitle('Dirección audiovisual'), 'Dirección audiovisual');
});
