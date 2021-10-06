// Se hace referencia al serviceWorker de la siguiente forma
// self = this
// No es recomendable, se puede pero no se debe poner funciones fuera de los listeners
self.addEventListener('install', e => {
    console.log('sw install')
    console.log('install', e)
})

self.addEventListener('activate', e => {
    console.log('sw activate')
})

self.addEventListener('fetch', e => {
    console.log('sw fetch')
    console.log('fetch!', e.request.url)
})
