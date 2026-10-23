// Site-wide settings. Edit these values to rebrand the theme.
// Contact details and links are generic placeholders (example.com / root-domain social links).

export const site = {
  name: 'Atrecxa',
  url: import.meta.env.SITE_URL || 'https://example.com',
  defaultTitle: 'Atrecxa - Architecture & Interior Design Astro Theme',
  defaultDescription:
    'Atrecxa is a modern architecture and interior design Astro theme for studios, architects and design firms to showcase projects and win clients.',
  ogImage: '/images/open-graph-image-1200x630-2.webp',
  email: 'hello@example.com',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    x: 'https://x.com',
  },
  designer: {
    name: 'ink Studio',
    url: 'https://webflow.com/templates/designers/inksstudio-llc',
  },
  /** Video opened by the "watch" lightbox buttons (navbar dropdown, heroes). */
  /** Endpoint that receives form submissions as JSON (Formspree, Web3Forms, Basin, a serverless function, etc.). */
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || '',
};

export type Site = typeof site;
