
    async function AddProductToCart(productId) {
    try {
        

        const response = await fetch(`api/carts/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al agregar el producto al carrito: ${response.status}`);
        }

        const data = await response.json();
        console.info('Producto agregado al carrito:', data);

        // Show success toast using SweetAlert
           await Swal.fire({
            icon: 'success',
            title: 'Producto agregado al carrito',
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            toast:true
        });

        // Realizar acciones adicionales si es necesario, por ejemplo, actualizar la interfaz de usuario

    } catch (error) {
        
        await Swal.fire({
        title: 'Error al agregar el producto al carrito',
        text: error.message || 'Ocurrió un error inesperado',
        icon: 'error',
        confirmButtonText: 'Aceptar',
    });

        // Manejar el error de alguna manera, por ejemplo, mostrar un mensaje de error al usuario
    }
}

