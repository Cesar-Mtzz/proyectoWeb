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
    { id: 1, nombre: "Carlos Eduardo Gomez", horario: "Matutino", puesto: "Gerente" },
    { id: 2, nombre: "Valeria Torres Ríos", horario: "Vespertino", puesto: "Gerente" },
    { id: 3, nombre: "Alejandro Silva Castro", horario: "Vespertino", puesto: "Staff" },
    { id: 4, nombre: "Sofía Ramírez Méndez", horario: "Vespertino", puesto: "Gerente en capacitación" },
    { id: 5, nombre: "Juan Martínez Hernández", horario: "Matutino", puesto: "En capacitación" }
];

let personal = JSON.parse(localStorage.getItem('personal') || 'null');
if (!Array.isArray(personal) || personal.length === 0) {
    personal = personalInicial.slice();
    localStorage.setItem('personal', JSON.stringify(personal));
}

function guardarPersonal() {
    localStorage.setItem('personal', JSON.stringify(personal));
}

function generarUsuario(nombre, usuarios) {
    const base = String(nombre || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .join(".") || "trabajador";

    let usuario = base;
    let i = 1;
    while (usuarios.some(u => (u.usuario || "").toLowerCase() === usuario)) {
        usuario = `${base}${i}`;
        i++;
    }
    return usuario;
}

function crearPerfilTrabajador(persona, mostrarAlerta = false) {
    if (!persona || !persona.nombre) return null;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const yaExiste = usuarios.some(
        u => (u.nombre || "").toLowerCase() === persona.nombre.toLowerCase()
    );
    if (yaExiste) return null;

    const usuario = generarUsuario(persona.nombre, usuarios);
    const nuevoPerfil = typeof User === 'function'
        ? new User(persona.nombre, usuario, "123", "trabajador", `${usuario}@cafeteria.local`, "")
        : {
            nombre: persona.nombre,
            usuario,
            contraseña: "123",
            rol: "trabajador",
            correo: `${usuario}@cafeteria.local`,
            telefono: ""
        };

    usuarios.push(nuevoPerfil);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    if (mostrarAlerta) {
        alert(`Personal agregado. Perfil creado:\nUsuario: ${nuevoPerfil.usuario}\nContraseña: ${nuevoPerfil.contraseña}\nRol: trabajador`);
    }

    return nuevoPerfil;
}

function asegurarPerfilesPersonal() {
    personal.forEach(persona => crearPerfilTrabajador(persona, false));
}

function escaparHTML(texto) {
    return String(texto || "").replace(/[&<>"']/g, c => ({
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": "'"
    }[c]));
}

function mostrarPersonal() {
    if (!dashboard) return;
    dashboard.innerHTML = '';

    personal.forEach(persona => {
        let clasePuesto = 'vacio';
        if (persona.puesto === 'Gerente') {
            clasePuesto = 'gerente';
        } else if ((persona.puesto || '').toLowerCase().includes('capacitac')) {
            clasePuesto = 'capacitacion';
        }

        const horario = persona.horario === 'Matutino' ? '10:00 - 17:00' : '17:00 - 21:00';

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        tarjeta.innerHTML = `
            <div>
                <img class="iconPersona ${modoEdicion ? 'noVisible' : ''}" src="../icons/persona.svg" alt="Persona">
                <button class="btnModificar" type="button" data-id="${persona.id}">
                    <img src="../icons/editar.svg" alt="Modificar">
                </button>
                <button class="btnEliminar ${modoEdicion ? '' : 'noVisible'}" type="button" data-id="${persona.id}">
                    <img src="../icons/menos.svg" alt="Eliminar">
                </button>
            </div>
            <h1>${escaparHTML(persona.nombre)}</h1>
            <p>${horario}</p>
            <p class="${clasePuesto}">${escaparHTML(persona.puesto)}</p>
        `;
        dashboard.appendChild(tarjeta);
    });
}

function abrirFormulario(id = null) {
    if (!formPersonal || !menuFlotante) return;
    formPersonal.reset();
    idModificar = id;

    if (id !== null) {
        const persona = personal.find(p => p.id === id);
        if (!persona) return;
        if (tituloFormulario) tituloFormulario.textContent = 'Modificar personal';
        if (inputNombre) inputNombre.value = persona.nombre;
        if (selectHorario) selectHorario.value = persona.horario;
        if (selectPuesto) selectPuesto.value = persona.puesto;
    } else if (tituloFormulario) {
        tituloFormulario.textContent = 'Agregar personal';
    }

    menuFlotante.classList.add('activo');
}

function cerrarFormulario() {
    if (!menuFlotante || !formPersonal) return;
    menuFlotante.classList.remove('activo');
    formPersonal.reset();
    idModificar = null;
}

if (btnEditar) {
    btnEditar.addEventListener('click', () => {
        modoEdicion = !modoEdicion;
        if (btnAgregar) btnAgregar.classList.toggle('noVisible', !modoEdicion);
        document.querySelectorAll('.btnEliminar').forEach(b => b.classList.toggle('noVisible', !modoEdicion));
        document.querySelectorAll('.iconPersona').forEach(i => i.classList.toggle('noVisible', modoEdicion));
    });
}

if (btnAgregar) btnAgregar.addEventListener('click', () => abrirFormulario());
if (btnCancelar) btnCancelar.addEventListener('click', cerrarFormulario);
if (menuFlotante) {
    menuFlotante.addEventListener('click', e => {
        if (e.target === menuFlotante) cerrarFormulario();
    });
}

if (dashboard) {
    dashboard.addEventListener('click', e => {
        const btnMod = e.target.closest('.btnModificar');
        if (btnMod) {
            abrirFormulario(Number(btnMod.dataset.id));
            return;
        }

        const btnDel = e.target.closest('.btnEliminar');
        if (btnDel) {
            const id = Number(btnDel.dataset.id);
            if (!confirm('¿Deseas eliminar a este empleado?')) return;
            personal = personal.filter(p => p.id !== id);
            guardarPersonal();
            mostrarPersonal();
        }
    });
}

if (formPersonal) {
    formPersonal.addEventListener('submit', e => {
        e.preventDefault();
        const nombre = inputNombre ? inputNombre.value.trim() : '';
        const horario = selectHorario ? selectHorario.value : 'Matutino';
        const puesto = selectPuesto ? selectPuesto.value : 'Staff';
        if (!nombre) return;

        if (idModificar !== null) {
            const idx = personal.findIndex(p => p.id === idModificar);
            if (idx !== -1) {
                personal[idx] = { ...personal[idx], nombre, horario, puesto };
            }
        } else {
            const nuevoPersonal = {
                id: personal.length > 0 ? Math.max(...personal.map(p => p.id)) + 1 : 1,
                nombre,
                horario,
                puesto
            };
            personal.push(nuevoPersonal);
            crearPerfilTrabajador(nuevoPersonal, true);
        }

        guardarPersonal();
        mostrarPersonal();
        cerrarFormulario();
    });
}

asegurarPerfilesPersonal();
mostrarPersonal();