
//credit and thanks to Chris Ferdinandi
//https://css-tricks.com/add-a-service-worker-to-your-site
//https://gist.github.com/cferdinandi/6e4a73a69b0ee30c158c8dd37d314663

// Core assets
let coreAssets = 
[
    './images/backgrounds/3px-tile.png',
    './images/backgrounds/argyle.png',
    './images/backgrounds/black-orchid.png',
    './images/backgrounds/brick-wall-dark.png',
    './images/backgrounds/classy-fabric.png',
    './images/backgrounds/dark-mosaic.png',
    './images/backgrounds/diagmonds.png',
    './images/backgrounds/my-little-plaid-dark.png',
    './images/backgrounds/purty-wood.png',
    './images/backgrounds/real-carbon-fibre.png',
    './images/backgrounds/shattered-dark.png',
    './images/backgrounds/shley-tree-2.png',
    './images/backgrounds/type.png',
    './images/android-chrome-192x192.png',
    './images/android-chrome-512x512.png',
    './images/apple-touch-icon.png',
    './images/favicon-16x16.png',
    './images/favicon-32x32.png',
    './images/narrow.png',
    './images/wide.png',
    'favicon.ico',
    'manifest.json',
    'sw.js',
    'firebase-messaging-sw.js',
    'index.html'
];

const appName = "minlist";



// On install, cache core assets
self.addEventListener('install', function (event) {

	// Cache core assets
	event.waitUntil(caches.open(appName).then(function (cache) {
		for (let asset of coreAssets) {
			cache.add(new Request(asset));
		}
		return cache;
	}));

});

// Listen for request events
self.addEventListener('fetch', function (event) {

	// Get the request
	let request = event.request;

	// Bug fix
	// https://stackoverflow.com/a/49719964
	if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

	// HTML files
	// Network-first
	if (request.headers.get('Accept').includes('text/html')) {
		event.respondWith(
			fetch(request).then(function (response) {

				// Create a copy of the response and save it to the cache
				let copy = response.clone();
				event.waitUntil(caches.open(appName).then(function (cache) {
					return cache.put(request, copy);
				}));

				// Return the response
				return response;

			}).catch(function (error) {

				// If there's no item in cache, respond with a fallback
				return caches.match(request).then(function (response) {
					return response || caches.match('/index.html');
				});

			})
		);
	}

	// CSS & JavaScript
	// Offline-first
	else if (request.headers.get('Accept').includes('text/css') || request.headers.get('Accept').includes('text/javascript')) {
		event.respondWith(
			caches.match(request).then(function (response) {
				return response || fetch(request).then(function (response) {

					// Return the response
					return response;

				});
			})
		);
		return;
	}

	// Images
	// Offline-first
	else if (request.headers.get('Accept').includes('image')) {
		event.respondWith(
			caches.match(request).then(function (response) {
				return response || fetch(request).then(function (response) {

					// Save a copy of it in cache
					let copy = response.clone();
					event.waitUntil(caches.open(appName).then(function (cache) {
						return cache.put(request, copy);
					}));

					// Return the response
					return response;

				});
			})
		);
	}

});