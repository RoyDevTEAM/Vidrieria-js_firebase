// Constantes para paginación
const itemsPorPagina = 5;
let paginaActual = 1;

// Función para cargar los productos desde la base de datos y mostrarlos en el formulario de venta
function cargarProductos() {
    db.collection("productos").get()
    .then((querySnapshot) => {
        const productoVentaSelect = document.getElementById('productoVenta');
        productoVentaSelect.innerHTML = ''; // Limpiar contenido actual del select

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const productoID = doc.id;
            const nombreProducto = data.Nombre;

            productoVentaSelect.innerHTML += `
                <option value="${productoID}">${nombreProducto}</option>
            `;
        });
    })
    .catch((error) => {
        console.error("Error al cargar los productos: ", error);
    });
}

// Variable para almacenar los usuarios
let usuarios = {};

// Función para cargar todos los usuarios desde Firestore
function cargarUsuarios() {
    db.collection("usuarios").get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const userID = doc.id;
            const nombreUsuario = data.Nombre;

            // Almacena el nombre del usuario en el objeto "usuarios" usando el ID como clave
            usuarios[userID] = nombreUsuario;
        });
        // Una vez que hayas cargado todos los usuarios, puedes llamar a la función para cargar los clientes
        cargarClientes();
    })
    .catch((error) => {
        console.error("Error al cargar los usuarios: ", error);
    });
}

// Función para cargar los clientes desde la base de datos y mostrarlos en el formulario de venta
function cargarClientes() {
    db.collection("clientes").get()
    .then((querySnapshot) => {
        const clienteVentaSelect = document.getElementById('clienteVenta');
        clienteVentaSelect.innerHTML = ''; // Limpiar contenido actual del select

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const clienteID = doc.id;
            const nombreCliente = data.Nombre;
            const userID = data.UserID; // Suponiendo que aquí se almacena el ID del usuario asociado al cliente

            // Obtén el nombre de usuario asociado al cliente del objeto "usuarios"
            const nombreUsuario = usuarios[userID];

            // Agrega una opción al select con el nombre del cliente y el nombre del usuario
            clienteVentaSelect.innerHTML += `
                <option value="${clienteID}">${nombreCliente} (${nombreUsuario})</option>
            `;
        });
    })
    .catch((error) => {
        console.error("Error al cargar los clientes: ", error);
    });
}

// Función para cargar los métodos de pago desde la base de datos y mostrarlos en el formulario de venta
function cargarMetodosPago() {
    db.collection("metodosPago").get()
    .then((querySnapshot) => {
        const metodoPagoVentaSelect = document.getElementById('metodoPagoVenta');
        metodoPagoVentaSelect.innerHTML = ''; // Limpiar contenido actual del select

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const metodoPagoID = doc.id;
            const nombreMetodoPago = data.NombreMetodo;

            metodoPagoVentaSelect.innerHTML += `
                <option value="${metodoPagoID}">${nombreMetodoPago}</option>
            `;
        });
    })
    .catch((error) => {
        console.error("Error al cargar los métodos de pago: ", error);
    });
}

function guardarNuevaVenta() {
    const clienteID = document.getElementById('clienteVenta').value;
    const productoID = document.getElementById('productoVenta').value;
    const cantidad = parseInt(document.getElementById('cantidadVenta').value);
    const metodoPagoID = document.getElementById('metodoPagoVenta').value;

    if (!clienteID || !productoID || isNaN(cantidad) || cantidad <= 0 || !metodoPagoID) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    db.collection("productos").doc(productoID).get()
    .then((doc) => {
        if (doc.exists) {
            const productoData = doc.data();
            const precioProducto = productoData.Precio;
            const totalVenta = precioProducto * cantidad;

            db.collection("ventas").add({
                ClienteID: clienteID,
                FechaVenta: firebase.firestore.Timestamp.now(),
                MetodoPagoID: metodoPagoID,
                TotalVenta: totalVenta
            })
            .then((docRef) => {
                console.log("Venta guardada exitosamente con ID: ", docRef.id);
                guardarDetalleVenta(docRef.id, productoID, cantidad, precioProducto);
                obtenerVentas();
                $('#nuevaVentaModal').modal('hide');
                limpiarFormularioVenta();
            })
            .catch((error) => {
                console.error("Error al guardar la venta: ", error);
                alert("Error al guardar la venta.");
            });
        } else {
            console.log("El producto no existe");
        }
    })
    .catch((error) => {
        console.error("Error al obtener el precio del producto:", error);
    });
}


