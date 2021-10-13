// Se hace referencia al serviceWorker de la siguiente forma
// self = this
// No es recomendable, se puede pero no se debe poner funciones fuera de los listeners

const CACHE_STATIC_NAME = 'static-v08'
const CACHE_INMUTABLES_NAME = 'inmutable-v08'
const CACHE_DYNAMIC_NAME = 'dynamic-v08'



self.addEventListener("install", (e) => {
    console.log("sw install!!!");
    //console.log("install", e);

    
    self.skipWaiting()
    
    const cacheStatic = caches.open(CACHE_STATIC_NAME).then( cache => {
        //console.log(cache)
        //Guardar todos los recursos estaticos de la App Shell

        return cache.addAll([
          '/index.html',
          '/css/styles.css',
          '/js/index.js',
          '/js/api.js',
          'js/handlebars.min-v4.7.7.js',
          '/plantilla-lista.hbs',
          '/images/supermarket.jpg'         
        ])
    })
    const cacheInmutable = caches.open(CACHE_INMUTABLES_NAME).then(cache => {
      //console.log(cache)
        return cache.addAll([
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://code.getmdl.io/1.3.0/material.deep_purple-amber.min.css',
            'https://code.getmdl.io/1.3.0/material.min.js',
            'https://code.jquery.com/jquery-3.6.0.min.js'
        ])

    })
    e.waitUntil(Promise.all[cacheStatic, cacheInmutable])

});

self.addEventListener("activate", (e) => {
      console.log("sw activate");

      const cacheWhiteList = [
          CACHE_STATIC_NAME,
          CACHE_INMUTABLES_NAME,
          CACHE_DYNAMIC_NAME
      ]


      e.waitUntil(
        caches.keys().then(keys => {
          keys.map(cache => {
            //console.log(cache)
            if (!cacheWhiteList.includes(cache)) {
              return caches.delete(cache)
            }
          })
        })
      )
});

self.addEventListener("fetch", (e) => {
    console.log("sw fetch");
    //console.log('fetch!', e.request.url)

    let { url, method } = e.request;
    console.log(method, url);

    if(method == 'GET' && !url.includes('mockapi.io')) {
      const respuesta = caches.match(e.request).then( res => {
        if (res) {
            console.log('Existe en el CACHE')
            return res
        } else {
          console.error('NO EXISTE EL RECURSO EN LA CACHE')
          return fetch(e.request).then(nuevaRta => {
            caches.open(CACHE_DYNAMIC_NAME).then(cache => {
              cache.put(e.request, nuevaRta)
            })
            
            return nuevaRta.clone()
          })          
        }
      })
      //e.responWith(respuesta)
    } else {
      console.warn('BYPASS', method, url)
    }
  
});


self.addEventListener('push', (e)=> {
    console.log('push', e.data.text())
})