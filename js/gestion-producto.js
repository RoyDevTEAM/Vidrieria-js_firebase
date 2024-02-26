  // Constantes para paginación
    const itemsPorPagina = 5;
    let paginaActual = 1;

    // Función para guardar un nuevo producto en la base de datos
    function guardarNuevoProducto() {
        const Nombre = document.getElementById('nombreProducto').value;
        const Descripcion = document.getElementById('descripcionProducto').value;
        const Precio = document.getElementById('precioProducto').value;
        const Stock = document.getElementById('stockProducto').value;
        const ProveedorID = document.getElementById('proveedorProducto').value;
        const CategoriaID = document.getElementById('categoriaProducto').value;
        const ImagenURL = document.getElementById('imagenProducto').value;

        // Validación: verificar que los campos no estén vacíos
        if (Nombre.trim() === '' || Descripcion.trim() === '' || Precio === '' || Stock === '' || ProveedorID === '' || CategoriaID === '' || ImagenURL === '') {
            alert("Por favor, completa todos los campos.");
            return; // Detener la ejecución si hay campos vacíos
        }

        db.collection("productos").add({
            Nombre: Nombre,
            Descripcion: Descripcion,
            Precio: parseFloat(Precio),
            Stock: parseInt(Stock),
            ProveedorID: ProveedorID,
            CategoriaID: CategoriaID,
            ImagenURL: ImagenURL
        })
        .then(() => {
            console.log("Producto guardado exitosamente");
            obtenerProductos();
            // Cierra el modal después de guardar el producto
            $('#nuevoProductoModal').modal('hide');
            // Limpiar los campos del formulario
            document.getElementById('nombreProducto').value = '';
            document.getElementById('descripcionProducto').value = '';
            document.getElementById('precioProducto').value = '';
            document.getElementById('stockProducto').value = '';
            document.getElementById('proveedorProducto').value = '';
            document.getElementById('categoriaProducto').value = '';
            document.getElementById('imagenProducto').value = '';
        })
        .catch((error) => {
            console.error("Error al guardar el producto: ", error);
        });
    }

    // Función para obtener todos los productos de la base de datos y mostrarlos en la tabla
    function obtenerProductos() {
        db.collection("productos").get()
        .then((querySnapshot) => {
            const productosTablaBody = document.getElementById('productosTablaBody');
            productosTablaBody.innerHTML = ''; // Limpiar contenido actual de la tabla
            let contador = 0;

            querySnapshot.forEach((doc) => {
                if (contador >= (paginaActual - 1) * itemsPorPagina && contador < paginaActual * itemsPorPagina) {
                    const data = doc.data();
                    const ProductoID = doc.id;
                    const Nombre = data.Nombre;
                    const Descripcion = data.Descripcion;
                    const Precio = data.Precio;
                    const Stock = data.Stock;
                    const ProveedorID = data.ProveedorID;
                    const CategoriaID = data.CategoriaID;

                    // Obtener el nombre del proveedor y categoría
                    obtenerNombreProveedor(ProveedorID, (NombreEmpresa) => {
                        obtenerNombreCategoria(CategoriaID, (nombreCategoria) => {
                            productosTablaBody.innerHTML += `
                                <tr>
                                    <td>${ProductoID}</td>
                                    <td>${Nombre}</td>
                                    <td>${Descripcion}</td>
                                    <td>${Precio}</td>
                                    <td>${Stock}</td>
                                    <td>${NombreEmpresa}</td>
                                    <td>${nombreCategoria}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" onclick="editarProducto('${ProductoID}', '${Nombre}', '${Descripcion}', '${Precio}', '${Stock}', '${ProveedorID}', '${CategoriaID}', '${data.ImagenURL}')">Editar</button>
                                        <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${ProductoID}')">Eliminar</button>
                                    </td>
                                </tr>
                            `;
                        });
                    });
                }
                contador++;
            });

            // Actualizar los botones de paginación
            actualizarPaginacion(querySnapshot.size);
        })
        .catch((error) => {
            console.error("Error al obtener productos: ", error);
        });
    }

    // Función para cargar los nombres de proveedores en el menú desplegable del modal de edición
    function cargarProveedores() {
        const proveedorProductoSelect = document.getElementById('proveedorProducto');
        proveedorProductoSelect.innerHTML = '';

        db.collection("proveedores").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const proveedorData = doc.data();
                const ProveedorID = doc.ProveedorID;
                const NombreEmpresa = proveedorData.NombreEmpresa;

                proveedorProductoSelect.innerHTML += `<option value="${ProveedorID}">${NombreEmpresa}</option>`;
            });
        })
        .catch((error) => {
            console.error("Error al cargar los proveedores: ", error);
        });
    }

    // Función para cargar los nombres de categorías en el menú desplegable del modal de edición
    function cargarCategorias() {
        const categoriaProductoSelect = document.getElementById('categoriaProducto');
        categoriaProductoSelect.innerHTML = '';

        db.collection("categorias").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const categoriaData = doc.data();
                const CategoriaID = doc.id;
                const NombreCategoria = categoriaData.Nombre;

                categoriaProductoSelect.innerHTML += `<option value="${CategoriaID}">${NombreCategoria}</option>`;
            });
        })
        .catch((error) => {
            console.error("Error al cargar las categorías: ", error);
        });
    }

    // Función para obtener el nombre del proveedor
    function obtenerNombreProveedor(ProveedorID, callback) {
        db.collection("proveedores").doc(ProveedorID).get()
        .then((doc) => {
            if (doc.exists) {
                const proveedorData = doc.data();
                const NombreEmpresa = proveedorData.NombreEmpresa;
                callback(NombreEmpresa);
            } else {
                callback("Proveedor no encontrado");
            }
        })
        .catch((error) => {
            console.error("Error al obtener el nombre del proveedor: ", error);
        });
    }

    // Función para obtener el nombre de la categoría
    function obtenerNombreCategoria(CategoriaID, callback) {
        db.collection("categorias").doc(CategoriaID).get()
        .then((doc) => {
            if (doc.exists) {
                const categoriaData = doc.data();
                const NombreCategoria = categoriaData.Nombre;
                callback(NombreCategoria);
            } else {
                callback("Categoría no encontrada");
            }
        })
        .catch((error) => {
            console.error("Error al obtener el nombre de la categoría: ", error);
        });
    }

    // Función para actualizar un producto existente en la base de datos
    function actualizarProducto(ProductoID, Nombre, Descripcion, Precio, Stock, ProveedorID, CategoriaID, ImagenURL) {
        db.collection("productos").doc(ProductoID).update({
            Nombre: Nombre,
            Descripcion: Descripcion,
            Precio: parseFloat(Precio),
            Stock: parseInt(Stock),
            ProveedorID: ProveedorID,
            CategoriaID: CategoriaID,
            ImagenURL: ImagenURL
        })
        .then(() => {
            console.log("Producto actualizado exitosamente");
            // Muestra un mensaje de éxito
            alert("Producto actualizado exitosamente");
            // Actualiza la tabla de productos
            obtenerProductos();

            // Llama a la función para restablecer el modal de nuevo producto
            restablecerModalNuevoProducto();
        })
        .catch((error) => {
            console.error("Error al actualizar el producto: ", error);
        });
    }

    // Función para restablecer el modal para agregar un nuevo producto
    function restablecerModalNuevoProducto() {
        document.getElementById('nombreProducto').value = '';
        document.getElementById('descripcionProducto').value = '';
        document.getElementById('precioProducto').value = '';
        document.getElementById('stockProducto').value = '';
        document.getElementById('proveedorProducto').value = '';
        document.getElementById('categoriaProducto').value = '';
        document.getElementById('imagenProducto').value = '';
    }

    // Función para eliminar un producto de la base de datos
    function eliminarProducto(ProductoID) {
        // Mostrar una alerta de confirmación al usuario
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar este producto?");
        
        // Verificar si el usuario confirmó la eliminación
        if (confirmacion) {
            // Eliminar el producto si el usuario confirma
            db.collection("productos").doc(ProductoID).delete()
            .then(() => {
                console.log("Producto eliminado exitosamente");
                alert("Producto eliminado exitosamente");
                // Actualiza la tabla de productos
                obtenerProductos();
            })
            .catch((error) => {
                console.error("Error al eliminar el producto: ", error);
                alert("Error al eliminar el producto");
            });
        } else {
            // No hacer nada si el usuario cancela la eliminación
            console.log("Eliminación cancelada por el usuario");
        }
    }

    // Función para cargar los datos de un producto en el modal de edición
    function editarProducto(ProductoID, Nombre, Descripcion, Precio, Stock, ProveedorID, CategoriaID, ImagenURL) {
        // Llenar los campos del formulario con los datos del producto a editar
        document.getElementById('nombreProducto').value = Nombre;
        document.getElementById('descripcionProducto').value = Descripcion;
        document.getElementById('precioProducto').value = Precio;
        document.getElementById('stockProducto').value = Stock;
        document.getElementById('proveedorProducto').value = ProveedorID;
        document.getElementById('categoriaProducto').value = CategoriaID;
        document.getElementById('imagenProducto').value = ImagenURL;

        // Cambiar el texto del botón de guardar
        document.getElementById('guardarProductoBtn').textContent = 'Actualizar';
        
        // Remover el evento de clic anterior del botón de guardar
        $('#guardarProductoBtn').off('click');

        // Crear un nuevo evento de clic al botón de guardar para actualizar el producto
        document.getElementById('guardarProductoBtn').onclick = function() {
            const nuevoNombre = document.getElementById('nombreProducto').value;
            const nuevaDescripcion = document.getElementById('descripcionProducto').value;
            const nuevoPrecio = document.getElementById('precioProducto').value;
            const nuevoStock = document.getElementById('stockProducto').value;
            const nuevoProveedorID = document.getElementById('proveedorProducto').value;
            const nuevaCategoriaID = document.getElementById('categoriaProducto').value;
            const nuevaImagenURL = document.getElementById('imagenProducto').value;
            actualizarProducto(ProductoID, nuevoNombre, nuevaDescripcion, nuevoPrecio, nuevoStock, nuevoProveedorID, nuevaCategoriaID, nuevaImagenURL);
            // Cierra el modal después de actualizar el producto
            $('#nuevoProductoModal').modal('hide');
            // Limpiar los campos del formulario
            restablecerModalNuevoProducto();
            // Cambiar el texto del botón de guardar de vuelta a "Guardar"
            document.getElementById('guardarProductoBtn').textContent = 'Guardar';
        };

        // Mostrar el modal de edición
        $('#nuevoProductoModal').modal('show');
    }

    // Función para actualizar los botones de paginación
    function actualizarPaginacion(totalItems) {
        const paginacion = document.getElementById('paginacionProductos');
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
        obtenerProductos();
    }

    // Función para buscar productos por nombre
    document.getElementById('busquedaProducto').addEventListener('keyup', function() {
        const busqueda = this.value.toLowerCase();
        const filas = document.querySelectorAll('#productosTablaBody tr');

        filas.forEach(function(fila) {
            const nombreProducto = fila.childNodes[3].textContent.toLowerCase();

            if (nombreProducto.includes(busqueda)) {
                fila.style.display = 'table-row';
            } else {
                fila.style.display = 'none';
            }
        });
    });

    // Obtener los productos al cargar la página
    window.onload = function() {
        obtenerProductos();
        cargarProveedores();
        cargarCategorias();
    };

