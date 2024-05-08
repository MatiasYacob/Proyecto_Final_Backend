


const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/jwt/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            result.json()
                .then(json => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Login exitoso!',
                        text: 'Has iniciado sesión correctamente.',
                        confirmButtonText: 'Aceptar',
                        onClose: () => {
                            window.location.replace('/api/users');
                        }
                    });
                });
        } else if (result.status === 401) {
            
            Swal.fire({
                icon: 'error',
                title: 'Error de inicio de sesión',
                text: 'Credenciales inválidas. Por favor, verifica tus datos e intenta nuevamente.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});
