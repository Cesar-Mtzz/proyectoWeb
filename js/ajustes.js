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
        <div style="background:#222; color:#fff; padding:16px; border-radius:8px; max-width:460px; width:92%; max-height:85vh; overflow-y:auto; font-family:sans-serif; font-size:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
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

function verHistorialCompras() {
    const s = getSesion();
    if (!s) return salirAjustes();
    if ((s.rol || "").toLowerCase() !== "cliente") return;

    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    const userActual = String(s.usuario || "").toLowerCase();
    const nombreActual = String(s.nombre || "").toLowerCase();

    const misPedidos = pedidos.filter(p => {
        if (p.usuario) {
            return String(p.usuario).toLowerCase() === userActual;
        }
        return nombreActual && String(p.cliente || "").toLowerCase() === nombreActual;
    }).reverse();

    if (misPedidos.length === 0) {
        abrirModal("Historial de compras", `<p>Sin compras registradas para ${s.nombre || "tu cuenta"}.</p>`);
        return;
    }

    const htmlPedidos = misPedidos.map(p => `
        <div style="background:#181412; border:1px solid rgba(255,255,255,0.12); border-radius:6px; padding:10px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">
                <strong>${p.id}</strong>
                <span style="padding:2px 8px; border-radius:12px; font-size:12px; background:${p.estado === 'Entregado' ? '#2e7d32' : '#a67c52'}; color:#fff;">
                    ${p.estado}
                </span>
            </div>
            <p style="margin:2px 0; font-size:12px; opacity:0.8;">A nombre de: <strong>${p.cliente || "Sin nombre"}</strong></p>
            <p style="margin:2px 0 8px; font-size:12px; opacity:0.7;">Fecha: ${p.fecha}</p>
            <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:6px; display:flex; flex-direction:column; gap:4px;">
                ${(p.productos || []).map(item => `
                    <div style="display:flex; justify-content:space-between; font-size:13px;">
                        <span>${item.cantidad}x ${item.producto.name}</span>
                        <span>$${(item.producto.price * item.cantidad).toFixed(2)}</span>
                    </div>
                `).join("")}
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.1); margin-top:6px; padding-top:6px; display:flex; justify-content:space-between;">
                <span>Total</span>
                <strong>$${Number(p.total).toFixed(2)} MXN</strong>
            </div>
        </div>
    `).join("");

    abrirModal("Historial de compras", htmlPedidos);
}

function irALoginAdmin() {
    sessionStorage.removeItem("sesionActiva");
    window.location.href = "../index.html";
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
        if (rol !== "trabajador") {
            btnAdmin.style.display = "none";
        } else {
            btnAdmin.onclick = irALoginAdmin;
        }
    }

    const btnHistorial = document.getElementById("btnHistorialCompras");
    if (btnHistorial) {
        if (rol !== "cliente") {
            btnHistorial.style.display = "none";
        } else {
            btnHistorial.onclick = verHistorialCompras;
        }
    }

    const onClick = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.onclick = fn;
    };

    onClick("btnCuentaAjustes", verCuenta);
    onClick("btnAdministrarPerfil", editarPerfil);
    onClick("btnCerrarSesionAjustes", salirAjustes);
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