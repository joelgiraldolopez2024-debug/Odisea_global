// --- JAVASCRIPT UNIFICADO: VALIDACIONES, ROLES Y PANEL DE ADMINISTRACIÓN PRO ---

let tipoViajeActual = 'Vuelo + Hotel';
let paqueteSeleccionado = '';
let precioSeleccionado = '';
let tamanoActual = 1;
let rolActual = 'cliente';

// 🔒 BLOQUEO EN TIEMPO REAL AL ESCRIBIR EN TODOS LOS FORMULARIOS
document.addEventListener('DOMContentLoaded', () => {
    const camposSoloLetras = ['reg-nombre', 'cliente-nombre'];
    const camposSoloNumeros = ['reg-tel', 'cliente-tel'];

    // 1. Bloquear números y símbolos (Solo letras, tildes y espacios, máx 40 caracteres)
    camposSoloLetras.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute('maxlength', '40');

            el.addEventListener('keydown', (e) => {
                const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];
                if (teclasPermitidas.includes(e.key)) return;
                
                if (/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });

            el.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            });
        }
    });

    // 2. Bloquear letras y símbolos (Solo números, máx 10 dígitos)
    camposSoloNumeros.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute('maxlength', '10');

            el.addEventListener('keydown', (e) => {
                const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                if (teclasPermitidas.includes(e.key)) return;

                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });

            el.addEventListener('input', (e) => {
                let valor = e.target.value.replace(/[^0-9]/g, '');
                if (valor.length > 10) {
                    valor = valor.slice(0, 10);
                }
                e.target.value = valor;
            });
        }
    });
});

// 🔀 CAMBIAR VISTA DEL FORMULARIO SEGÚN EL ROL SELECCIONADO
function cambiarVistaRolFormulario() {
    const rol = document.getElementById('reg-rol').value;
    const grupoAdminPass = document.getElementById('grupo-admin-pass');
    const inputNombre = document.getElementById('reg-nombre');

    if (rol === 'admin') {
        grupoAdminPass.style.display = 'block';
        inputNombre.value = 'Joel'; // Asigna por defecto el nombre requerido para admin
    } else {
        grupoAdminPass.style.display = 'none';
        inputNombre.value = '';
    }
}

// 🛡️ VERIFICAR ACCESO CON ROLES Y CÓDIGO ENCRIPTADO
function verificarAccesoRol() {
    const rol = document.getElementById('reg-rol').value;
    const nombreInput = document.getElementById('reg-nombre').value.trim();
    const telInput = document.getElementById('reg-tel').value.trim();

    if (!nombreInput || !telInput) {
        alert('Por favor completa todos los campos requeridos.');
        return;
    }

    if (telInput.length !== 10) {
        alert('El número de celular debe tener exactamente 10 dígitos.');
        return;
    }

    if (rol === 'admin') {
        const codigoIngresado = document.getElementById('reg-admin-pass').value.trim();
        const codigoSecretoAdmin = '33022998014';

        // Validación estricta para el Administrador
        if (nombreInput.toLowerCase() !== 'joel' || codigoIngresado !== codigoSecretoAdmin) {
            alert('❌ Acceso denegado. Nombre de administrador o código secreto incorrectos.');
            return;
        }

        rolActual = 'admin';
        alert('✅ ¡Acceso concedido como Administrador (Joel)!');
    } else {
        rolActual = 'cliente';
        alert(`✅ ¡Bienvenido cliente ${nombreInput} a Odisea Global!`);
    }

    // Ocultar muro de acceso y revelar la página web
    const muro = document.getElementById('muro-registro');
    const contenido = document.getElementById('contenido-web');

    if (muro) muro.style.display = 'none';
    if (contenido) contenido.style.display = 'block';

    // Adaptar interfaz según el rol
    adaptarVistaSegunRol();
}

// 🎨 ADAPTAR LA PÁGINA SEGÚN EL ROL DE ACCESO
function adaptarVistaSegunRol() {
    const panelAdmin = document.getElementById('panel-admin-exclusivo');

    if (rolActual === 'admin') {
        if (panelAdmin) panelAdmin.style.display = 'block';

        // Agregar botones de edición de inventario en cada tarjeta de destino
        document.querySelectorAll('.card-content').forEach((card, index) => {
            if (card.querySelector('.admin-only-ctrl')) return;

            const btnAdminCtrl = document.createElement('div');
            btnAdminCtrl.className = 'admin-only-ctrl';
            btnAdminCtrl.style.marginTop = '10px';
            btnAdminCtrl.style.padding = '8px';
            btnAdminCtrl.style.background = '#eee';
            btnAdminCtrl.style.borderRadius = '5px';
            btnAdminCtrl.style.display = 'flex';
            btnAdminCtrl.style.gap = '5px';
            btnAdminCtrl.innerHTML = `
                <button onclick="alert('Editar precio del Paquete ${index + 1}')" style="background:#2e86de; color:#fff; border:none; padding:4px 8px; border-radius:3px; cursor:pointer; font-size:11px;">✏️ Editar Precio</button>
                <button onclick="alert('Paquete ${index + 1} pausado en catálogo')" style="background:#ee5253; color:#fff; border:none; padding:4px 8px; border-radius:3px; cursor:pointer; font-size:11px;">🚫 Pausar Venta</button>
            `;
            card.appendChild(btnAdminCtrl);
        });
    } else {
        if (panelAdmin) panelAdmin.style.display = 'none';
    }
}

