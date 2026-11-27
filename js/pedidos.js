* {
    box-sizing: border-box;
}

#contenido {
    flex: 1;
    min-width: 0;
    padding: 2rem;
}

.encabezado-pedidos {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
}

.encabezado-pedidos h1 {
    margin: 0 0 .4rem;
    color: var(--fc-color);
    font-size: 1.8rem;
}

.encabezado-pedidos p {
    margin: 0;
    color: var(--fc-color);
    opacity: .7;
}

#contadorPedidos {
    padding: .6rem 1rem;
    background-color: var(--bg-sec);
    color: var(--acento-2);
    border: 1px solid var(--acento);
    border-radius: 2rem;
    font-weight: bold;
}

#listaPedidos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.3rem;
    width: 100%;
}

.tarjeta-pedido {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
    padding: 1.3rem;
    background-color: var(--bg-sec);
    color: var(--fc-color);
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .2);
}

.pedido-encabezado {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: .8rem;
}

.pedido-etiqueta {
    color: var(--acento-2);
    font-size: .8rem;
    font-weight: bold;
    text-transform: uppercase;
}

.pedido-encabezado h2 {
    margin: .2rem 0 0;
    font-size: 1.1rem;
    overflow-wrap: anywhere;
}

.estado-pedido {
    padding: .4rem .7rem;
    background-color: rgba(212, 163, 115, .15);
    color: var(--acento-2);
    border-radius: 2rem;
    font-size: .8rem;
    font-weight: bold;
    white-space: nowrap;
}

.fecha-pedido {
    margin: 0;
    font-size: .85rem;
    opacity: .7;
}

.productos-pedido {
    display: flex;
    flex-direction: column;
    gap: .8rem;
    padding: 1rem 0;
    border-top: 1px solid rgba(255, 255, 255, .1);
    border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.productos-pedido h3 {
    margin: 0;
    font-size: 1rem;
}

.producto-pedido {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.producto-pedido div {
    display: flex;
    flex-direction: column;
    gap: .2rem;
}

.producto-pedido strong {
    font-size: .9rem;
}

.producto-pedido span {
    font-size: .8rem;
    opacity: .7;
}

.pedido-pie {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: auto;
}

.total-pedido {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
}

.total-pedido strong {
    color: var(--acento-2);
}

.btn-entregado {
    width: 100%;
    padding: .8rem 1rem;
    background-color: var(--acento);
    color: var(--fc-dark);
    border: 1px solid var(--acento);
    border-radius: .7rem;
    font-family: inherit;
    font-size: .9rem;
    font-weight: bold;
    cursor: pointer;
    transition: .2s ease;
}

.btn-entregado:hover {
    background-color: var(--acento-2);
    border-color: var(--acento-2);
    transform: translateY(-2px);
}

.pedidos-vacios {
    grid-column: 1 / -1;
    padding: 3rem 1rem;
    text-align: center;
    background-color: var(--bg-sec);
    border: 1px dashed var(--acento);
    border-radius: 1rem;
}

.pedidos-vacios h2 {
    color: var(--fc-color);
    font-size: 1.3rem;
}

.pedidos-vacios p {
    color: var(--fc-color);
    opacity: .7;
}

@media (max-width: 640px) {
    #contenido {
        padding: 1rem;
    }

    .encabezado-pedidos h1 {
        font-size: 1.4rem;
    }

    #listaPedidos {
        grid-template-columns: 1fr;
    }
}
