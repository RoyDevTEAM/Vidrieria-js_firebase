// Función para obtener todos los productos de la base de datos y mostrarlos en la tabla
function obtenerProductos() {
    db.collection("productos").get()
    .then((querySnapshot) => {
        const productosTablaBody = document.getElementById('productosTablaBody');
        productosTablaBody.innerHTML = ''; // Limpiar contenido actual de la tabla
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const ProductoID = doc.id;
            const Nombre = data.Nombre;
            const Descripcion = data.Descripcion;
            const Precio = data.Precio;
            const Stock = data.Stock;
            productosTablaBody.innerHTML += `
                <tr>
                    <td>${ProductoID}</td>
                    <td>${Nombre}</td>
                    <td>${Descripcion}</td>
                    <td>${Precio}</td>
                    <td>${Stock}</td>

                    <td>
                        <button class="btn btn-primary btn-editar-producto" data-bs-toggle="modal" data-bs-target="#editarProductoModal">Editar</button>
                        <button class="btn btn-danger btn-eliminar-producto">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    })
    .catch((error) => {
        console.error("Error al obtener productos: ", error);
    });
}


// Llama a la función obtenerProductos() después de que se haya cargado el documento
document.addEventListener('DOMContentLoaded', function() {
    obtenerProductos();
});
