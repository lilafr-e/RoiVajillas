const productos = [
    { id: 1, nombre: "Plato Playo", precio: 95, imagen: "./content/Images/plato-1.jpg", stock: 95, },
    { id: 2, nombre: "Plato Lunch", precio: 95, imagen: "./content/Images/plato-1.jpg", stock: 95, },
    { id: 3, nombre: "Cuchillo", precio: 95, imagen: "./content/Images/cuchillo.jpg", stock: 95, },
    { id: 4, nombre: "Tenedor", precio: 95, imagen: "./content/Images/tenedor.jpg", stock: 95, },
    { id: 5, nombre: "Cuchara", precio: 95, imagen: "./content/Images/cuchara.webp", stock: 95, },
    { id: 6, nombre: "Copa Windsor Agua", precio: 95, imagen: "./content/Images/copa-1.png", stock: 95, },
    { id: 7, nombre: "Copa Windsor Brindis", precio: 95, imagen: "./content/Images/copa-2.webp", stock: 95, },
    { id: 8, nombre: "Balde de hielo", precio: 95, imagen: "./content/Images/balde-hielo.png", stock: 5, },
    { id: 9, nombre: "Panera", precio: 95, imagen: "./content/Images/panera.webp", stock: 5, },
    { id: 10, nombre: "Legumbrera", precio: 95, imagen: "./content/Images/legumbrera.webp", stock: 5, },
    { id: 11, nombre: "Fuente Oval Playa", precio: 95, imagen: "./content/Images/fuente.webp", stock: 5, }
];

productos.forEach(function(producto) {
    var divProducto = document.createElement("div");
    divProducto.classList.add("boxProd", "mod-" + producto.id);

    divProducto.setAttribute("onclick", "toggleSelection(" + producto.id + ")"); // Pasamos el ID como número

    divProducto.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <span>
            <h2>${producto.nombre}</h2> 
            <button type="button" id="${producto.id}">Seleccionar</button>
        </span>
    `;

    document.querySelector(".container-Box").appendChild(divProducto);
});


let vajillaSeleccionada = []; // Creamos un array para almacenar la vajilla seleccionada

function toggleSelection(id) {
    const productoSeleccionado = productos.find(producto => producto.id === id);
    const index = vajillaSeleccionada.findIndex(producto => producto.id === id);
    const productoElemento = document.getElementById(id); // Obtener el elemento del producto

    if (index !== -1) { // Si el producto ya está seleccionado, lo eliminamos
        vajillaSeleccionada.splice(index, 1);
        productoElemento.parentNode.parentNode.classList.remove('selected'); // Eliminamos la clase 'selected'
    } else { // Si el producto no está seleccionado, lo agregamos al array
        vajillaSeleccionada.push(productoSeleccionado);
        productoElemento.parentNode.parentNode.classList.add('selected'); // Agregamos la clase 'selected'
    }

    calcularCostoTotal(); // Calculamos el costo total de la vajilla seleccionada
}


function calcularCostoTotal() {
    const cantidadPersonas = parseInt(document.getElementById('value').textContent); // Obtenemos la cantidad de personas
    let costoTotal = 0;

    vajillaSeleccionada.forEach(producto => {
        costoTotal += producto.precio;
    });

    const costoPorPersona = cantidadPersonas * costoTotal;
    document.getElementById('alquiler-value').textContent = costoPorPersona; // Mostramos el costo total en la página
}

function updateValue(value) {
    document.getElementById('value').textContent = value;
    calcularCostoTotal(); // Calculamos el costo total cuando se actualiza el valor de personas
}

function cotizar() {
    alert('Cotización realizada con éxito.');
}
