import userModel from '../services/dao/mongo/models/user.model.js';
import {userRepository} from '../services/service.js';

const UsersController = {};






// Controlador para obtener todos los usuarios
UsersController.GetAllUsers = async (req, res) => {
    try {
        // Obtiene todos los usuarios desde el repositorio
        const allUsers = await userRepository.getAll();
        if (allUsers.success) {
            // Si la obtención de usuarios fue exitosa, renderiza la plantilla 'admin' y pasa los usuarios obtenidos como datos
            res.render('admin', { users: allUsers.users });
        } else {
            // Si hubo un error al obtener usuarios, renderiza una página de error o maneja el error de alguna otra manera
            res.render('error', { message: allUsers.message });
        }
    } catch (error) {
        // Si ocurrió un error durante el proceso, renderiza una página de error o maneja el error de alguna otra manera
        res.render('error', { message: "Error al obtener usuarios" });
    }
}

// Eliminar usuario por correo electrónico
// Eliminar usuario por correo electrónico
UsersController.DeleteUserByEmail = async (email) => {
    try {
        const result = await userRepository.deleteUserByEmail(email);
        return result; // Devuelve el resultado de la eliminación de usuario
    } catch (error) {
        return { success: false, message: "Error al eliminar usuario" }; // Devuelve un objeto indicando que ocurrió un error
    }
};


// Eliminar usuarios inactivos
UsersController.DeleteInactiveUsers = async (req, res) => {
    try {
        const result = await userRepository.deleteInactiveUsers();
        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuarios inactivos" });
    }
};





//Upload
UsersController.uploadDoc = async (req, res) =>{
    const userId = req.params.userId;
    

    try {
        // Obtener el usuario por ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado con ID: " + userId });
        }

        const Update = await userRepository.updateDocs(userId, documents)
        

        // Enviar la respuesta con el usuario actualizado
        res.status(200).json({ message: "ok", user });
    } catch (error) {
        console.error("Error al cambiar el rol del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

}

// Renderiza la vista de inicio de sesión
UsersController.renderLogin = (req, res) => {
    res.render('login');
};

// Renderiza la vista de registro
UsersController.renderRegister = (req, res) => {
    res.render('register');
};

// Renderiza la vista del perfil de usuario
UsersController.renderProfile = (req, res) => {
    res.render("profile", {
        user: req.user
    });
};

UsersController.changeUserRole = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Obtener el usuario por ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado con ID: " + userId });
        }

        // Determinar el nuevo rol opuesto al actual
        const newRole = user.role === "usuario" ? "premium" : "usuario";

        // Actualizar el rol del usuario
        user.role = newRole;
        await user.save();

        // Enviar la respuesta con el usuario actualizado
        res.clearCookie('jwtCookieToken');
        res.status(200).json({ message: "Rol de usuario actualizado correctamente", user });
       
    } catch (error) {
        console.error("Error al cambiar el rol del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

UsersController.changeUserRoleDocs = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Obtener el usuario por ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado con ID: " + userId });
        }

        // Verificar si el usuario tiene el rol "usuario"
        if (user.role === "usuario") {
            
            // Verificar si el usuario tiene todos los documentos requeridos
            const requiredDocuments = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
            const userDocuments = user.documents.map(doc => {
                const parts = doc.name.split('.'); // Divide el nombre del documento por el guión bajo
                return parts[0]; // Devuelve la primera parte (nombre del documento sin el email)
            });
            
            const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));
            
            if (!hasAllDocuments) {
                
                return res.status(400).json({ message: "El usuario debe cargar todos los documentos requeridos antes de actualizar su rol a premium" });
            }

        }

        // Determinar el nuevo rol opuesto al actual
        const newRole = user.role === "usuario" ? "premium" : "usuario";

        // Actualizar el rol del usuario
        user.role = newRole;
        await user.save();

        // Enviar la respuesta con el usuario actualizado
        res.status(200).json({ message: "Rol de usuario actualizado correctamente", user });
    } catch (error) {
        console.error("Error al cambiar el rol del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};




// Obtiene información del usuario por ID
UsersController.getUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found with ID: " + userId });
        }

        res.json(user);
    } catch (error) {
        console.error("Error consultando el usuario con ID: " + userId);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default UsersController;
