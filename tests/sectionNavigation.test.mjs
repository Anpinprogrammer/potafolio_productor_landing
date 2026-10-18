import assert from 'node:assert/strict';
import {test} from 'node:test';
import {scrollToSection, sectionScrollDuration} from '../src/lib/sectionNavigation.ts';

function browser(t) {
  const frames = new Map();
  let nextFrame = 0;
  let targetTop = 4000;
  const viewport = Object.assign(new EventTarget(), {
    scrollY: 0, innerHeight: 800,
    scrollTo({top, behavior}) {
      assert.equal(behavior, 'instant');
      this.scrollY = top;
    },
  });
  const section = {getBoundingClientRect: () => ({top: targetTop - viewport.scrollY})};
  const document = {documentElement: {scrollHeight: 8000}};
  const globals = {
    window: viewport, document,
    getComputedStyle: (el) => el === section ? {scrollMarginTop: '0px'} : {scrollPaddingTop: '80px'},
    requestAnimationFrame: (fn) => { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  for (const [key, value] of Object.entries(globals)) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, {configurable: true, writable: true, value});
    t.after(() => original ? Object.defineProperty(globalThis, key, original) : delete globalThis[key]);
  }
  return {
    viewport, section, frames,
    moveTarget: (top) => { targetTop = top; },
    tick(now) {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(fn => fn(now));
    },
  };
}

test('los saltos largos duran más que los cortos, en ambas direcciones', () => {
  assert.ok(sectionScrollDuration(4000) > sectionScrollDuration(800));
  assert.equal(sectionScrollDuration(-4000), sectionScrollDuration(4000));
  assert.ok(sectionScrollDuration(20000) <= 4500);
});

test('el recorrido respeta el header fijo y se adapta a cambios de altura del contenido', (t) => {
  const page = browser(t);
  let completed = 0;
  scrollToSection(page.section, () => completed++);
  page.tick(0);
  page.tick(1000);
  assert.ok(page.viewport.scrollY > 0 && page.viewport.scrollY < 3920);
  assert.equal(completed, 0);
  page.moveTarget(4500);
  page.tick(5000);
  assert.equal(page.viewport.scrollY, 4420);
  assert.equal(completed, 1);
  assert.equal(page.frames.size, 0);
});

test('el gesto del usuario y una nueva navegación pueden cancelar el recorrido', (t) => {
  const page = browser(t);
  let completed = 0;
  scrollToSection(page.section, () => completed++);
  page.tick(0);
  page.tick(500);
  const position = page.viewport.scrollY;
  page.viewport.dispatchEvent(new Event('wheel'));
  page.tick(5000);
  assert.equal(page.viewport.scrollY, position);
  assert.equal(completed, 0);
  assert.equal(page.frames.size, 0);
  const cancel = scrollToSection(page.section, () => completed++);
  cancel();
  assert.equal(page.frames.size, 0);
});
