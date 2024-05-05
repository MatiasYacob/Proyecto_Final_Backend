import { Router } from 'express';
import UsersController from '../controllers/UsersViewsController.js';
import { passportCall, authorization } from "../utils.js";




const router = Router();

router.delete('/:mail', passportCall('jwt'), authorization(['ADMIN','PREMIUM']), async (req, res) => {
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




export default router;