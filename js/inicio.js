function animarBoton(boton) {
    boton.style.transform = "scale(0.95)";
    setTimeout(function() {
        boton.style.transform = "scale(1)";
    }, 100);
}

document.addEventListener("DOMContentLoaded", function() {
    const tarjetas = document.querySelectorAll(".tarjeta");
    tarjetas.forEach(function(tarjeta) {
        tarjeta.addEventListener("mouseenter", function() {
            tarjeta.style.transform = "translateY(-5px)";
        });
        tarjeta.addEventListener("mouseleave", function() {
            tarjeta.style.transform = "translateY(0)";
        });
    });

    const buscador = document.getElementById("buscador");
    if (buscador) {
        buscador.addEventListener("focus", function() {
            buscador.style.transform = "scale(1.02)";
        });
        buscador.addEventListener("blur", function() {
            buscador.style.transform = "scale(1)";
        });
    }
});