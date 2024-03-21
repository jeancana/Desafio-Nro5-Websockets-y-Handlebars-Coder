
import express from 'express' // Importando la libreria express 
import handlebars from 'express-handlebars' // le importo por defecto y me lo traigo todo el MODULO 
import { Server } from 'socket.io' // Importando Modolo Server de la biblioteca de socket.io
import http from 'http'// Importando el Modulo http de express 


import ProductsManager from './managers/productManager.js'// IMPORTANDO el productManager

// Creando un Nueva Instancia del ProductsManager
const productManager = new ProductsManager()

// Importando Rutas Dinamicas 
import cartsRouter from './routers/carts.routes.js'
import productsRouter from './routers/products.routes.js'
import viewsRouter from './routers/views.routes.js' //Importando Rutas Manejo MOTOR d Plantillas HANDLEBARS

//Importando Constantes Absolutas 
import { __dirname } from './utils.js'

// Configuramos el puerto 
const PORT = 8080

// Array Vacio para Trabajar Websocket
const products = [] 

//Configuracion de los Servicios de la App
const app = express()// Express me retorna un objeto aplication y no objeto http y websocket necesita el modulo http
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuracion de los Servicios de socket.io
const server = http.createServer(app)// Habilitando un modulo de Servicios con todas las configuracion de express 

const io = new Server(server) //Pasandole el modulo server al WebsocketServer y habilitando el socketServer

// Activando los Servicio de socket.io del lado del Servidor
io.on('connection', socket => {
    
    //console.log('nueva conexion aca', socket.id)

    // Reciendo los datos del Cliente via websocket
    socket.on('client:product', product => {
        
        // Verificando los Datos que viene del Cliente
        //console.log(product)
        
        // Agregando con Socket.io el Producto al products.json  
        productManager.addProduct(product)
        
        // Preparando el contenido que sera enviando al Front para Mostralo con websocket
        products.push({
            socketId: socket.id,
            ...product
        }) 
        //console.log(products)

        // Enviando la lista de productos al cliente via Websocket 
        io.emit('server:allproducts', products)
        

    })

} )

// Habilitando/Inicializando el modulo HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

// Asignacion de Rutas para servicios de contenidos dinamicos
app.use('/', viewsRouter)// Endpoint para el manejo de Vista con el motor de Plantillas Handlebars
app.use('/api/carts', cartsRouter) // Endpoint para el manejo de Carritos de Compra 
app.use('/api/products', productsRouter) // Endpoint para el manejo de Productos


// Poniendo a Escuchar el Servidor 
server.listen(PORT, () => console.log(`Backend activo en puerto ${ PORT }`))