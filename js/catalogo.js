const contenedor = document.getElementById('productos');
const buscador = document.getElementById('buscador');
const IMG_RESPALDO = '../imagenes/coffee-latte.jpg';
const ROLES_GESTION = ['trabajador', 'admin', 'jefe'];

const productosBase = [
    { name: 'Coffee latte', category: 'cafe', price: 48, description: 'Bebida caliente suave y cremosa, ideal para empezar el día.', hechoDe: 'Shot de espresso, leche entera vaporizada y una capa ligera de espuma.', img: '../icons/coffee-latte.svg' },
    { name: 'Espresso coffee', category: 'cafe', price: 32, description: 'Café corto e intenso con sabor concentrado.', hechoDe: 'Granos de café molidos finos extraídos con agua caliente a presión.', img: '../icons/espresso-coffee.svg' },
    { name: 'Cappuccino', category: 'cafe', price: 46, description: 'Clásico de cafetería con balance entre café y espuma de leche.', hechoDe: 'Espresso, leche vaporizada y espuma densa y cremosa.', img: '../icons/cappuccino.svg' },
    { name: 'Iced coffee', category: 'frios', price: 45, description: 'Opción fría y refrescante para días calurosos.', hechoDe: 'Café frío o espresso con hielos y un toque de leche.', img: '../icons/iced-coffee.svg' },
    { name: 'Frappuccino', category: 'frios', price: 58, description: 'Bebida fría licuada con textura espesa tipo granizado.', hechoDe: 'Café, hielo triturado, leche y base cremosa licuada.', img: '../icons/frappuccino.svg' },
    { name: 'Milkshake', category: 'frios', price: 55, description: 'Bebida dulce, fría y muy cremosa.', hechoDe: 'Helado cremoso, leche fría y saborizante al gusto.', img: '../icons/milkshake.svg' },
    { name: 'Chocolate cake', category: 'postres', price: 52, description: 'Rebanada dulce con sabor marcado a cacao.', hechoDe: 'Bizcocho de cacao, harina, huevo, azúcar y cobertura de chocolate.', img: '../icons/chocolate-cake.svg' },
    { name: 'Cheesecake', category: 'postres', price: 54, description: 'Postre suave y cremoso con base crujiente.', hechoDe: 'Queso crema, base de galleta molida, huevo y vainilla.', img: '../icons/cheesecake.svg' },
    { name: 'Brownies', category: 'postres', price: 38, description: 'Porción compacta y suave con intenso sabor a chocolate.', hechoDe: 'Chocolate oscuro, mantequilla, azúcar, huevo y poca harina.', img: '../icons/brownies.svg' },
    { name: 'Croissant', category: 'pan', price: 36, description: 'Pan ligero por dentro y con capas doradas por fuera.', hechoDe: 'Masa hojaldrada de harina de trigo, mantequilla en capas y levadura.', img: '../icons/croissant.svg' },
    { name: 'Muffins', category: 'pan', price: 34, description: 'Panecillo esponjoso ideal para acompañar café.', hechoDe: 'Harina, huevo, mantequilla o aceite, azúcar y polvo para hornear.', img: '../icons/muffins.svg' },
    { name: 'Donuts', category: 'pan', price: 28, description: 'Pan dulce suave con acabado glaseado o azucarado.', hechoDe: 'Masa fermentada dulce, levadura y glaseado o cobertura.', img: '../icons/donuts.svg' },
    { name: 'Sandwich', category: 'salados', price: 62, description: 'Opción salada completa para desayunar o comer.', hechoDe: 'Pan, proteína, queso, vegetales frescos y aderezo.', img: '../icons/sandwich.svg' }
];

const ESTILO_BTN_ELIMINAR = 'background:#ffffff; color:#140f0c; border:1px solid #d4a373; border-radius:6px; padding:4px 10px; font-weight:bold; cursor:pointer; opacity:1;';

function esPaginaCatalogo() {
    return (window.location.pathname || '').toLowerCase().includes('catalogo.html');
}

function puedeGestionar() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva') || 'null');
    const rol = (sesion?.rol || localStorage.getItem('rolUsuario') || '').toLowerCase();
    return ROLES_GESTION.includes(rol);
}

let productos = productosBase.slice();
let filtroActual = 'todos';
let carrito = [];

const modal = document.createElement('div');
modal.id = 'modal';
modal.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:99999; justify-content:center; align-items:center; padding:16px;';
document.body.appendChild(modal);

