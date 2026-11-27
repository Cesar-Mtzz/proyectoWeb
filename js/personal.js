const dashboard = document.getElementById('dashboard');

const btnEditar = document.getElementById('btnEditar');
const btnAgregar = document.getElementById('btnAgregar');

const menuFlotante = document.getElementById('menuFlotante');
const formPersonal = document.getElementById('formPersonal');

const inputNombre = document.getElementById('inputNombre');
const selectHorario = document.getElementById('selectHorario');
const selectPuesto = document.getElementById('selectPuesto');

const tituloFormulario = document.getElementById('tituloFormulario');
const btnCancelar = document.getElementById('btnCancelar');

let idModificar = null;
let modoEdicion = false;

const personalInicial = [
    {
        id: 1,
        nombre: "Carlos Eduardo Gomez",
        horario: "Matutino",
        puesto: "Gerente"
    },
    {
        id: 2,
        nombre: "Valeria Torres Ríos",
        horario: "Vespertino",
        puesto: "Gerente"
    },
    {
        id: 3,
        nombre: "Alejandro Silva Castro",
        horario: "Vespertino",
        puesto: "Staff"
    },
    {
        id: 4,
        nombre: "Sofía Ramírez Méndez",
        horario: "Vespertino",
        puesto: "Gerente en capacitación"
    },
    {
        id: 5,
        nombre: "Juan Martínez Hernández",
        horario: "Matutino",
        puesto: "En capacitación"
    }
];

let personal = JSON.parse(localStorage.getItem('personal'));

if (!Array.isArray(personal)) {
    personal = personalInicial;
    guardarPersonal();
}

function guardarPersonal() {
    localStorage.setItem('personal', JSON.stringify(personal));
}

function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, caracter => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caracter]);
}

function mostrarPersonal() {
    dashboard.innerHTML = '';

    personal.forEach(persona => {
        let clasePuesto = 'vacio';

        if (persona.puesto === 'Gerente') {
            clasePuesto = 'gerente';
        } else if (persona.puesto.includes('capacitación') ||
                   persona.puesto.includes('capacitacion')) {
            clasePuesto = 'capacitacion';
        }

        const horario = persona.horario === 'Matutino'
            ? '10:00 - 17:00'
            : '17:00 - 21:00';

        const tarjeta = document.createElement('div');

        tarjeta.classList.add('tarjeta');

        tarjeta.innerHTML = `
            <div>
                <img class="iconPersona ${modoEdicion ? 'noVisible' : ''}"
                     src="../icons/persona.svg" alt="Persona">

                <button class="btnModificar"
                        type="button"
                        data-id="${persona.id}">
                    <img src="../icons/editar.svg" alt="Modificar">
                </button>

                <button class="btnEliminar ${modoEdicion ? '' : 'noVisible'}"
                        type="button"
                        data-id="${persona.id}">
                    <img src="../icons/menos.svg" alt="Eliminar">
                </button>
            </div>

            <h1>${escaparHTML(persona.nombre)}</h1>

            <p>${horario}</p>

            <p class="${clasePuesto}">
                ${escaparHTML(persona.puesto)}
            </p>
        `;

        dashboard.appendChild(tarjeta);
    });

    if (typeof btnEliminar !== 'undefined') {
        btnEliminar = document.querySelectorAll('.btnEliminar');
        iconPersona = document.querySelectorAll('.iconPersona');
    }
}

let btnEliminar = document.querySelectorAll('.btnEliminar');
let iconPersona = document.querySelectorAll('.iconPersona');

mostrarPersonal();

// Mostrar y ocultar los botones de edición

btnEditar.addEventListener('click', () => {
    const elementos = [btnAgregar, ...btnEliminar];
    const mostrar = elementos[0].classList.contains('noVisible');

    modoEdicion = mostrar;

    elementos.forEach(elemento => {
        if (mostrar) {
            elemento.classList.remove('noVisible');
            elemento.classList.add('transicion');

            requestAnimationFrame(() => {
                elemento.classList.add('visible');
            });
        } else if (elemento.classList.contains('btnEliminar')) {
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

// Abrir menú para agregar

btnAgregar.addEventListener('click', () => {
    abrirFormulario();
});

// Abrir menú para modificar

dashboard.addEventListener('click', e => {
    const boton = e.target.closest('.btnModificar');

    if (!boton) return;

    const id = Number(boton.dataset.id);

    abrirFormulario(id);
});

// Eliminar personal

dashboard.addEventListener('click', e => {
    const boton = e.target.closest('.btnEliminar');

    if (!boton) return;

    const id = Number(boton.dataset.id);

    const confirmar = confirm('¿Deseas eliminar a este empleado?');

    if (!confirmar) return;

    personal = personal.filter(persona => persona.id !== id);

    guardarPersonal();
    mostrarPersonal();
});

// Abrir formulario

function abrirFormulario(id = null) {
    formPersonal.reset();

    idModificar = id;

    if (id !== null) {
        const persona = personal.find(persona => persona.id === id);

        if (!persona) return;

        tituloFormulario.textContent = 'Modificar personal';

        inputNombre.value = persona.nombre;
        selectHorario.value = persona.horario;
        selectPuesto.value = persona.puesto;
    } else {
        tituloFormulario.textContent = 'Agregar personal';
    }

    menuFlotante.classList.add('activo');
}

// Cerrar formulario

function cerrarFormulario() {
    menuFlotante.classList.remove('activo');
    formPersonal.reset();
    idModificar = null;
}

btnCancelar.addEventListener('click', cerrarFormulario);

// Cerrar al presionar fuera del formulario

menuFlotante.addEventListener('click', e => {
    if (e.target === menuFlotante) {
        cerrarFormulario();
    }
});

// Guardar o modificar personal

formPersonal.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const horario = selectHorario.value;
    const puesto = selectPuesto.value;

    if (!nombre) return;

    if (idModificar !== null) {
        const indice = personal.findIndex(
            persona => persona.id === idModificar
        );

        if (indice !== -1) {
            personal[indice] = {
                ...personal[indice],
                nombre,
                horario,
                puesto
            };
        }
    } else {
        const nuevoPersonal = {
            id: personal.length > 0
                ? Math.max(...personal.map(persona => persona.id)) + 1
                : 1,
            nombre,
            horario,
            puesto
        };

        personal.push(nuevoPersonal);
    }

    guardarPersonal();
    mostrarPersonal();
    cerrarFormulario();
});
