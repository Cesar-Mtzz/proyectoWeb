function crearPerfilTrabajador(persona, mostrarAlerta = false) {
    if (typeof inicializarUsuarios === 'function') {
        inicializarUsuarios();
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const yaExiste = usuarios.some(
        u => (u.nombre || "").toLowerCase() === persona.nombre.toLowerCase()
    );
    if (yaExiste) return null;

    const nuevoPerfil = typeof crearUsuarioTrabajador === 'function'
        ? crearUsuarioTrabajador(persona, usuarios)
        : {
            nombre: persona.nombre,
            usuario: generarUsuario(persona.nombre, usuarios),
            contraseña: "123",
            rol: "trabajador",
            correo: "",
            telefono: ""
        };

    usuarios.push(nuevoPerfil);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    if (mostrarAlerta) {
        alert(`Personal agregado. Perfil creado:\nUsuario: ${nuevoPerfil.usuario}\nContraseña: ${nuevoPerfil.contraseña}\nRol: trabajador`);
    }

    return nuevoPerfil;
}