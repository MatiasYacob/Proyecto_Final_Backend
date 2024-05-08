// Secuencia de teclas dese



        // Inicializar tooltips de Bootstrap
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        // Agregar evento para el botón de borrar usuario
        $('.user-delete-button').on('click', function () {
            const userEmail = $(this).data('user-email');
            // Mostrar el mensaje de confirmación
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Realizar la solicitud de eliminación si se confirma
                        const response = await fetch(`/api/admin/${userEmail}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        if (response.ok) {
                            // Si la eliminación fue exitosa, mostrar un mensaje de éxito
                            Swal.fire(
                                '¡Eliminado!',
                                'El usuario ha sido eliminado.',
                                'success'
                            ).then(() => {
                                // Recargar la página para reflejar los cambios
                                window.location.reload();
                            });
                        } else {
                            // Si hay un error en la eliminación, mostrar un mensaje de error
                            Swal.fire(
                                'Error',
                                'No se pudo eliminar el usuario.',
                                'error'
                            );
                        }
                    } catch (error) {
                        // Si hay un error en la solicitud, mostrar un mensaje de error
                        Swal.fire(
                            'Error',
                            'No se pudo eliminar el usuario.',
                            'error'
                        );
                    }
                }
            });
        });
        //Cambiar roll de usuario
        $('.user-role-button').on('click', function () {
    const userEmail = $(this).data('user-email');
    // Mostrar el mensaje de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Se Cambiara el Rol del Usuario!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar rol'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Realizar la solicitud para cambiar el rol si se confirma
                const response = await fetch(`/api/admin/${userEmail}`, {
                    method: 'POST', // Utiliza el método POST para cambiar el rol
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    // Si la operación fue exitosa, mostrar un mensaje de éxito
                    Swal.fire(
                        '¡Rol Cambiado!',
                        'El rol del usuario ha sido cambiado.',
                        'success'
                    ).then(() => {
                        // Recargar la página para reflejar los cambios
                        window.location.reload();
                    });
                } else {
                    // Si hay un error, mostrar un mensaje de error
                    Swal.fire(
                        'Error',
                        'No se pudo cambiar el rol del usuario.',
                        'error'
                    );
                }
            } catch (error) {
                // Si hay un error en la solicitud, mostrar un mensaje de error
                Swal.fire(
                    'Error',
                    'No se pudo cambiar el rol del usuario.',
                    'error'
                );
            }
        }
    });
});





        //borrar usuarios inactivos 
        function borrarUsuariosInactivos() {
    // Mostrar el mensaje de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar inactivos'
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Mostrar el modal de carga
            Swal.fire({
                title: 'Cargando...',
                text: 'Por favor, espera mientras se eliminan los usuarios inactivos.',
                showConfirmButton: false,
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                // Realizar la solicitud DELETE para eliminar usuarios inactivos
                const response = await fetch('/api/admin/inactive', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Ocultar el modal de carga
                Swal.close();

                if (response.ok) {
                    // Si la eliminación fue exitosa, mostrar un mensaje de éxito
                    Swal.fire(
                        '¡Eliminados!',
                        'Los usuarios inactivos han sido eliminados.',
                        'success'
                    ).then(() => {
                        // Recargar la página para reflejar los cambios
                        window.location.reload();
                    });
                } else {
                    // Si hay un error en la eliminación, mostrar un mensaje de error
                    Swal.fire(
                        'Error',
                        'No se pudieron eliminar los usuarios inactivos.',
                        'error'
                    );
                }
            } catch (error) {
                // Si hay un error en la solicitud, mostrar un mensaje de error
                Swal.fire(
                    'Error',
                    'No se pudieron eliminar los usuarios inactivos.',
                    'error'
                );
            }
        }
    });
}