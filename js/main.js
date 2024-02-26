// Constantes para paginación
const itemsPorPagina = 5;
let paginaActual = 1;

// Función para guardar una nueva categoría en la base de datos
function guardarNuevaCategoria() {
    const Nombre = document.getElementById('nombreCategoria').value;
    const Descripcion = document.getElementById('descripcionCategoria').value;

    // Validación: verificar que los campos no estén vacíos
    if (Nombre.trim() === '' || Descripcion.trim() === '') {
        alert("Por favor, completa todos los campos.");
        return; // Detener la ejecución si hay campos vacíos
    }

    db.collection("categorias").add({
        Nombre: Nombre,
        Descripcion: Descripcion
    })
    .then(() => {
        console.log("Categoría guardada exitosamente");
        obtenerCategorias();
        // Cierra el modal después de guardar la categoría
        $('#nuevaCategoriaModal').modal('hide');
        // Limpiar los campos del formulario
        document.getElementById('nombreCategoria').value = '';
        document.getElementById('descripcionCategoria').value = '';
    })
    .catch((error) => {
        console.error("Error al guardar la categoría: ", error);
    });
}

// Función para obtener todas las categorías de la base de datos y mostrarlas en la tabla
function obtenerCategorias() {
    db.collection("categorias").get()
    .then((querySnapshot) => {
        const categoriasTablaBody = document.getElementById('categoriasTablaBody');
        categoriasTablaBody.innerHTML = ''; // Limpiar contenido actual de la tabla
        let contador = 0;

        querySnapshot.forEach((doc) => {
            if (contador >= (paginaActual - 1) * itemsPorPagina && contador < paginaActual * itemsPorPagina) {
                const data = doc.data();
                const CategoriaID = doc.id;
                const Nombre = data.Nombre;
                const Descripcion = data.Descripcion;
                categoriasTablaBody.innerHTML += `
                    <tr>
                        <td>${CategoriaID}</td>
                        <td>${Nombre}</td>
                        <td>${Descripcion}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="editarCategoria('${CategoriaID}', '${Nombre}', '${Descripcion}')">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarCategoria('${CategoriaID}')">Eliminar</button>
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
        console.error("Error al obtener categorías: ", error);
    });
}

// Función para actualizar una categoría existente en la base de datos
function actualizarCategoria(CategoriaID, Nombre, Descripcion) {
    db.collection("categorias").doc(CategoriaID).update({
        Nombre: Nombre,
        Descripcion: Descripcion
    })
    .then(() => {
        console.log("Categoría actualizada exitosamente");
        // Muestra un mensaje de éxito
        alert("Categoría actualizada exitosamente");
        // Actualiza la tabla de categorías
        obtenerCategorias();

        // Llama a la función para restablecer el modal
        restablecerModalNuevaCategoria();
    })
    .catch((error) => {
        console.error("Error al actualizar la categoría: ", error);
    });
}


// Función para restablecer el modal para agregar una nueva categoría
function restablecerModalNuevaCategoria() {
    document.getElementById('nombreCategoria').value = '';
    document.getElementById('descripcionCategoria').value = '';
}

// Función para eliminar una categoría de la base de datos
function eliminarCategoria(CategoriaID) {
    // Mostrar una alerta de confirmación al usuario
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta categoría?");
    
    // Verificar si el usuario confirmó la eliminación
    if (confirmacion) {
        // Eliminar la categoría si el usuario confirma
        db.collection("categorias").doc(CategoriaID).delete()
        .then(() => {
            console.log("Categoría eliminada exitosamente");
            alert("Categoría eliminada exitosamente");
            // Actualiza la tabla de categorías
            obtenerCategorias();
        })
        .catch((error) => {
            console.error("Error al eliminar la categoría: ", error);
            alert("Error al eliminar la categoría");
        });
    } else {
        // No hacer nada si el usuario cancela la eliminación
        console.log("Eliminación cancelada por el usuario");
    }
}

// Función para cargar los datos de una categoría en el modal de edición
function editarCategoria(CategoriaID, Nombre, Descripcion) {
    // Llenar los campos del formulario con los datos de la categoría a editar
    document.getElementById('nombreCategoria').value = Nombre;
    document.getElementById('descripcionCategoria').value = Descripcion;

    // Cambiar el texto del botón de guardar
    document.getElementById('guardarCategoriaBtn').textContent = 'Actualizar';
    
    // Remover el evento de clic anterior del botón de guardar
    $('#guardarCategoriaBtn').off('click');

    // Crear un nuevo evento de clic al botón de guardar para actualizar la categoría
    document.getElementById('guardarCategoriaBtn').onclick = function() {
        const nuevoNombre = document.getElementById('nombreCategoria').value;
        const nuevaDescripcion = document.getElementById('descripcionCategoria').value;
        actualizarCategoria(CategoriaID, nuevoNombre, nuevaDescripcion);
        // Cierra el modal después de actualizar la categoría
        $('#nuevaCategoriaModal').modal('hide');
        // Limpiar los campos del formulario
        document.getElementById('nombreCategoria').value = '';
        document.getElementById('descripcionCategoria').value = '';
        // Cambiar el texto del botón de guardar de vuelta a "Guardar"
        document.getElementById('guardarCategoriaBtn').textContent = 'Guardar';
    };

    // Mostrar el modal de edición
    $('#nuevaCategoriaModal').modal('show');
}

// Función para actualizar los botones de paginación
function actualizarPaginacion(totalItems) {
    const paginacion = document.getElementById('paginacionCategorias');
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
    obtenerCategorias();
}

// Función para buscar categorías por nombre
document.getElementById('busquedaCategoria').addEventListener('keyup', function() {
    const busqueda = this.value.toLowerCase();
    const filas = document.querySelectorAll('#categoriasTablaBody tr');

    filas.forEach(function(fila) {
        const nombreCategoria = fila.childNodes[3].textContent.toLowerCase();

        if (nombreCategoria.includes(busqueda)) {
            fila.style.display = 'table-row';
        } else {
            fila.style.display = 'none';
        }
    });
});



// Obtener las categorías al cargar la página
window.onload = function() {
    obtenerCategorias();
};
