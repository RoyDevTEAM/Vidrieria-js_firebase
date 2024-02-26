// Constantes para paginación
const itemsPorPagina = 5;
let paginaActual = 1;

// Función para guardar un nuevo rol en la base de datos
function guardarNuevoRol() {
    const nombreRol = document.getElementById('nombreRol').value;

    // Validación: verificar que el campo no esté vacío
    if (nombreRol.trim() === '') {
        alert("Por favor, completa el nombre del rol.");
        return; // Detener la ejecución si hay campo vacío
    }

    db.collection("roles").add({
        NombreRol: nombreRol
    })
    .then(() => {
        console.log("Rol guardado exitosamente");
        obtenerRoles();
        // Cierra el modal después de guardar el rol
        $('#nuevoRolModal').modal('hide');
        // Limpiar el campo del formulario
        document.getElementById('nombreRol').value = '';
    })
    .catch((error) => {
        console.error("Error al guardar el rol: ", error);
    });
}

// Función para obtener todos los roles de la base de datos y mostrarlos en la tabla
function obtenerRoles() {
    db.collection("roles").get()
    .then((querySnapshot) => {
        const rolesTablaBody = document.getElementById('rolesTablaBody');
        rolesTablaBody.innerHTML = ''; // Limpiar contenido actual de la tabla
        let contador = 0;

        querySnapshot.forEach((doc) => {
            if (contador >= (paginaActual - 1) * itemsPorPagina && contador < paginaActual * itemsPorPagina) {
                const data = doc.data();
                const rolID = doc.id;
                const nombreRol = data.NombreRol;
                rolesTablaBody.innerHTML += `
                    <tr>
                        <td>${rolID}</td>
                        <td>${nombreRol}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="editarRol('${rolID}', '${nombreRol}')">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarRol('${rolID}')">Eliminar</button>
                        </td>
                    </tr>
                `;
            }
            contador++;
        });

        // Actualizar los botones de paginación
        actualizarPaginacion(querySnapshot.size);
    })
    .catch((error) => {
        console.error("Error al obtener roles: ", error);
    });
}

// Función para actualizar un rol existente en la base de datos
function actualizarRol(rolID, nombreRol) {
    db.collection("roles").doc(rolID).update({
        NombreRol: nombreRol
    })
    .then(() => {
        console.log("Rol actualizado exitosamente");
        // Muestra un mensaje de éxito
        alert("Rol actualizado exitosamente");
        // Actualiza la tabla de roles
        obtenerRoles();

        // Llama a la función para restablecer el modal
        restablecerModalNuevoRol();
    })
    .catch((error) => {
        console.error("Error al actualizar el rol: ", error);
    });
}

// Función para restablecer el modal para agregar un nuevo rol
function restablecerModalNuevoRol() {
    document.getElementById('nombreRol').value = '';
}

// Función para eliminar un rol de la base de datos
function eliminarRol(rolID) {
    // Mostrar una alerta de confirmación al usuario
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este rol?");
    
    // Verificar si el usuario confirmó la eliminación
    if (confirmacion) {
        // Eliminar el rol si el usuario confirma
        db.collection("roles").doc(rolID).delete()
        .then(() => {
            console.log("Rol eliminado exitosamente");
            alert("Rol eliminado exitosamente");
            // Actualiza la tabla de roles
            obtenerRoles();
        })
        .catch((error) => {
            console.error("Error al eliminar el rol: ", error);
            alert("Error al eliminar el rol");
        });
    } else {
        // No hacer nada si el usuario cancela la eliminación
        console.log("Eliminación cancelada por el usuario");
    }
}

// Función para cargar los datos de un rol en el modal de edición
function editarRol(rolID, nombreRol) {
    // Llenar el campo del formulario con los datos del rol a editar
    document.getElementById('nombreRol').value = nombreRol;

    // Cambiar el texto del botón de guardar
    document.getElementById('guardarRolBtn').textContent = 'Actualizar';
    
    // Remover el evento de clic anterior del botón de guardar
    $('#guardarRolBtn').off('click');

    // Crear un nuevo evento de clic al botón de guardar para actualizar el rol
    document.getElementById('guardarRolBtn').onclick = function() {
        const nuevoNombreRol = document.getElementById('nombreRol').value;
        actualizarRol(rolID, nuevoNombreRol);
        // Cierra el modal después de actualizar el rol
        $('#nuevoRolModal').modal('hide');
        // Limpiar el campo del formulario
        document.getElementById('nombreRol').value = '';
        // Cambiar el texto del botón de guardar de vuelta a "Guardar"
        document.getElementById('guardarRolBtn').textContent = 'Guardar';
    };

    // Mostrar el modal de edición
    $('#nuevoRolModal').modal('show');
}

// Función para actualizar los botones de paginación
function actualizarPaginacion(totalItems) {
    const paginacion = document.getElementById('paginacionRoles');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `
            <li class="page-item ${i === paginaActual ? 'active' : ''}">
                <a class="page-link" href="#" onclick="cambiarPagina(${i})">${i}</a>
            </li>
        `;
    }
}

// Función para cambiar de página
function cambiarPagina(numeroPagina) {
    paginaActual = numeroPagina;
    obtenerRoles();
}

// Función para buscar roles por nombre
document.getElementById('busquedaRol').addEventListener('keyup', function() {
    const busqueda = this.value.toLowerCase();
    const filas = document.querySelectorAll('#rolesTablaBody tr');

    filas.forEach(function(fila) {
        const nombreRol = fila.childNodes[3].textContent.toLowerCase();

        if (nombreRol.includes(busqueda)) {
            fila.style.display = 'table-row';
        } else {
            fila.style.display = 'none';
        }
    });
});

// Obtener los roles al cargar la página
window.onload = function() {
    obtenerRoles();
};
