// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el formulario de inicio de sesión por su ID
    const loginForm = document.getElementById('login-form');

    // Agrega un evento de escucha para el envío del formulario
    loginForm.addEventListener('submit', function(event) {
        // Previene el comportamiento predeterminado de enviar el formulario
        event.preventDefault();

        // Obtiene los valores de correo electrónico y contraseña del formulario
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Realiza la autenticación directamente desde la base de datos de Firebase
        autenticarUsuario(email, password);
    });
});

// Función para autenticar al usuario directamente desde la base de datos de Firebase
function autenticarUsuario(email, password) {
    // Realiza una consulta a la base de datos de Firebase para obtener los usuarios
    const usersRef = firebase.firestore().collection('usuarios');
    
    // Realiza una consulta para encontrar al usuario con el correo electrónico dado
    usersRef.where('Email', '==', email).get()
        .then(function(querySnapshot) {
            if (!querySnapshot.empty) {
                querySnapshot.forEach(function(doc) {
                    // Verifica si la contraseña coincide
                    if (doc.data().Contraseña === password) {
                        // Credenciales válidas
                        // Obtener el ID del rol del usuario
                        const rolID = doc.data().RolID;
                        // Redirigir al usuario según su rol
                        redireccionarSegunRol(rolID);
                    } else {
                        // Contraseña incorrecta
                        console.error("Contraseña incorrecta");
                    }
                });
            } else {
                // Usuario no encontrado
                console.error("Usuario no encontrado");
            }
        })
        .catch(function(error) {
            console.error("Error al buscar usuario:", error);
        });
}

// Función para redirigir al usuario según su rol
function redireccionarSegunRol(RolID) {
    // Consulta la colección de roles para obtener el nombre del rol
    const rolesRef = firebase.firestore().collection('roles');

    // Realiza una consulta para encontrar el rol con el RolID dado
    rolesRef.doc(RolID).get()
        .then(function(doc) {
            if (doc.exists) {
                // Obtiene el nombre del rol
                const nombreRol = doc.data().NombreRol;
                // Redirecciona según el nombre del rol del usuario
                if (nombreRol === "Administrador") {
                    window.location.href = "dashboar-admin.html"; // Redireccionar al dashboard de administrador
                } else if (nombreRol === "Cliente") {
                    window.location.href = "index.html"; // Redireccionar al área de productos para clientes
                } else {
                    console.error("Rol no reconocido");
                }
            } else {
                console.error("Rol no encontrado");
            }
        })
        .catch(function(error) {
            console.error("Error al obtener el rol:", error);
        });
}
