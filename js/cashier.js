/* =============================================================
   CASHIER (THU NGÂN) LOGIC - POS & COMPACT LISTBOX BUZZER CONTROLLER
   ============================================================= */

let currentCart = [];
let selectedBuzzerNumber = null;
let activeCategoryFilter = 'ALL';
let currentPaymentMethod = 'CASH';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Authentication (Bắt buộc vai trò Thu Ngân hoặc Admin)
    const user = requireAuth('CASHIER');
    if (!user) return;

    initNavbar();
    renderBuzzerPopup();
    renderProducts();
    renderCart();
    renderReadyAlerts();

    // Listen for events from Barista or other tabs!
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('poly_')) {
            renderBuzzerPopup();
            renderReadyAlerts();
            updateNavbarBadges();
        }
    });

    // Auto poll buzzer status
    setInterval(() => {
        renderBuzzerPopup();
        renderReadyAlerts();
    }, 2500);
});

/* 1. BUZZER LISTBOX / DROPDOWN CONTROLLER */
function renderBuzzerPopup() {
    const data = getAppData();
    const popupGrid = document.getElementById('buzzerPopupGrid');
    if (!popupGrid) return;

    popupGrid.innerHTML = data.buzzers.map(b => {
        let statusClass = 'available';
        let title = `Thẻ ${b.number} (Trống)`;

        if (b.status === 'BREWING') {
            statusClass = 'brewing';
            title = `Thẻ ${b.number} (Đang pha chế - ${b.orderCode || ''})`;
        } else if (b.status === 'READY') {
            statusClass = 'ready';
            title = `Thẻ ${b.number} (ĐÃ XONG! Bấm để gọi khách)`;
        }

        if (selectedBuzzerNumber === b.number) {
            statusClass += ' selected';
        }

        return `
            <button type="button" class="buzzer-popup-btn ${statusClass}" 
                onclick="handleBuzzerSelect(${b.number}, '${b.status}')" title="${title}">
                ${b.number}
            </button>
        `;
    }).join('');

    // Update label on closed button
    const labelElem = document.getElementById('selectedBuzzerLabel');
    if (labelElem) {
        if (selectedBuzzerNumber) {
            labelElem.innerHTML = `🔔 Thẻ số <strong>${selectedBuzzerNumber}</strong>`;
        } else {
            labelElem.innerHTML = `Chọn thẻ`;
        }
    }
}

function handleBuzzerSelect(number, status) {
    if (status === 'READY') {
        callCustomerToPickup(number);
        return;
    }
    if (status === 'BREWING') {
        alert(`Thẻ số [ ${number} ] đang được khách cầm chờ món, không thể chọn!`);
        return;
    }

    selectedBuzzerNumber = number;
    renderBuzzerPopup();
    updateTransferQrCode();

    // Close Bootstrap dropdown
    const dropdownBtn = document.getElementById('buzzerDropdownBtn');
    if (dropdownBtn) {
        const bsDropdown = bootstrap.Dropdown.getInstance(dropdownBtn);
        if (bsDropdown) bsDropdown.hide();
    }
}

function clearBuzzerSelection() {
    selectedBuzzerNumber = null;
    renderBuzzerPopup();
}

function renderReadyAlerts() {
    const data = getAppData();
    const readyBuzzers = data.buzzers.filter(b => b.status === 'READY');
    const alertContainer = document.getElementById('readyBuzzerAlertContainer');
    if (!alertContainer) return;

    if (readyBuzzers.length > 0) {
        alertContainer.innerHTML = readyBuzzers.map(b => `
            <div class="ready-buzzer-alert">
                <div class="d-flex align-items-center gap-3">
                    <span class="fs-3"><i class="fa-solid fa-bell fa-shake"></i></span>
                    <div>
                        <h6 class="fw-bold mb-0">THẺ RUNG SỐ [ ${b.number} ] ĐÃ LÀM XONG MÓN!</h6>
                        <small>Đơn hàng ${b.orderCode || ''} từ Bếp đã sẵn sàng giao cho khách</small>
                    </div>
                </div>
                <button class="btn btn-warning text-dark fw-bold rounded-pill px-4 shadow" onclick="callCustomerToPickup(${b.number})">
                    <i class="fa-solid fa-bullhorn me-1"></i>GỌI KHÁCH NHẬN MÓN
                </button>
            </div>
        `).join('');
    } else {
        alertContainer.innerHTML = '';
    }
}

