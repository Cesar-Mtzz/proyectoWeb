const btnEditar = document.getElementById('btnEditar');
const btnAgregar = document.getElementById('btnAgregar');
const btnEliminar = document.querySelectorAll('.btnEliminar');
const iconPersona = document.querySelectorAll('.iconPersona');

btnEditar.addEventListener('click', () => {
    const elementos = [btnAgregar, ...btnEliminar];
    const mostrar = elementos[0].classList.contains('noVisible');

    elementos.forEach(elemento => {
        if (mostrar) {
            elemento.classList.remove('noVisible');
            elemento.classList.add('transicion');

            requestAnimationFrame(() => {
                elemento.classList.add('visible');
            });
        } else if (elemento.classList.contains('btnEliminar')) {
            // Desaparecer inmediatamente
            elemento.classList.add('noVisible');
            elemento.classList.remove('transicion', 'visible');
        } else {
            elemento.classList.remove('visible');
            elemento.classList.add('noVisible');
        }
    });

    iconPersona.forEach(icono => {
        if (mostrar) {
            icono.classList.add('noVisible');
            icono.classList.remove('transicion', 'visible');
        } else {
            setTimeout(() => {
                icono.classList.remove('noVisible');
                icono.classList.add('transicion');

                requestAnimationFrame(() => {
                    icono.classList.add('visible');
                });
            }, 500);
        }
    });
});
