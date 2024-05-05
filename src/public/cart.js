
    // Función para eliminar un producto del carrito
    async function deleteProduct(productId) {
        try {
            const response = await fetch(`api/carts/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar el producto del carrito: ${response.status}`);
            }
            
            if (response.ok) {
                location.reload();
            }

            const data = await response.json();

            // Puedes realizar otras acciones después de eliminar el producto

            return data; // Puedes decidir si devolver algo específico desde el backend y manejarlo aquí

        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            // Manejar el error de alguna manera
        }
    }

    // Función para mostrar el cuadro de diálogo de confirmación con SweetAlert2
      function confirmPurchase() {
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();
    }

    // Función para realizar la compra
async function checkout() {
    // Mostrar indicador de carga mientras se procesa la compra
    Swal.showLoading();

    try {
        const response = await fetch(`api/carts/tickets/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text(); // Obtener el mensaje de error del cuerpo de la respuesta
            throw new Error(`Error al finalizar la compra: ${errorMessage}`);
        }

        const data = await response.json();
        console.log('Ticket Enviado:', data);

        // Ocultar indicador de carga
        Swal.hideLoading();

        // Mostrar mensaje de confirmación con SweetAlert2
        const result = await Swal.fire({
            title: 'Compra realizada',
            text: 'Se ha generado un ticket.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
        });

        // Si el usuario confirma, puedes realizar acciones adicionales
        if (result.isConfirmed) {
            // Puedes redirigir a otra página, recargar la página actual, etc.
            // En este ejemplo, simplemente recargamos la página para reflejar los cambios
            location.reload();
        }

    } catch (error) {
        console.error('Error al finalizar la Compra:', error);

        // Ocultar indicador de carga en caso de error
        Swal.hideLoading();

        // Mostrar un mensaje de error al usuario con SweetAlert2
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: obtenerMensajeError(error),
    }).then((result) => {
        // Después de hacer clic en el botón "Aceptar", recarga la página
        if (result.isConfirmed) {
            location.reload();
        }
    });
    }
}

// Función para obtener un mensaje más descriptivo del error del servidor
function obtenerMensajeError(error) {
    if (error.message.includes('No hay suficiente stock') || error.message.includes('fuera de stock')) {
        return 'No hay suficiente stock para completar la compra. Por favor, Consulta con tu vendedor.';
    }

    // Mostrar el mensaje de error específico del servidor
    return `Error del servidor: ${error.message}`;
}