// Función para guardar el detalle de la venta en la base de datos
function guardarDetalleVenta(ventaID, productoID, cantidad, precioUnitario) {
    const totalDetalleVenta = precioUnitario * cantidad;

    db.collection("detallesVentas").add({
        VentaID: ventaID,
        ProductoID: productoID,
        Cantidad: cantidad,
        PrecioUnitario: precioUnitario,
        Total: totalDetalleVenta
        // Puedes agregar otros campos si es necesario
    })
    .then(() => {
        console.log("Detalle de venta guardado exitosamente");
    })
    .catch((error) => {
        console.error("Error al guardar el detalle de venta: ", error);
    });
}

// Función para calcular el total de la venta
function calcularTotalVenta() {
    const productoID = document.getElementById('productoVenta').value;
    const cantidad = parseInt(document.getElementById('cantidadVenta').value);

    // Obtener el precio del producto desde la base de datos
    db.collection("productos").doc(productoID).get()
    .then((doc) => {
        if (doc.exists) {
            const productoData = doc.data();
            const precioProducto = productoData.Precio;
            const totalVenta = precioProducto * cantidad;
            
            // Mostrar el total de la venta en el campo correspondiente
            document.getElementById('totalVenta').value = totalVenta;
        } else {
            console.log("El producto no existe");
        }
    })
    .catch((error) => {
        console.error("Error al obtener el precio del producto:", error);
    });
}

// Agregar event listeners a los campos de cantidad y producto para calcular el total de la venta automáticamente
document.getElementById('cantidadVenta').addEventListener('input', calcularTotalVenta);
document.getElementById('productoVenta').addEventListener('change', calcularTotalVenta);

// Función para cargar las ventas desde la base de datos y mostrarlas en la tabla
function obtenerVentas() {
    db.collection("ventas").get()
    .then((querySnapshot) => {
        const ventasTablaBody = document.getElementById('ventasTablaBody');
        ventasTablaBody.innerHTML = ''; // Limpiar contenido actual de la tabla

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const ventaID = doc.id;
            const clienteID = data.ClienteID;
            const fechaVenta = data.FechaVenta.toDate(); // Convertir a objeto de fecha
            const metodoPagoID = data.MetodoPagoID;
            const totalVenta = data.TotalVenta;

            ventasTablaBody.innerHTML += `
                <tr>
                    <td>${ventaID}</td>
                    <td>${clienteID}</td>
                    <td>${fechaVenta}</td>
                    <td>${metodoPagoID}</td>
                    <td>${totalVenta}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="generarComprobante('${ventaID}')">Generar Comprobante</button>
                    </td>
                </tr>
            `;
        });
    })
    .catch((error) => {
        console.error("Error al obtener ventas: ", error);
    });
}

// Función para generar el comprobante en PDF
function generarComprobante(ventaID) {
    generarComprobantePDF(ventaID);
}

function generarComprobantePDF(ventaID) {
    // Obtener los datos de la venta de la base de datos
    db.collection("ventas").doc(ventaID).get()
        .then((doc) => {
            if (doc.exists) {
                const ventaData = doc.data();

                // Crear un nuevo documento PDF
                var docPDF = new jsPDF();

                // Encabezado del documento
                docPDF.text('Comprobante de Venta', 10, 10);

                // Formatear la fecha de emisión
                const fechaEmision = new Date(ventaData.FechaVenta.seconds * 1000); // Convertir los segundos a milisegundos
                const fechaFormateada = `${fechaEmision.getDate()}/${fechaEmision.getMonth() + 1}/${fechaEmision.getFullYear()}`;

                // Crear la tabla para mostrar los detalles de la venta
                var columns = ["Venta ID", "Fecha de Emisión", "Método de Pago", "Total"];
                var data = [
                    [ventaID, fechaFormateada, ventaData.MetodoPagoID, ventaData.TotalVenta]
                ];

                docPDF.autoTable(columns, data, { startY: 20 });

                // Guardar el PDF
                docPDF.save('comprobante_venta_' + ventaID + '.pdf');
            } else {
                console.log("La venta no existe");
            }
        })
        .catch((error) => {
            console.error("Error al obtener los datos de la venta:", error);
        });
}

// Obtener el botón de guardar venta por su ID
const guardarVentaBtn = document.getElementById('guardarVentaBtn');

// Agregar un event listener para el evento de clic
guardarVentaBtn.addEventListener('click', function() {
    guardarNuevaVenta(); // Llamar a la función guardarNuevaVenta() al hacer clic en el botón
});
// Función para limpiar el formulario de venta
function limpiarFormularioVenta() {
    document.getElementById('clienteVenta').value = '';
    document.getElementById('productoVenta').value = '';
    document.getElementById('cantidadVenta').value = '';
    document.getElementById('metodoPagoVenta').value = '';
    document.getElementById('totalVenta').value = '';
}

// Función para cargar los datos al cargar la página
window.onload = function() {
    obtenerVentas();
    cargarProductos();
    cargarClientes();
    cargarMetodosPago();
    cargarUsuarios();
};
