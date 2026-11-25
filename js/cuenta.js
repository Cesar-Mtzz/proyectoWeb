const ROLES_CUENTA = {
    cliente: {
        rol: "Cliente",
        desc: "Cuenta de cliente para ver el catálogo y configurar tu perfil.",
        permisos: ["Ver el catálogo y detalles de productos.", "Editar configuración de tu cuenta."],
        ir: "catalogo.html",
        textoIr: "Ir al catálogo"
    },
    trabajador: {
        rol: "Trabajador",
        desc: "Cuenta de trabajador con acceso a inicio, catálogo y ajustes.",
        permisos: ["Acceder a Inicio, Catálogo y Ajustes.", "Subir y eliminar productos.", "Sin acceso a Dashboard ni Personal."],
        ir: "inicio.html",
        textoIr: "Ir a inicio"
    },
    admin: {
        rol: "Administrador",
        desc: "Cuenta de administrador con acceso a inicio, catálogo, ajustes y personal.",
        permisos: ["Acceder a Inicio, Catálogo, Ajustes y Personal.", "Subir y eliminar productos.", "Sin acceso a Dashboard."],
        ir: "inicio.html",
        textoIr: "Ir a inicio"
    },
    jefe: {
        rol: "Jefe",
        desc: "Cuenta con acceso a todas las secciones del sistema.",
        permisos: ["Acceso a Inicio, Catálogo, Ajustes, Dashboard y Personal.", "Subir y eliminar productos."],
        ir: "inicio.html",
        textoIr: "Ir a inicio"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const panel = document.getElementById("cuentaPanel");
    if (!panel) return;

    const u = typeof obtenerUsuarioSesion === "function"
        ? obtenerUsuarioSesion()
        : JSON.parse(sessionStorage.getItem("sesionActiva") || "null");

    if (!u) {
        window.location.href = "../index.html";
        return;
    }

    const info = ROLES_CUENTA[(u.rol || "cliente").toLowerCase()] || ROLES_CUENTA.cliente;

    panel.innerHTML = `
        <div class="cuenta-card">
            <div class="cuenta-header">
                <div>
                    <span class="cuenta-rol-badge">${info.rol}</span>
                    <h1>${u.nombre || "Sin nombre"}</h1>
                </div>
                <div class="cuenta-estatus">Activa</div>
            </div>
            <div class="cuenta-grid">
                <div class="cuenta-dato"><span>Usuario</span><strong>@${u.usuario || "usuario"}</strong></div>
                <div class="cuenta-dato"><span>Rol</span><strong>${info.rol}</strong></div>
                <div class="cuenta-dato"><span>Correo</span><strong>${u.correo || "No registrado"}</strong></div>
                <div class="cuenta-dato"><span>Teléfono</span><strong>${u.telefono || "No registrado"}</strong></div>
            </div>
            <div class="cuenta-permisos">
                <h2>Permisos de la cuenta</h2>
                <p>${info.desc}</p>
                <ul class="cuenta-lista">${info.permisos.map(p => `<li>${p}</li>`).join("")}</ul>
            </div>
            <div class="cuenta-acciones">
                <a href="${info.ir}" class="cuenta-btn cuenta-btn-principal">${info.textoIr}</a>
                <a href="ajustes.html" class="cuenta-btn cuenta-btn-principal">Ajustes</a>
                <button id="btnSalirCuenta" type="button" class="cuenta-btn cuenta-btn-salir">Cerrar sesión</button>
            </div>
        </div>
    `;

    document.getElementById("btnSalirCuenta").onclick = () => {
        if (typeof cerrarSesion === "function") return cerrarSesion();
        sessionStorage.removeItem("sesionActiva");
        window.location.href = "../index.html";
    };
});