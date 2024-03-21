import { promises as fs } from 'fs'

export default class CartManager {
    
    constructor() {
        this.cart = []
        this.path = './data/carts.json'
    }

    // Creando el Id Auto Incrementable
    #generateId = () => (this.cart.length === 0) ? 1 : this.cart[this.cart.length - 1].id + 1
  
    // <<<< CREATE  >>>>

    // Metodo agregar Carritos en el Archivo carts.json
    addCarts = async (products) => {
        
        const newCart = { id: this.#generateId(), products }
        
        const result = this.cart

        result.push(newCart)
        
        await fs.writeFile(this.path, JSON.stringify(result, null, '\t'))

    }

    // Metodo agregar Productos a un Carrito en el Archivo carts.json
    addProductTocart = async (result) => {
        
        // Pisando el archivo "products.json" - con las actualizaciones
        await fs.writeFile(this.path, JSON.stringify(result, null, '\t'))

    }

    //<<< READ >>>> 
    // Metodo para leer productos contenidos en el Archivo carts.json 
    readCarts = async () => {

        try {

            // leyendo Archivo carts.json tiene Carritos leelo y devuelvo el contenido 
            const contenido = await fs.readFile(this.path, 'utf-8')
            //console.log(contenido.length)

            // Si esta Vacio envia el Reporte 
            if (contenido.length === 0) {

                const readCarts = { data: "Debe Crear Al menos un(1) Carrito El Archivo Esta Vacio" }
                return readCarts

            }

            // Sino Manda la data de carts.json
            return JSON.parse(contenido)

        } catch (err) {

            return err.message

        }

    }

    // READ NRO.1
    // Metodo para Mostrar Todos los Carritos contenidos en el Archivo carts.json
    getCarts = async () => {

        let readCarts = await this.readCarts()
        return readCarts
        
    }

    // READ NRO.2 
    // Metodo para Mostra 1 Carrito Ubicado por ID
    getCarstById = async (id) => {

        let showOneContent = await this.readCarts()  
        let response = showOneContent.find(product => product.id === id)
        return (response)
        
    }


}











