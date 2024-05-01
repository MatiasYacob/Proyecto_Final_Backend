import { Router, response } from 'express';
import { authToken, passportCall, authorization, uploader } from '../utils.js';
import UsersController from '../controllers/UsersViewsController.js';
import passport from 'passport';
import { addLogger } from "../config/logger_CUSTOM.js";
import { userRepository } from '../services/service.js';


const router = Router();

// Middleware de logger
router.use(addLogger);


//Uploader

router.post('/:uid/documents', uploader.array('documents'), async (req, res) => {
    try {
        
        const userId = req.params.uid;
        const documents = req.files; // Array de documentos subidos
        
        // Actualizar los documentos del usuario utilizando el servicio UserService
        const updateResult = await userRepository.updateDocs(userId, documents);
        

        if (!updateResult.success) {
            return res.status(404).json({ message: updateResult.message });
        }

        res.status(200).json({ message: "Documentos subidos correctamente" });
    } catch (error) {
        console.error("Error al subir documentos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



//Intercambia los roles de "usuario" a "premium" segun haga falta
router.put('/:userId', (req, res) => {
    req.logger.info('Intercambiando Roles del usuario con ID: ' + req.params.userId);
    UsersController.changeUserRole(req, res);
});

//Intercambia los roles de "usuario" a "premium" solo si el usuario tiene cargado los archivos identificación, Comprobante de domicilio, Comprobante de estado de cuenta
router.put('/premium/:userId', (req, res) => {
    req.logger.info('Intercambiando Roles del usuario con ID: ' + req.params.userId);
    UsersController.changeUserRoleDocs(req, res);
});

// Renderiza la vista de inicio de sesión
router.get("/login", (req, res) => {
    req.logger.info('Accediendo a la ruta /login');
    UsersController.renderLogin(req, res);
});

// Renderiza la vista de registro
router.get("/register", (req, res) => {
    req.logger.info('Accediendo a la ruta /register');
    UsersController.renderRegister(req, res);
});

// Renderiza la vista del perfil de usuario
router.get("/", passportCall('jwt'), (req, res) => {
    req.logger.info('Accediendo a la ruta /api/users (perfil de usuario)');
    UsersController.renderProfile(req, res);
});

// Obtiene información del usuario por ID
router.get("/:userId", authToken, (req, res) => {
    req.logger.info(`Accediendo a la ruta /${req.params.userId} (obtener información del usuario por ID)`);
    UsersController.getUserById(req, res);
});

export default router;
