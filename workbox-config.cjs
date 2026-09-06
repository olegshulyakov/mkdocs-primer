/** @type {import('workbox-build').Configuration} */
module.exports = {
  globDirectory: 'site',
  globPatterns: ['**/*'],
  globIgnores: ['service-worker.js', 'workbox-*.js'],
  swDest: 'site/service-worker.js',
  clientsClaim: true,
  skipWaiting: true,
  cleanupOutdatedCaches: true,
  navigateFallback: 'index.html',
  /*
   * Which parameters do not choose a different document. Workbox looks a
   * navigation up in the precache by its whole URL and strips only what is
   * listed here, defaulting to the tracking parameters `utm_*` and `fbclid`.
   *
   * The theme's search form is a GET to search.html carrying `q`, and `lang`
   * as well on a translated site. Without these two, every search misses the
   * precached search.html and falls through to `navigateFallback` — so a
   * visitor whose service worker is in control gets the home page instead of
   * their results, network or no network. The page reads both parameters off
   * `location.search` itself, so dropping them from the lookup costs nothing.
   */
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^q$/, /^lang$/],
}
