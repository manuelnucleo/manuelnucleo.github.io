console.log("Estoy preparado");

/* ------------------------------------------------------ */
/*                   VARIABLES GLOBALES                   */
/* ------------------------------------------------------ */

let listaProductos = leerListaProductosLocal([
  { nombre: "Pan", cantidad: 2, precio: 12.34 },
  { nombre: "Carne", cantidad: 3, precio: 200.23 },
  { nombre: "Leche", cantidad: 4, precio: 45.64 },
  { nombre: "Fideos", cantidad: 5, precio: 20.34 }, 
])

/* let crearLista = true;
let ul; */
/* ------------------------------------------------------ */
/*                   LOCAL STORAGE                        */
/* ------------------------------------------------------ */

function guardarListaProductosLocal(lista) {
    let prods = JSON.stringify(lista)
    localStorage.setItem('LISTA', prods)
}

function leerListaProductosLocal(lista) {
    let prods = localStorage.getItem('LISTA')
    if (prods) {
        lista = JSON.parse(prods)
    }
    return lista
}


/* ------------------------------------------------------ */
/*                   FUNCIONES GLOBALES                   */
/* ------------------------------------------------------ */

async function borrarProd(id) {
    console.log("borrarProd ", id);
    
    try {
        await api.deleteProdWeb(id)
        renderLista();
    } 
    catch (error) {
        console.log('borrarProd', error)
    }

    //listaProductos.splice(index, 1);
    
}

async function cambiarCantidad(id, el) {
    let index = listaProductos.findIndex(prod => prod.id == id)  // 

    let cantidad = Number(el.value); //convenierto el string del "value" en un number
    console.log("cambiarCantidad", id, index, cantidad);
    listaProductos[index].cantidad = cantidad;  

    // Almaceno la lista en el localStorage
    guardarListaProductosLocal(listaProductos)

    // Actualizo el prod en la MockApi
    let prod = listaProductos[index]
    try {
        await api.putProdWeb(id, prod)
    } catch (error) {
        console.log('cambiarCantidad', error)
    }
    
}

async function cambiarPrecio(id, el) {
    let index = listaProductos.findIndex(prod => prod.id == id)  // 
    let precio = Number(el.value); //convenierto el string del "value" en un number

    console.log("cambiarprecio", id, index, precio);
    listaProductos[index].precio = precio;

    // Almaceno la lista en el localStorage
    guardarListaProductosLocal(listaProductos)

    // Actualizo el prod en la MockApi
    let prod = listaProductos[index]
    try {
        await api.putProdWeb(id, prod)
    } catch (error) {
        console.log('cambiarPrecio', error)
    }
    
}

async function renderLista() {

    try {
        // leemos la plantilla desde el archivo externo
        let plantilla = await $.ajax({url: "plantilla-lista.hbs", method: "get",})

        // compilamos la plantilla
        const template = Handlebars.compile(plantilla);      
        
        //obtengo la lista de productos
        listaProductos = await api.getProdWeb()    

        // Almacenar la lista en el localstorage
        guardarListaProductosLocal(listaProductos)

        //Mesclamos plantilla compilada con los datos (funcion template)
        //inyectamos el resultado en el elemento con id = lista
        //let data = { listaProductos };
        $("#lista").html(template({listaProductos: listaProductos}));
            // esto es para actualizar los estilos (probar)
        let ul = $('#contenedor-lista')
        componentHandler.upgradeElements(ul);
     
    } catch (error) {
        console.log('Render Lista', error)
    }
 
}

function configurarListeners() {
  /* Ingreso de producto */
    $('#btn-entrada-producto').click( async ()=> {

        let input = $('#ingreso-producto')
        let producto = input.val()
        console.log(producto)

        if (producto) {
            try {
                let prod = {nombre: producto, cantidad: 1, precio:0}
                await api.postProdWeb(prod)
                renderLista();
                input.value = null;
            } catch (error) {
                console.log('entrada producto ', error)
            }
        }
    })

    $('#btn-borrar-producto').click( ()=> {
        if (listaProductos.length) {
            var dialog = $('dialog')[0]
            dialog.showModal()
            //listaProductos = []
            //renderLista()            
        }
    })

}

function registrarServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      this.navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          console.log("El service Worker se registro correctamente", reg);
        })
        .catch((err) => {
          console.warn("Error al registrar el service worker", err);
        });
    });
  } else {
    console.error("ServiceWorker no esta disponible en navigator");
  }
}

function iniDialog() {
    var dialog = $('dialog')[0];
    if(!dialog.showModal) { 
        dialogPolyfill.registerDialog(dialog);
    }

    $('.cancelar').click(async ()=> {
        dialog.close()
    })

    $('.aceptar').click(async ()=> {
        try {
            await api.deleteAllProdWeb()
            renderLista()
            dialog.close()
        } catch (error) {
            console.error("aceptar", error);
        }
    })
}

// can i use
// https://caniuse.com/?search=caches

function pruebaCaches() {

    if(window.caches) {
        console.log('El browser sosporta caches')
        /* Creo espacio de caches */
        caches.open('prueba-1')
        caches.open('prueba-2')
        caches.open('prueba-3')
        //Comprobar si existe o no un cache
        //caches.has('prueba-3').then(rta => console.log(rta))
        caches.has('prueba-3').then(console.log) // lo mismo que linea anterior

        /* borro una cache */
        caches.delete('prueba-1').then(console.log)

        /* Listo todos los caches */
        caches.keys().then(console.log)

        /* abro una cache y trabajo con ella */
        caches.open('cache-v1.1').then(cache => {
            console.log('------------------------------')
            console.log(cache)
            console.log(caches)
            console.log('------------------------------')

            /* agregar un recurso a la cahe */
            cache.add('/index.html')

            cache.addAll([
                '/index.html',
                '/css/styles.css',
                'images/supermarket.jpg'
            ]).then(()=> {
                console.log('recursos agrregados')

                /* borro estilos */
               // cache.delete('/css/styles.css').then(console.log)

                /* verificar si un recurso existe en la cache */
                cache.match('/css/styles.css').then(res => {
                    if (res) {
                        console.warn('recurso encontrado')
                        res.text().then(console.log)
                    } else {
                        console.warn('Recurso inexistente')
                    }
                })

                /* Crear o modificar contenido de unr ecurso */
                cache.put('index.html', new Response('hola mundo'))

                /* listar los recursos de la cache */
                cache.keys().then(recursos => console.log('recursos de cache', recursos))

                cache.keys().then(rec=> {
                    rec.forEach(recurso => {
                        console.log(recurso.url)
                    })
                })

                /* listo todos los espacios de cache  */
                cache.keys().then(nombre=> {
                    console.log('nombres de caches: ', nombre)
                })

            })
        })
    } else {
        console.warn('El browser no sosporta caches')
    }
}


function start() {
    console.log(document.querySelector("title").textContent)
    registrarServiceWorker()
    configurarListeners()
    iniDialog()
    renderLista()
    pruebaCaches()
}

start();

