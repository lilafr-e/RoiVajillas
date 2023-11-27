let precios = {};

document.addEventListener('DOMContentLoaded', () => {


    var asideElemento = document.getElementById('guiaUsuario');
var botonOnclick = document.getElementById('botonGuia');

// Inicializar el estado del elemento de guía
var guiaVisible = false;

function alternarGuia() {
  // Alternar el estado del elemento de guía
  guiaVisible = !guiaVisible;

  // Mostrar u ocultar el elemento de guía según el estado
  if (guiaVisible) {
    asideElemento.style.display = 'flex';
  } else {
    asideElemento.style.display = 'none';
  }
}

// Agregar event listener al botón
if (botonOnclick) {
  botonOnclick.addEventListener('click', function(event) {
    event.preventDefault();
    alternarGuia();
  });
}

// Cerrar la guía si se hace clic fuera de ella
document.addEventListener('click', function(event) {
  var target = event.target;
  if (guiaVisible && target !== botonOnclick && !asideElemento.contains(target)) {
    // Ocultar la guía si está visible y se hace clic fuera de ella
    asideElemento.style.display = 'none';
    guiaVisible = false;
  }
});

    const apiKey = '$2a$10$n3Be/OiZpAJ7KI5vUYT6dOmj90s0tg2/5T3QHbVdDbTBTxTiKc62K';
    const binId = '655f87a254105e766fd41d19';

    var checkboxes = document.querySelectorAll('.container-checkboxs input[type=checkbox]');
    var cantidadPersonasInput = document.getElementById('bedrooms-input');
    var precioTotalElement = document.getElementById('precioFinal');
    var actualizarButton = document.getElementById('actualizar-button');

    function mostrarCargando() {
        precioTotalElement.innerText = 'Cargando datos...';
    }

    function ocultarCargando() {
        precioTotalElement.innerText = '';
    }

    var firmaContainer = document.getElementById('firma-container');
    var canvas = document.createElement('canvas');
    firmaContainer.appendChild(canvas);

    // Inicializa signature_pad
    var firmaPad = new SignaturePad(canvas);

    // Maneja el botón de borrar
    document.getElementById('borrar-firma').addEventListener('click', function () {
        event.preventDefault();
        firmaPad.clear();
    });


    function calcularPrecio() {
        mostrarCargando();
        // console.log('Precio total:', precioTotal);
        var cantidadPersonas = parseInt(cantidadPersonasInput.value);
        var precioTotal = 0;

        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                var elemento = checkbox.id;
                var precioElemento = precios[elemento] ? precios[elemento].precio : 0;

                // Ajustar la cantidad al máximo permitido
                var cantidadSeleccionada = obtenerCantidadSeleccionada(elemento, cantidadPersonas);

                // Sumar el precio total
                precioTotal += cantidadSeleccionada * precioElemento;

                // Actualizar el precio en el HTML
                mostrarPrecioEnHTML(elemento, precioElemento);
            }
        });

        // Actualizar el precio total en el HTML
        precioTotalElement.innerText = '$' + precioTotal.toFixed(2);

        ocultarCargando();
    }

    function obtenerCantidadSeleccionada(elemento, cantidadPersonas) {
        var maximo = precios[elemento] ? precios[elemento].maximo : 0;

        if (elemento.includes('plato')) {
            return Math.min(cantidadPersonas, maximo);
        } else {
            // Ajustar la cantidad al máximo permitido
            var cantidadPersonalizadaInput = document.getElementById(`cantidad_${elemento}`);
            var cantidadPersonalizada = cantidadPersonalizadaInput ? parseInt(cantidadPersonalizadaInput.value) : 0;

            cantidadPersonalizada = cantidadPersonalizada > 0 ? cantidadPersonalizada : cantidadPersonas;

            return Math.min(cantidadPersonalizada, maximo);
        }
    }

    function mostrarPrecioEnHTML(elemento, precioElemento) {
        var precioElement = document.getElementById(`precio_${elemento}`);
        if (precioElement) {
            precioElement.textContent = `$${precioElemento.toFixed(2)}`;
        } else {
            console.error(`Elemento de precio no encontrado: ${elemento}`);
        }
    }

    function obtenerDatos() {
        mostrarCargando();
        fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`)
            .then(response => response.json())
            .then(data => {
                precios = data.record;
                ocultarCargando();
                calcularPrecio();
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
                ocultarCargando();
            });
    }

    actualizarButton.addEventListener('click', () => {
        obtenerDatos();
    });

    calcularPrecio();
});

const { jsPDF } = window.jspdf;
let pdf;

// Evento para descargar el PDF
document.getElementById("descargarPDF").addEventListener("click", function () {
    descargarPDF();
});


function descargarPDF() {
    var pdf = new window.jspdf.jsPDF();
    var cantidadPersonas = document.getElementById("bedrooms-input").value.trim();
    var vajillasSeleccionadas = [];
    var precioTotal = 0;

    var checkboxes = document.querySelectorAll('.container-checkboxs input[type="checkbox"]');
    var maximo; // Definir maximo aquí

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            var id = checkbox.id;
            var valor = checkbox.value;
            var precioElement = document.getElementById("precio_" + id);
            var precio = precioElement ? parseFloat(precioElement.textContent.trim().replace('$', '')) : 0;
            var cantidadElement = document.getElementById("cantidad_" + id);
            var cantidad = cantidadElement ? parseInt(cantidadElement.value.trim()) : 0;

            if (isNaN(precio)) {
                precio = 0;
            }

            if (id.includes("plato")) {
                maximo = precios[id] ? parseFloat(precios[id].maximo) : 0; // Definir maximo aquí
                cantidad = Math.min(parseInt(cantidadPersonas), maximo);
            } else if (id.includes("cuchillos") || id.includes("tenedor_mesa") || id.includes("cuchara_postre") || id.includes("copa")) {
                // Ajustar la cantidad al máximo permitido
                maximo = precios[id] ? parseFloat(precios[id].maximo) : 0;
                cantidad = Math.min(parseInt(cantidadPersonas), maximo);
            }

            var total = precio * cantidad;

            vajillasSeleccionadas.push({
                tipoVajilla: valor,
                cantidad: cantidad,
                precio: precio,
                total: total
            });

            precioTotal += total;
        }

    });

    pdf.autoTable({
        head: [['Tipo de vajilla', 'Cantidad', 'Precio x Unidad', 'TOTAL']],
        body: vajillasSeleccionadas.map(function (vajilla) {
            return [vajilla.tipoVajilla, vajilla.cantidad, `$${vajilla.precio.toFixed(2)}`, `$${vajilla.total.toFixed(2)}`];
        }),
        layout: 'lightHorizontalLines',
        startY: 15
    });

    var titulo = "VajillasREY";
    var anchoPagina = pdf.internal.pageSize.width;
    var alturaTitulo = 16;
    var posicionXTitulo = anchoPagina / 2 - pdf.getStringUnitWidth(titulo) * alturaTitulo / 6;
    pdf.setFontSize(16);
    pdf.text(titulo, posicionXTitulo, 10);

    var numeroDocumento = document.getElementById('numeroDocumento').value;
    // console.log("Número de documento:", numeroDocumento);

    // Calcular el ancho disponible para el texto
    var anchoDisponible = pdf.internal.pageSize.width - -150;

    var texto = 'Este documento certifica que los elementos seleccionados fueron elegidos por el cliente y tienen un precio total de $' + precioTotal.toFixed(2) +
        '. No incluye el seguro, que es opcional con un costo de $5.000, éste se devolverá al remitente ya sea por transferencia bancaria CBU, CVU o pago físico) ' +
        'una vez finalizado el evento y verificado el estado de la vajilla.' +
        'En caso de rotura, se deberá abonar el elemento dañado al precio de lista, consulte los precios de reposición en la página. ' +
        'El máximo a alquilar son 106 platos, 106 copas, 106 cuchillos y 106 tenedores, en caso de que algo se pierda o rompa durante el evento ' +
        'tendrán 1-2 repuestos dependiendo del stock del momento. Por ejemplo, son 106 personas pero a una se le rompe un plato, habrán 2 platos ' +
        'adicionales disponibles para usar de emergencia (Esto depende del stock disponible, la cantidad varía de 1 a 2). Esto mismo aplica a cuchillos, tenedores, copas. No aplicable en hieleras, Pinza de hielo, ' +
        'Panera, Legumbrera y Fuente Oval.' +
        '0- ¿Puedo cancelar mi alquiler? Puede cancelar el alquiler hasta 2 días antes del evento.' +
        '1- ¿Qué hacer una vez tengo mi cotización? Debes comunicarte por algunas de las vías disponibles; le pediremos en qué fecha quiere la vajilla y según ' +
        'la disponibilidad te daremos un cupón para pagar de MercadoPago o pago físico.' +
        '2- ¿Debo entregar la vajilla limpia? La vajilla se entregará limpia y en sus respectivas cajones de madera.' +
        '3- ¿Qué pasa si en alguna copa hay rajaduras o astillamiento? Queda pendiente de evaluación, depende si es una copa y el grado de astillamiento. ' +
        'En caso de los platos depende en qué sitio físicamente suceda; normalmente, si está rajado en la parte superior se considera roto debido a ' +
        'qué es inseguro volverlo a usar en otros eventos.' +
        '4- ¿Qué sucede si falta algún elemento o más y supera el monto del seguro? Si se entregan 100 elementos, deben devolverse 100 elementos. ' +
        'En caso de haya una faltante se descontará del seguro ($5.000), en caso de que el monto supere al seguro se puede pagar voluntariamente o se recurrirá ' +
        'a medidas legales. El cliente con documento ('+ numeroDocumento +') firma y está conforme con las reglas estipuladas en el contrato.';

    var textoDividido = pdf.splitTextToSize(texto, anchoDisponible);

    // Configurar estilo de texto
    var fontSize = 8;
    pdf.setFontSize(fontSize);
    pdf.setTextColor(0, 0, 0);

    // Calcular la posición vertical para que esté justo debajo de la tabla
    var positionY = pdf.autoTable.previous.finalY + 5;

    // Iterar sobre las líneas de texto y agregarlas al PDF
    textoDividido.forEach(function (linea) {
        pdf.text(linea, 15, positionY);
        positionY += pdf.getTextDimensions(linea).h * fontSize / pdf.internal.scaleFactor;
    });

    // Reducir la separación antes del área de firma
    positionY += 0;

    // Agregar área de firma
    var firmaContainer = document.createElement('div');
    firmaContainer.id = 'firma-container'; // Cambia a un ID único
    firmaContainer.style.width = 50 + 'px';
    firmaContainer.style.height = '180px';
    firmaContainer.style.borderBottom = '1px solid #000';
    firmaContainer.style.borderRadius = '10px';
    firmaContainer.style.marginTop = '5px';

    html2canvas(document.getElementById('firma-container')).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png');

        // Agregar imagen de firma al PDF
        pdf.addImage(imgData, 'PNG', 15, positionY + 3, 70, 30);

        // Agregar la leyenda "Firma y aclaración"
        pdf.setFontSize(8); // Puedes ajustar el tamaño de fuente según tus preferencias
        pdf.text('Firma del cliente', 16, positionY + 32); // Ajusta la posición vertical según sea necesario

        // Guardar el PDF
        pdf.save('alquiler-vajillas.pdf');
    });
}