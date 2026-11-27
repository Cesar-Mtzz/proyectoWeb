class User {
    constructor(nombre, usuario, contraseña, rol, correo = "", telefono = "") {
        this.nombre = nombre;
        this.usuario = usuario;
        this.contraseña = contraseña;
        this.rol = rol;
        this.correo = correo;
        this.telefono = telefono;
    }
}

const usuariosIniciales = [
    new User("Sofía Mendoza", "cliente", "cliente123", "cliente"),
    new User("Roberto Navarro", "jefe", "jefe123", "jefe"),
    new User("Carlos Ramírez", "admin", "admin123", "admin"),
    new User("Luis Hernández", "trabajador", "trabajador123", "trabajador")
];

const personalBase = [
    { id: 1, nombre: "Carlos Eduardo Gomez", horario: "Matutino", puesto: "Gerente" },
    { id: 2, nombre: "Valeria Torres Ríos", horario: "Vespertino", puesto: "Gerente" },
    { id: 3, nombre: "Alejandro Silva Castro", horario: "Vespertino", puesto: "Staff" },
    { id: 4, nombre: "Sofía Ramírez Méndez", horario: "Vespertino", puesto: "Gerente en capacitación" },
    { id: 5, nombre: "Juan Martínez Hernández", horario: "Matutino", puesto: "En capacitación" }
];

function generarUsuarioDesdeNombre(nombre, usuariosExistentes) {
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
    while (usuariosExistentes.some(u => (u.usuario || "").toLowerCase() === usuario)) {
        usuario = `${base}${i}`;
        i++;
    }
    return usuario;
}

function crearUsuarioTrabajador(persona, usuariosExistentes) {
    const usuario = generarUsuarioDesdeNombre(persona.nombre, usuariosExistentes);
    return new User(
        persona.nombre,
        usuario,
        "123",
        "trabajador",
        `${usuario}@cafeteria.local`,
        ""
    );
}

function obtenerRutaBase() {
    return window.location.pathname.includes("/html/") ? "../" : "./";
}

function obtenerUsuarioSesion() {
    return JSON.parse(sessionStorage.getItem("sesionActiva"));
}

function obtenerRol() {
    const sesion = obtenerUsuarioSesion();
    return sesion ? sesion.rol : null;
}

function irAInicio() {
    const rol = obtenerRol();
    const destino = rol === "cliente" ? "catalogo.html" : "inicio.html";
    window.location.href = window.location.pathname.includes("/html/") ? destino : `html/${destino}`;
}

function inicializarUsuarios() {
    let guardados = JSON.parse(localStorage.getItem("usuarios"));
    if (!Array.isArray(guardados)) {
        guardados = [];
    }

    const usuarios = guardados.map(u =>
        new User(u.nombre, u.usuario, u.contraseña ?? u.password ?? "", u.rol, u.correo || "", u.telefono || "")
    );

    usuariosIniciales.forEach(base => {
        const existe = usuarios.some(u => (u.usuario || "").toLowerCase() === base.usuario.toLowerCase());
        if (!existe) {
            usuarios.push(new User(base.nombre, base.usuario, base.contraseña, base.rol, base.correo, base.telefono));
        }
    });

    let listaPersonal = JSON.parse(localStorage.getItem("personal"));
    if (!Array.isArray(listaPersonal)) {
        listaPersonal = personalBase;
    }

    listaPersonal.forEach(persona => {
        const yaExiste = usuarios.some(
            u => (u.nombre || "").toLowerCase() === String(persona.nombre || "").toLowerCase()
        );
        if (!yaExiste && persona.nombre) {
            usuarios.push(crearUsuarioTrabajador(persona, usuarios));
        }
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function crearUsuario(e) {
    e.preventDefault();
    inicializarUsuarios();

    const nombre = document.getElementById("nombre").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const contraseña = document.getElementById("password").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios"));

    if (usuarios.some(u => u.usuario.toLowerCase() === usuario.toLowerCase())) {
        alert("Este usuario ya existe.");
        return;
    }

    usuarios.push(new User(nombre, usuario, contraseña, "cliente", correo, telefono));
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado correctamente.");
    window.location.href = `${obtenerRutaBase()}index.html`;
}

function iniciarSesion(e) {
    e.preventDefault();
    inicializarUsuarios();

    const usuario = document.getElementById("usuario").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const encontrado = usuarios.find(
        u => (u.usuario || "").toLowerCase() === usuario && (u.contraseña ?? u.password) === password
    );

    if (encontrado) {
        if (errorMsg) errorMsg.hidden = true;
        sessionStorage.setItem("sesionActiva", JSON.stringify(encontrado));
        irAInicio();
    } else if (errorMsg) {
        errorMsg.hidden = false;
    }
}

function saltarLoginSiAutenticado() {
    if (obtenerUsuarioSesion()) irAInicio();
}

function cerrarSesion() {
    sessionStorage.removeItem("sesionActiva");
    window.location.href = `${obtenerRutaBase()}index.html`;
}

inicializarUsuarios();