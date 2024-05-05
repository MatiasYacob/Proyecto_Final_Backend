// Importación de módulos y archivos necesarios
import express, { Router } from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import Handlebars from "handlebars";
import config from './config/config.js';
import { addLogger } from './config/logger_CUSTOM.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';

// Rutas
import mokingRouter from './routes/mock.router.js'
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import usersViewRouter from './routes/users.views.router.js';
import viewsRouter from './routes/views.routes.js';
import sessionRouter from './routes/sessions.router.js';
import githubLoginViewRouter from './routes/githubLoginviewRouter.routes.js';
import jwtRouter from './routes/jwt.router.js';
import { __dirname, authorization, passportCall } from './utils.js';
import LoggerRouter from './routes/loggers.router.js';
import resetPasword from './routes/recuperarPassword.router.js'
//Custom router

import UsersExtendRouter from './routes/custom/custom.extend.router.js';


import MongoSingleton from './config/mongodb.singleton.js';

// Passport Initialization
import initializePassport from '../src/config/passport.config.js';

import {messageRepository} from './services/service.js'
import path from 'path';
// Configuración de Express

const app = express();
const port = config.port || 8080;

// URL de la base de datos de mongo
const MONGOURL = config.mongoUrl;

// Logger
app.use(addLogger);

// Inicialización de la aplicación y configuraciones
initializeApp(app, __dirname);

// Configuración de Express Session
app.use(
  session({
    store: new MongoStore({
      mongoUrl: MONGOURL,
      mongoOptions: {  },
      ttl: 10 * 60, // tiempo de vida de la sesión en segundos (10 minutos en este caso)
    }),
    secret: 'tu_secreto_aqui',
    resave: true,
    saveUninitialized: true,
  })
);

// Función para inicializar la aplicación
function initializeApp(app, __dirname) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('view engine', 'hbs');
  app.set('views', `${__dirname}/views`);
  app.use(express.static(path.join(__dirname, 'public')));
  console.log(__dirname);
}




// Passport Configuration
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser("CoderS3cr3tC0d3"));

// Configuración de Handlebars como motor de vistas
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);


// Función para inicializar la instancia de MongoDB
const mongoInstance = async () => {
  try {
      await MongoSingleton.getInstance()
  } catch (error) {
      console.log(error);
  }
}
mongoInstance()



// Definición de rutas para la API y las vistas
app.use('/api/product', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/users', usersViewRouter);
app.use('/github', githubLoginViewRouter);
app.use('/api/jwt', jwtRouter);
app.use('/resetPassword',resetPasword);
app.use('/',mokingRouter);
app.use('/', LoggerRouter);

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info:{
      title: "Documentacion API ",
      description: "Documentacion para uso de Swagger"
    }
  },
  apis:[`./src/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
// Declarar la API con la parte Grafica
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

// Custom router
const usersExtendRouter = new UsersExtendRouter();
app.use('/api/extend/api/users', usersExtendRouter.getRouter());

// Creación del servidor HTTP y Socket.IO
const httpServer = app.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`);
});


//Todo lo Referido a IO
const io = new Server(httpServer);
export { io };
const messages = [];

io.on("connection", async (socket) => {
    // Recuperar mensajes anteriores de la base de datos
    let allMessages = [];
    try {
        allMessages = await messageRepository.getAllMessages();
    } catch (error) {
        console.error('Error al obtener mensajes anteriores:', error);
    }

    // Agregar los mensajes recuperados de la base de datos a la matriz de mensajes
    messages.push(...allMessages);

    socket.on("newUser", (username) => {
      socket.broadcast.emit("userConnected", username);
    });
  
    socket.on("message", async (data) => {
        messages.push(data);
      
        
        io.emit("messages", messages);
        try {
            await messageRepository.addMessage(data);
            
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    });
  
    socket.emit("messages", messages);
});




export default app;
