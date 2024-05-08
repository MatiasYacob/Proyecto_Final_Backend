import { Router } from 'express';
import UsersController from '../controllers/UsersViewsController.js';
import { passportCall, authorization } from "../utils.js";
import { Devlogger } from "../config/logger_CUSTOM.js";



const router = Router();

//Ruta para borrar Usuarios inactivos (2Dias)
router.delete('/inactive', passportCall('jwt'), authorization(['ADMIN']), async (req, res) =>{
    try {
        await UsersController.DeleteInactiveUsers(req, res);
    } catch (error) {
        // Maneja el error de manera adecuada
        req.logger.error(`Error interno al eliminar usuarios: ${error.message}`);
        res.status(500).json({ error: "Error interno al eliminar usuarios" });
    }
});


//Ruta para borrar un usuario (Mail)
router.delete('/:mail', passportCall('jwt'), authorization(['ADMIN']), async (req, res) => {
    try {
        
        const email = req.params.mail;
        const result = await UsersController.DeleteUserByEmail(email);
        if (result.success) {
            req.logger.info(`Usuario eliminado: ${email}`);
            res.status(200).json(result.user);
        } else {
            req.logger.error(`Error al eliminar usuario: ${result.message}`);
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        // Maneja el error de manera adecuada, como registrar el error
        req.logger.error(`Error interno al eliminar usuario: ${error.message}`);
        // Devuelve un mensaje de error genérico al cliente
        res.status(500).json({ error: "Error interno al eliminar usuario" });
    }
});

//cambiar el roll del usuario (Mail)
router.post('/:mail', passportCall('jwt'), authorization(['ADMIN']), async (req, res) => {
    try {
    
        const email = req.params.mail;
        const result = await UsersController.changeUserRoleMail(req, res);
     
    } catch (error) {
        // Maneja el error de manera adecuada, como registrar el error
        req.logger.error(`Error interno : ${error.message}`);
     
    }
});







export default router;