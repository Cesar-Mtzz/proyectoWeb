const INFO_ROLES_CUENTA = {
    cliente: {
        tituloRol: "Cliente",
        descripcion: "Cuenta de cliente para ver el catálogo y configurar tu perfil.",
        accesos: [
            "Ver el catálogo y el detalle de cada producto.",
            "Editar la configuración de tu cuenta."
        ],
        vistaPrincipal: "catalogo.html",
        textoPrincipal: "Ir al catálogo"
    },
    trabajador: {
        tituloRol: "Trabajador",
        descripcion: "Cuenta de trabajador con acceso a inicio, catálogo y ajustes.",
        accesos: [
            "Acceder a Inicio, Catálogo y Ajustes.",
            "Subir y eliminar productos del catálogo.",
            "Sin acceso a Dashboard ni a Personal."
        ],
        vistaPrincipal: "inicio.html",
        textoPrincipal: "Ir a inicio"
    },
    admin: {
        tituloRol: "Administrador",
        descripcion: "Cuenta de administrador con acceso a inicio, catálogo, ajustes y personal.",
        accesos: [
            "Acceder a Inicio, Catálogo, Ajustes y Personal.",
            "Subir y eliminar productos del catálogo.",
            "Sin acceso al Dashboard."
        ],
        vistaPrincipal: "inicio.html",
        textoPrincipal: "Ir a inicio"
    },
    jefe: {
        tituloRol: "Jefe",
        descripcion: "Cuenta con acceso a todas las secciones del sistema.",
        accesos: [
            "Acceso a Inicio, Catálogo, Ajustes, Dashboard y Personal.",
            "Subir y eliminar productos del catálogo."
        ],
        vistaPrincipal: "inicio.html",
        textoPrincipal: "Ir a inicio"
    }
};

function obtenerDatosCuenta() {
    if (typeof obtenerUsuarioSesion === "function") {
        const sesion = obtenerUsuarioSesion();
        if (sesion) return sesion;
    }

    try {
        return JSON.parse(sessionStorage.getItem("sesionActiva"));
    } catch {
        return null;
    }
}

function renderizarCuenta() {
    const panel = document.getElementById("cuentaPanel");
    if (!panel) return;

    const usuario = obtenerDatosCuenta();
    if (!usuario) {
        window.location.href = "../index.html";
        return;
    }

    const rolClave = (usuario.rol || "cliente").toLowerCase().trim();
    const infoRol = INFO_ROLES_CUENTA[rolClave] || INFO_ROLES_CUENTA.cliente;

    const nombreTexto = usuario.nombre || "Sin nombre";
    const handleTexto = usuario.usuario ? `@${usuario.usuario}` : "Sin usuario";
    const correoTexto = usuario.correo && usuario.correo.trim() !== "" ? usuario.correo : "No registrado";
    const telefonoTexto = usuario.telefono && usuario.telefono.trim() !== "" ? usuario.telefono : "No registrado";

    panel.innerHTML = `
        <div class="cuenta-card">
            <div class="cuenta-header">
                <div>
                    <span class="cuenta-rol-badge">${infoRol.tituloRol}</span>
                    <h1>${nombreTexto}</h1>
                </div>
                <div class="cuenta-estatus">Activa</div>
            </div>

            <div class="cuenta-grid">
                <div class="cuenta-dato">
                    <span>Usuario</span>
                    <strong>${handleTexto}</strong>
                </div>
                <div class="cuenta-dato">
                    <span>Rol</span>
                    <strong>${infoRol.tituloRol}</strong>
                </div>
                <div class="cuenta-dato">
                    <span>Correo</span>
                    <strong>${correoTexto}</strong>
                </div>
                <div class="cuenta-dato">
                    <span>Teléfono</span>
                    <strong>${telefonoTexto}</strong>
                </div>
            </div>

            <div class="cuenta-permisos">
                <h2>Permisos de la cuenta</h2>
                <p>${infoRol.descripcion}</p>
                <ul class="cuenta-lista">
                    ${infoRol.accesos.map(item => `<li>${item}</li>`).join("")}
                </ul>
            </div>

            <div class="cuenta-acciones">
                <a href="${infoRol.vistaPrincipal}" class="cuenta-btn cuenta-btn-principal">${infoRol.textoPrincipal}</a>
                <a href="ajustes.html" class="cuenta-btn cuenta-btn-principal">Ajustes</a>
                <button id="btnSalirCuenta" type="button" class="cuenta-btn cuenta-btn-salir">Cerrar sesión</button>
            </div>
        </div>
    `;

    const btnSalir = document.getElementById("btnSalirCuenta");
    if (btnSalir) {
        btnSalir.addEventListener("click", () => {
            if (typeof cerrarSesion === "function") {
                cerrarSesion();
            } else {
                sessionStorage.removeItem("sesionActiva");
                localStorage.removeItem("rolUsuario");
                window.location.href = "../index.html";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", renderizarCuenta);