// routes/cart.router.js

import { Router } from 'express';
import * as CartController from '../controllers/CartController.js';
import * as TicketController from '../controllers/TicketController.js'
import { passportCall, authorization } from "../utils.js";
import errorHandler from "../services/errors/middlewares/ErrorMiddleware.js"
import { Devlogger } from "../config/logger_CUSTOM.js";
const router = Router();




router.post('/tickets/create', passportCall('jwt'), authorization(['USUARIO','PREMIUM']), TicketController.createTicket);

router.post('/:productId', passportCall('jwt'), authorization(['USUARIO','PREMIUM']), CartController.AddProductToCart);

router.delete('/:productId', passportCall('jwt'), authorization(['USUARIO','PREMIUM']), CartController.removeProductFromCart);





router.use(errorHandler)

export default router;
