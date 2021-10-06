
console.log('Estoy preparado')

/* ------------------------------------------------------ */
/*                   VARIABLES GLOBALES                   */
/* ------------------------------------------------------ */


let listaProductos = [
    { nombre: 'Pan', cantidad: 2, precio: 12.34 },
    { nombre: 'Carne', cantidad: 3, precio: 200.23 },
    { nombre: 'Leche', cantidad: 4, precio: 45.64 },
    { nombre: 'Fideos', cantidad: 5, precio: 20.34 }
]

let crearLista = true
let ul


/* ------------------------------------------------------ */
/*                   FUNCIONES GLOBALES                   */
/* ------------------------------------------------------ */

function borrarProd(index) {
    console.log('borrar producto ', index)

    listaProductos.splice(index, 1)
    renderLista()
}

function cambiarCantidad(index, el) {
    let cantidad = Number(el.value) //convenierto el string del "value" en un number
    console.log('cambiarCantidad', index, cantidad)
    listaProductos[index].cantidad = cantidad
}

function cambiarPrecio(index, el) {
    let precio = Number(el.value) //convenierto el string del "value" en un number
    console.log('cambiarprecio', index, precio)
    listaProductos[index].precio = precio
}

function renderLista() {

    if (crearLista) {
        ul = document.createElement('ul')
        ul.classList.add('demo-list-icon', 'mdl-list', 'w-100')
        //console.log(ul)
        
    }



    ul.innerHTML = ''
    /* listaProductos.forEach((prod, index, array)=> {
        console.log(prod)
        console.log(index)
        console.log(array)
    }) */
    listaProductos.forEach((prod, index) => {
        ul.innerHTML += `<li class="mdl-list__item">
                            <!-- Icono del produto -->
                            <span class="mdl-list__item-primary-content w-10">
                                <i class="material-icons mdl-list__item-icon">shopping_cart</i>
                            </span>

                            <!-- Nombre del producto -->
                            <span class="mdl-list__item-primary-content w-30">
                                ${prod.nombre}
                            </span>

                            <!-- Entrada de cantidad -->
                            <span class="mdl-list__item-primary-content w-20 ml-item">
                                <div class="mdl-textfield mdl-js-textfield mdl-textfield ">
                                    <input onchange="cambiarCantidad(${index},this)" class="mdl-textfield__input" type="text" id="cantidad-${index}" value="${prod.cantidad}">
                                    <label class="mdl-textfield__label" for="cantidad-${index}">Cantidad</label>
                                </div>
                            </span>

                            <!-- Entrada de precio -->
                            <span class="mdl-list__item-primary-content w-20 ml-item">
                                <div class="mdl-textfield mdl-js-textfield mdl-textfield ">
                                    <input onchange="cambiarPrecio(${index},this)" class="mdl-textfield__input" type="text" id="precio-${index}" value="${prod.precio}">
                                    <label class="mdl-textfield__label" for="precio-${index}">Precio</label>
                                </div>
                            </span>

                            <!-- Boton de borrar el producto -->
                            <span class="mdl-list__item-primary-content w-20 ml-item">
                                <button onclick="borrarProd(${index})"
                                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored ">
                                    <i class="material-icons">remove_shopping_cart</i>
                                </button>
                            </span>

                        </li>`
    })

    // SOLUCION PARA PERDIDA DE ANIMACION DE BOOTSWATCH
    if(crearLista) {
        document.getElementById('lista').appendChild(ul)
    } else {
        componentHandler.upgradeElements(ul)
    }   

    crearLista = false
}

function configurarListeners() {
    
    /* Ingreso de producto */
    document.getElementById('btn-entrada-producto').addEventListener('click', ()=> {
        console.log('btn-entrada-producto')

        let input = document.getElementById('ingreso-producto')
        let producto = input.value
        console.log(producto)

        if(producto) {
            listaProductos.unshift( {nombre: producto, cantidad: 1, precio: 0})
            renderLista()
            input.value = null
        }
    })

    document.getElementById('btn-borrar-producto').addEventListener('click', ()=> {
        console.log('btn-borrar-producto')

        if(confirm('confirma borrar todo')) {
            listaProductos = []
            renderLista()
        }
    })

    /* borrado de todos los productos */

}

function registrarServiceWorker() {
    if('serviceWorker' in navigator) {
        window.addEventListener('load', ()=> {
            this.navigator.serviceWorker.register('./sw.js')
            .then((reg)=> {
                console.log('El service Worker se registro correctamente', reg)
            })
            .catch((err) => {
                console.warn('Error al registrar el service worker', err)
            })
        })
    } else {
        console.error('ServiceWorker no esta disponible en navigator')
    }
}

function start() {
    console.log(document.querySelector('title').textContent)
    registrarServiceWorker()
    configurarListeners()
    renderLista()
}

start()






























