import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import multer from "multer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


 
//Confuguracion de multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '';
        if (file.fieldname === 'profileImage') {
            uploadPath = `${__dirname}/uploads/profiles/`;
        } else if (file.fieldname === 'productImage') {
            uploadPath = `${__dirname}/uploads/products/`;
        } else {
            uploadPath = `${__dirname}/uploads/documents/`;
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const uploader = multer({
    storage,
    onError: function (err, next){
        next();
    }
})









// Generamos el hash
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Validamos el hash
export const isValidPassword = (user, password) => {
  
    return bcrypt.compareSync(password, user.password);
}

// JWT
export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT"

export const generateJWToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "7d" });
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
   
    if (!authHeader) {
        return res.status(401).send({ error: "User pato Not Authenticated or missing token." })
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) {
           
            return res.status(403).send({ error: "Token invalid, Unauthorized!" })
        }
        // Token ok
        req.user = credentials.user;
        
        next();
    })
}

// Para passportCall
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        try {
            await passport.authenticate(strategy, function (err, user, info) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
                }
                req.user = user;
                next();
            })(req, res, next);
        } catch (error) {
            // Devlogger.error("Error en passportCall:", error);
            next(error);
        }
    };
};

export const authorization = (role) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                // Si el usuario no está autenticado, puedes redirigirlo o renderizar la vista de error
                // Puedes ajustar esto según tus necesidades
                return res.status(401).render('error.hbs', { error: 'Unauthorized: User not found in JWT' });
            }

            if (!role.includes(req.user.role.toUpperCase())) {
              
                return res.status(403).render('error.hbs', { error: 'Forbidden: El usuario no tiene permisos con este rol.' });
            }

            next();
        } catch (error) {
         
            return res.status(500).render('error.hbs', { error: 'Internal Server Error' });
        }
    };
};

// Exportar __dirname al final
export { __dirname };
