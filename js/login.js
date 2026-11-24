// ! No modificar si no entienden que hace, mejor preguntar a alguie o apoyarse con una IA !

// ==============================
// Clase Usuario
// ==============================
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

// ==============================
// Usuarios predeterminados
// ==============================
const usuariosIniciales = [
    new User("Carlos Ramírez", "admin", "admin123", "admin"),
    new User("Mariana Torres", "gerente", "gerente123", "gerente"),
    new User("Luis Hernández", "empleado", "empleado123", "empleado")
];

// ==============================
// Inicializar usuarios
// ==============================
function inicializarUsuarios() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));

    if (!usuarios) {
        usuarios = usuariosIniciales;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

// ==============================
// Crear usuario
// ==============================
function crearUsuario(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const contraseña = document.getElementById("password").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Comprobar si el nombre de usuario ya existe
    const existe = usuarios.some(
        u => u.usuario.toLowerCase() === usuario.toLowerCase()
    );

    if (existe) {
        alert("Este nombre de usuario ya está registrado.");
        return;
    }

    // Todo registro nuevo tendrá el rol usuario
    const nuevoUsuario = new User(
        nombre,
        usuario,
        contraseña,
        "usuario",
        correo,
        telefono
    );

    usuarios.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado correctamente.");

    window.location.href = "../index.html";
}

// ==============================
// Iniciar sesión
// ==============================
function iniciarSesion(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contraseña = document.getElementById("password").value;

    const errorMsg = document.getElementById("errorMsg");

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioEncontrado = usuarios.find(
        u => u.usuario.toLowerCase() === usuario.toLowerCase()
        && u.contraseña === contraseña
    );

    if (usuarioEncontrado) {
        errorMsg.hidden = true;

        sessionStorage.setItem(
            "sesionActiva",
            JSON.stringify(usuarioEncontrado)
        );

        window.location.href = "./html/inicio.html";

    } else {
        errorMsg.hidden = false;
    }
}

// ==============================
// Obtener rol del usuario actual
// ==============================
function obtenerRol() {
    const sesion = JSON.parse(sessionStorage.getItem("sesionActiva"));

    return sesion ? sesion.rol : null;
}

// ==============================
// Obtener usuario de la sesión
// ==============================
function obtenerUsuarioSesion() {
    return JSON.parse(sessionStorage.getItem("sesionActiva"));
}

// ==============================
// Comprobar sesión activa
// ==============================
function saltarLoginSiAutenticado() {
    const sesion = sessionStorage.getItem("sesionActiva");

    if (sesion) {
        window.location.href = "./html/inicio.html";
    }
}

// ==============================
// Cerrar sesión
// ==============================
function cerrarSesion() {
    sessionStorage.removeItem("sesionActiva");

    window.location.href = "../index.html";
}

// Inicialización
inicializarUsuarios();
