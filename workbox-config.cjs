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
}
