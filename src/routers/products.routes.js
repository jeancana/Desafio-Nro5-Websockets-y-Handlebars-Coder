// Importando el Modulo Router de Express
import { Router } from "express";

// IMPORTANDO el productManager
import ProductsManager from '../managers/productManager.js'

// Activando el Modulo Router de Express
const router = Router();

// Creando un Nueva Instancia del ProductsManager
const productManager = new ProductsManager()


// <<<<<<<<< HACIENDO C.R.U.D >>>>>>>>>>>>>>

// 1) Metodo POST = CREATE en la ruta RAIZ para:
// 1.1) agregar UN PRODUCTO NUEVO en el Archivo products.json  
router.post('/', async (req, res) => {

    try {

        //console.log(req.body) 
        const { title, description, code, price, status, stock, category } = req.body

        // ***** VALIDACIONES ****** 

        // 1) Chequeando que todo los Campos sean obligatorios
        if (!title || !description || !code || !price || !status || !stock || !category) {

            return res.status(400).send({ status: 'ERR', data: 'Faltan campos obligatorios' })

        }

        // Creamos un Nuevo Objeto con los Datos Desestructurados 
        const newContent = {

            title, //Se puede poner asi el Objeto y JS enviente que la propiedad Y el valor tienen el MISMO NOMBRE
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail: " url - imagen", // NO es un campo obligatorio

        }

        // Agragemos el nuevo producto al listado de productos 
        const result = await productManager.addProduct(newContent)

        // Enviando la respueta el cliente
        res.status(200).send({ status: 'OK. Producto Creado', data: result })

    } catch (err) {

        res.status(500).send({ err: err.message })

    }

    //----- DATOS para USAR del Lado del cliente ----------
    /*
    .- Para Agregar una Producto la raiz: http://localhost:8080/api/products
    
    <<<<< Productos INICIALES Enviados via POST (req.body) al archivo products.json >>>>>

    .- Producto 1
        {
            "title": "Violin Electrico ", 
            "description": "Instrumeto Moderno", 
            "code": "T-001",
            "price": 1000, 
            "status": true,
            "stock": "11", 
            "category": "Alta Gama",
            "thumbnail": "url - imagen"
         }

    .- Producto 2 
         {
            "title": "Violin Acustico ",
            "description": "InstrumetoClasico", 
            "code": "T-002", 
            "price": 2000, 
            "status": true,
            "stock": "12", 
            "category": "Alta Gama",
            "thumbnail": "url - imagen"
         }

    .- Producto 3    
         {
            "title": "Teclado Casio ",
            "description": "Instrumeto Eletrico", 
            "code": "T-003", 
            "price": 3000, 
            "status": true,
            "stock": "13", 
            "category": "Alta Media",
            "thumbnail": "url - imagen"
         }
    
    */

})


