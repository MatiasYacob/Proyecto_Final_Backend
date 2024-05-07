
      //funcion para validar el

      function validateAndSubmit() {
        // Obtener valores de los campos
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const thumbnails = document.getElementById('thumbnails').value;
        const code = document.getElementById('code').value;
        const stock = document.getElementById('stock').value;

        // Validar que todos los campos estén llenos
        if (!title || !description || !price || !thumbnails || !code || !stock) {
            Swal.fire({
                icon: 'error',
                title: 'Por favor, complete todos los campos obligatorios.',
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }

        // Llamar a la función para enviar el formulario si todos los campos están llenos
        submitForm();
    }

    
//Funcion para borrar producto
async function deleteProduct(productId) {
    try {
        // Mostrar confirmación antes de borrar el producto
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            // Mostrar ventana de carga
            Swal.fire({
                title: 'Eliminando producto...',
                showConfirmButton: false,
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });

            // Hacer una solicitud DELETE al servidor
            const response = await fetch(`/api/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Aquí podrías incluir el token JWT si es necesario para la autenticación
                    // 'Authorization': 'Bearer ' + tuTokenJWT,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar el producto: ${response.status}`);
            }

            const data = await response.json();

            // Ocultar la ventana de carga
            Swal.close();

            if (data) {
                location.reload();
            }

            // Puedes realizar otras acciones aquí después de borrar el producto
        }
    } catch (error) {
        console.error('Error al eliminar el producto de la BD:', error);
        // Mostrar SweetAlert 2 en caso de error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No tienes permiso para borrar el producto.',
        });
    }
}





   async function submitForm() {
        try {
            const form = document.getElementById('productForm');
            const formData = new FormData(form);

            const response = await fetch('api/product/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (!response.ok) {
                throw new Error(`Error al agregar el producto: ${response.status}`);
            }

            const data = await response.json();
            if(data){
              // Mostrar una alerta de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado exitosamente.',
                html: `
                <p>Información del producto:</p>
                <ul>
                    <li><strong>Título:</strong> ${formData.get('title')}</li>
                    <li><strong>Descripción:</strong> ${formData.get('description')}</li>
                    <li><strong>Precio:</strong> ${formData.get('price')}</li>
                    <!-- Agrega más campos según tus necesidades -->
                </ul>
            `,
                showConfirmButton: true,
                
            }).then(() => {
                // Recargar la página después de que la alerta de éxito desaparezca
                location.reload();
            });
            }
            

            // Puedes realizar otras acciones aquí después de agregar el producto

        } catch (error) {
            console.error('Error al agregar el producto:', error);

            // Mostrar una alerta de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error al agregar el producto.',
                showConfirmButton: false,
                timer: 2000
            });

            // Manejar el error de alguna manera
        }
    }


