const contenedor = document.getElementById('productos');
const buscador = document.getElementById('buscador');

const IMAGEN_RESPALDO = '../imagenes/coffee-latte.jpg';
const STORAGE_PRODUCTOS_KEY = 'catalogoProductos';
const ROLES_CON_GESTION = ['trabajador', 'admin', 'jefe'];

const productosBase = [
    {
        name: 'Coffee latte',
        category: 'cafe',
        price: 48,
        description: 'Bebida caliente suave y cremosa, ideal para empezar el día.',
        hechoDe: 'Shot de espresso, leche entera vaporizada y una capa ligera de espuma.',
        img: '../icons/coffee-latte.svg'
    },
    {
        name: 'Espresso coffee',
        category: 'cafe',
        price: 32,
        description: 'Café corto e intenso con sabor concentrado.',
        hechoDe: 'Granos de café molidos finos extraídos con agua caliente a presión.',
        img: '../icons/espresso-coffee.svg'
    },
    {
        name: 'Cappuccino',
        category: 'cafe',
        price: 46,
        description: 'Clásico de cafetería con balance entre café y espuma de leche.',
        hechoDe: 'Espresso, leche vaporizada y espuma densa y cremosa.',
        img: '../icons/cappuccino.svg'
    },
    {
        name: 'Iced coffee',
        category: 'frios',
        price: 45,
        description: 'Opción fría y refrescante para días calurosos.',
        hechoDe: 'Café frío o espresso con hielos y un toque de leche.',
        img: '../icons/iced-coffee.svg'
    },
    {
        name: 'Frappuccino',
        category: 'frios',
        price: 58,
        description: 'Bebida fría licuada con textura espesa tipo granizado.',
        hechoDe: 'Café, hielo triturado, leche y base cremosa licuada.',
        img: '../icons/frappuccino.svg'
    },
    {
        name: 'Milkshake',
        category: 'frios',
        price: 55,
        description: 'Bebida dulce, fría y muy cremosa.',
        hechoDe: 'Helado cremoso, leche fría y saborizante al gusto.',
        img: '../icons/milkshake.svg'
    },
    {
        name: 'Chocolate cake',
        category: 'postres',
        price: 52,
        description: 'Rebanada dulce con sabor marcado a cacao.',
        hechoDe: 'Bizcocho de cacao, harina, huevo, azúcar y cobertura de chocolate.',
        img: '../icons/chocolate-cake.svg'
    },
    {
        name: 'Cheesecake',
        category: 'postres',
        price: 54,
        description: 'Postre suave y cremoso con base crujiente.',
        hechoDe: 'Queso crema, base de galleta molida, huevo y vainilla.',
        img: '../icons/cheesecake.svg'
    },
    {
        name: 'Brownies',
        category: 'postres',
        price: 38,
        description: 'Porción compacta y suave con intenso sabor a chocolate.',
        hechoDe: 'Chocolate oscuro, mantequilla, azúcar, huevo y poca harina.',
        img: '../icons/brownies.svg'
    },
    {
        name: 'Croissant',
        category: 'pan',
        price: 36,
        description: 'Pan ligero por dentro y con capas doradas por fuera.',
        hechoDe: 'Masa hojaldrada de harina de trigo, mantequilla en capas y levadura.',
        img: '../icons/croissant.svg'
    },
    {
        name: 'Muffins',
        category: 'pan',
        price: 34,
        description: 'Panecillo esponjoso ideal para acompañar café.',
        hechoDe: 'Harina, huevo, mantequilla o aceite, azúcar y polvo para hornear.',
        img: '../icons/muffins.svg'
    },
    {
        name: 'Donuts',
        category: 'pan',
        price: 28,
        description: 'Pan dulce suave con acabado glaseado o azucarado.',
        hechoDe: 'Masa fermentada dulce, levadura y glaseado o cobertura.',
        img: '../icons/donuts.svg'
    },
    {
        name: 'Sandwich',
        category: 'salados',
        price: 62,
        description: 'Opción salada completa para desayunar o comer.',
        hechoDe: 'Pan, proteína, queso, vegetales frescos y aderezo.',
        img: '../icons/sandwich.svg'
    }
];

function obtenerRolActualCatalogo() {
    try {
        const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
        if (sesion && sesion.rol) {
            return String(sesion.rol).toLowerCase().trim();
        }
    } catch {
        // Ignora error de parseo
    }
    const rolLocal = localStorage.getItem('rolUsuario');
    return rolLocal ? rolLocal.toLowerCase().trim() : '';
}

function puedeGestionarCatalogo() {
    const rol = obtenerRolActualCatalogo();
    return ROLES_CON_GESTION.includes(rol);
}

