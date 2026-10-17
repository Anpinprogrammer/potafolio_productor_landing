import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getAutoplayUrl, getYouTubeAutoplayUrl} from '../src/lib/videoAutoplay.ts';

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

test('YouTube recibe autoplay y silencio desde la navegación inicial del iframe, sin perder el instante de inicio', () => {
  const url = new URL(getYouTubeAutoplayUrl('https://www.youtube-nocookie.com/embed/l9WJ6PspaW4?start=41&rel=0', true, 'https://yamamoto.example'));
  assert.equal(url.searchParams.get('autoplay'), '1');
  assert.equal(url.searchParams.get('mute'), '1');
  assert.equal(url.searchParams.get('playsinline'), '1');
  assert.equal(url.searchParams.get('enablejsapi'), '1');
  assert.equal(url.searchParams.get('start'), '41');
  assert.equal(url.searchParams.get('origin'), 'https://yamamoto.example');
  assert.equal(new URL(getYouTubeAutoplayUrl(url.href, false, 'https://yamamoto.example')).searchParams.get('mute'), '0');
});
