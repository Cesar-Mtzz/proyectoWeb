function animarBoton(boton) {
    boton.style.transform = "scale(0.95)";
    setTimeout(function() {
        boton.style.transform = "scale(1)";
    }, 100);
}
