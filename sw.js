const appCacheNames = ['worldcup2018-countdown-v000'];// 0
const mainCache = appCacheNames[0];

self.addEventListener('install', event => {
	console.log("Installing SW");
	event.waitUntil(
		caches.open(mainCache).then(function(cache) {
			cache.addAll([
					"./",
					"./manifest.json",

					// html
					"./index.html",
					"./404.html",
					"./offline.html",
					"./about.html",
					"./city.html",
					"./cities-list.html",
					"./countdown.html",
					"./dates.html",
					"./downloadables.html",
					"./sitemap.html",
					"./social-feeds.html",
					"./stadium.html",
					"./stadiums-list.html",
					"./team.html",
					"./teams-list.html",
					"./tournament-facts.html",
					"./useful-links.html",

					// fonts
					"./assets/fonts/dusha.ttf",

					// css
					"./assets/css/city.css",
					"./assets/css/countdown.css",
					"./assets/css/dates.css",
					"./assets/css/index.css",
					"./assets/css/city.css",
					"./assets/css/main.css",
					"./assets/css/modal.css",
					"./assets/css/simple-card-carousel.css",
					"./assets/css/stadium.css",
					"./assets/css/team.css",
					"./assets/css/vellum.css",

					// js
					"./assets/js/index-page.js",
					"./assets/js/main.js",
					"./assets/js/countdown.js",
					"./assets/js/countdown-freezable.js",
					"./assets/js/dates.js",
					"./assets/js/modal.js",
					"./assets/js/simple-card-carousel.js",
					"./assets/js/social-feeds.js",
					"./assets/js/stadium.js",
					"./assets/js/team-page.js",
					"./assets/js/teams-list.js",
					"./assets/js/tournament-facts.js",

					// json
					"./assets/json/Matches.json",
					"./assets/json/Team Data - South Korea.json",
					"./assets/json/Team Order List.json",
					"./assets/json/Tournament Facts.json",
					
					// images
					"./assets/images/bg_blue.jpg",
					"./assets/images/bg_red.jpg",
					"./assets/images/fwc-2018-logo1.png",
					"./assets/images/Fancy Separator.png"
				]);
		})
	);
});

self.addEventListener('activate', event => {
  event.waitUntil(
  	// deleting unused caches
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
          const appCache = cacheName.startsWith("worldcup2018-countdown-v");
          const outOfDateCache = appCacheNames.indexOf(cacheName) < 0;
          return (appCache && outOfDateCache);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );	
});

self.addEventListener('fetch', event => {
	event.respondWith(
		// look in the cache
		caches.open(mainCache).then( cache => {

			const urlPath = new URL(event.request.url).pathname;
			return caches.match(urlPath).then(retreivedResource => {
				if(retreivedResource) return retreivedResource;
				// if we can't find the resource in the catch, fetch it from network
				return fetchFromNetwork(event);
			})

		})
	)

});

function fetchFromNetwork (event){
	return fetch(event.request).then( response => {
		if(response.status == 404){
			console.log("404 - fetchFromNetwork");
			return fetch("./404.html");
		}
		return response;
	}).catch( () => {
		console.log("Offline - fetchFromNetwork");
		// when we are offline and the request doesn't exist in cache
		// we show the offline page.
		// there is no catch statement for offline since if get an error
		// that means the user is offline and doesn't have any cached pages
		return caches.match("./offline.html").then(offlinePage => offlinePage);
	})
}


self.addEventListener('message', function(event){
	// console.log("SW message:", event.data);
	if(event.data.skipWaiting) self.skipWaiting();
});