function esCliente() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva') || 'null');
    return sesion?.rol?.toLowerCase() === 'cliente';
}

if (esCliente()) {
    const btnCarrito = document.createElement('button');
    btnCarrito.id = 'btnCarrito';
    btnCarrito.type = 'button';
    btnCarrito.innerHTML = `
        <img src="../icons/carroCompras.svg" alt="Carrito">
        <span id="contadorCarrito">0</span>
    `;
    btnCarrito.onclick = abrirCarrito;
    document.body.appendChild(btnCarrito);
}

const cerrarModal = () => modal.style.display = 'none';

modal.onclick = e => {
    if (e.target === modal) cerrarModal();
};

function refrescarVista() {
    cerrarModal();
    filtrarCatalogo();
}

function obtenerTotal() {
    return carrito.reduce((total, item) => total + item.producto.price * item.cantidad, 0);
}

function actualizarContador() {
    const contador = document.getElementById('contadorCarrito');

    if (!contador) return;

    const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);

    contador.textContent = cantidad;
    contador.style.display = cantidad > 0 ? 'flex' : 'none';
}

function agregarAlCarrito(producto) {
    const existente = carrito.find(item => item.producto === producto);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            producto: producto,
            cantidad: 1
        });
    }

    actualizarContador();
}

function cambiarCantidad(indice, cambio) {
    if (!carrito[indice]) return;

    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    actualizarContador();
    abrirCarrito();
}

function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    actualizarContador();
    abrirCarrito();
}

function abrirCarrito() {
    const total = obtenerTotal();
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva') || 'null');
    const nombreInicial = sesion?.nombre || '';

    modal.innerHTML = `
        <div class="ventana-carrito">
            <div class="encabezado-carrito">
                <h2>Resumen de la cesta</h2>
                <button id="cerrarCarrito" type="button">✕</button>
            </div>

            <div class="lista-carrito">
                ${carrito.length === 0 ? `
                    <p class="carrito-vacio">Tu cesta está vacía.</p>
                ` : carrito.map((item, indice) => `
                    <div class="producto-carrito">
                        <img src="${item.producto.img}" alt="${item.producto.name}"
                            onerror="this.onerror=null;this.src='${IMG_RESPALDO}';">

                        <div class="info-carrito">
                            <h3>${item.producto.name}</h3>
                            <p>$${item.producto.price.toFixed(2)} MXN c/u</p>

                            <div class="cantidad-carrito">
                                <button type="button" data-accion="restar" data-indice="${indice}">−</button>
                                <span>${item.cantidad}</span>
                                <button type="button" data-accion="sumar" data-indice="${indice}">+</button>
                            </div>
                        </div>

                        <div class="subtotal-carrito">
                            <strong>$${(item.producto.price * item.cantidad).toFixed(2)}</strong>
                            <button type="button" class="eliminar-carrito" data-accion="eliminar" data-indice="${indice}">
                                Eliminar
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${carrito.length > 0 ? `
                <div class="campo-nombre-pedido">
                    <label for="nombreClientePedido">Nombre para llamar tu pedido</label>
                    <input id="nombreClientePedido" type="text" placeholder="Ej. Ana López" value="" maxlength="60" required>
                </div>
            ` : ''}

            <div class="pie-carrito">
                <div class="total-carrito">
                    <span>Total:</span>
                    <strong>$${total.toFixed(2)} MXN</strong>
                </div>

                <div class="acciones-carrito">
                    <button type="button" id="seguirComprando">Seguir comprando</button>
                    <button type="button" id="btnPagar" ${carrito.length === 0 ? 'disabled' : ''}>
                        Pagar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('cerrarCarrito').onclick = cerrarModal;
    document.getElementById('seguirComprando').onclick = cerrarModal;
    document.getElementById('btnPagar').onclick = () => {
        const inputCliente = document.getElementById('nombreClientePedido');
        const nombreCliente = inputCliente ? inputCliente.value.trim() : '';

        if (!nombreCliente) {
            alert('Escribe tu nombre para identificar tu pedido.');
            if (inputCliente) inputCliente.focus();
            return;
        }

        generarTicket(nombreCliente);
    };

    modal.querySelectorAll('[data-accion]').forEach(boton => {
        boton.onclick = () => {
            const indice = Number(boton.dataset.indice);
            const accion = boton.dataset.accion;

            if (accion === 'sumar') cambiarCantidad(indice, 1);
            if (accion === 'restar') cambiarCantidad(indice, -1);
            if (accion === 'eliminar') eliminarDelCarrito(indice);
        };
    });

    modal.style.display = 'flex';
}

