
import { promises as fs } from 'fs'

export default class ProductManager {

    // Privatizando la propiedad producto 
    #products

    constructor() {
        this.#products = []
        this.path = './data/products.json'
    }


    // Creando el Id Auto Incrementable
    #generateId = () => (this.#products.length === 0) ? 1 : this.#products[this.#products.length - 1].id + 1

    //  ******* Haciendo el C.R.U.D *******

    // <<<< CREATE  >>>>
    // Metodo agregar Productos en el Archivo products.json
    addProduct = async (newContent) => {

        const newProduct = { id: this.#generateId(), ...newContent }
        const productArray = this.#products

        productArray.push(newProduct)
        //console.log(this.#products)

        // Escribiendo los productos en el archivo products.json
        await fs.writeFile(this.path, JSON.stringify(productArray, null, '\t'))


    }


    //<<< READ >>>> 
    // Metodo para leer productos contenidos en el Archivo products.json 
    readProducts = async () => {

        try {

            // leyendo Archivo products.json tiene Productos leelo y devuelvo el contenido 
            const contenido = await fs.readFile(this.path, 'utf-8')
            //console.log(contenido.length)

            // Si esta Vacio envia el Reporte 
            if (contenido.length === 0) {

                const contenido2 = { data: "Cargue Al menos un(1) Producto El Archivo Esta Vacio" }
                return contenido2

            }

            // Sino Manda la data de products.json
            return JSON.parse(contenido)

        } catch (err) {

            return err.message

        }

    }

    // READ NRO.1 
    // Metodo para Mostrar Todos los Productos contenidos en el Archivo products.json
    getProducts = async () => {

        let showProducts = await this.readProducts()
        return showProducts
    }

    // READ NRO.2 
    // Metodo para Mostra 1 producto Ubicado por ID
    getProductsById = async (id) => {

        const product = await this.readProducts()
        //console.log(product.length)
        
        if (!product.length) {
            const contenido2 = { data: " Archivo Vacio Sin productos a Buscar por su ID" }
            return contenido2
            
        } else {

            const respuesta = product.find(product => product.id === id)
            
            if (!respuesta) {

                return null

            } else {

                return respuesta
            }
        }

    }

    // <<<< UPDATE >>>>
    // Metodo para Actualizar un Producto en el Archivo products.json
    updateProducts = async (readProducts) => {

        // Pisando el archivo "products.json" - con las actualizaciones
        await fs.writeFile(this.path, JSON.stringify(readProducts, null, '\t'))

    }


    // <<<< DELETE >>>>
    // Metodo para Borrar un Producto del Archivo "products.json"
    deleteProductsById = async (id) => {

        // Leyendo todo los Productos que estan en "productos.json"
        let showProducts = await this.readProducts()

        // Aplicando un filter Invertido a showProducts para Borrar el Producto Seleccionado
        let filterProduct = showProducts.filter(producto => producto.id != id)

        // Verificando q elimino del Array el producto indicado con el ID
        //console.log(filterProduct)

        // Pisando el archivo "productos.json"
        await fs.writeFile(this.path, JSON.stringify(filterProduct, null, '\t'))
    }


}







