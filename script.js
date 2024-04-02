    function updateValue(newValue) {
        document.getElementById("value").innerText = newValue;
    }

    function toggleSelection(id) {
        var button = document.getElementById(id);
        var parentDiv = button.parentNode.parentNode; // Obtener el div padre del botón

        // Alternar la clase 'selected' en el div padre
        parentDiv.classList.toggle('selected');
    }


    document.addEventListener('DOMContentLoaded', function() {
        var indiceSeccionActual = 1; // Inicialmente mostramos la primera sección

        function avanzar() {
            var seccionActual = document.getElementById("section-" + indiceSeccionActual);
            seccionActual.style.display = "none";

            indiceSeccionActual++;

            if (indiceSeccionActual > 4) {
                indiceSeccionActual = 1;
            }

            var nuevaSeccion = document.getElementById("section-" + indiceSeccionActual);
            nuevaSeccion.style.display = "block";
        }

        function retroceder() {
            var seccionActual = document.getElementById("section-" + indiceSeccionActual);
            seccionActual.style.display = "none";

            indiceSeccionActual--;

            if (indiceSeccionActual < 1) {
                indiceSeccionActual = 4;
            }

            var nuevaSeccion = document.getElementById("section-" + indiceSeccionActual);
            nuevaSeccion.style.display = "block";
        }
    });