// 🔀 CAMBIAR ENTRE PESTAÑAS DEL PANEL DE ADMINISTRACIÓN
function cambiarSeccionAdmin(seccion, btn) {
    document.getElementById('admin-sec-metricas').style.display = 'none';
    document.getElementById('admin-sec-leads').style.display = 'none';
    document.getElementById('admin-sec-inventario').style.display = 'none';

    document.querySelectorAll('.tab-admin').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = '#94a3b8';
    });

    document.getElementById(`admin-sec-${seccion}`).style.display = 'block';
    btn.style.background = '#1e293b';
    btn.style.color = '#38bdf8';
}

// 🔍 FILTRO EN TIEMPO REAL PARA LA TABLA DE LEADS
function filtrarTablaLeads() {
    const input = document.getElementById('filter-lead').value.toLowerCase();
    const filas = document.querySelectorAll('#tabla-leads-admin tbody tr');

    filas.forEach(fila => {
        const nombre = fila.children[0].innerText.toLowerCase();
        if (nombre.includes(input)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// ✅ CAMBIAR ESTADO DE UN LEAD A CONTACTADO
function cambiarEstadoLead(btn) {
    const celdaEstado = btn.parentElement.parentElement.querySelector('.badge-status');
    celdaEstado.style.background = '#10b98122';
    celdaEstado.style.color = '#10b981';
    celdaEstado.innerText = '✅ Contactado';
    btn.remove();
}

// 💬 CONTACTAR AL CLIENTE DIRECTO POR WHATSAPP DESDE EL PANEL
function contactarClienteWA(telefono, nombre) {
    const mensaje = encodeURIComponent(`Hola ${nombre}, te saludamos de Odisea Global. Vemos que cotizaste un paquete turístico con nosotros, ¿en qué podemos ayudarte?`);
    window.open(`https://wa.me/57${telefono}?text=${mensaje}`, '_blank');
}

// 🔄 SIMULADOR DE ACTUALIZACIÓN DE DATOS EN TIEMPO REAL
function actualizarMetricasSimuladas() {
    const kpiVentas = document.getElementById('kpi-ventas');
    const barVentas = document.getElementById('bar-ventas');

    kpiVentas.style.opacity = '0.4';
    setTimeout(() => {
        kpiVentas.innerText = '$ 56.800.000 COP';
        barVentas.style.width = '92%';
        kpiVentas.style.opacity = '1';
        alert('📊 ¡Métricas sincronizadas con la base de datos!');
    }, 500);
}

// 📌 CAMBIO DE PESTAÑAS EN EL BUSCADOR DE VIAJES
function cambiarTab(btn, tipo) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (tipo === 'vuelohotel') tipoViajeActual = 'Vuelo + Hotel';
    if (tipo === 'hotel') tipoViajeActual = 'Solo Hotel';
    if (tipo === 'tour') tipoViajeActual = 'Tour & Experiencia';
}

// 🔍 BUSCADOR DE VIAJES
function buscarViaje() {
    const origen = document.getElementById('origen-select').value;
    const destino = document.getElementById('destino-select').value;
    const fecha = document.getElementById('fecha-salida').value;
    const pasajeros = document.getElementById('pasajeros-select').value;

    paqueteSeleccionado = `Cotización (${tipoViajeActual}): ${origen} ➔ ${destino}`;
    precioSeleccionado = `Fecha: ${fecha} | ${pasajeros}`;
    
    abrirModal(paqueteSeleccionado, precioSeleccionado);
}

// 💬 MODAL DE COTIZACIÓN
function abrirModal(titulo, precio) {
    paqueteSeleccionado = titulo;
    precioSeleccionado = precio;
    document.getElementById('modal-titulo').innerText = titulo;
    document.getElementById('modal-precio').innerText = precio;
    document.getElementById('modal-reserva').classList.add('active');
}

function cerrarModal() {
    document.getElementById('modal-reserva').classList.remove('active');
}

function enviarWhatsAppModal() {
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const tel = document.getElementById('cliente-tel').value.trim();

    if (!nombre || !tel) {
        alert('Por favor completa tu nombre y número de teléfono.');
        return;
    }

    if (tel.length !== 10) {
        alert('El número de celular debe tener exactamente 10 dígitos.');
        return;
    }

    const mensaje = encodeURIComponent(`¡Hola Odisea Global! Deseo cotizar el paquete:\n📌 *${paqueteSeleccionado}*\n💰 *${precioSeleccionado}*\n\n👤 *Nombre:* ${nombre}\n📱 *Teléfono:* ${tel}`);
    window.open(`https://wa.me/573113924038?text=${mensaje}`, '_blank');
    cerrarModal();
}

// ♿ ACCESIBILIDAD
function toggleMenuAccesibilidad() {
    const menu = document.getElementById('accessibility-menu');
    if (menu) menu.classList.toggle('active');
}

function cambiarTamanoTexto(factor) {
    tamanoActual *= factor;
    if (tamanoActual < 0.8) tamanoActual = 0.8;
    if (tamanoActual > 1.4) tamanoActual = 1.4;
    document.body.style.zoom = tamanoActual;
}

function toggleAltoContraste() {
    document.body.classList.toggle('alto-contraste');
}

function resetAccesibilidad() {
    tamanoActual = 1;
    document.body.style.zoom = "100%";
    document.body.classList.remove('alto-contraste');
}