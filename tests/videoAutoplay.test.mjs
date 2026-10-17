import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getAutoplayUrl} from '../src/lib/videoAutoplay.ts';

test('Vimeo móvil arranca silenciado conservando el hash privado y los parámetros del reproductor', () => {
  const video = {provider: 'Vimeo', url: 'https://player.vimeo.com/video/123456789?h=abc123&autoplay=1&playsinline=1'};
  const url = new URL(getAutoplayUrl(video, true));
  assert.equal(url.searchParams.get('muted'), '1');
  assert.equal(url.searchParams.get('h'), 'abc123');
  assert.equal(url.searchParams.get('autoplay'), '1');
  assert.equal(url.searchParams.get('playsinline'), '1');
  assert.equal(new URL(getAutoplayUrl(video, false)).searchParams.get('muted'), '0');
});

test('las URLs de archivos firmados y de YouTube no se modifican', () => {
  for (const provider of [null, 'YouTube']) {
    const video = {provider, url: 'https://cdn.example.com/demo.mp4?signature=abc%2F123&expires=9999'};
    assert.equal(getAutoplayUrl(video, true), video.url);
  }
});
