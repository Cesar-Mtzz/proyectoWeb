const PERMISOS_POR_ROL = {
    cliente: {
        label: "Cliente",
        paginas: ["catalogo.html", "ajustes.html", "cuenta.html"],
        inicio: "catalogo.html"
    },
    jefe: {
        label: "Jefe",
        paginas: ["inicio.html", "catalogo.html", "ajustes.html", "dashboard.html", "personal.html", "cuenta.html"],
        inicio: "inicio.html"
    },
    admin: {
        label: "Admin",
        paginas: ["inicio.html", "catalogo.html", "ajustes.html", "personal.html", "cuenta.html"],
        inicio: "inicio.html"
    },
    trabajador: {
        label: "Trabajador",
        paginas: ["inicio.html", "catalogo.html", "ajustes.html", "cuenta.html"],
        inicio: "inicio.html"
    }
};

function obtenerRolActivo() {
    try {
        const sesion = JSON.parse(sessionStorage.getItem("sesionActiva"));
        const rol = sesion && sesion.rol ? String(sesion.rol).toLowerCase().trim() : "";
        return PERMISOS_POR_ROL[rol] ? rol : null;
    } catch {
        return null;
    }
}

function obtenerPaginaActual() {
    const ruta = window.location.pathname || "";
    const limpia = ruta.split("?")[0].split("#")[0];
    const archivo = limpia.substring(limpia.lastIndexOf("/") + 1);
    return archivo || "index.html";
}

function aplicarPermisos() {
    const pagina = obtenerPaginaActual();

    if (pagina === "index.html" || pagina === "registro.html" || pagina === "") {
        return;
    }

    const rol = obtenerRolActivo();
    if (!rol) {
        window.location.href = "../index.html";
        return;
    }

    const config = PERMISOS_POR_ROL[rol];

    if (!config.paginas.includes(pagina)) {
        window.location.href = config.inicio;
        return;
    }

    document.querySelectorAll("a[href]").forEach((enlace) => {
        const href = enlace.getAttribute("href") || "";

        if (href.includes("index.html")) {
            enlace.addEventListener("click", (e) => {
                e.preventDefault();
                sessionStorage.removeItem("sesionActiva");
                localStorage.removeItem("rolUsuario");
                window.location.href = "../index.html";
            });
            return;
        }

        const destino = href.substring(href.lastIndexOf("/") + 1).split("?")[0];
        if (!destino) return;

        const esVistaProtegida = Object.values(PERMISOS_POR_ROL).some((item) =>
            item.paginas.includes(destino)
        );

        if (esVistaProtegida && !config.paginas.includes(destino)) {
            const contenedorEnlace = enlace.closest("li") || enlace;
            contenedorEnlace.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", aplicarPermisos);