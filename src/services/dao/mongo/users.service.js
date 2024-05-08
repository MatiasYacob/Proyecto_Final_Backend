import userModel from "./models/user.model.js";
import {createHash} from "../../../utils.js";
import { sendEmail } from "../../../controllers/EmailController.js";
import { Devlogger } from "../../../config/logger_CUSTOM.js";
 class UserService {
    constructor(){
        
    };  
   
    getAll = async () => {
        try {
            // Utiliza el método find de userModel para obtener todos los usuarios
            const users = await userModel.find({}, { email: 1, age: 1,role: 1, documents: 1, last_connection: 1 });
            
            // Retorna la lista de usuarios obtenida
            return { success: true, message: "Usuarios obtenidos correctamente", users };
        } catch (error) {
            // Manejo de errores en caso de fallo al obtener usuarios
            return { success: false, message: "Error al obtener usuarios" };
        }
    };
    


    Register = async (user) => {
        try {
            const exist = await userModel.findOne({ email: user.email });
            

            if (exist) {
                
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

            
            return { success: true, message: "Registro exitoso", user: result };
        } catch (error) {
            
            return { success: false, message: "Error registrando usuario" };
        }
    };

    updateLastConnection = async (userId) => {
        try {
            const user = await userModel.findById(userId);

            if (!user) {
               
                return { success: false, message: "El usuario no existe" };
            }

            // Actualizar la propiedad last_connection
            user.last_connection = new Date();

            // Guardar los cambios en la base de datos
            await user.save();

            
            return { success: true, message: "Última conexión actualizada correctamente" };
        } catch (error) {
            
            return { success: false, message: "Error al actualizar la última conexión" };
        }
    };

    //Borrar usuario 
    deleteUserByEmail = async (email) => {
        try {
            const deletedUser = await userModel.findOneAndDelete({ email });
            if (!deletedUser) {
                return { success: false, message: "Usuario no encontrado" };
            }
            return { success: true, message: "Usuario eliminado correctamente", user: deletedUser };
        } catch (error) {
            return { success: false, message: "Error al eliminar usuario" };
        }
    };
    // borrar usuarios inactivos (2 dias)
    
    deleteInactiveUsers = async () => {
        try {
            Devlogger.info("Iniciando la eliminación de usuarios inactivos...");
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            Devlogger.info("Fecha de referencia para la eliminación:", twoDaysAgo);
            
            // Obtener usuarios inactivos que deben ser eliminados
            const usersToDelete = await userModel.find({ 
                $or: [
                    { last_connection: { $exists: true, $lt: twoDaysAgo } }, // Usuarios con last_connection y son mayores que dos días
                    { last_connection: { $exists: false } } // Usuarios que no tienen el campo last_connection
                ]
            });
    
            if (usersToDelete.length === 0) {
                Devlogger.info("No se encontraron usuarios inactivos para eliminar.");
                return { success: true, message: "No se encontraron usuarios inactivos para eliminar." };
            } else {
                // Obtener los correos electrónicos de los usuarios a eliminar
                const emailsToDelete = usersToDelete.map(user => user.email);
    
                // Enviar correos electrónicos a los usuarios antes de eliminarlos
                for (const email of emailsToDelete) {
                    await sendEmail(email, 'Eliminación de cuenta por inactividad', 'Tu cuenta ha sido eliminada debido a la inactividad durante un largo período de tiempo.');
                    Devlogger.info(`Correo electrónico enviado a ${email}`);
                }
    
                // Eliminar usuarios inactivos
                const deletedUsers = await userModel.deleteMany({ _id: { $in: usersToDelete.map(user => user._id) } });
                Devlogger.info(`${deletedUsers.deletedCount} usuarios eliminados correctamente.`);
                return { success: true, message: `${deletedUsers.deletedCount} usuarios eliminados correctamente.` };
            }
        } catch (error) {
            Devlogger.error("Error al eliminar usuarios inactivos:", error);
            return { success: false, message: "Error al eliminar usuarios inactivos" };
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
                Devlogger.info("El usuario no existe");
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
    
            Devlogger.info("Documentos actualizados correctamente");
            return { success: true, message: "Documentos actualizados correctamente" };
        } catch (error) {
            Devlogger.error("Error al actualizar documentos:", error);
            return { success: false, message: "Error al actualizar documentos" };
        }
    };
    



};

export default UserService;