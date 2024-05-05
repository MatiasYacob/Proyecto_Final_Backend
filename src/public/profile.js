
function uploadDocuments() {
    const filesInput = document.getElementById('documents');
    const files = filesInput.files;

    // Verificar si no se han seleccionado archivos
    if (files.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor selecciona al menos un archivo para subir.',
            showConfirmButton: true,
        });
        return; // Salir de la función
    }

    Swal.showLoading(); // Mostrar carga visual

    const userId = "{{user._id}}"; // Obtener el ID del usuario
    const formData = new FormData(); // Crear objeto FormData para enviar archivos

    // Nombres permitidos de documentos (sin extensión)
    const allowedDocumentNames = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];

    // Función para obtener el nombre base del archivo (sin extensión)
    function getBaseName(fileName) {
        return fileName.split('.').slice(0, -1).join('.');
    }

    // Recorrer todos los archivos seleccionados
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name; // Obtener el nombre del archivo
        const baseFileName = getBaseName(fileName); // Obtener el nombre base del archivo

        // Verificar si el nombre base del archivo está en la lista de nombres permitidos
        if (allowedDocumentNames.includes(baseFileName)) {
            formData.append('documents', file); // Agregar archivo al FormData
        } else {
            // Mostrar mensaje de error si el nombre del archivo no es permitido
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `El archivo "${fileName}" no es válido. Por favor, selecciona archivos Validos.`,
                showConfirmButton: true,
            });
            return; // Salir de la función
        }
    }

    // Enviar la solicitud POST con los archivos al endpoint
    fetch(`/api/users/${userId}/documents`, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al subir documentos');
            }
            return response.json();
        })
        .then(data => {
            console.log('Documentos subidos correctamente:', data);
            Swal.fire({
                icon: 'success',
                title: 'Documentos subidos correctamente',
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload(); // Recargar la página
                }
            });
        })
        .catch(error => {
            console.error('Error al subir documentos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al subir documentos',
                text: 'Ocurrió un error al subir los documentos. Por favor, inténtalo de nuevo más tarde.',
                showConfirmButton: true,
            });
        })
        .finally(() => {
            Swal.hideLoading(); // Ocultar carga visual al finalizar, ya sea con éxito o error
        });
}


document.getElementById('changeRoleButton').addEventListener('click', function () {
    const userId = "{{user._id}}"; // Obtener el ID del usuario de Handlebars

    fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // No necesitamos enviar ningún cuerpo en este caso
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cambiar el rol del usuario');
            }
            return response.json();
        })
        .then(data => {
            // Actualizar dinámicamente el contenido del rol
            const userRoleElement = document.getElementById('userRole');
            if (userRoleElement) {
                userRoleElement.innerHTML = `<strong>Rol:</strong> ${data.user.role}`;
            }
            console.log('Rol del usuario cambiado correctamente:', data);
        })
        .catch(error => {
            console.error('Error al cambiar el rol del usuario:', error);
            // Manejar el error si es necesario
        });
});


document.getElementById('logoutButton').addEventListener('click', function () {
    // Realizar la acción de cierre de sesión aquí
    // Por ejemplo, realizar una solicitud POST a la ruta de cierre de sesión
    fetch('/api/sessions/logout/', {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cerrar sesión');
            }
            // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
            window.location.href = 'users/login'; // Cambia '/login' por la URL de tu página de inicio de sesión
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
            // Manejar el error si es necesario
        });
});
