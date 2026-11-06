/* =============================================================
   BARISTA (PHA CHẾ / BẾP) LOGIC - KDS KITCHEN DISPLAY SYSTEM
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Authentication (Phải đăng nhập với vai trò Barista hoặc Admin)
    const user = requireAuth('BARISTA');
    if (!user) return;

    initNavbar();
    renderBaristaOrders();

    // Listen for storage events (new orders from Cashier!)
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('poly_')) {
            renderBaristaOrders();
            updateNavbarBadges();
        }
    });

    // Auto poll orders
    setInterval(renderBaristaOrders, 2500);
});

function renderBaristaOrders() {
    const data = getAppData();
    const pendingList = document.getElementById('kitchenPendingList');
    const brewingList = document.getElementById('kitchenBrewingList');
    const readyList = document.getElementById('kitchenReadyList');
    if (!pendingList) return;

    const pendingOrders = data.orders.filter(o => o.status === 'PENDING');
    const brewingOrders = data.orders.filter(o => o.status === 'BREWING');
    const readyOrders = data.orders.filter(o => o.status === 'READY');

    document.getElementById('countPending').innerText = pendingOrders.length;
    document.getElementById('countBrewing').innerText = brewingOrders.length;
    document.getElementById('countReady').innerText = readyOrders.length;

    pendingList.innerHTML = pendingOrders.length === 0 ? `<p class="text-muted text-center py-4">Không có đơn mới</p>` :
        pendingOrders.map(o => createKdsCardHtml(o, 'PENDING')).join('');

    brewingList.innerHTML = brewingOrders.length === 0 ? `<p class="text-muted text-center py-4">Chưa có đơn đang làm</p>` :
        brewingOrders.map(o => createKdsCardHtml(o, 'BREWING')).join('');

    readyList.innerHTML = readyOrders.length === 0 ? `<p class="text-muted text-center py-4">Không có đơn chờ khách</p>` :
        readyOrders.map(o => createKdsCardHtml(o, 'READY')).join('');
}

function createKdsCardHtml(order, stage) {
    let actionBtn = '';
    if (stage === 'PENDING') {
        actionBtn = `
            <button class="btn btn-warning w-100 fw-bold py-2 rounded-3 text-dark shadow-sm" onclick="startBrewingOrder('${order.id}')">
                <i class="fa-solid fa-mug-hot me-1"></i>BẮT ĐẦU PHA CHẾ
            </button>
        `;
    } else if (stage === 'BREWING') {
        actionBtn = `
            <button class="btn btn-success w-100 fw-bold py-2 rounded-3 shadow-sm" onclick="completeBrewingOrder('${order.id}')">
                <i class="fa-solid fa-check-double me-1"></i>✅ XÁC NHẬN LÀM XONG
            </button>
        `;
    } else if (stage === 'READY') {
        actionBtn = `
            <div class="alert alert-success py-2 mb-0 text-center small fw-bold">
                <i class="fa-solid fa-bell fa-shake me-1"></i>Đã xong! Đang báo thẻ #${order.buzzerCardNumber} ở quầy
            </div>
        `;
    }

    return `
        <div class="kds-card p-3 status-${stage.toLowerCase()}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="buzzer-tag bg-dark text-warning">
                    <i class="fa-solid fa-bell-concierge"></i> THẺ ${order.buzzerCardNumber}
                </span>
                <div class="text-end">
                    <strong class="d-block text-primary">${order.orderCode}</strong>
                    <small class="text-muted" style="font-size: 0.75rem;"><i class="fa-regular fa-clock me-1"></i>${order.createdAt}</small>
                </div>
            </div>
            <div class="border-top border-bottom py-2 my-2">
                ${order.items.map(item => `
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <span class="fw-bold">${item.quantity}x ${item.productName}</span>
                        ${item.note ? `<span class="badge bg-danger-subtle text-danger border border-danger-subtle">${item.note}</span>` : ''}
                    </div>
                `).join('')}
            </div>
            ${actionBtn}
        </div>
    `;
}

function startBrewingOrder(orderId) {
    const data = getAppData();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return;
    order.status = 'BREWING';
    saveAppData(data);
    renderBaristaOrders();
    updateNavbarBadges();
}

function completeBrewingOrder(orderId) {
    const data = getAppData();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = 'READY';
    order.readyAt = new Date().toLocaleTimeString('vi-VN');

    // Update Buzzer Card to READY
    const buzzer = data.buzzers.find(b => b.number === order.buzzerCardNumber);
    if (buzzer) {
        buzzer.status = 'READY';
    }

    saveAppData(data);
    playChimeSound('ready');
    renderBaristaOrders();
    updateNavbarBadges();

    alert(`✅ ĐÃ LÀM XONG ĐƠN ${order.orderCode} - THẺ SỐ [ ${order.buzzerCardNumber} ]!\nHệ thống đã chuyển tín hiệu chuông và đèn báo sang màn hình Thu Ngân.`);
}
