import userModel from "./models/user.model.js";
import {createHash} from "../../../utils.js";
 class UserService {
    constructor(){
        console.log("Calling users model using a service.");
    };  
   
    Register = async (user) => {
        try {
            const exist = await userModel.findOne({ email: user.email });
            console.log("Calling users model using a service.");

            if (exist) {
                console.log("El usuario ya existe");
                return { success: false, message: "El usuario ya existe" };
            }

            const newUser = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                password: createHash(user.password),
            };

            const result = await userModel.create(newUser);

            console.log(result);
            return { success: true, message: "Registro exitoso", user: result };
        } catch (error) {
            console.error("Error registrando usuario:", error);
            return { success: false, message: "Error registrando usuario" };
        }
    };

    updateLastConnection = async (userId) => {
        try {
            const user = await userModel.findById(userId);

            if (!user) {
                console.log("El usuario no existe" + userId);
                return { success: false, message: "El usuario no existe" };
            }

            // Actualizar la propiedad last_connection
            user.last_connection = new Date();

            // Guardar los cambios en la base de datos
            await user.save();

            console.log("Última conexión actualizada correctamente");
            return { success: true, message: "Última conexión actualizada correctamente" };
        } catch (error) {
            console.error("Error al actualizar la última conexión:", error);
            return { success: false, message: "Error al actualizar la última conexión" };
        }
    };





    
    findByUsername = async (username) => {
        const result = await userModel.findOne({email: username});
        return result;
    };
  

    updateDocuments = async (userId, documents) => {
        try {
            // Buscar el usuario por su ID
            const user = await userModel.findById(userId);
    
            if (!user) {
                console.log("El usuario no existe");
                return { success: false, message: "El usuario no existe" };
            }
    
            // Asignar un nombre específico a cada archivo
            const namedDocuments = documents.map(document => ({
                name: `${document.originalname}_${user.email}`, // Nombre del documento = nombre original + email del usuario
                reference: document.path // Guardar la referencia al documento en el sistema de archivos
            }));
    
            // Actualizar el contenido del campo documents
            user.documents.push(...namedDocuments);
    
            // Guardar los cambios en la base de datos
            await user.save();
    
            console.log("Documentos actualizados correctamente");
            return { success: true, message: "Documentos actualizados correctamente" };
        } catch (error) {
            console.error("Error al actualizar documentos:", error);
            return { success: false, message: "Error al actualizar documentos" };
        }
    };
    



};

export default UserService;