// Global behaviour carried over unchanged from the original template:
// Lenis smooth scrolling and the scroll-triggered number counters ([data-counter]).
// Lenis, GSAP and ScrollTrigger are loaded as classic scripts in BaseLayout (window globals),
// because the Webflow IX3 runtime expects the same globals.

declare global {
  interface Window {
    Lenis: new (options: Record<string, unknown>) => { raf(time: number): void };
    gsap: any;
    WfRuntime: any;
  }
}

const lenis = new window.Lenis({
  smoothWheel: true,
  lerp: 0.1,
  wheelMultiplier: 1,
  infinite: false,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Counter animation
window.WfRuntime ||= [];
window.WfRuntime.push(() => {
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((counter) => {
    // Animate the first text node (the number), so a trailing <span>+</span> is left alone
    const textNode = [...counter.childNodes].find((n) => n.nodeType === 3 && n.textContent?.trim());
    const textEl = (textNode || counter.firstElementChild || counter) as Node;
    const original = (textEl.textContent || '').trim();
    const match = original.match(/^([^0-9.-]*)([0-9.,-]+)(.*)$/);
    if (!match) return;
    const prefix = match[1];
    const number = match[2].replace(/,/g, '');
    const suffix = match[3];
    const target = parseFloat(number);
    if (Number.isNaN(target)) return;
    const hasDecimal = number.includes('.');
    const hasComma = original.includes(',');
    const value = { current: 0 };
    window.gsap.fromTo(
      value,
      { current: 0 },
      {
        current: target,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 88%',
          once: true,
        },
        onUpdate: () => {
          let formattedValue: string | number = hasDecimal ? value.current.toFixed(1) : Math.floor(value.current);
          if (hasComma && !hasDecimal) {
            formattedValue = Number(formattedValue).toLocaleString();
          }
          textEl.textContent = prefix + formattedValue + suffix;
        },
      },
    );
  });
});

export {};
