
/* ------------------------------------------------------ */
/*      API REST lista productos contra MpckAPI.io        */
/* ------------------------------------------------------ */
const api = (function() {


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
        let prods = leerListaProductosLocal(listaProductos)
        return prods
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
    let progress = document.querySelector('progress')
    let btnBorrarProductos = document.querySelector('#btn-borrar-producto')

    progress.value = 0
    progress.style.display = 'block'
    btnBorrarProductos.setAttribute('disabled', true)
    for (let i = 0; i < listaProductos.length; i++) {
        porcentaje = Math.ceil((i*100/listaProductos.length))
        progress.value = porcentaje

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
    porcentaje = 100
    progress.value = porcentaje
    setTimeout(()=> {
        progress.style.display = 'none'
        btnBorrarProductos.removeAttribute('disabled')
    },2000)
    
}

const retardo = ms => new Promise(resolve => setTimeout(resolve, ms))

return {
    getProdWeb,
    postProdWeb,
    putProdWeb,
    deleteProdWeb,
    deleteAllProdWeb
}

})();