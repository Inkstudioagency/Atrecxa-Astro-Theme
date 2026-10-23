// Webflow runtime bundles per page, self-hosted in public/js/webflow/.
// Each page loads the same files the original Webflow site loads for it: the shared chunk (navbar, dropdowns,
// sliders, lightbox, tabs, forms, IX3 engine) plus a page-specific file that holds that page's IX3 interactions.
// Keyed by the Webflow page id that every page passes to BaseLayout (`wfPage`).
// The runtime's global namespace was renamed from `Webflow` to `WfRuntime` (behaviour unchanged), and
// <html> carries no `data-wf-site`, so the static site isn't fingerprinted as a Webflow-hosted site.
export const webflowRuntime: Record<string, string[]> = {
  // 404
  '6a9ea08c02c28ae8aa38c433': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.9e459672.5b831516bfa0ae6f.js'],
  // about-us-v1
  '6a9ec280e51c6fb372b62089': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.018e4c92.ed668c1dc0819268.js'],
  // about-us-v2
  '6aa1657995f946b2d560ae14': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.4fa5cf0b.cfc54238fb2e7738.js'],
  // about-us-v3
  '6aa2bc98123b655f64c9cd77': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.c821f588.d2259997ab37ec80.js'],
  // blogs
  '6a9fb87458d2e531d85a2e6b': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.1e34aed0.cc52c2486ff46446.js'],
  // blog/[slug]
  '6a9fb7c96cfcb148fd00e15b': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.fe35b1da.bfb549308c0ad5b5.js'],
  // contact-us
  '6a9ecbc2ee1b24fab4ffd1b8': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.ca7e989a.73862d8789133eff.js'],
  // home-v2
  '6aa165511fb503ef5e07fa55': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.15a86a23.97c0f5ab2264bd35.js'],
  // home-v3
  '6aa2bc854f1e650338495bd1': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.19d863bf.ec0b4f78c71c4549.js'],
  // index
  '6a9ea08c02c28ae8aa38c42c': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.50d4a568.4acbe8066e4eeb50.js'],
  // projects
  '6a9fa567b9bd14bcdd40d456': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.a3ff014f.db871442bbe2bb6b.js'],
  // project/[slug]
  '6a9fa5178aa0087a7956aed3': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.ce6eb36a.fadf57d7509c32e1.js'],
  // services-v1
  '6a9ecba416758259e5be92d8': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.f580f856.bc6bd686f964b2e5.js'],
  // services-v2
  '6aa1658c9b0bb2c8089892a7': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.a1a5dcc4.e15767278981f597.js'],
  // services-v3
  '6aa2bcae9ceb948e88419cac': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.1998df88.5414cdb1089efcbd.js'],
  // service/[slug]
  '6a9fa0416cfcb148fdf7afb3': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.1226c705.0a5eeb4040504358.js'],
  // style-guide
  '6a9ea08c02c28ae8aa38c42d': ['webflow.schunk.b9f1509c431fd787.js', 'webflow.9301ba8a.c9b8403c741dd67a.js'],
};
