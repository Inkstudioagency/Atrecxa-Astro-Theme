// Webflow marks every link that points at the current page with `w--current` and aria-current="page".
// This reproduces that at build time.

const normalize = (path: string) => (path.replace(/\/+$/, '') || '/').toLowerCase();

export function currentLink(url: URL) {
  const here = normalize(url.pathname);
  const isCurrent = (href: string) => normalize(href) === here;
  /** `class` value for a link: the base classes plus `w--current` when the link points at this page. */
  const linkClass = (href: string, base: string) => (isCurrent(href) ? `${base} w--current` : base);
  /** `aria-current` value for a link (undefined renders no attribute). */
  const ariaCurrent = (href: string) => (isCurrent(href) ? ('page' as const) : undefined);
  return { isCurrent, linkClass, ariaCurrent };
}