function generarTicket(nombreCliente) {
    if (carrito.length === 0) return;

    const pedido = 'PEDIDO-#' + Math.floor(100000000 + Math.random() * 900000000);
    const fecha = new Date().toLocaleString('es-MX');
    const productosComprados = carrito.map(item => ({
        producto: { ...item.producto },
        cantidad: item.cantidad
    }));
    const total = obtenerTotal();

    const nuevoPedido = {
        id: pedido,
        cliente: nombreCliente,
        fecha: fecha,
        productos: productosComprados,
        total: total,
        estado: 'Pendiente'
    };

    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
    pedidosGuardados.push(nuevoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));

    modal.innerHTML = `
        <div class="ticket">
            <div class="ticket-encabezado">
                <h2>CAFETERÍA WEB</h2>
                <p>Comprobante de compra</p>
                <strong>${pedido}</strong>
            </div>

            <div class="ticket-datos">
                <p><strong>Cliente:</strong> ${nombreCliente}</p>
                <p>Fecha: ${fecha}</p>
                <p>Estado: Pendiente</p>
            </div>

            <div class="ticket-linea"></div>

            <div class="ticket-productos">
                ${productosComprados.map(item => `
                    <div class="ticket-producto">
                        <div>
                            <strong>${item.producto.name}</strong>
                            <small>${item.cantidad} x $${item.producto.price.toFixed(2)}</small>
                        </div>
                        <strong>$${(item.producto.price * item.cantidad).toFixed(2)}</strong>
                    </div>
                `).join('')}
            </div>

            <div class="ticket-linea"></div>

            <div class="ticket-total">
                <span>TOTAL</span>
                <strong>$${total.toFixed(2)} MXN</strong>
            </div>

            <p class="ticket-gracias">¡Gracias por tu compra, ${nombreCliente}!</p>

            <div class="acciones-ticket">
                <button type="button" id="btnTerminar">Finalizar</button>
            </div>
        </div>
    `;

    carrito = [];
    actualizarContador();

    document.getElementById('btnTerminar').onclick = cerrarModal;

    modal.style.display = 'flex';
}

function abrirModal(item, idx) {
    const gestion = puedeGestionar();

    modal.innerHTML = `
        <div style="background:#241b16; color:#fff; border:1px solid #d4a373; border-radius:10px; max-width:430px; width:100%; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div>
                    <small style="color:#d4a373;">${item.category}</small>
                    <h2 style="margin:0; font-size:20px;">${item.name}</h2>
                </div>
                <button id="mCerrar" type="button">✕</button>
            </div>

            <div style="background:#a67c52; border-radius:8px; padding:10px; margin-bottom:10px; display:flex; justify-content:center; height:130px;">
                <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='${IMG_RESPALDO}';" style="max-height:100%; object-fit:contain;">
            </div>

            <p>${item.description}</p>
            <p><strong>De qué está hecho:</strong> ${item.hechoDe}</p>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                <strong>$${item.price} MXN</strong>
                <div style="display:flex; gap:8px;">
                    ${gestion ? `<button id="mEliminar" type="button" style="${ESTILO_BTN_ELIMINAR}">Eliminar</button>` : ''}
                    <button id="mAgregar" type="button">Agregar a cesta</button>
                    <button id="mCerrar2" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('mCerrar').onclick = cerrarModal;
    document.getElementById('mCerrar2').onclick = cerrarModal;

    document.getElementById('mAgregar').onclick = () => {
        agregarAlCarrito(item);
        cerrarModal();
    };

    const btnDel = document.getElementById('mEliminar');

    if (btnDel) {
        btnDel.onclick = () => {
            productos.splice(idx, 1);
            refrescarVista();
        };
    }

    modal.style.display = 'flex';
}

function abrirModalSubir() {
    if (!esPaginaCatalogo() || !puedeGestionar()) return;

    modal.innerHTML = `
        <div style="background:#241b16; color:#fff; border:1px solid #d4a373; border-radius:10px; max-width:430px; width:100%; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h2 style="margin:0; font-size:18px;">Subir producto</h2>
                <button id="mCerrarSub" type="button">✕</button>
            </div>

            <form id="fSubir" style="display:flex; flex-direction:column; gap:8px;">
                <label>Nombre</label>
                <input id="npNombre" type="text" required>

                <label>Categoría</label>
                <select id="npCat">
                    <option value="cafe">cafe</option>
                    <option value="frios">frios</option>
                    <option value="postres">postres</option>
                    <option value="pan">pan</option>
                    <option value="salados">salados</option>
                </select>

                <label>Precio</label>
                <input id="npPrecio" type="number" min="1" required>

                <label>Descripción</label>
                <textarea id="npDesc" rows="2" required></textarea>

                <label>De qué está hecho</label>
                <input id="npHecho" type="text" required>

                <label>Ruta de imagen (opcional)</label>
                <input id="npImg" type="text" placeholder="../icons/coffee-latte.svg">

                <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
                    <button type="button" id="npCancel">Cancelar</button>
                    <button type="submit">Guardar</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('mCerrarSub').onclick = cerrarModal;
    document.getElementById('npCancel').onclick = cerrarModal;

    document.getElementById('fSubir').onsubmit = e => {
        e.preventDefault();

        productos.push({
            name: document.getElementById('npNombre').value.trim(),
            category: document.getElementById('npCat').value,
            price: Number(document.getElementById('npPrecio').value),
            description: document.getElementById('npDesc').value.trim(),
            hechoDe: document.getElementById('npHecho').value.trim(),
            img: document.getElementById('npImg').value.trim() || IMG_RESPALDO
        });

        refrescarVista();
    };

    modal.style.display = 'flex';
}

