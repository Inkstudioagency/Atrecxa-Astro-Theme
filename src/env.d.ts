interface ImportMetaEnv {
  readonly STRAPI_URL: string;
  readonly STRAPI_API_TOKEN?: string;
  readonly SITE_URL?: string;
  readonly PUBLIC_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Attributes from the original Webflow markup that aren't in the standard HTML typings:
// `parallax` is an IX3 interaction trigger (public/js/webflow/), and a few Webflow blocks carry `href` on a <div>.
declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    parallax?: string;
    href?: string;
  }
}
