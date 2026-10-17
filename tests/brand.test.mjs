import assert from 'node:assert/strict';
import {test} from 'node:test';
import {YAMAMOTO_LOGO} from '../src/lib/brand.ts';

test('las coordenadas del destello corresponden al archivo original', () => {
  assert.equal(YAMAMOTO_LOGO.src, '/images/logo.webp');
  assert.equal(YAMAMOTO_LOGO.flare.x * YAMAMOTO_LOGO.width, 1321);
  assert.equal(YAMAMOTO_LOGO.flare.y * YAMAMOTO_LOGO.height, 272);
  assert.ok(YAMAMOTO_LOGO.flare.x > 0 && YAMAMOTO_LOGO.flare.x < 1);
  assert.ok(YAMAMOTO_LOGO.flare.y > 0 && YAMAMOTO_LOGO.flare.y < 1);
});
