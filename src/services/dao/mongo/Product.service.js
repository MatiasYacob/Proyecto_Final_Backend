import { Product } from './models/product.model.js';

class ProductManager {
    constructor() {
        // Puede añadirse alguna lógica inicial aquí si es necesario.
    }
    
    // Agrega un nuevo producto a la base de datos.
    async addProduct(producto) {
        try {
            const newProduct = new Product(producto);
            await newProduct.save();
            
            return newProduct;
        } catch (error) {
            Devlogger.error('Error al agregar el producto:', error);
            return null;
        }
    }

    // Actualiza un producto existente basado en su ID.
    async updateProduct(_id, updatedProduct) {
        try {
            const product = await Product.findByIdAndUpdate(_id, updatedProduct, { new: true });
            if (!product) {
                Devlogger.info('El producto no existe.');
                return null;
            }
            Devlogger.info('Producto actualizado exitosamente.');
            return product;
        } catch (error) {
            Devlogger.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    // Elimina un producto basado en su ID.
    async deleteProduct(_id) {
        try {
            const product = await Product.findByIdAndDelete(_id);
            if (!product) {
                Devlogger.info('El producto no existe.');
                return null;
            }
            
            return product;
        } catch (error) {
            Devlogger.error('Error al eliminar el producto:', error);
            return null;
        }
    }

    // Obtiene todos los productos de la base de datos.
    async getProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            Devlogger.error('Error al obtener los productos:', error);
            return [];
        }
    }

    // Obtiene un producto por su ID específico.
    async getProductBy_id(_id) {
        try {
            
            const product = await Product.findById(_id);
            
            return product || null;
        } catch (error) {
            Devlogger.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }
}

// Exporta la clase ProductManager.
export default ProductManager;
