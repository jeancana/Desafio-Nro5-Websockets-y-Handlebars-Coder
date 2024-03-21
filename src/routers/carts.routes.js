// Importando el Modulo Router de Express
import { Router } from "express";

// IMPORTANDO el productManager 
import CartsManager from '../managers/cartManager.js'

// IMPORTANDO el productManager 
import ProductsManager from '../managers/productManager.js'

// Activando el Modulo Router de Express
const router = Router();

// Creando un Nueva Instancia del CartsManager
const cartManager = new CartsManager()

// Creando un Nueva Instancia del ProductsManager
const productsManager = new ProductsManager()


// 1) Metodo POST = CREATE en la ruta RAIZ
// 1.1) crear un NUEVO carrito en el Archivo carts.json  
router.post('/', async (req, res) => {


    const { products } = (req.body)

    if (!Array.isArray(products)) {

        res.status(200).send({ error: 'Key <<<products:>>> is Not a Array - Try Again' })

    } else {

        try {

            await cartManager.addCarts(products)
            res.status(200).send({ status: 'ok Cart Created' })

        } catch (err) {

            res.status(500).send({ err: err.message })
        }

    }

    //----- Datos para USAR del Lado del cliente ----------
    /*
    .- Creando un Carrito Vacio en la ruta raiz: http://localhost:8080/api/carts
    
    .- Datos del Json  
        {
            "products": []  
         }
    
    */

})


// 2) Metodo GET = READ en la ruta /:cid 
// 2.1) Mostrando todo los Productos que estan Incluidos de un Carrito Seleccionado por su ID  
router.get('/:cid', async (req, res) => {

    const id = parseInt(req.params.cid)
    //console.log(cid)

    //------------------------------------------------------------

    // Ubicando el carrito a Mostrar
    const cart = await cartManager.getCarstById(id)
    //console.log(cart.products[0])

    // Validando el carrito encontrado
    if (!cart) {
        return res.status(404).send({ error: 'Cart Not Found' })
    }

    //------------------------------------------------------------

    // Funcion para poder Poblar el Carrito Encontrado con los datos completos del Producto 
    let productosValidados = [];

    for (let i = 0; i < cart.products.length; i++) {

        const { product, quantity } = cart.products[i]
        //console.log(product)

        // Leyendo listado de Productos 
        const readProducts = await productsManager.readProducts()
        //console.log(readProducts)

        // Validando el producto a Mostrar
        const validateProduct = readProducts.find(item => item.id === product)
        //console.log(validateProduct)

        const products = {
            product: validateProduct,
            quantity: quantity
        }

        productosValidados.push(products);

    }

    //Verificando 
    //console.log(productosValidados)

    // Preparando el contenido a Mostrar
    const newContent = {
        id: cart.id,
        products: productosValidados
    }

    try {

        res.status(200).send({ status: 'ok', data: newContent })


    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    // Ruta para leer un Carrito con Detalle de sus productos -- http://localhost:8080/api/carts/2 

})


// 3) Metodo POST = CREATE 
// 3.1) Agregar Productos al Carrito Selecion por su ID 
router.post('/:cid/product/:pid', async (req, res) => {

    const { product, quantity } = req.body
    //console.log(product, quantity)

    const { cid, pid } = req.params
    const cartId = parseInt(cid)
    const productId = parseInt(pid)

    //------------------------------------------------------------    
    // Leyendo el listado de Carritos
    const readCarts = await cartManager.readCarts()
    //console.log(readCarts)

    // Ubicando el carrito a Modificar
    const cart = readCarts.find(item => item.id === cartId)

    // Validando el carrito a Modificar
    if (!cart) {
        return res.status(200).send({ status: 'Carrito No encontrado' })
    }

    //------------------------------------------------------------
    // Leyendo listado de Productos 
    const readProducts = await productsManager.readProducts()
    //console.log(readProducts)

    // Validando el producto a Agregar 
    const validateProduct = readProducts.find(item => item.id === productId)
    console.log(validateProduct)

    if (!validateProduct) {
        return res.status(200).send({ status: 'Producto Inexistente en el Listado' })
    }

    // ------------------------------------------------------------

    // Cargando Productos al Carrito selecionado
    cart.products.push({
        product: product,
        quantity: quantity
    })
    // console.log(readCarts)

    //------------------------------------------------------------

    try {

        const result = cartManager.addProductTocart(readCarts)
        res.status(200).send({ status: 'ok. Producto Agregado al Carrito', data: result })


    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    //----- Rutas para USAR del Lado del cliente ----------
    /*
    .- Ruta para Agregar Productos al Carrito :  http://localhost:8080/api/carts/2/product/"n"

    - Primer producto a Agregar al Carrito
    {
        "product": 2,
        "quantity": 30
    }

     - Segundo producto a Agregar al Carrito
    {
        "product": 1,
        "quantity": 25
    }
     
    */

})


export default router;

