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
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (!usuarios || usuarios.length < 4) {
        localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
    }
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
        u => u.usuario.toLowerCase() === usuario && u.contraseña === password
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