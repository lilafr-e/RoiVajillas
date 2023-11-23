document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '$2a$10$n3Be/OiZpAJ7KI5vUYT6dOmj90s0tg2/5T3QHbVdDbTBTxTiKc62K';
    const binId = '655f87a254105e766fd41d19';
    let precios = {}; // Definimos la variable precios aquí para que esté disponible en todo el alcance.

    var checkboxes = document.querySelectorAll('.container-checkboxs input[type=checkbox]');
    var cantidadPersonasInput = document.getElementById('bedrooms-input');
    var precioTotalElement = document.getElementById('cotizacion');
    var actualizarButton = document.getElementById('actualizar-button');

    function mostrarCargando() {
        precioTotalElement.innerText = 'Cargando datos...';
    }

    function ocultarCargando() {
        precioTotalElement.innerText = '';
    }

    function calcularPrecio() {
        mostrarCargando();
        var cantidadPersonas = parseInt(cantidadPersonasInput.value);
        var precioTotal = 0;

        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                var elemento = checkbox.id;
                var precioElemento = precios[elemento] ? precios[elemento].precio : 0;
                var maximo = precios[elemento] ? precios[elemento].maximo : 0;
        
                // Obtener la cantidad personalizada ingresada por el usuario
                var cantidadPersonalizadaInput = document.getElementById(`cantidad_${elemento}`);
                var cantidadPersonalizada = cantidadPersonalizadaInput ? parseInt(cantidadPersonalizadaInput.value) : 0;
        
                // Ajustar la cantidad al máximo permitido
                var cantidadSeleccionada = Math.min(cantidadPersonalizada, maximo);
        
                if (elemento.includes('plato')) {
                    // Ajustar la cantidad de platos al máximo permitido por persona
                    var cantidadPlatosPorPersona = Math.min(cantidadPersonas, maximo);
                    // Sumar el precio total de los platos
                    precioTotal += cantidadPlatosPorPersona * precioElemento;
                } else {
                    // Sumar el precio total de otros elementos
                    precioTotal += cantidadSeleccionada * precioElemento;
                }
        
                var precioElementId = `precio_${elemento}`;
                var precioElement = document.getElementById(precioElementId);
                if (precioElement) {
                    precioElement.textContent = `$${precioElemento}`;
                }
            }
        });
        
        ocultarCargando();
        precioTotalElement.innerText = '$' + precioTotal.toFixed(2);
        
    }

    function obtenerDatos() {
        return fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': apiKey,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud de datos');
            }
            return response.json();
        })
        .then(data => {
            precios = data.record; // Actualizamos la variable precios con los datos obtenidos.
            calcularPrecio();
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            ocultarCargando();
        });
    }

    actualizarButton.addEventListener('click', () => {
        // Actualizamos solo cuando se hace clic en el botón "Actualizar"
        obtenerDatos();
    });

    calcularPrecio(); // Ejecutamos la función al cargar la página para mostrar el precio total inicial
});