function callCustomerToPickup(buzzerNumber) {
    playChimeSound('call');
    const data = getAppData();
    const buzzer = data.buzzers.find(b => b.number === buzzerNumber);
    if (!buzzer) return;

    // Complete order
    if (buzzer.orderId) {
        const order = data.orders.find(o => o.id === buzzer.orderId);
        if (order) {
            order.status = 'COMPLETED';
            const now = new Date();
            order.completedAt = now.toLocaleTimeString('vi-VN') + ' - ' + now.toLocaleDateString('vi-VN');
        }
    }

    // Release buzzer card
    buzzer.status = 'AVAILABLE';
    buzzer.orderId = null;
    buzzer.orderCode = null;

    saveAppData(data);
    renderBuzzerPopup();
    renderReadyAlerts();
    updateNavbarBadges();

    alert(`📢 ĐÃ GỌI KHÁCH! Thẻ số [ ${buzzerNumber} ] đã được thu hồi và sẵn sàng phục vụ đơn mới.`);
}

/* 2. MENU & PRODUCTS */
function filterCategory(cat, elem) {
    activeCategoryFilter = cat;
    document.querySelectorAll('#categoryPills .category-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    if (elem) elem.classList.add('active');
    renderProducts();
}

function searchProducts(keyword) {
    renderProducts(keyword.trim().toLowerCase());
}

function renderProducts(searchKw = '') {
    const data = getAppData();
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let list = data.products.filter(p => p.available);
    if (activeCategoryFilter !== 'ALL') {
        list = list.filter(p => p.category === activeCategoryFilter);
    }
    if (searchKw) {
        list = list.filter(p => p.name.toLowerCase().includes(searchKw) || p.code.toLowerCase().includes(searchKw));
    }

    if (list.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center text-muted py-5"><p>Không tìm thấy món phù hợp</p></div>`;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="col">
            <div class="product-card" onclick="addToCart('${p.id}')">
                <div class="product-img-box">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'">
                    ${p.combo ? `<span class="badge-combo"><i class="fa-solid fa-tag me-1"></i>COMBO</span>` : ''}
                </div>
                <div class="p-2 flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                        <h6 class="fw-bold mb-1 fs-6 text-truncate" title="${p.name}">${p.name}</h6>
                        <small class="text-muted d-block text-truncate small">${p.description || ''}</small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                        <span class="fw-bold text-danger">${formatMoney(p.price)}</span>
                        <button class="btn btn-sm btn-primary rounded-circle p-1" style="width:28px; height:28px;" title="Thêm vào đơn">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/* 3. CART ACTIONS */
function addToCart(productId) {
    const data = getAppData();
    const product = data.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = currentCart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentCart.push({
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
            note: ''
        });
    }
    renderCart();
}

function updateItemQty(productId, delta) {
    const item = currentCart.find(i => i.productId === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        currentCart = currentCart.filter(i => i.productId !== productId);
    }
    renderCart();
}

function updateItemNote(productId, note) {
    const item = currentCart.find(i => i.productId === productId);
    if (item) item.note = note;
}

function clearCart() {
    currentCart = [];
    selectedBuzzerNumber = null;
    renderBuzzerPopup();
    renderCart();
}

function calculateCartTotal() {
    return currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderCart() {
    const listContainer = document.getElementById('cartItemsList');
    const totalQtyElem = document.getElementById('cartTotalQty');
    const totalAmountElem = document.getElementById('cartTotalAmount');
    if (!listContainer) return;

    if (currentCart.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="fa-solid fa-mug-saucer fa-3x mb-3 text-secondary opacity-50"></i>
                <p class="mb-1 fw-semibold">Chưa có món nào trong đơn</p>
                <small>Bấm vào món bên thực đơn để thêm vào đơn hàng</small>
            </div>
        `;
        totalQtyElem.innerText = '0 món';
        totalAmountElem.innerText = '0 đ';
        return;
    }

    let totalQty = 0;
    let totalAmount = 0;

    listContainer.innerHTML = currentCart.map(item => {
        const subtotal = item.price * item.quantity;
        totalQty += item.quantity;
        totalAmount += subtotal;

        return `
            <div class="cart-item">
                <div class="d-flex justify-content-between align-items-start mb-1">
                    <span class="fw-bold">${item.productName}</span>
                    <span class="fw-bold text-danger">${formatMoney(subtotal)}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-light border rounded-circle p-0" style="width:24px; height:24px;" onclick="updateItemQty('${item.productId}', -1)">-</button>
                        <span class="fw-bold px-1">${item.quantity}</span>
                        <button class="btn btn-sm btn-light border rounded-circle p-0" style="width:24px; height:24px;" onclick="updateItemQty('${item.productId}', 1)">+</button>
                    </div>
                    <input type="text" class="form-control form-control-sm border-0 bg-white" style="max-width: 170px; font-size:0.8rem;" 
                        placeholder="Ghi chú (ít ngọt, nhiều đá...)" value="${item.note}" oninput="updateItemNote('${item.productId}', this.value)">
                </div>
            </div>
        `;
    }).join('');

    totalQtyElem.innerText = `${totalQty} món`;
    totalAmountElem.innerText = formatMoney(totalAmount);

    updateTransferQrCode();
}

/* 4. PAYMENT METHOD TOGGLE (TIỀN MẶT / CHUYỂN KHOẢN QR) */
function togglePaymentMethod(method) {
    currentPaymentMethod = method;
    const transferBox = document.getElementById('transferInfoBox');
    if (transferBox) {
        transferBox.style.display = (method === 'TRANSFER') ? 'block' : 'none';
        if (method === 'TRANSFER') {
            updateTransferQrCode();
        }
    }
}

function updateTransferQrCode() {
    const total = calculateCartTotal();
    const buzzerStr = selectedBuzzerNumber ? `THE${selectedBuzzerNumber}` : 'THE00';
    const content = `POLYCOFFEE ${buzzerStr}`;
    const lbl = document.getElementById('transferContentLabel');
    if (lbl) lbl.innerText = content;

    const qrImg = document.getElementById('checkoutQrImage');
    if (qrImg) {
        qrImg.src = `https://img.vietqr.io/image/MB-0909888999-compact.png?amount=${total}&addInfo=${encodeURIComponent(content)}&accountName=POLY%20COFFEE`;
    }
}

/* 5. CREATE ORDER & SHOW BILL (CÓ NGÀY GIỜ CHÍNH XÁC) */
function createOrderAndPrintBill() {
    if (currentCart.length === 0) {
        alert('Vui lòng chọn ít nhất 1 món từ menu trước khi xuất bill!');
        return;
    }
    if (!selectedBuzzerNumber) {
        alert('CHÚ Ý: Vui lòng chọn 1 thẻ rung từ danh sách thẻ (kế bên nút Xuất bill) để đánh dấu đơn cho khách!');
        return;
    }

    const total = calculateCartTotal();
    const user = getLoggedInUser();
    const data = getAppData();

    const now = new Date();
    const fullDateTime = now.toLocaleTimeString('vi-VN') + ' - ' + now.toLocaleDateString('vi-VN');

    const orderCode = 'HD' + String(data.orders.length + 1).padStart(4, '0');
    const newOrder = {
        id: 'ORD_' + Date.now(),
        orderCode: orderCode,
        buzzerCardNumber: selectedBuzzerNumber,
        items: JSON.parse(JSON.stringify(currentCart)),
        totalAmount: total,
        paymentMethod: currentPaymentMethod,
        cashierName: user ? user.fullName : 'Lan Anh',
        status: 'PENDING',
        createdAt: fullDateTime,
        timestamp: Date.now()
    };

    // Lock buzzer to BREWING
    const buzzer = data.buzzers.find(b => b.number === selectedBuzzerNumber);
    if (buzzer) {
        buzzer.status = 'BREWING';
        buzzer.orderId = newOrder.id;
        buzzer.orderCode = orderCode;
    }

    data.orders.unshift(newOrder);
    saveAppData(data);

    // Show thermal receipt
    showReceiptModal(newOrder);

    // Reset
    currentCart = [];
    selectedBuzzerNumber = null;

    renderBuzzerPopup();
    renderCart();
    updateNavbarBadges();
}

function showReceiptModal(order) {
    document.getElementById('billReceiptBuzzer').innerText = String(order.buzzerCardNumber).padStart(2, '0');
    document.getElementById('billReceiptCode').innerText = order.orderCode;
    document.getElementById('billReceiptTime').innerText = order.createdAt; // Ngày giờ của bill
    document.getElementById('billReceiptCashier').innerText = order.cashierName;
    document.getElementById('billReceiptTotal').innerText = formatMoney(order.totalAmount);
    document.getElementById('billReceiptPayment').innerText = (order.paymentMethod === 'CASH') ? 'Tiền mặt' : 'Chuyển khoản VietQR';

    document.getElementById('billReceiptItemsList').innerHTML = order.items.map(item => `
        <div class="d-flex justify-content-between mb-1">
            <span>${item.quantity}x ${item.productName} ${item.note ? `<br><small class="text-muted">(${item.note})</small>` : ''}</span>
            <strong>${formatMoney(item.price * item.quantity)}</strong>
        </div>
    `).join('');

    const receiptModal = new bootstrap.Modal(document.getElementById('printReceiptModal'));
    receiptModal.show();
}
