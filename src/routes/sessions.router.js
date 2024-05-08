import { Router } from "express";
import SessionsController from "../controllers/SessionsController.js";
import jwt from 'jsonwebtoken';
import { passportCall, authorization } from "../utils.js";
import { Devlogger } from "../config/logger_CUSTOM.js";

const router = Router();


// Passport local - Registro
router.post('/register', SessionsController.register, (req, res) => {
    Devlogger.info("Registrando usuario:");
    // Puedes manejar la respuesta aquí y decidir si redirigir o enviar otra respuesta.
    res.status(201).send("Registro exitoso");
});

// Logout
router.post("/logout", passportCall('jwt'), authorization(['ADMIN', 'USUARIO','PREMIUM']), async (req, res) => {
    try {
        
        await SessionsController.logout(req, res);
        res.clearCookie('jwtCookieToken');
    } catch (error) {
        req.logger.error('Error al Desloguear', error);
        res.status(500).send('Error interno del servidor');
    }
});



//Current
router.get('/current', async (req, res) => {
    const cookie = req.cookies['jwtCookieToken']; 
    if (!cookie) {
        return res.status(401).send({ status: "error", message: "Cookie 'jwtCookieToken' no encontrada." });
    }

    try {
        const user = jwt.verify(cookie, "CoderhouseBackendCourseSecretKeyJWT");
        
        if (user) {
            return res.send({ status: "success", payload: user });
        }
    } catch (error) {
        return res.status(401).send({ status: "error", message: "Token no válido." });
    }
});


// Error en el registro
router.get("/fail-register", SessionsController.failRegister);

// Error en el inicio de sesión
router.get("/fail-login", SessionsController.failLogin);

export default router;