function pintarTarjetas(items) {
    if (!contenedor) return;

    if (!items.length) {
        contenedor.innerHTML = '<p>No hay resultados.</p>';
        return;
    }

    const gestion = puedeGestionar();
    const cliente = esCliente();

    contenedor.innerHTML = '';

    items.forEach(item => {
        const idx = productos.indexOf(item);
        const card = document.createElement('article');

        card.className = 'producto';
        card.style.cursor = 'pointer';

        card.innerHTML = `
            <div class="imagen-producto">
                <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='${IMG_RESPALDO}';">
            </div>

            <h2>${item.name}</h2>
            <p>${item.description}</p>
            <p><strong>$${item.price}</strong></p>

            <div class="acciones-producto">
                ${cliente ? `
                    <a href="#" class="ver-detalles">Más detalles</a>
                    <button type="button" class="btn-agregar">Agregar</button>
                ` : ''}

                ${gestion ? `
                    <button type="button" class="btn-del" style="${ESTILO_BTN_ELIMINAR}">Eliminar</button>
                ` : ''}
            </div>
        `;

        if (cliente) {
            card.onclick = e => {
                if (e.target.closest('button') || e.target.closest('.ver-detalles')) {
                    e.preventDefault();
                    return;
                }

                abrirModal(item, idx);
            };

            card.querySelector('.ver-detalles').onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                abrirModal(item, idx);
            };

            card.querySelector('.btn-agregar').onclick = e => {
                e.stopPropagation();
                agregarAlCarrito(item);
            };
        }

        const btnDel = card.querySelector('.btn-del');

        if (btnDel) {
            btnDel.onclick = e => {
                e.stopPropagation();
                productos.splice(idx, 1);
                refrescarVista();
            };
        }

        contenedor.appendChild(card);
    });
}

function filtrarCatalogo() {
    const txt = buscador ? buscador.value.trim().toLowerCase() : '';

    const filtrados = productos.filter(p =>
        (filtroActual === 'todos' || p.category === filtroActual) &&
        (!txt ||
            p.name.toLowerCase().includes(txt) ||
            p.description.toLowerCase().includes(txt) ||
            p.hechoDe.toLowerCase().includes(txt))
    );

    pintarTarjetas(filtrados);
}

if (esPaginaCatalogo() && puedeGestionar() && !document.getElementById('btnSubirProducto')) {
    const btn = document.createElement('button');

    btn.id = 'btnSubirProducto';
    btn.type = 'button';
    btn.textContent = '+ Subir producto';
    btn.onclick = abrirModalSubir;

    document.body.appendChild(btn);
}

if (buscador) buscador.oninput = filtrarCatalogo;

document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.onclick = e => {
        e.preventDefault();
        filtroActual = btn.dataset.filter;
        filtrarCatalogo();
    };
});

actualizarContador();
filtrarCatalogo();