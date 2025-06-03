
// Obtener referencias del HTML
const addOrderBtn = document.getElementById('pedido'); // Selecciona el botón con ID "pedido"
const ordersContainer = document.getElementById('contenedor'); // Contenedor con ID "contenedor"

// Un contador para generar IDs únicos de pedidos
let orderIdCounter = 0;

// Se guarda un registro de los pedidos actuales.
const currentOrders = [];

// Función auxiliar para generar un tiempo de preparación aleatorio
function getRandomPreparationTime() {
    return Math.floor(Math.random() * 4000) + 3000; // Entre 1 y 7 segundos (1000ms a 7000ms)
}

// --- Funciones principales ---

// Recepción de un pedido
function addNewOrder() {
    orderIdCounter++;
    const orderId = `pedido-${orderIdCounter}`;
    const order = {
        id: orderId,
        item: `Café ${orderIdCounter}`,
        status: 'En Proceso'
    };

    console.log(`Nuevo pedido recibido: ${order.item} (ID: ${order.id})`);
    currentOrders.push(order);

    // Actualización se visualiza (inicial)
    renderOrder(order);

    // Se usa Promesa y setTimeout
    prepareOrder(order)
        .then(completedOrder => {
            console.log(`Pedido ${completedOrder.id} completado.`);
            updateOrderStatusInUI(completedOrder.id, 'Completado');
        })
        .catch(error => {
            console.error(`Error al preparar el pedido ${order.id}:`, error);
        });
}

// Actualización visual del estado de pedidos (agrega los nuevo)
function renderOrder(order) {
    const orderCard = document.createElement('div');
    orderCard.classList.add('pedido-card', 'en-proceso');
    orderCard.id = `card-${order.id}`;

    orderCard.innerHTML = `
        <h3> ${order.id}</h3>
        <p>Artículo: ${order.item}</p>
        <p>Estado: <span class="status en-proceso-text" id="status-${order.id}">${order.status}</span></p>
    `;
    ordersContainer.prepend(orderCard);
}

// Actualización visual del estado de los pedidos (actualiza uno existente)
async function updateOrderStatusInUI(orderId, newStatus) {
    return new Promise(resolve => {
        setTimeout(() => {
            const statusSpan = document.getElementById(`status-${orderId}`);
            const orderCard = document.getElementById(`card-${orderId}`);

            if (statusSpan && orderCard) {
                statusSpan.textContent = newStatus;
                statusSpan.classList.remove('en-proceso-text', 'completado-text');
                orderCard.classList.remove('en-proceso', 'completado');

                if (newStatus === 'Completado') {
                    statusSpan.classList.add('completado-text');
                    orderCard.classList.add('completado');
                } else if (newStatus === 'En Proceso') {
                    statusSpan.classList.add('en-proceso-text');
                    orderCard.classList.add('en-proceso');
                }
                orderCard.classList.add(newStatus.toLowerCase().replace(' ', '-'));
            }
            resolve(true);
        }, 50);
    });
}

// Simulación de la preparación de pedidos (usando Promises y setTimeout)
function prepareOrder(order) {
    return new Promise((resolve, reject) => {
        const preparationTime = getRandomPreparationTime();
        console.log(`Preparando ${order.item} (ID: ${order.id}). Tardará ${preparationTime / 1000} segundos.`);

        setTimeout(() => {
            order.status = 'Completado';
            resolve(order);
        }, preparationTime);
    });
}


// --- Event Listener ---
// Comportamiento del sistema cuando el usuario haga clic en 'Agregar Pedido'
addOrderBtn.addEventListener('click', addNewOrder);

console.log('El script está cargado y funcionando!');