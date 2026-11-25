const DESCRIPCION_CUENTA_AJUSTES = {
    cliente: {
        titulo: "Cliente",
        detalle: "Puedes ver el catálogo, consultar detalles de productos y administrar tu perfil."
    },
    trabajador: {
        titulo: "Trabajador",
        detalle: "Puedes acceder a Inicio, Catálogo y Ajustes, así como subir y eliminar productos."
    },
    admin: {
        titulo: "Administrador",
        detalle: "Puedes acceder a Inicio, Catálogo, Ajustes y Personal, y gestionar productos del catálogo."
    },
    jefe: {
        titulo: "Jefe",
        detalle: "Tienes acceso completo a todas las secciones y módulos del sistema."
    }
};

function obtenerSesionAjustes() {
    if (typeof obtenerUsuarioSesion === "function") {
        const u = obtenerUsuarioSesion();
        if (u) return u;
    }
    try {
        return JSON.parse(sessionStorage.getItem("sesionActiva"));
    } catch {
        return null;
    }
}

function salirDesdeAjustes() {
    if (typeof cerrarSesion === "function") {
        cerrarSesion();
    } else {
        sessionStorage.removeItem("sesionActiva");
        localStorage.removeItem("rolUsuario");
        window.location.href = "../index.html";
    }
}

const modalAjustes = document.createElement("div");
modalAjustes.style.cssText = "display:none; position:fixed; inset:0; background:rgba(0, 0, 0, 0.7); z-index:99999; justify-content:center; align-items:center; padding:16px; box-sizing:border-box;";
document.body.appendChild(modalAjustes);

function cerrarModalAjustes() {
    modalAjustes.style.display = "none";
}

modalAjustes.addEventListener("click", (e) => {
    if (e.target === modalAjustes) cerrarModalAjustes();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalAjustes.style.display === "flex") {
        cerrarModalAjustes();
    }
});

function abrirModalAjustes(titulo, cuerpoHtml) {
    modalAjustes.innerHTML = `
        <div style="background:var(--bg-sec, #241b16); color:var(--fc-color, #ffffff); border:1px solid var(--acento-2, #d4a373); border-radius:10px; max-width:430px; width:100%; padding:18px; box-sizing:border-box; font-family:inherit; max-height:90vh; overflow-y:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px;">
                <h2 style="margin:0; font-size:18px;">${titulo}</h2>
                <button id="maCerrar" type="button" style="background:none; color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:6px; width:30px; height:30px; cursor:pointer;">✕</button>
            </div>
            ${cuerpoHtml}
        </div>
    `;
    document.getElementById("maCerrar").addEventListener("click", cerrarModalAjustes);
    modalAjustes.style.display = "flex";
}

function abrirEstadoCuenta() {
    const sesion = obtenerSesionAjustes();
    if (!sesion) {
        salirDesdeAjustes();
        return;
    }

    const rol = (sesion.rol || "cliente").toLowerCase().trim();
    const info = DESCRIPCION_CUENTA_AJUSTES[rol] || DESCRIPCION_CUENTA_AJUSTES.cliente;

    abrirModalAjustes(
        "Estado de cuenta",
        `
        <div style="display:flex; flex-direction:column; gap:8px; font-size:14px;">
            <p style="margin:0;"><strong>Estatus:</strong> Activa</p>
            <p style="margin:0;"><strong>Nombre:</strong> ${sesion.nombre || "Sin nombre"}</p>
            <p style="margin:0;"><strong>Usuario:</strong> @${sesion.usuario || "usuario"}</p>
            <p style="margin:0;"><strong>Tipo de cuenta:</strong> ${info.titulo}</p>
            <p style="margin:0;"><strong>Correo:</strong> ${sesion.correo || "No registrado"}</p>
            <p style="margin:0;"><strong>Teléfono:</strong> ${sesion.telefono || "No registrado"}</p>
            <p style="margin:6px 0 0 0; font-size:13.5px; color:var(--acento-2, #d4a373);">${info.detalle}</p>
        </div>
        `
    );
}

