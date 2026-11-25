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

function esPaginaCatalogo() {
    return (window.location.pathname || '').toLowerCase().endsWith('/catalogo.html');
}

function puedeGestionar() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva') || 'null');
    const rol = (sesion?.rol || localStorage.getItem('rolUsuario') || '').toLowerCase();
    return ROLES_GESTION.includes(rol);
}

let productos = productosBase.slice();
let filtroActual = 'todos';

const modal = document.createElement('div');
modal.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:99999; justify-content:center; align-items:center; padding:16px;';
document.body.appendChild(modal);

const cerrarModal = () => modal.style.display = 'none';
modal.onclick = e => { if (e.target === modal) cerrarModal(); };

function refrescarVista() {
    cerrarModal();
    filtrarCatalogo();
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
                    ${gestion ? `<button id="mEliminar" type="button">Eliminar</button>` : ''}
                    <button id="mCerrar2" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('mCerrar').onclick = cerrarModal;
    document.getElementById('mCerrar2').onclick = cerrarModal;
    const btnDel = document.getElementById('mEliminar');
    if (btnDel) btnDel.onclick = () => {
        productos.splice(idx, 1);
        refrescarVista();
    };
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
            <div style="display:flex; align-items:center; justify-content:center; gap:10px; margin-top:auto;">
                <a href="#" class="ver-detalles">Más detalles</a>
                ${gestion ? `<button type="button" class="btn-del">Eliminar</button>` : ''}
            </div>
        `;
        card.onclick = e => {
            if (e.target.closest('.btn-del')) return;
            e.preventDefault();
            abrirModal(item, idx);
        };
        const btnDel = card.querySelector('.btn-del');
        if (btnDel) btnDel.onclick = e => {
            e.stopPropagation();
            productos.splice(idx, 1);
            refrescarVista();
        };
        contenedor.appendChild(card);
    });
}

function filtrarCatalogo() {
    const txt = buscador ? buscador.value.trim().toLowerCase() : '';
    const filtrados = productos.filter(p =>
        (filtroActual === 'todos' || p.category === filtroActual) &&
        (!txt || p.name.toLowerCase().includes(txt) || p.description.toLowerCase().includes(txt) || p.hechoDe.toLowerCase().includes(txt))
    );
    pintarTarjetas(filtrados);
}

if (esPaginaCatalogo() && puedeGestionar() && !document.getElementById('btnSubirProducto')) {
    const btn = document.createElement('button');
    btn.id = 'btnSubirProducto';
    btn.type = 'button';
    btn.textContent = '+ Subir producto';
    btn.style.cssText = 'position:fixed; left:20px; bottom:20px; z-index:9998; background:#d4a373; color:#140f0c; border:none; border-radius:8px; padding:10px 14px; font-weight:bold; cursor:pointer;';
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

filtrarCatalogo();