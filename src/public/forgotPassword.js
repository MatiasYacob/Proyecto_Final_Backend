
document.getElementById('forgotPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario

    const formData = new FormData(event.target); // Obtener los datos del formulario

    const email = formData.get('email'); // Obtener el valor del campo de entrada de correo electrónico

    console.info('Correo electrónico ingresado:', email); // Mostrar el correo electrónico en la consola
    Swal.showLoading();
    try {
        // Mostrar ventana de carga mientras se espera la respuesta del servidor
       

        const response = await fetch('/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        if (response.ok) {
            const data = await response.json();
            console.info(data); // Hacer algo con la respuesta del servidor (opcional)
            // Mostrar SweetAlert2 de éxito
            await Swal.fire({
                icon: 'success',
                title: 'Correo enviado',
                text: 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.',
            });
        } else {
            console.error('Error en la solicitud:', response.status);
            // Mostrar SweetAlert2 de error
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.',
            });
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        // Mostrar SweetAlert2 de error
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.',
        });
    }
});
