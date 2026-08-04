/**
 * Bumped whenever CMS content changes so the cached sitemap is rebuilt
 * and its ETag changes, forcing crawler caches to refetch.
 */
let version = 1;

export function sitemapVersion() {
  return version;
}

export function bumpSitemapVersion() {
  version += 1;
  return version;
}
