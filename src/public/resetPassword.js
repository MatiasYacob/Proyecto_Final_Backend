document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario

    const formData = new FormData(event.target); // Obtener los datos del formulario

    // Obtener las contraseñas del formulario
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // Verificar si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'OK'
        });
        return; // Detener el proceso si las contraseñas no coinciden
    }
        Swal.showLoading();
    try {
        const response = await fetch('/resetPassword/reset-password', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            await Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: data.message,
                confirmButtonText: 'OK',
                onClose: () => {
                    window.location.href = '/api/users/login';
                }
            });
        } else {
            const errorData = await response.json();
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorData.error || 'Error al restablecer la contraseña. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al restablecer la contraseña. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'OK'
        });
    }
});