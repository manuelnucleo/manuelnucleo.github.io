console.log("Estoy preparado");

/* ------------------------------------------------------ */
/*                   VARIABLES GLOBALES                   */
/* ------------------------------------------------------ */

let listaProductos = [/* 
  { nombre: "Pan", cantidad: 2, precio: 12.34 },
  { nombre: "Carne", cantidad: 3, precio: 200.23 },
  { nombre: "Leche", cantidad: 4, precio: 45.64 },
  { nombre: "Fideos", cantidad: 5, precio: 20.34 }, */
];

/* let crearLista = true;
let ul; */

/* ------------------------------------------------------ */
/*      API REST lista productos contra MpckAPI.io        */
/* ------------------------------------------------------ */

function getURL(id) {
    return 'https://615e311a12571a0017207a77.mockapi.io/lista/' + (id? id : '')  // id existe ? true = id sino false =  ''
}

/* GET */
async function getProdWeb() {
    try {
        let url = getURL() + '?' + Date.now()  // lo ultimo es para generar una URL unica todo el tiempo
        let prods = await $.ajax({url, method: 'get'})
        return prods
    } catch (error) {
        console.log('Error getProdWeb', error)
        
    }
}

/* POST */
async function postProdWeb(prod) {
    try {
        let url = getURL()
        return await $.ajax({url, method:'post', data:prod})
    } catch (error) {
        console.log('Error postProdWeb', error)
    }
}

/* PUT */
async function putProdWeb(id, prod) {
    try {
        let url = getURL(id)
        return await $.ajax({url, method: 'put', data:prod})
    } catch (error) {
        console.log('Error putProdWeb', error)
    }
}


/* DELETE */
async function deleteProdWeb(id) {
    try {
        let url = getURL(id);
        return await $.ajax({ url, method: 'delete'})
    } catch(error){
        console.log('Error deleteProdWeb', error)
    }
}

/* DELETE ALL */
async function deleteAllProdWeb() {
    let porcentaje = 0
    for (let i = 0; i < listaProductos.length; i++) {
        porcentaje = Math.ceil((i*100/listaProductos.length))
        console.log(porcentaje + '%')

        let id = listaProductos[i].id
        try {
            let url = getURL(id)
            await retardo(300)
            await $.ajax({url, method: 'delete'})
        } catch (error) {
            console.log('Error deleteAllProdWeb', error)
        }
    }
}

const retardo = ms => new Promise(resolve => setTimeout(resolve, ms))


/* ------------------------------------------------------ */
/*                   FUNCIONES GLOBALES                   */
/* ------------------------------------------------------ */

async function borrarProd(id) {
    console.log("borrarProd ", id);
    
    try {
        await deleteProdWeb(id)
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

    let prod = listaProductos[index]
    try {
        await putProdWeb(id, prod)
    } catch (error) {
        console.log('cambiarCantidad', error)
    }
    
}

async function cambiarPrecio(id, el) {
    let index = listaProductos.findIndex(prod => prod.id == id)  // 
    let precio = Number(el.value); //convenierto el string del "value" en un number

    console.log("cambiarprecio", id, index, precio);
    listaProductos[index].precio = precio;

    let prod = listaProductos[index]
    try {
        await putProdWeb(id, prod)
    } catch (error) {
        console.log('cambiarPrecio', error)
    }
    
}

async function renderLista() {
    try {
        // jquery ajax
        let plantilla = await $.ajax({url: "plantilla-lista.hbs", method: "get",})
        const template = Handlebars.compile(plantilla);            
        listaProductos = await getProdWeb()    

        //let data = { listaProductos };
        $("#lista").html(template({listaProductos: listaProductos}));
            // esto es para actualizar los estilos (probar)
        let ul = $('#contenedor-lista')
        componentHandler.upgradeElements(ul);
     
    } catch (error) {
        console.log('Render Lista', error)
    }


  //fetch - handlebars
  /* fetch('plantilla-lista.hbs')
    .then(datos => datos.text())
    .then(source => {
        //console.log(source)
        const template = Handlebars.compile(source)
        let data = {listaProductos}
        //document.querySelector('#lista').innerHTML = template(data)
        $('#lista').html(template(data))

        // esto es para actualizar los estilos (probar)
        let ul = document.querySelector('#contenedor-lista')
        componentHandler.upgradeElements(ul)
    }) */

  // XMLHttpRequest
  /*  let xhr = new XMLHttpRequest;
    xhr.open('get', 'plantilla-lista.hbs')
    xhr.send();

    xhr.addEventListener('load', () => {
        if(xhr.status == 200) {
            let source = xhr.response
            //console.log(source)

            const template = Handlebars.compile(source)
            let data = {listaProductos}
            document.querySelector('#lista').innerHTML = template(data)

            let ul = document.querySelector('#contenedor-lista')

            componentHandler.upgradeElements(ul)

        }
    }) */
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
                await postProdWeb(prod)
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


/*   document
    .getElementById("btn-entrada-producto")
    .addEventListener("click", () => {
      console.log("btn-entrada-producto");

      let input = document.getElementById("ingreso-producto");
      let producto = input.value;
      console.log(producto);

      if (producto) {
        listaProductos.unshift({ nombre: producto, cantidad: 1, precio: 0 });
        renderLista();
        input.value = null;
      }
    }); */

 /*  document
    .getElementById("btn-borrar-producto")
    .addEventListener("click", () => {
      console.log("btn-borrar-producto");

      if (confirm("confirma borrar todo")) {
        listaProductos = [];
        renderLista();
      }
    }); */

  /* borrado de todos los productos */

  

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
            await deleteAllProdWeb()
            renderLista()
            dialog.close()
        } catch (error) {
            console.error("aceptar", error);
        }
    })
}

function start() {
  console.log(document.querySelector("title").textContent)
  registrarServiceWorker()
  configurarListeners()
  iniDialog()
  renderLista()
}

start();
