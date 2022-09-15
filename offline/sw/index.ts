// typing
interface Movie {
  id: number,
  title: string,
  year: number,
  genres: Array<string>,
  description: string,
  cover: string,
}

interface MovieShort {
  id: number,
  title: string,
}


// IDB
const STORE_NAME = 'offline';
const idb = {
  getDB() : Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('offline', 1);

      openRequest.onupgradeneeded = () => {
        const db = openRequest.result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      openRequest.onsuccess = () => {
        resolve(openRequest.result);
      };

      openRequest.onerror = (event: any) => {
        const error = event.target.error;

        reject(error);
      };
    });
  },

  storeMovies(movies: Array<Movie>) {
    return new Promise((resolve) => {
      idb.getDB().then((db) => {
        const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);

        const promises : Array<Promise<any>> = [];

        movies.forEach((movie) => {
          promises.push(new Promise((resolveWrite) => {
            const request = store.add(movie);
            request.onsuccess = resolveWrite;
          }));
        });

        Promise.all(promises).then(resolve);
      });
    });
  },

  getMoviesList() {
    const result: Array<MovieShort> = [];

    return new Promise((resolve) => {
      idb.getDB().then((db) => {
        const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);

        store.openCursor().onsuccess = (event: any) => {
          const cursor = event?.target?.result || null;

          if (cursor) {
            result.push({
              id: cursor.value.id,
              title: cursor.value.title,
            });

            cursor.continue();
          } else {
            resolve(result);
          }
        };
      });
    });
  },

  getMovie(id: number) {
    return new Promise((resolve) => {
      idb.getDB().then((db) => {
        const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);

        const itemRequest = store.get(id);
        itemRequest.onsuccess = () => resolve(itemRequest.result);
      });
    });
  },
};

// SW

const resourcesToCache = [
  '/img/movies/offline.jpg',
  '/js/chunk-vendors.js',
  '/js/app.js',
  '/js/runtime-app.js',
  '/sw.js',
  '/',
];

const CACHE_NAME = 'offline';

const cacheResource = async () => {
  const cache = await caches.open(CACHE_NAME);

  await cache.addAll(resourcesToCache);
};

const cacheMovies = async () => {
  const response = await fetch('/api/movies/cache.json');

  if (response.ok) {
    const data = await response.json();

    await idb.storeMovies(data);
  }
};

self.addEventListener('install', (event: any) => {
  event.waitUntil((async () => {
    await cacheMovies();
    await cacheResource();
  })());
});

const imgResponse = async (cache: Cache) => {
  return await cache.match('/img/movies/offline.jpg');
};

const apiResponse = async (cache: Cache, url: string) => {
  const buildResponse = (data: any) => {
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  };

  const splittedURL = url.split('/');

  if (splittedURL[splittedURL.length - 1] === 'movies') {
    const data = await idb.getMoviesList();

    return buildResponse(data);
  } else {
    const data = await idb.getMovie(Number(splittedURL[splittedURL.length - 1]));

    return buildResponse(data);
  }
};

const onlineFirstRequest = async (event: any, fallbackUrl?: string ) => {
  try {
    const preloadResponse = await event.preloadResponse;
    if (preloadResponse) {
      return preloadResponse;
    }

    return await fetch(event.request);
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);

    if (event.request.url.endsWith('.jpg')) {
      return await imgResponse(cache);
    }
    if (event.request.url.indexOf('/api/') !== -1) {
      return await apiResponse(cache, event.request.url);
    }

    return await cache.match(fallbackUrl || event.request);
  }
};

self.addEventListener('activate', (event: any) => {
  event.waitUntil((async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if ('navigationPreload' in self.registration) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await self.registration.navigationPreload.enable();
    }
  })());
});

self.addEventListener('fetch', (event: any) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(onlineFirstRequest(event, '/'));
  } else {
    event.respondWith(onlineFirstRequest(event));
  }
});
