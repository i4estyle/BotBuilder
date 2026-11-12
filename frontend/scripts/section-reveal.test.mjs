import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function loadModule(file, resolve, globals = {}) {
  const module = { exports: {} };
  const source = readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  runInNewContext(code, { module, exports: module.exports, require: resolve, ...globals });
  return module.exports;
}

const loading = loadModule('constants/loading-constants.ts', () => ({ default: '' }));
const reveal = loadModule('constants/section-reveal-constants.ts', () => ({}));

class Element {
  children = [];
  attributes = new Map();
  styles = new Map();
  listeners = new Map();
  classes = new Set();
  classList = {
    add: (...names) => names.forEach((name) => this.classes.add(name)),
    remove: (...names) => names.forEach((name) => this.classes.delete(name)),
    contains: (name) => this.classes.has(name),
  };
  style = { setProperty: (name, value) => this.styles.set(name, value) };

  constructor(tag = 'section') {
    this.tag = tag;
  }
  append(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }
  contains(child) {
    return this === child || this.children.some((item) => item.contains(child));
  }
  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
  hasAttribute(name) {
    return this.attributes.has(name);
  }
  querySelectorAll() {
    return this.children.filter(
      (child) =>
        child.tag === 'section' || child.tag === 'footer' || child.classes.has('hero__brandline'),
    );
  }
  closest() {
    return this.hasAttribute('data-section-reveal') ? this : this.parent?.closest();
  }
  addEventListener(name, listener) {
    this.listeners.set(name, listener);
  }
  removeEventListener(name) {
    this.listeners.delete(name);
  }
}

function createFixture({
  active = true,
  reduced = false,
  supported = true,
  withLoader = false,
} = {}) {
  const root = new Element('main');
  const documentRoot = new Element('html');
  if (active) documentRoot.classList.add('bb-loading-active');
  const header = root.append(new Element('header'));
  const hero = root.append(new Element());
  const brandline = root.append(new Element('div'));
  brandline.classList.add('hero__brandline');
  const footer = root.append(new Element('footer'));
  const mounted = [];
  const unmounted = [];
  const watchers = [];
  const observers = [];
  const timers = [];
  let frame;
  const vue = {
    onMounted: (callback) => mounted.push(callback),
    onBeforeUnmount: (callback) => unmounted.push(callback),
    watch: (_, callback) => watchers.push(callback),
    ref: (value) => ({ value }),
    computed: (get) => ({
      get value() {
        return get();
      },
    }),
  };
  class Observer {
    observed = new Set();
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      observers.push(this);
    }
    observe(element) {
      this.observed.add(element);
    }
    unobserve(element) {
      this.observed.delete(element);
    }
    disconnect() {
      this.disconnected = true;
      this.observed.clear();
    }
    emit(entries) {
      this.callback(
        entries.map(([target, top = 0, isIntersecting = true]) => ({
          target,
          isIntersecting,
          boundingClientRect: { top },
        })),
      );
    }
  }
  const window = new EventTarget();
  window.matchMedia = () => ({ matches: reduced });
  window.setTimeout = (callback) => {
    timers.push(callback);
    return timers.length;
  };
  window.clearTimeout = () => {};
  if (supported) window.IntersectionObserver = Observer;
  const globals = {
    window,
    document: { documentElement: documentRoot },
    HTMLElement: Element,
    IntersectionObserver: Observer,
    Event,
    performance: { now: () => 0 },
    requestAnimationFrame: (callback) => {
      frame = callback;
      return 1;
    },
    cancelAnimationFrame: () => {},
  };
  const resolve = (name) => {
    if (name === 'vue') return vue;
    if (name === 'vue-router') return { useRoute: () => ({ path: '/' }) };
    if (name.endsWith('/loading-constants')) return loading;
    if (name.endsWith('/section-reveal-constants')) return reveal;
    throw new Error(`Unexpected import: ${name}`);
  };
  const loader = withLoader
    ? loadModule('composables/use-app-loading.ts', resolve, globals).useAppLoading()
    : undefined;
  loadModule('composables/use-section-reveal.ts', resolve, globals).useSectionReveal(
    { value: root },
    () => [],
  );
  return {
    root,
    header,
    hero,
    brandline,
    footer,
    observers,
    timers,
    window,
    loader,
    mount: () => mounted.forEach((callback) => callback()),
    refresh: () => watchers.forEach((callback) => callback()),
    stop: () => unmounted.forEach((callback) => callback()),
    tick: (now) => frame(now),
    finish: () => {
      documentRoot.classList.remove('bb-loading-active');
      window.dispatchEvent(new Event(loading.APP_LOADING_COMPLETE_EVENT));
    },
  };
}

