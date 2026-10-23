// Header and footer menus. Edit these arrays to change the site's navigation.

export interface NavLink {
  label: string;
  href: string;
}

/** Links shown in the header bar (left on desktop, inside the menu on tablet/mobile). */
export const headerLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about-us-v1' },
  { label: 'Services', href: '/services-v1' },
];

/** Extra link shown only inside the right-hand menu (after the header links). */
export const headerMenuExtra: NavLink[] = [{ label: 'Projects', href: '/projects' }];

/** "Pages" dropdown: link groups (separated by dividers), then the utility links row. */
export const dropdownGroups: { title: string; links: NavLink[] }[] = [
  {
    title: 'Main pages',
    links: [
      { label: 'Home page V1', href: '/' },
      { label: 'Home page V2', href: '/home-v2' },
      { label: 'Home page V3', href: '/home-v3' },
    ],
  },
  {
    title: 'Contact page',
    links: [
      { label: 'Services page v1', href: '/services-v1' },
      { label: 'Services page v2', href: '/services-v2' },
      { label: 'Services page v3', href: '/services-v3' },
    ],
  },
  {
    title: 'About page',
    links: [
      { label: 'About page V1', href: '/about-us-v1' },
      { label: 'About page V2', href: '/about-us-v2' },
      { label: 'About page V3', href: '/about-us-v3' },
    ],
  },
  {
    title: 'Other pages',
    links: [
      { label: 'Projects', href: '/projects' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Contact us', href: '/contact-us' },
    ],
  },
];

export const dropdownUtilityLinks: NavLink[] = [
  { label: '404', href: '/404' },
  { label: 'Style Guide', href: '/style-guide' },
];

/** Header call-to-action button. */
export const headerCta: NavLink = { label: 'Get in touch', href: '/contact-us' };

/** Footer link columns. */
export const footerColumns: { title: string; links: (NavLink & { newTab?: boolean })[] }[] = [
  {
    title: 'Main pages',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services-v1' },
      { label: 'About us', href: '/about-us-v1' },
      { label: 'Contact ', href: '/contact-us' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Projects', href: '/projects' },
    ],
  },
  {
    title: 'Single pages',
    links: [
      { label: 'Blog single ', href: '/blog/building-on-a-difficult-site-without-fighting-it' },
      { label: 'Project single', href: '/project/foundry-lofts' },
      { label: 'Service single', href: '/service/interior-styling' },
    ],
  },
  {
    title: 'Others Pages',
    links: [
      { label: 'Style Guide', href: '/style-guide' },
      { label: '404', href: '/404' },
    ],
  },
];
