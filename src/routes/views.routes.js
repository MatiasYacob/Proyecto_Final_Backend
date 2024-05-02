// Importación de módulos y dependencias necesarios
import { Router } from "express";
import { passportCall, authorization } from "../utils.js";
import * as CartController from "../controllers/CartController.js";
import * as ProductController from "../controllers/ProductController.js";
import { ticketRepository } from "../services/service.js";
import { addLogger } from "../config/logger_CUSTOM.js";
import {io} from "../app.js"
// Creación de una instancia de Router
const router = Router();

// Middleware de logger
router.use(addLogger);

// Ruta raíz ("/")
router.get("/", (req, res) => {
    req.logger.info('Accediendo a la ruta /');
    res.render("home.hbs");
});

// Ruta para visualizar productos en tiempo real ("/realtimeproducts")
router.get('/realtimeproducts', passportCall('jwt'), authorization(['ADMIN','PREMIUM']), async (req, res) => {
    try {
        await ProductController.getProducts(req, res);
        req.logger.info("Ingresando a la Carga De Productos")
    } catch (error) {
        req.logger.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para visualizar productos para uso del usuario ("/products")
router.get("/products", passportCall('jwt'), authorization(['ADMIN', 'USUARIO','PREMIUM']), async (req, res) => {
    try {
        await ProductController.getProductsUser(req, res);
        req.logger.info("Ingresando a Productos")
    } catch (error) {
        req.logger.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para acceder al chat ("/chat")
router.get("/chat", passportCall('jwt'), authorization(['ADMIN', 'USUARIO','PREMIUM']), (req, res) => {
    try { 
        req.logger.debug('Accediendo a la ruta /chat ' + req.user.name);
        
        // Guardar el nombre de usuario en res.locals para que esté disponible en el cliente
        res.locals.username = req.user.name;
        
        // Renderizar la página
        res.render("chat.hbs");
    } catch (error) {
        req.logger.error('Error al acceder a la ruta /chat: ' + error.message);
        res.status(500).send('Error interno del servidor');
    }
});






// Ruta para visualizar productos en el carrito ("/cart")
router.get("/cart", passportCall('jwt'), authorization(['ADMIN', 'USUARIO','PREMIUM']), async (req, res) => {
    try {
        console.log(req.user);
        await CartController.getProductsInCartController(req, res);
        req.logger.info("Ingresando a El Carrito")
    } catch (error) {
        req.logger.error('Error al obtener los productos en el carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para manejar sesiones ("/session")
router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        req.logger.info(`Visita número ${req.session.counter}`);
        res.send(`Se ha visitado este sitio: ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        req.logger.info('Primera visita al sitio');
        res.send('Bienvenido!!');
    }
});

// Ruta para cerrar sesión ("/logout")
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            req.logger.error('Error al cerrar la sesión:', error);
            res.json({ error: "Error logout", msg: "Error al cerrar la sesión" });
        }
        req.logger.info('Sesión cerrada correctamente');
        res.send('Sesión cerrada correctamente!');
    });
});

// Ruta para visualizar tickets ("/tickets")
router.get('/tickets', passportCall('jwt'), authorization(['ADMIN', 'USUARIO','PREMIUM']), async (req, res) => {
    const userId = req.user._id;

    try {
        const tickets = await ticketRepository.getAll(userId);
        req.logger.info(`Tickets obtenidos para el usuario con ID ${userId}`);

        // Renderiza la vista y pasa los datos de los tickets como un objeto
        res.render("tickets.hbs", { tickets });
    } catch (error) {
        req.logger.error('Error al obtener los tickets:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Exportación del router para su uso en otros archivos
export default router;