test('waits for loader fade; reveals visible sections once in visual order', () => {
  const fixture = createFixture();
  fixture.mount();
  const [observer] = fixture.observers;
  assert.equal(observer.observed.size, 0);
  assert.equal(fixture.header.hasAttribute('data-section-reveal'), false);
  fixture.finish();
  assert.equal(observer.observed.size, 3);
  assert.equal(observer.options.threshold, 0);
  observer.emit([
    [fixture.brandline, 400],
    [fixture.hero, 0],
    [fixture.footer, 2000, false],
  ]);
  assert.equal(fixture.hero.styles.get('--reveal-delay'), '0ms');
  assert.equal(
    fixture.brandline.styles.get('--reveal-delay'),
    `${reveal.SECTION_REVEAL_CONFIG.staggerMs}ms`,
  );
  assert.equal(fixture.footer.classes.has('is-revealed'), false);
  observer.emit([[fixture.brandline]]);
  assert.equal(
    fixture.brandline.styles.get('--reveal-delay'),
    `${reveal.SECTION_REVEAL_CONFIG.staggerMs}ms`,
  );
  assert.equal(observer.observed.size, 1);
});

test('route entry and dynamic sections work without replaying existing sections', () => {
  const fixture = createFixture({ active: false });
  fixture.mount();
  const [observer] = fixture.observers;
  assert.equal(observer.observed.size, 3);
  observer.emit([[fixture.hero]]);
  const added = fixture.root.append(new Element());
  fixture.refresh();
  assert(observer.observed.has(added));
  assert.equal(observer.observed.has(fixture.hero), false);
  fixture.root.children = fixture.root.children.filter((child) => child !== added);
  fixture.refresh();
  assert.equal(observer.observed.has(added), false);
});

test('stagger is bounded and keyboard focus reveals a pending section immediately', () => {
  const fixture = createFixture({ active: false });
  fixture.mount();
  const sections = Array.from({ length: 6 }, () => fixture.root.append(new Element()));
  fixture.refresh();
  fixture.observers[0].emit(sections.map((section, index) => [section, index]));
  assert.equal(
    sections.at(-1).styles.get('--reveal-delay'),
    `${reveal.SECTION_REVEAL_CONFIG.maxStaggerMs}ms`,
  );
  const button = fixture.footer.append(new Element('button'));
  fixture.root.listeners.get('focusin')({ target: button });
  assert.equal(fixture.footer.styles.get('--reveal-delay'), '0ms');
  assert(fixture.footer.classes.has('is-revealed'));
});

for (const options of [{ reduced: true }, { supported: false }]) {
  test(`keeps content visible for ${options.reduced ? 'reduced motion' : 'missing observer support'}`, () => {
    const fixture = createFixture(options);
    fixture.mount();
    assert(fixture.root.classes.has('home-reveal'));
    assert.equal(fixture.root.classes.has('home-reveal--animated'), false);
    assert.equal(fixture.observers.length, 0);
  });
}

test('unmount disconnects and ignores queued observer or loader events', () => {
  const fixture = createFixture();
  fixture.mount();
  fixture.stop();
  fixture.finish();
  const [observer] = fixture.observers;
  observer.emit([[fixture.hero]]);
  assert(observer.disconnected);
  assert.equal(observer.observed.size, 0);
  assert.equal(fixture.hero.classes.has('is-revealed'), false);
  assert.equal(fixture.root.listeners.has('focusin'), false);
});

test('actual loader releases sections only after the completion fade timer', () => {
  const fixture = createFixture({ withLoader: true });
  fixture.mount();
  fixture.window.dispatchEvent(new Event(loading.APP_CONTENT_READY_EVENT));
  for (let now = 0; now < loading.LOADING_CONFIG.maxTimeoutMs && !fixture.timers.length; now += 16)
    fixture.tick(now);
  assert.equal(fixture.loader.phase.value, 'completing');
  assert.equal(fixture.observers[0].observed.size, 0);
  fixture.timers[0]();
  assert.equal(fixture.loader.isVisible.value, false);
  assert.equal(fixture.observers[0].observed.size, 3);
  fixture.stop();
});
