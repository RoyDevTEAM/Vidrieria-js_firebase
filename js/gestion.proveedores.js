// Constantes para paginación
const itemsPorPagina = 5;
let paginaActual = 1;

// Función para guardar un nuevo proveedor en la base de datos
function guardarNuevoProveedor() {
    const nombreEmpresa = document.getElementById('nombreEmpresa').value;
    const contactoNombre = document.getElementById('contactoNombre').value;
    const contactoEmail = document.getElementById('contactoEmail').value;
    const contactoTelefono = document.getElementById('contactoTelefono').value;

    // Validación: verificar que los campos no estén vacíos
    if (nombreEmpresa.trim() === '' || contactoNombre.trim() === '' || contactoEmail.trim() === '') {
        alert("Por favor, completa todos los campos obligatorios.");
        return; // Detener la ejecución si hay campos vacíos
    }

    db.collection("proveedores").add({
        NombreEmpresa: nombreEmpresa,
        ContactoNombre: contactoNombre,
        ContactoEmail: contactoEmail,
        ContactoTelefono: contactoTelefono
    })
    .then(() => {
        console.log("Proveedor guardado exitosamente");
        obtenerProveedores();
        // Cierra el modal después de guardar el proveedor
        $('#nuevoProveedorModal').modal('hide');
        // Limpiar los campos del formulario
        document.getElementById('nombreEmpresa').value = '';
        document.getElementById('contactoNombre').value = '';
        document.getElementById('contactoEmail').value = '';
        document.getElementById('contactoTelefono').value = '';
    })
    .catch((error) => {
        console.error("Error al guardar el proveedor: ", error);
    });
}

// Función para obtener todos los proveedores de la base de datos y mostrarlos en la tabla
function obtenerProveedores() {
    db.collection("proveedores").get()
    .then((querySnapshot) => {
        const proveedoresTablaBody = document.getElementById('proveedoresTablaBody');
        proveedoresTablaBody.innerHTML = ''; // Limpiar contenido actual de la tabla
        let contador = 0;

        querySnapshot.forEach((doc) => {
            if (contador >= (paginaActual - 1) * itemsPorPagina && contador < paginaActual * itemsPorPagina) {
                const data = doc.data();
                const proveedorID = doc.id;
                const nombreEmpresa = data.NombreEmpresa;
                const contactoNombre = data.ContactoNombre;
                const contactoEmail = data.ContactoEmail;
                const contactoTelefono = data.ContactoTelefono;
                proveedoresTablaBody.innerHTML += `
                    <tr>
                        <td>${proveedorID}</td>
                        <td>${nombreEmpresa}</td>
                        <td>${contactoNombre}</td>
                        <td>${contactoEmail}</td>
                        <td>${contactoTelefono}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="editarProveedor('${proveedorID}', '${nombreEmpresa}', '${contactoNombre}', '${contactoEmail}', '${contactoTelefono}')">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarProveedor('${proveedorID}')">Eliminar</button>
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
        console.error("Error al obtener proveedores: ", error);
    });
}

// Función para actualizar un proveedor existente en la base de datos
function actualizarProveedor(proveedorID, nombreEmpresa, contactoNombre, contactoEmail, contactoTelefono) {
    db.collection("proveedores").doc(proveedorID).update({
        NombreEmpresa: nombreEmpresa,
        ContactoNombre: contactoNombre,
        ContactoEmail: contactoEmail,
        ContactoTelefono: contactoTelefono
    })
    .then(() => {
        console.log("Proveedor actualizado exitosamente");
        // Muestra un mensaje de éxito
        alert("Proveedor actualizado exitosamente");
        // Actualiza la tabla de proveedores
        obtenerProveedores();

        // Llama a la función para restablecer el modal
        restablecerModalNuevoProveedor();
    })
    .catch((error) => {
        console.error("Error al actualizar el proveedor: ", error);
    });
}

// Función para restablecer el modal para agregar un nuevo proveedor
function restablecerModalNuevoProveedor() {
    document.getElementById('nombreEmpresa').value = '';
    document.getElementById('contactoNombre').value = '';
    document.getElementById('contactoEmail').value = '';
    document.getElementById('contactoTelefono').value = '';
}

// Función para eliminar un proveedor de la base de datos
function eliminarProveedor(proveedorID) {
    // Mostrar una alerta de confirmación al usuario
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este proveedor?");
    
    // Verificar si el usuario confirmó la eliminación
    if (confirmacion) {
        // Eliminar el proveedor si el usuario confirma
        db.collection("proveedores").doc(proveedorID).delete()
        .then(() => {
            console.log("Proveedor eliminado exitosamente");
            alert("Proveedor eliminado exitosamente");
            // Actualiza la tabla de proveedores
            obtenerProveedores();
        })
        .catch((error) => {
            console.error("Error al eliminar el proveedor: ", error);
            alert("Error al eliminar el proveedor");
        });
    } else {
        // No hacer nada si el usuario cancela la eliminación
        console.log("Eliminación cancelada por el usuario");
    }
}

// Función para cargar los datos de un proveedor en el modal de edición
function editarProveedor(proveedorID, nombreEmpresa, contactoNombre, contactoEmail, contactoTelefono) {
    // Llenar los campos del formulario con los datos del proveedor a editar
    document.getElementById('nombreEmpresa').value = nombreEmpresa;
    document.getElementById('contactoNombre').value = contactoNombre;
    document.getElementById('contactoEmail').value = contactoEmail;
    document.getElementById('contactoTelefono').value = contactoTelefono;

    // Cambiar el texto del botón de guardar
    document.getElementById('guardarProveedorBtn').textContent = 'Actualizar';
    
    // Remover el evento de clic anterior del botón de guardar
    $('#guardarProveedorBtn').off('click');

    // Crear un nuevo evento de clic al botón de guardar para actualizar el proveedor
    document.getElementById('guardarProveedorBtn').onclick = function() {
        const nuevoNombreEmpresa = document.getElementById('nombreEmpresa').value;
        const nuevoContactoNombre = document.getElementById('contactoNombre').value;
        const nuevoContactoEmail = document.getElementById('contactoEmail').value;
        const nuevoContactoTelefono = document.getElementById('contactoTelefono').value;
        actualizarProveedor(proveedorID, nuevoNombreEmpresa, nuevoContactoNombre, nuevoContactoEmail, nuevoContactoTelefono);
        // Cierra el modal después de actualizar el proveedor
        $('#nuevoProveedorModal').modal('hide');
        // Limpiar los campos del formulario
        restablecerModalNuevoProveedor();
        // Cambiar el texto del botón de guardar de vuelta a "Guardar"
        document.getElementById('guardarProveedorBtn').textContent = 'Guardar';
    };

    // Mostrar el modal de edición
    $('#nuevoProveedorModal').modal('show');
}

// Función para actualizar los botones de paginación
function actualizarPaginacion(totalItems) {
    const paginacion = document.getElementById('paginacionProveedores');
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
    obtenerProveedores();
}

// Función para buscar proveedores por nombre de empresa
document.getElementById('busquedaProveedor').addEventListener('keyup', function() {
    const busqueda = this.value.toLowerCase();
    const filas = document.querySelectorAll('#proveedoresTablaBody tr');

    filas.forEach(function(fila) {
        const nombreEmpresa = fila.childNodes[3].textContent.toLowerCase();

        if (nombreEmpresa.includes(busqueda)) {
            fila.style.display = 'table-row';
        } else {
            fila.style.display = 'none';
        }
    });
});

// Obtener los proveedores al cargar la página
window.onload = function() {
    obtenerProveedores();
};
