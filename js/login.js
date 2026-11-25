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

const ROLES_VALIDOS = ["cliente", "jefe", "admin", "trabajador"];

const INICIO_POR_ROL = {
    cliente: "catalogo.html",
    jefe: "inicio.html",
    admin: "inicio.html",
    trabajador: "inicio.html"
};

const usuariosIniciales = [
    new User("Sofía Mendoza", "cliente", "cliente123", "cliente"),
    new User("Roberto Navarro", "jefe", "jefe123", "jefe"),
    new User("Carlos Ramírez", "admin", "admin123", "admin"),
    new User("Luis Hernández", "trabajador", "trabajador123", "trabajador")
];

function obtenerRutaBase() {
    return window.location.pathname.includes("/html/") ? "../" : "./";
}

function obtenerDestinoPorRol(rol) {
    const normalizado = (rol || "").toLowerCase().trim();
    return INICIO_POR_ROL[normalizado] || "inicio.html";
}

function irAInicio() {
    const sesion = obtenerUsuarioSesion();
    const rol = sesion ? (sesion.rol || "").toLowerCase().trim() : "cliente";
    const destino = obtenerDestinoPorRol(rol);

    if (window.location.pathname.includes("/html/")) {
        window.location.href = destino;
    } else {
        window.location.href = `html/${destino}`;
    }
}

function inicializarUsuarios(forzarReinicio = false) {
    let usuarios = null;

    if (!forzarReinicio) {
        try {
            usuarios = JSON.parse(localStorage.getItem("usuarios"));
        } catch {
            usuarios = null;
        }
    }

    const tieneLosCuatro =
        Array.isArray(usuarios) &&
        usuarios.some(u => (u.usuario || "").toLowerCase() === "cliente") &&
        usuarios.some(u => (u.usuario || "").toLowerCase() === "jefe") &&
        usuarios.some(u => (u.usuario || "").toLowerCase() === "admin") &&
        usuarios.some(u => (u.usuario || "").toLowerCase() === "trabajador");

    if (!tieneLosCuatro || forzarReinicio) {
        usuarios = usuariosIniciales.slice();
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

function crearUsuario(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const contraseña = document.getElementById("password").value;

    inicializarUsuarios(false);
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.some(
        u => (u.usuario || "").toLowerCase() === usuario.toLowerCase()
    );

    if (existe) {
        alert("Este nombre de usuario ya está registrado.");
        return;
    }

    const nuevoUsuario = new User(
        nombre,
        usuario,
        contraseña,
        "cliente",
        correo,
        telefono
    );

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado correctamente.");
    window.location.href = `${obtenerRutaBase()}index.html`;
}

function iniciarSesion(e) {
    e.preventDefault();

    inicializarUsuarios(false);

    const usuarioInput = document.getElementById("usuario");
    const passwordInput = document.getElementById("password");
    const errorMsg = document.getElementById("errorMsg");

    const usuarioIngresado = usuarioInput ? usuarioInput.value.trim().toLowerCase() : "";
    const passwordIngresado = passwordInput ? passwordInput.value : "";

    let usuarios = [];
    try {
        usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch {
        usuarios = [];
    }

    let usuarioEncontrado = usuarios.find(
        u => (u.usuario || "").toLowerCase() === usuarioIngresado
        && u.contraseña === passwordIngresado
    );

    if (!usuarioEncontrado) {
        usuarioEncontrado = usuariosIniciales.find(
            u => u.usuario.toLowerCase() === usuarioIngresado
            && u.contraseña === passwordIngresado
        );
    }

    if (usuarioEncontrado) {
        if (errorMsg) errorMsg.hidden = true;
        sessionStorage.setItem("sesionActiva", JSON.stringify(usuarioEncontrado));
        irAInicio();
    } else if (errorMsg) {
        errorMsg.hidden = false;
    }
}

function obtenerRol() {
    const sesion = obtenerUsuarioSesion();
    return sesion && sesion.rol ? String(sesion.rol).toLowerCase().trim() : null;
}

function obtenerUsuarioSesion() {
    try {
        return JSON.parse(sessionStorage.getItem("sesionActiva"));
    } catch {
        return null;
    }
}

function saltarLoginSiAutenticado() {
    const sesion = obtenerUsuarioSesion();
    if (sesion && sesion.rol) {
        irAInicio();
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("sesionActiva");
    localStorage.removeItem("rolUsuario");
    window.location.href = `${obtenerRutaBase()}index.html`;
}

inicializarUsuarios(false);