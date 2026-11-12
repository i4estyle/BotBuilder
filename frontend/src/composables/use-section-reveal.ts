import { onBeforeUnmount, onMounted, watch } from 'vue';
import type { Ref, WatchSource } from 'vue';
import { APP_LOADING_COMPLETE_EVENT } from '@/constants/loading-constants';
import { SECTION_REVEAL_CONFIG } from '@/constants/section-reveal-constants';

export function useSectionReveal(
  pageRoot: Ref<HTMLElement | null>,
  sectionIds: WatchSource<readonly string[]>,
): void {
  const pending = new Set<HTMLElement>();
  let observer: IntersectionObserver | undefined;
  let started = false;

  const reveal = (element: HTMLElement, delayMs: number): void => {
    if (!pending.delete(element)) return;
    element.style.setProperty('--reveal-delay', `${delayMs}ms`);
    element.classList.add('is-revealed');
    observer?.unobserve(element);
  };

  const prepareSections = (): void => {
    const root = pageRoot.value;
    if (!root || !observer) return;

    pending.forEach((element) => {
      if (root.contains(element)) return;
      observer?.unobserve(element);
      pending.delete(element);
    });

    root.querySelectorAll<HTMLElement>(SECTION_REVEAL_CONFIG.selector).forEach((element) => {
      if (element.hasAttribute('data-section-reveal')) return;
      element.setAttribute('data-section-reveal', '');
      if (element.classList.contains('is-revealed')) return;
      pending.add(element);
      if (started) observer?.observe(element);
    });
  };

  const start = (): void => {
    if (started) return;
    started = true;
    window.removeEventListener(APP_LOADING_COMPLETE_EVENT, start);
    pending.forEach((element) => observer?.observe(element));
  };

  const handleFocus = (event: FocusEvent): void => {
    if (!started || !(event.target instanceof HTMLElement)) return;
    const section = event.target.closest<HTMLElement>('[data-section-reveal]');
    if (section) reveal(section, 0);
  };

  onMounted((): void => {
    const root = pageRoot.value;
    if (!root) return;
    root.classList.add('home-reveal');

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    observer = new IntersectionObserver(
      (entries): void => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)
          .forEach((entry, index) => {
            if (!(entry.target instanceof HTMLElement)) return;
            reveal(
              entry.target,
              Math.min(index * SECTION_REVEAL_CONFIG.staggerMs, SECTION_REVEAL_CONFIG.maxStaggerMs),
            );
          });
      },
      { threshold: 0, rootMargin: SECTION_REVEAL_CONFIG.rootMargin },
    );

    root.style.setProperty('--section-reveal-duration', `${SECTION_REVEAL_CONFIG.durationMs}ms`);
    root.style.setProperty('--section-reveal-distance', `${SECTION_REVEAL_CONFIG.distancePx}px`);
    root.classList.add('home-reveal--animated');
    prepareSections();
    root.addEventListener('focusin', handleFocus);
    window.addEventListener(APP_LOADING_COMPLETE_EVENT, start);
    if (!document.documentElement.classList.contains('bb-loading-active')) start();
  });

  watch([pageRoot, sectionIds], prepareSections, { flush: 'post' });

  onBeforeUnmount((): void => {
    observer?.disconnect();
    pending.clear();
    window.removeEventListener(APP_LOADING_COMPLETE_EVENT, start);
    pageRoot.value?.removeEventListener('focusin', handleFocus);
    pageRoot.value?.classList.remove('home-reveal--animated');
  });
}
