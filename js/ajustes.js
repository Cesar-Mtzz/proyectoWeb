const ROLES_INFO = {
    cliente: { rol: "Cliente", texto: "Ver catálogo y editar perfil." },
    trabajador: { rol: "Trabajador", texto: "Inicio, catálogo, ajustes y productos." },
    admin: { rol: "Administrador", texto: "Inicio, catálogo, ajustes, personal y productos." },
    jefe: { rol: "Jefe", texto: "Acceso completo al sistema." }
};

let modal;
const cerrarModal = () => { if (modal) modal.style.display = "none"; };

function abrirModal(titulo, html) {
    modal.innerHTML = `
        <div style="background:#222; color:#fff; padding:16px; border-radius:6px; max-width:360px; width:90%; font-family:sans-serif; font-size:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <strong>${titulo}</strong>
                <button id="mCerrar" type="button">✕</button>
            </div>
            <div>${html}</div>
        </div>
    `;
    document.getElementById("mCerrar").onclick = cerrarModal;
    modal.style.display = "flex";
}

function getSesion() {
    if (typeof obtenerUsuarioSesion === "function") return obtenerUsuarioSesion();
    return JSON.parse(sessionStorage.getItem("sesionActiva") || "null");
}

function salirAjustes() {
    if (typeof cerrarSesion === "function") return cerrarSesion();
    sessionStorage.removeItem("sesionActiva");
    window.location.href = "../index.html";
}

function verCuenta() {
    const s = getSesion();
    if (!s) return salirAjustes();
    const info = ROLES_INFO[(s.rol || "cliente").toLowerCase()] || ROLES_INFO.cliente;

    abrirModal("Estado de cuenta", `
        <p>Estatus: Activa</p>
        <p>Nombre: ${s.nombre || "Sin nombre"}</p>
        <p>Usuario: @${s.usuario || "usuario"}</p>
        <p>Rol: ${info.rol}</p>
        <p>Correo: ${s.correo || "No registrado"}</p>
        <p>Teléfono: ${s.telefono || "No registrado"}</p>
        <p>${info.texto}</p>
    `);
}

function editarPerfil() {
    const s = getSesion();
    if (!s) return salirAjustes();

    abrirModal("Administrar perfil", `
        <form id="fPerfil" style="display:flex; flex-direction:column; gap:6px;">
            <label>Nombre</label>
            <input id="pNombre" type="text" required value="${s.nombre || ""}">
            <label>Correo</label>
            <input id="pCorreo" type="email" value="${s.correo || ""}">
            <label>Teléfono</label>
            <input id="pTel" type="tel" value="${s.telefono || ""}">
            <div style="display:flex; gap:8px; margin-top:8px;">
                <button type="button" id="pCancel">Cancelar</button>
                <button type="submit">Guardar</button>
            </div>
        </form>
    `);

    document.getElementById("pCancel").onclick = cerrarModal;
    document.getElementById("fPerfil").onsubmit = e => {
        e.preventDefault();
        s.nombre = document.getElementById("pNombre").value.trim();
        s.correo = document.getElementById("pCorreo").value.trim();
        s.telefono = document.getElementById("pTel").value.trim();
        sessionStorage.setItem("sesionActiva", JSON.stringify(s));

        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
        const i = usuarios.findIndex(u => u.usuario === s.usuario);
        if (i !== -1) {
            usuarios[i] = { ...usuarios[i], ...s };
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }

        cerrarModal();
        alert("Perfil actualizado.");
    };
}

function entrarAdmin() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const admin = usuarios.find(u => u.usuario === "admin") || {
        nombre: "Carlos Ramírez", usuario: "admin", rol: "admin", correo: "", telefono: ""
    };
    sessionStorage.setItem("sesionActiva", JSON.stringify(admin));
    window.location.href = "inicio.html";
}

document.addEventListener("DOMContentLoaded", () => {
    modal = document.createElement("div");
    modal.style.cssText = "display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99999; justify-content:center; align-items:center;";
    modal.onclick = e => { if (e.target === modal) cerrarModal(); };
    document.body.appendChild(modal);

    const s = getSesion();
    const rol = (s?.rol || "cliente").toLowerCase();

    const btnAdmin = document.getElementById("btnLoginAdmin");
    if (btnAdmin) {
        if (rol === "admin" || rol === "jefe") btnAdmin.style.display = "none";
        else btnAdmin.onclick = entrarAdmin;
    }

    const onClick = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.onclick = fn;
    };

    onClick("btnCuentaAjustes", verCuenta);
    onClick("btnAdministrarPerfil", editarPerfil);
    onClick("btnCerrarSesionAjustes", salirAjustes);
    onClick("btnHistorialCompras", () => abrirModal("Historial de compras", `<p>Sin compras registradas para ${s?.nombre || "tu cuenta"}.</p>`));
    onClick("btnSoporteTecnico", () => abrirModal("Soporte técnico", `<p>soporte@cafeteriaweb.local</p>`));
    onClick("btnBolsaTrabajo", () => abrirModal("Bolsa de trabajo", `<p>Vacantes: barra y preparación.</p>`));

    const btnNavSalir = document.getElementById("btnCerrarSesion");
    if (btnNavSalir) {
        btnNavSalir.onclick = e => {
            e.preventDefault();
            salirAjustes();
        };
    }
});