function cambiarAAdmin() {
    let usuarios = [];
    try {
        usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch {
        usuarios = [];
    }

    const adminUsuario = usuarios.find(u => (u.usuario || "").toLowerCase() === "admin") || {
        nombre: "Carlos Ramírez",
        usuario: "admin",
        contraseña: "admin123",
        rol: "admin",
        correo: "",
        telefono: ""
    };

    sessionStorage.setItem("sesionActiva", JSON.stringify(adminUsuario));
    window.location.href = "inicio.html";
}

function abrirAdministrarPerfil() {
    const sesion = obtenerSesionAjustes();
    if (!sesion) {
        salirDesdeAjustes();
        return;
    }

    abrirModalAjustes(
        "Administrar perfil",
        `
        <form id="formPerfilAjustes" style="display:flex; flex-direction:column; gap:10px;">
            <div>
                <label style="display:block; font-size:13px; margin-bottom:4px;">Rol</label>
                <input type="text" value="${sesion.rol || "cliente"}" disabled style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block; font-size:13px; margin-bottom:4px;">Nombre completo</label>
                <input id="apNombre" type="text" required value="${sesion.nombre || ""}" style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block; font-size:13px; margin-bottom:4px;">Correo electrónico</label>
                <input id="apCorreo" type="email" value="${sesion.correo || ""}" style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block; font-size:13px; margin-bottom:4px;">Teléfono</label>
                <input id="apTelefono" type="tel" value="${sesion.telefono || ""}" style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;">
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:6px;">
                <button id="apCancelar" type="button" style="background:rgba(255,255,255,0.12); color:inherit; border:none; border-radius:6px; padding:7px 12px; cursor:pointer;">Cancelar</button>
                <button type="submit" style="background:var(--acento, #a67c52); color:var(--bg-color, #140f0c); border:none; border-radius:6px; padding:7px 14px; font-weight:bold; cursor:pointer;">Guardar</button>
            </div>
        </form>
        `
    );

    document.getElementById("apCancelar").addEventListener("click", cerrarModalAjustes);
    document.getElementById("formPerfilAjustes").addEventListener("submit", (e) => {
        e.preventDefault();
        sesion.nombre = document.getElementById("apNombre").value.trim();
        sesion.correo = document.getElementById("apCorreo").value.trim();
        sesion.telefono = document.getElementById("apTelefono").value.trim();

        sessionStorage.setItem("sesionActiva", JSON.stringify(sesion));

        try {
            const lista = JSON.parse(localStorage.getItem("usuarios")) || [];
            const idx = lista.findIndex(u => (u.usuario || "").toLowerCase() === (sesion.usuario || "").toLowerCase());
            if (idx !== -1) {
                lista[idx] = { ...lista[idx], ...sesion };
                localStorage.setItem("usuarios", JSON.stringify(lista));
            }
        } catch {
            // Ignora error de storage
        }

        cerrarModalAjustes();
        alert("Perfil actualizado.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const sesion = obtenerSesionAjustes();
    const rol = sesion && sesion.rol ? String(sesion.rol).toLowerCase().trim() : "cliente";

    const btnLoginAdmin = document.getElementById("btnLoginAdmin");
    if (btnLoginAdmin) {
        if (rol === "admin" || rol === "jefe") {
            btnLoginAdmin.style.display = "none";
        } else {
            btnLoginAdmin.addEventListener("click", cambiarAAdmin);
        }
    }

    const btnCuenta = document.getElementById("btnCuentaAjustes");
    if (btnCuenta) {
        btnCuenta.addEventListener("click", abrirEstadoCuenta);
    }

    const btnHistorial = document.getElementById("btnHistorialCompras");
    if (btnHistorial) {
        btnHistorial.addEventListener("click", () => {
            abrirModalAjustes(
                "Historial de compras",
                `<p style="margin:0; font-size:14px;">Aún no hay compras registradas para <strong>${sesion ? sesion.nombre : "tu cuenta"}</strong>.</p>`
            );
        });
    }

    const btnSoporte = document.getElementById("btnSoporteTecnico");
    if (btnSoporte) {
        btnSoporte.addEventListener("click", () => {
            abrirModalAjustes(
                "Soporte técnico",
                `<p style="margin:0; font-size:14px;">Contacto de soporte: soporte@cafeteriaweb.local</p>`
            );
        });
    }

    const btnBolsa = document.getElementById("btnBolsaTrabajo");
    if (btnBolsa) {
        btnBolsa.addEventListener("click", () => {
            abrirModalAjustes(
                "Bolsa de trabajo",
                `<p style="margin:0; font-size:14px;">Vacantes disponibles: atención en barra y preparación.</p>`
            );
        });
    }

    const btnPerfil = document.getElementById("btnAdministrarPerfil");
    if (btnPerfil) {
        btnPerfil.addEventListener("click", abrirAdministrarPerfil);
    }

    const btnCerrarAjustes = document.getElementById("btnCerrarSesionAjustes");
    if (btnCerrarAjustes) {
        btnCerrarAjustes.addEventListener("click", salirDesdeAjustes);
    }

    const btnCerrarNav = document.getElementById("btnCerrarSesion");
    if (btnCerrarNav) {
        btnCerrarNav.addEventListener("click", (e) => {
            e.preventDefault();
            salirDesdeAjustes();
        });
    }
});