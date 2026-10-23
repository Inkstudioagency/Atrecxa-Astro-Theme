// Videos opened by the "play" lightbox buttons. Each entry is a lightbox item read by the lightbox module in
// public/js/webflow/: `html` is the player embedded in the lightbox, `thumbnailUrl` a preview image.
//
// The demo video is "Cliff House Time-lapse Recut" by AltiusArchitecture (CC BY 3.0), served by Wikimedia Commons:
// https://commons.wikimedia.org/wiki/File:Cliff_House_Time-lapse_Recut.webm
// Replace it with your own (a YouTube/Vimeo embed iframe works too) and remove the credit from the README.

export interface LightboxVideo {
  url: string;
  originalUrl: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  html: string;
  type: 'video';
}

/** Lightbox item for an embeddable player URL. */
function embed(pageUrl: string, embedUrl: string, thumbnailUrl: string, title: string): LightboxVideo {
  return {
    url: pageUrl,
    originalUrl: pageUrl,
    width: 940,
    height: 528,
    thumbnailUrl,
    html: `<iframe class="embedly-embed" src="${embedUrl}" width="940" height="528" scrolling="no" title="${title}" frameborder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen="true"></iframe>`,
    type: 'video',
  };
}

const demo = embed(
  'https://commons.wikimedia.org/wiki/File:Cliff_House_Time-lapse_Recut.webm',
  'https://commons.wikimedia.org/wiki/File:Cliff_House_Time-lapse_Recut.webm?embedplayer=yes',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cliff_House_Time-lapse_Recut.webm/1280px--Cliff_House_Time-lapse_Recut.webm.jpg',
  'Cliff House time-lapse',
);

export const videos = {
  /** Navbar "Pages" dropdown, Home V1/V3 play buttons and the V3 testimonials. */
  showreel: demo,
  /** V2 testimonials (first video card). */
  studio: demo,
  /** V2 testimonials (other video cards). */
  process: demo,
} satisfies Record<string, LightboxVideo>;

/** JSON payload for a `.w-lightbox` link (`<script type="application/json" class="w-json">`). */
export function lightboxJson(video: LightboxVideo): string {
  return JSON.stringify({ items: [video], group: '' });
}
