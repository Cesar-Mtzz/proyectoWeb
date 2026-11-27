const listaPedidos = document.getElementById('listaPedidos');
const buscador = document.getElementById('buscador');
const contadorPedidos = document.getElementById('contadorPedidos');

function obtenerPedidos() {
    return JSON.parse(localStorage.getItem('pedidos') || '[]');
}

function guardarPedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

function mostrarPedidos() {
    const pedidos = obtenerPedidos();
    const pendientes = pedidos.filter(pedido => pedido.estado === 'Pendiente');
    const texto = buscador.value.trim().toLowerCase();

    const filtrados = pendientes.filter(pedido =>
        pedido.id.toLowerCase().includes(texto)
    );

    contadorPedidos.textContent =
        `${pendientes.length} ${pendientes.length === 1 ? 'pedido pendiente' : 'pedidos pendientes'}`;

    if (filtrados.length === 0) {
        listaPedidos.innerHTML = `
            <div class="pedidos-vacios">
                <h2>No hay pedidos pendientes</h2>
                <p>Cuando un cliente realice una compra, aparecerá aquí.</p>
            </div>
        `;
        return;
    }

    listaPedidos.innerHTML = '';

    filtrados.forEach(pedido => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'tarjeta-pedido';

        tarjeta.innerHTML = `
            <div class="pedido-encabezado">
                <div>
                    <span class="pedido-etiqueta">Pedido</span>
                    <h2>${pedido.id}</h2>
                </div>

                <span class="estado-pedido">${pedido.estado}</span>
            </div>

            <p class="fecha-pedido">Fecha: ${pedido.fecha}</p>

            <div class="productos-pedido">
                <h3>Productos solicitados</h3>

                ${pedido.productos.map(item => `
                    <div class="producto-pedido">
                        <div>
                            <strong>${item.producto.name}</strong>
                            <span>${item.cantidad} x $${Number(item.producto.price).toFixed(2)}</span>
                        </div>

                        <strong>
                            $${(item.producto.price * item.cantidad).toFixed(2)}
                        </strong>
                    </div>
                `).join('')}
            </div>

            <div class="pedido-pie">
                <div class="total-pedido">
                    <span>Total</span>
                    <strong>$${Number(pedido.total).toFixed(2)} MXN</strong>
                </div>

                <button type="button" class="btn-entregado">
                    Marcar como entregado
                </button>
            </div>
        `;

        tarjeta.querySelector('.btn-entregado').addEventListener('click', () => {
            cambiarEstadoPedido(pedido.id);
        });

        listaPedidos.appendChild(tarjeta);
    });
}

function cambiarEstadoPedido(id) {
    const pedidos = obtenerPedidos();
    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) return;

    pedido.estado = 'Entregado';

    guardarPedidos(pedidos);
    mostrarPedidos();
}

buscador.addEventListener('input', mostrarPedidos);

mostrarPedidos();