function cargarProductos() {
    try {
        const guardados = JSON.parse(localStorage.getItem(STORAGE_PRODUCTOS_KEY));
        if (Array.isArray(guardados) && guardados.length > 0) {
            return guardados;
        }
    } catch {
        // Usa productosBase si falla el parseo
    }
    localStorage.setItem(STORAGE_PRODUCTOS_KEY, JSON.stringify(productosBase));
    return productosBase.slice();
}

function guardarProductos(lista) {
    localStorage.setItem(STORAGE_PRODUCTOS_KEY, JSON.stringify(lista));
}

function eliminarProducto(indice) {
    if (!puedeGestionarCatalogo()) return;
    if (indice < 0 || indice >= productos.length) return;
    productos.splice(indice, 1);
    guardarProductos(productos);
    cerrarModal();
    filtrarCatalogo();
}

let productos = cargarProductos();
let filtroActual = 'todos';

const modal = document.createElement('div');
modal.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0, 0, 0, 0.7); z-index:99999; justify-content:center; align-items:center; padding:16px; box-sizing:border-box;';
document.body.appendChild(modal);

function cerrarModal() {
    modal.style.display = 'none';
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        cerrarModal();
    }
});

function abrirModal(item, indice) {
    const gestion = puedeGestionarCatalogo();

    modal.innerHTML = `
        <div style="background:var(--bg-sec, #241b16); color:var(--fc-color, #ffffff); border:1px solid var(--acento-2, #d4a373); border-radius:10px; max-width:440px; width:100%; padding:18px; box-sizing:border-box; font-family:inherit; max-height:90vh; overflow-y:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px;">
                <div>
                    <small style="color:var(--acento-2, #d4a373);">${item.category}</small>
                    <h2 style="margin:2px 0 0 0; font-size:20px;">${item.name}</h2>
                </div>
                <button id="mCerrar" type="button" style="background:none; color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:6px; width:30px; height:30px; cursor:pointer;">✕</button>
            </div>

            <div style="background:var(--acento, #a67c52); border-radius:8px; padding:12px; margin-bottom:12px; display:flex; justify-content:center; align-items:center; height:140px;">
                <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='${IMAGEN_RESPALDO}';" style="max-width:100%; max-height:100%; width:auto; height:auto; object-fit:contain; display:block;">
            </div>

            <p style="margin:0 0 10px 0; font-size:14px;">${item.description}</p>
            <p style="margin:0 0 14px 0; font-size:13.5px;"><strong>De qué está hecho:</strong> ${item.hechoDe}</p>

            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <strong style="font-size:18px; color:var(--acento-2, #d4a373);">$${item.price} MXN</strong>
                <div style="display:flex; gap:8px;">
                    ${gestion ? `<button id="mEliminar" type="button" style="background:#7f2323; color:#ffffff; border:none; border-radius:6px; padding:7px 12px; cursor:pointer;">Eliminar</button>` : ''}
                    <button id="mCerrarSec" type="button" style="background:var(--acento, #a67c52); color:var(--bg-color, #140f0c); border:none; border-radius:6px; padding:7px 14px; font-weight:bold; cursor:pointer;">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('mCerrar').addEventListener('click', cerrarModal);
    document.getElementById('mCerrarSec').addEventListener('click', cerrarModal);

    const btnEliminarModal = document.getElementById('mEliminar');
    if (btnEliminarModal) {
        btnEliminarModal.addEventListener('click', () => eliminarProducto(indice));
    }

    modal.style.display = 'flex';
}

function abrirModalSubirProducto() {
    if (!puedeGestionarCatalogo()) return;

    modal.innerHTML = `
        <div style="background:var(--bg-sec, #241b16); color:var(--fc-color, #ffffff); border:1px solid var(--acento-2, #d4a373); border-radius:10px; max-width:440px; width:100%; padding:18px; box-sizing:border-box; font-family:inherit; max-height:90vh; overflow-y:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px;">
                <h2 style="margin:0; font-size:18px;">Subir producto</h2>
                <button id="mCerrarSubir" type="button" style="background:none; color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:6px; width:30px; height:30px; cursor:pointer;">✕</button>
            </div>

            <form id="formSubirProducto" style="display:flex; flex-direction:column; gap:10px;">
                <div>
                    <label style="display:block; font-size:13px; margin-bottom:4px;">Nombre</label>
                    <input id="npNombre" type="text" required style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div>
                        <label style="display:block; font-size:13px; margin-bottom:4px;">Categoría</label>
                        <select id="npCategoria" style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;">
                            <option value="cafe">cafe</option>
                            <option value="frios">frios</option>
                            <option value="postres">postres</option>
                            <option value="pan">pan</option>
                            <option value="salados">salados</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; font-size:13px; margin-bottom:4px;">Precio</label>
                        <input id="npPrecio" type="number" min="1" required style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;">
                    </div>
                </div>
                <div>
                    <label style="display:block; font-size:13px; margin-bottom:4px;">Descripción</label>
                    <textarea id="npDescripcion" rows="2" required style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;"></textarea>
                </div>
                <div>
                    <label style="display:block; font-size:13px; margin-bottom:4px;">De qué está hecho</label>
                    <input id="npHechoDe" type="text" required style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;">
                </div>
                <div>
                    <label style="display:block; font-size:13px; margin-bottom:4px;">Ruta de imagen (opcional)</label>
                    <input id="npImg" type="text" placeholder="../icons/coffee-latte.svg" style="width:100%; padding:7px 9px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:var(--bg-color, #140f0c); color:inherit; box-sizing:border-box;">
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:6px;">
                    <button id="npCancelar" type="button" style="background:rgba(255,255,255,0.12); color:inherit; border:none; border-radius:6px; padding:7px 12px; cursor:pointer;">Cancelar</button>
                    <button type="submit" style="background:var(--acento, #a67c52); color:var(--bg-color, #140f0c); border:none; border-radius:6px; padding:7px 14px; font-weight:bold; cursor:pointer;">Guardar</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('mCerrarSubir').addEventListener('click', cerrarModal);
    document.getElementById('npCancelar').addEventListener('click', cerrarModal);

    document.getElementById('formSubirProducto').addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevo = {
            name: document.getElementById('npNombre').value.trim(),
            category: document.getElementById('npCategoria').value,
            price: Number(document.getElementById('npPrecio').value),
            description: document.getElementById('npDescripcion').value.trim(),
            hechoDe: document.getElementById('npHechoDe').value.trim(),
            img: document.getElementById('npImg').value.trim() || IMAGEN_RESPALDO
        };

        if (!nuevo.name || Number.isNaN(nuevo.price) || nuevo.price <= 0) return;

        productos.push(nuevo);
        guardarProductos(productos);
        cerrarModal();
        filtrarCatalogo();
    });

    modal.style.display = 'flex';
}

