const PERMISOS = {
    cliente: { paginas: ["catalogo.html", "ajustes.html", "cuenta.html"], inicio: "catalogo.html" },
    jefe: { paginas: ["inicio.html", "catalogo.html", "ajustes.html", "dashboard.html", "personal.html", "cuenta.html"], inicio: "inicio.html" },
    admin: { paginas: ["inicio.html", "catalogo.html", "ajustes.html", "personal.html", "cuenta.html"], inicio: "inicio.html" },
    trabajador: { paginas: ["inicio.html", "catalogo.html", "ajustes.html", "cuenta.html"], inicio: "inicio.html" }
};

document.addEventListener("DOMContentLoaded", () => {
    const pagina = window.location.pathname.split("/").pop().split("?")[0] || "index.html";
    if (pagina === "index.html" || pagina === "registro.html") return;

    const sesion = JSON.parse(sessionStorage.getItem("sesionActiva") || "null");
    const rol = (sesion?.rol || "").toLowerCase();

    if (!PERMISOS[rol]) {
        window.location.href = "../index.html";
        return;
    }

    const config = PERMISOS[rol];
    if (!config.paginas.includes(pagina)) {
        window.location.href = config.inicio;
        return;
    }

    const todas = Object.values(PERMISOS).flatMap(p => p.paginas);

    document.querySelectorAll("a[href]").forEach(a => {
        const href = a.getAttribute("href") || "";
        if (href.includes("index.html")) {
            a.onclick = e => {
                e.preventDefault();
                sessionStorage.removeItem("sesionActiva");
                window.location.href = "../index.html";
            };
            return;
        }
        const destino = href.split("/").pop().split("?")[0];
        if (todas.includes(destino) && !config.paginas.includes(destino)) {
            (a.closest("li") || a).style.display = "none";
        }
    });
});