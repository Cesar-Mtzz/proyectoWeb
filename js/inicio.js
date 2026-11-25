function animarBoton(boton) {
    boton.style.transform = "scale(0.95)";
    setTimeout(() => boton.style.transform = "scale(1)", 100);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tarjeta").forEach(tarjeta => {
        tarjeta.onmouseenter = () => tarjeta.style.transform = "translateY(-5px)";
        tarjeta.onmouseleave = () => tarjeta.style.transform = "translateY(0)";
    });

    const buscador = document.getElementById("buscador");
    if (buscador) {
        buscador.onfocus = () => buscador.style.transform = "scale(1.02)";
        buscador.onblur = () => buscador.style.transform = "scale(1)";
    }
});