// 2) Metodo GET = READ en la ruta RAIZ para: 
// 2.1) Leer todo los PRODUCTOS guardados en el Archivo products.json
// 2.2) Leer los PRODUCTOS guardados en el Archivo producst.json hasta donde indique ?limit = n
router.get('/', async (req, res) => {

    try {

        //console.log(req.query)

        const limit = parseInt(req.query.limit)
        
        // Leyendo el listado de productos
        const readProducts = await productManager.getProducts()
        //console.log(readProducts)

        
        if (!limit) {
            
            //si el parametro limit no existe envia todo los productos
            res.status(200).send({ status: 'ok', data: readProducts })
            
        } else {
            
            //Acotando la Busqueda de Productos hasta ?limit = n
            const productLimit = await readProducts.slice(0, limit)
            //console.log(typeof productLimit)

            // Como existe el parametro limit envia el listado de productos Acotados 
            res.status(200).send({ status: 'ok', data: productLimit })
        }

    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    //----- DATOS para USAR del Lado del cliente ----------
    //-- Ruta NRO 1: Leyendo Todos los Productos   - http://localhost:8080/api/products
    //-- Ruta NRO 2:  Leyendo los hasta ?limit=n -  http://localhost:8080/api/products?limit=2

})


// 3) Metodo GET = READ en la ruta "/:pid" 
// 3.1) Leer UN SOLO PRODUCTO POR SU ID guardado en el Archivo products.json 
router.get('/:pid', async (req, res) => {

    try {

        const id = parseInt(req.params.pid)
        //console.log(id)

        // Ubicando un producto dentro del listado por us ID
        const product = await productManager.getProductsById(id)


        if (!product) {

            // Si el producto no existe el listado envia la siguiente respuesta 
            res.status(404).send({ error: 'Product Not Found' })

        } else {

            // Como existe Envia el producto Seleccionado 
            res.status(200).send({ status: 'ok', data: product })
        }

    } catch (err) {

        res.status(500).send({ err: err.message })
    }

    //-- Ruta NRO 1: Leyendo un Producto por su Id  --  http://localhost:8080/api/products/2 
    //-- Ruta NRO 1: Leyendo un Producto inexistente -- http://localhost:8080/api/products/55

})


// 4) Metodo PUT = UPDATE en la ruta /:id  
// 4.1) ACTUALIZAR UN PRODUCTO POR SU ID guardado en el Archivo products.json 
router.put('/:pid', async (req, res) => {

    //console.log(req.body)
    //console.log(req.params)

    try {

        // Recibo el ID quiero actualizar del Archivo products.json
        const id = parseInt(req.params.pid)

        // Desestructurando los Datos que viene por req.body
        let { title, description, code, price, status, stock, category, thumbnail } = req.body

        // ***** VALIDACIONES ****** 

        // 1. **** Campos que Estrictamente deben venir llenos
        // 1.1) Validacion del title
        if (title !== undefined && title.trim().length === 0 || Boolean(title) == false) {
            return res.status(400).send({ status: 'ERR', data: 'Title NO puede estar Vacio' })
        }

        // 1.2) Validacion del description
        if (description !== undefined && description.trim().length === 0 || Boolean(description) == false) {
            return res.status(400).send({ status: 'ERR', data: 'description NO puede estar Vacio' })
        }

        // 1.3) Validacion del code
        if (typeof code!== 'string') {
            return res.status(400).send({ status: 'ERR', data: 'Code debe ser un String' })
        } else if (code !== undefined && code.trim().length === 0 || Boolean(code) == false) {
            return res.status(400).send({ status: 'ERR', data: 'code NO puede estar Vacio' })
        }

        // 1.4) Validacion del price
        if (typeof price !== 'number') {
            return res.status(400).send({ status: 'ERR', data: 'price debe ser un Number' })
        } else if (price <= 0) {
            return res.status(400).send({ status: 'ERR', data: 'price debe ser mayor a Cero' })
        }

        // 1.5) Validacion del stock
        if (typeof stock !== 'number') {
            return res.status(400).send({ status: 'ERR', data: 'stock debe ser un Number' })
        } else if (stock < 0) {
            return res.status(400).send({ status: 'ERR', data: 'stock No puede ser Negativo' })
        }

        // 2. Campos que al llegar VACIOS quedaran con los valores Originales del Archivo product.json
        if (Boolean(status) == false) {
            status = undefined
        }
        if (category !== undefined && category.trim().length === 0 || Boolean(category) == false) {
            category = undefined
        }
        if (thumbnail !== undefined && thumbnail.trim().length === 0 || Boolean(thumbnail) == false) {
            thumbnail = undefined
        }


        // Llamando al archivo products.json 
        const readProducts = await productManager.getProducts()
        //console.log(readProducts)

        // Ubico la Posicion del Elemento dentro del Array que deseo Modificar con el metodo .findIndex()
        const productIndex = readProducts.findIndex(item => item.id === id)
        //console.log(productIndex)

        // ubico el Elemento que deseo modificar con el Metodo .find()
        const product = readProducts.find(item => item.id == id)
        //console.log(product.id)

        // Actualizando el producto Seleccionado
        readProducts[productIndex] = {

            // Actualizando los Datos del Producto Seleccionado  
            id: product.id,// Conservando el Id Original del Producto
            title: title ?? product.title,// Campo obligatorio 
            description: description ?? product.description,// Campo obligatorio 
            code: code ?? product.code,// Campo obligatorio 
            price: price ?? product.price,// Campo obligatorio 
            status: status ?? product.status,// Si viene vacio, Pon lo que esta en el Archivo 
            stock: stock ?? product.stock, // Si viene vacio, Pon lo que esta en el Archivo 
            category: category ?? product.category, // Si viene vacio, Pon lo que esta en el Archivo
            thumbnail: thumbnail ?? product.thumbnail // Si viene vacio, Pon lo que esta en el Archivo

        }

        //console.log(readProducts)

        // Actualizando el producto dentro del Archivo products.json
        productManager.updateProducts(readProducts)

        // Enviando Respuesta
        res.status(200).send({ status: 'Product upDate!' })

    } catch (err) {

        res.status(500).send({ err: err.message })

    }

    //----- Datos para USAR del Lado del cliente ----------
    /*
    .- Para Actualizar UN Producto ruta: http://localhost:8080/api/products/3
      
      .- Producto con id: 3 se va a Actualizar con el Metodo PUT = upDate
  
        {
            "id": 3334445,
            "title": "Teclado Casio - Actualizado  ",
            "description": "Instrumeto Eletrico - Probando Actualizancion",
            "code": "T-00222",
            "price": 11,
            "status": false,
            "stock": 0,
            "category": "Alta Media",
            "thumbnail": "url - imagen"
        }
           
      */

})


// 5) Metodo DELETE en la ruta /:pid 
// 5.1) ELIMINAR UN PRODUCTO POR SU ID guardado en el archivo products.json 
router.delete('/:pid', async (req, res) => {

    //console.log(req.params)

    try {

        const id = parseInt(req.params.pid)

        // trayendo el Listado de Productos
        const readProducts = await productManager.getProducts()

        // Seleccionando el Producto a borrar
        const product = readProducts.find(item => item.id === id)
        //console.log(product.id)

        // Borrando el producto en el archivo products.json
        productManager.deleteProductsById(product.id)

        // Enviando Respuesta
        res.status(200).send({ status: 'Product Delete!' })

    } catch (err) {

        res.status(500).send({ err: err.message })

    }

    //----- Datos para USAR del Lado del cliente ----------
    // Ruta para BORRAR UN Producto: http://localhost:8080/api/products/2

})


export default router;