function crearBotonFlotanteSubir() {
    if (!puedeGestionarCatalogo()) return;
    if (document.getElementById('btnSubirProducto')) return;

    const btn = document.createElement('button');
    btn.id = 'btnSubirProducto';
    btn.type = 'button';
    btn.textContent = '+ Subir producto';
    btn.style.cssText = 'position:fixed; right:20px; bottom:20px; z-index:9998; background:var(--acento, #a67c52); color:var(--bg-color, #140f0c); border:none; border-radius:8px; padding:10px 14px; font-size:14px; font-weight:bold; cursor:pointer;';

    btn.addEventListener('click', abrirModalSubirProducto);
    document.body.appendChild(btn);
}

function pintarTarjetas(items) {
    if (!contenedor) return;

    if (items.length === 0) {
        contenedor.innerHTML = '<p>No hay resultados.</p>';
        return;
    }

    const gestion = puedeGestionarCatalogo();
    contenedor.innerHTML = '';

    items.forEach(item => {
        const indiceReal = productos.indexOf(item);
        const card = document.createElement('article');
        card.className = 'producto';
        card.style.cursor = 'pointer';

        card.innerHTML = `
            <div class="imagen-producto">
                <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='${IMAGEN_RESPALDO}';">
            </div>
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            <p><strong>$${item.price}</strong></p>
            <div style="display:flex; align-items:center; justify-content:center; gap:10px; margin-top:auto; width:100%;">
                <a href="#" class="ver-detalles">Más detalles</a>
                ${gestion ? `<button type="button" class="btn-eliminar-prod" style="background:#7f2323; color:#ffffff; border:none; border-radius:6px; padding:4px 8px; font-size:12px; cursor:pointer;">Eliminar</button>` : ''}
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-eliminar-prod')) return;
            e.preventDefault();
            abrirModal(item, indiceReal);
        });

        const btnEliminar = card.querySelector('.btn-eliminar-prod');
        if (btnEliminar) {
            btnEliminar.addEventListener('click', (e) => {
                e.stopPropagation();
                eliminarProducto(indiceReal);
            });
        }

        contenedor.appendChild(card);
    });
}

function filtrarCatalogo() {
    const texto = buscador ? buscador.value.trim().toLowerCase() : '';

    const filtrados = productos.filter(item => {
        const okCat = filtroActual === 'todos' || item.category === filtroActual;
        const okTxt =
            texto === '' ||
            item.name.toLowerCase().includes(texto) ||
            item.description.toLowerCase().includes(texto) ||
            item.hechoDe.toLowerCase().includes(texto);
        return okCat && okTxt;
    });

    pintarTarjetas(filtrados);
}

if (buscador) {
    buscador.addEventListener('input', filtrarCatalogo);
}

document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        filtroActual = btn.dataset.filter;
        filtrarCatalogo();
    });
});

crearBotonFlotanteSubir();
filtrarCatalogo();