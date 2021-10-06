// Se hace referencia al serviceWorker de la siguiente forma
// self = this
// No es recomendable, se puede pero no se debe poner funciones fuera de los listeners
self.addEventListener("install", (e) => {
  console.log("sw install");
  console.log("install", e);
});

self.addEventListener("activate", (e) => {
  console.log("sw activate");
});

self.addEventListener("fetch", (e) => {
  console.log("sw fetch");
  //console.log('fetch!', e.request.url)

  let { url, method } = e.request;
  console.log(method, url);
  console.log("Es un css?", url.includes(".css") ? "Si" : "No");

  if (url.includes("styles.css")) {
    console.log("styles.css / Esta en los fetch!");
    //let resp = null
    let resp = new Response(`                        
            .w-10 {  width: 10% }
            .w-20 {  width: 20% }
            .w-30 {  width: 30% }
            .w-40 {  width: 40% }
            .w-50 {  width: 50% }
            .w-60 {  width: 60% }
            .w-70 {  width: 70% }
            .w-80 {  width: 80% }
            .w-90 {  width: 90% }
            .w-100 {  width: 100% }

            .ml-item {
                margin-left: 20px
            }

            .mdl-layout {
                min-width:360px
            }


            .contenedor {
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 20px;

            }

            img {
                width:100%;
                /* border-radius: 20px; */
                margin-bottom: 20px;
            }

            body {
                background-color:cyan
            }
            `,
      { headers: { "content-type": "text/css" } }
    );
    e.respondWith(resp)
  } else if (url.includes('material.deep_purple-amber.min.css')) {
   // console.log('Tengo el archivo')
    let respuesta = fetch('https://code.getmdl.io/1.3.0/material.blue_grey-indigo.min.css')
    e.respondWith(respuesta);
  }else if(url.includes('supermarket.jpg')) {
    console.log('Encontre la imagen')
    //let respuesta = null
    let respuesta = fetch('https://assets.website-files.com/60d7d2e1002c4685ee0aeecd/611be246473a16f96128a7b8_XmNF8GMvTmCmSezPpUmK_tienda_online.jpg')
    e.respondWith(respuesta);
  } else if (url.includes('index.js')){
    let respuesta = fetch('https://manuelnucleo.000webhostapp.com/index.js', {mode: 'no-cors'})
    .catch(error => console.error('ERROR FETCH', error))
    e.respondWith(respuesta);
  } else {
    // let respuesta = fetch(e.request)
    let resp = fetch(e.request.url);
    e.respondWith(resp);
  }
});
