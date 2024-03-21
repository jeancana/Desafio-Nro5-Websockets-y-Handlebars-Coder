// **** 3 PASOS BASICO  al hora de crear rutas****

// <<< Paso nro1 importa el Router del modulo express >>>
import { Router } from "express";

// ***** IMPORTANDO la piezas de codigo hechas previamente en el Directorio /managers para reutilizarlas  
import ProductsManager from '../managers/productManager.js' 

// Uso de MIDDLEWARE
// Uso los 2 ../ puntos para Salir de la carpeta "/routers" e ir a importar el uploader que esta en la carpeta "/src"
import { uploader } from "../uploader.js";


// <<< Paso nro2 Instanciar el Router >>>
const router = Router()

// ******* PERSISTENCIA EN ARCHIVOS **************
const productManager = new ProductsManager()


// 2) Metodo GET = READ en la ruta RAIZ para: 
// 2.1) RENDERIZAR todo los PRODUCTOS guardados en products.json 
// 2.2) Leer los PRDUCTOS guardados en producst.json hasta donde indique ?limit = n
router.get('/', async (req, res) => {

    try {

        const readProducts = await productManager.getProducts()
        //console.log(readProducts)

        res.render('home', { readProducts :readProducts } )
       

    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    //Ruta NRO 1: MOSTRANDO TODOS LOS PRODUCTOS CON HANDLEBARS --->  http://localhost:8080/
    

})


// RUTA Para ACCESAR PROTOCOLO WEBSOCKET clase websockets creado con SOCKET.OI(WEBSOCKET) desde de Una plantilla de Handlebars
router.get('/realtimeproducts', uploader.single('thumbnail'), async (req, res) => {
    

    try {

        res.render('realTimeProducts', { 
            title: 'Carga de Productos con Websocket'
        }  )

    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    
    //----- Rutas para USAR del Lado del cliente -----------
    // Para Cargar los Productos con socket.io  --->  http://localhost:8080/realtimeproducts

})




// <<< PASO nro3 exportar la instancia >>>
export default router