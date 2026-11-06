/* =============================================================
   ADMIN (QUẢN TRỊ VIÊN) LOGIC - DASHBOARD, MENU, STAFF, BILLS
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Authentication (BẮT BUỘC VAI TRÒ ADMIN)
    const user = requireAuth('ADMIN');
    if (!user) return;

    initNavbar();
    renderDashboardOverview();
    renderTopSellingTable();
    renderBillsTable();
    renderMenuTable();
    renderStaffTable();
});

/* 1. OVERVIEW DASHBOARD */
function renderDashboardOverview() {
    const data = getAppData();
    const totalRevenue = data.orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
    const totalBills = data.orders.length;
    const totalCups = data.orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.items.reduce((s, i) => s + i.quantity, 0) : 0), 0);
    const activeBuzzers = data.buzzers.filter(b => b.status !== 'AVAILABLE').length;

    const revElem = document.getElementById('statTotalRevenue');
    if (revElem) revElem.innerText = formatMoney(totalRevenue);

    const billElem = document.getElementById('statTotalBills');
    if (billElem) billElem.innerText = totalBills;

    const cupElem = document.getElementById('statTotalCups');
    if (cupElem) cupElem.innerText = totalCups + ' ly/bánh';

    const buzzElem = document.getElementById('statActiveBuzzers');
    if (buzzElem) buzzElem.innerText = `${activeBuzzers} / 20`;

    // Render Top 5 Preview
    const topContainer = document.getElementById('adminTopOverviewList');
    if (topContainer) {
        const sorted = getSortedProductSales(data);
        if (sorted.length === 0) {
            topContainer.innerHTML = `<p class="text-muted text-center py-4">Chưa có dữ liệu bán hàng</p>`;
        } else {
            topContainer.innerHTML = sorted.slice(0, 5).map((p, idx) => {
                const pct = totalRevenue > 0 ? ((p.totalRevenue / totalRevenue) * 100).toFixed(1) : 0;
                return `
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold"><span class="badge ${idx === 0 ? 'bg-warning text-dark' : 'bg-light text-dark border'} me-2">#${idx + 1}</span> ${p.name}</span>
                            <div>
                                <strong class="text-danger me-2">${formatMoney(p.totalRevenue)}</strong>
                                <span class="badge bg-primary-subtle text-primary border border-primary-subtle">${p.totalQty} ly</span>
                            </div>
                        </div>
                        <div class="progress" style="height: 7px;">
                            <div class="progress-bar bg-warning" role="progressbar" style="width: ${pct}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Render Recent Bills preview
    const recentTable = document.getElementById('adminRecentBillsTable');
    if (recentTable) {
        const recent = data.orders.slice(0, 5);
        if (recent.length === 0) {
            recentTable.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Chưa có đơn hàng nào</td></tr>`;
        } else {
            recentTable.innerHTML = recent.map(o => `
                <tr>
                    <td>
                        <span class="fw-bold text-primary">${o.orderCode}</span>
                        <div class="small text-muted" style="font-size: 0.72rem;"><i class="fa-regular fa-clock me-1"></i>${o.createdAt}</div>
                    </td>
                    <td><span class="badge bg-dark text-warning">#${o.buzzerCardNumber}</span></td>
                    <td class="fw-bold text-danger">${formatMoney(o.totalAmount)}</td>
                    <td>${o.paymentMethod === 'CASH' ? 'Tiền mặt' : 'CK QR'}</td>
                    <td>${getStatusBadge(o.status)}</td>
                </tr>
            `).join('');
        }
    }
}

/* 2. TOP PRODUCTS CALCULATION */
function getSortedProductSales(data) {
    let productSalesMap = {};
    data.orders.forEach(order => {
        if (order.status !== 'CANCELLED') {
            order.items.forEach(item => {
                if (!productSalesMap[item.productId]) {
                    const pInfo = data.products.find(p => p.id === item.productId) || { name: item.productName, image: '', category: 'KHÁC', price: item.price };
                    productSalesMap[item.productId] = {
                        id: item.productId,
                        name: item.productName,
                        category: pInfo.category,
                        image: pInfo.image,
                        price: item.price,
                        totalQty: 0,
                        totalRevenue: 0
                    };
                }
                productSalesMap[item.productId].totalQty += item.quantity;
                productSalesMap[item.productId].totalRevenue += (item.price * item.quantity);
            });
        }
    });
    return Object.values(productSalesMap).sort((a, b) => b.totalQty - a.totalQty);
}

function renderTopSellingTable() {
    const table = document.getElementById('topProductsFullTable');
    if (!table) return;

    const data = getAppData();
    const totalRevenue = data.orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
    const sorted = getSortedProductSales(data);

    if (sorted.length === 0) {
        table.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">Chưa có đơn hàng nào được tạo</td></tr>`;
        return;
    }

    table.innerHTML = sorted.map((p, idx) => {
        const pct = totalRevenue > 0 ? ((p.totalRevenue / totalRevenue) * 100).toFixed(1) : 0;
        return `
            <tr>
                <td><span class="badge ${idx === 0 ? 'bg-warning text-dark fs-6' : (idx < 3 ? 'bg-primary fs-6' : 'bg-light text-dark border')}">#${idx + 1}</span></td>
                <td><img src="${p.image}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'"></td>
                <td class="fw-bold">${p.name}</td>
                <td><span class="badge bg-secondary-subtle text-secondary">${p.category}</span></td>
                <td>${formatMoney(p.price)}</td>
                <td class="text-center fw-bold text-primary">${p.totalQty}</td>
                <td class="fw-bold text-danger">${formatMoney(p.totalRevenue)}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="progress flex-grow-1" style="height: 8px;">
                            <div class="progress-bar bg-success" style="width: ${pct}%"></div>
                        </div>
                        <small class="fw-bold text-muted">${pct}%</small>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/* 3. BILLS HISTORY */
function renderBillsTable() {
    const table = document.getElementById('billsFullTable');
    if (!table) return;

    const filterPayment = document.getElementById('filterBillPayment')?.value || 'ALL';
    const searchKw = (document.getElementById('searchBillCode')?.value || '').trim().toLowerCase();

    const data = getAppData();
    let list = data.orders;

    if (filterPayment !== 'ALL') {
        list = list.filter(o => o.paymentMethod === filterPayment);
    }
    if (searchKw) {
        list = list.filter(o => o.orderCode.toLowerCase().includes(searchKw));
    }

    if (list.length === 0) {
        table.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">Không tìm thấy hoá đơn phù hợp</td></tr>`;
        return;
    }

    table.innerHTML = list.map(o => `
        <tr>
            <td class="fw-bold text-primary">${o.orderCode}</td>
            <td><strong class="text-dark"><i class="fa-regular fa-clock me-1 text-muted"></i>${o.createdAt}</strong></td>
            <td><span class="badge bg-dark text-warning">Thẻ ${o.buzzerCardNumber}</span></td>
            <td>${o.items.reduce((s, i) => s + i.quantity, 0)} món</td>
            <td class="fw-bold text-danger">${formatMoney(o.totalAmount)}</td>
            <td><span class="badge ${o.paymentMethod === 'CASH' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'} border">${o.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản QR'}</span></td>
            <td>${o.cashierName}</td>
            <td>${getStatusBadge(o.status)}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary rounded-circle" onclick="viewBillDetail('${o.id}')" title="Xem & In lại">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterBillsTable() {
    renderBillsTable();
}

function viewBillDetail(orderId) {
    const data = getAppData();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('billReceiptBuzzer').innerText = String(order.buzzerCardNumber).padStart(2, '0');
    document.getElementById('billReceiptCode').innerText = order.orderCode;
    document.getElementById('billReceiptTime').innerText = order.createdAt;
    document.getElementById('billReceiptCashier').innerText = order.cashierName;
    document.getElementById('billReceiptTotal').innerText = formatMoney(order.totalAmount);
    document.getElementById('billReceiptPayment').innerText = (order.paymentMethod === 'CASH') ? 'Tiền mặt' : 'Chuyển khoản VietQR';

    document.getElementById('billReceiptItemsList').innerHTML = order.items.map(item => `
        <div class="d-flex justify-content-between mb-1">
            <span>${item.quantity}x ${item.productName} ${item.note ? `<br><small class="text-muted">(${item.note})</small>` : ''}</span>
            <strong>${formatMoney(item.price * item.quantity)}</strong>
        </div>
    `).join('');

    new bootstrap.Modal(document.getElementById('printReceiptModal')).show();
}

function getStatusBadge(status) {
    switch (status) {
        case 'PENDING': return `<span class="badge bg-warning text-dark">Chờ pha chế</span>`;
        case 'BREWING': return `<span class="badge bg-info text-white">Đang pha chế</span>`;
        case 'READY': return `<span class="badge bg-success">Đã xong (Gọi khách)</span>`;
        case 'COMPLETED': return `<span class="badge bg-secondary">Đã giao khách</span>`;
        default: return `<span class="badge bg-light text-dark">Khác</span>`;
    }
}

/* 4. MENU & COMBO CRUD */
function renderMenuTable() {
    const table = document.getElementById('adminProductsTable');
    if (!table) return;

    const data = getAppData();
    table.innerHTML = data.products.map(p => `
        <tr>
            <td><img src="${p.image}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'"></td>
            <td class="fw-bold">${p.code}</td>
            <td class="fw-bold">${p.name}</td>
            <td><span class="badge ${p.combo ? 'bg-danger' : 'bg-secondary-subtle text-secondary'}">${p.combo ? 'COMBO' : p.category}</span></td>
            <td class="fw-bold text-danger">${formatMoney(p.price)}</td>
            <td><small class="text-muted">${p.description || '-'}</small></td>
            <td>
                <span class="badge ${p.available ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger'}">
                    ${p.available ? 'Đang phục vụ' : 'Hết món'}
                </span>
            </td>
            <td class="text-center">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" onclick="editProduct('${p.id}')" title="Sửa"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-outline-danger" onclick="deleteProduct('${p.id}')" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddProductModal() {
    document.getElementById('productForm').reset();
    document.getElementById('prodEditId').value = '';
    document.getElementById('productModalTitle').innerText = 'Thêm Món / Combo Mới';
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

function editProduct(productId) {
    const data = getAppData();
    const p = data.products.find(item => item.id === productId);
    if (!p) return;

    document.getElementById('prodEditId').value = p.id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodImage').value = p.image;
    document.getElementById('prodDesc').value = p.description || '';
    document.getElementById('prodAvailable').checked = p.available;
    document.getElementById('productModalTitle').innerText = 'Sửa Thông Tin Món';
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

function saveProduct() {
    const id = document.getElementById('prodEditId').value;
    const name = document.getElementById('prodName').value.trim();
    const category = document.getElementById('prodCategory').value;
    const price = parseFloat(document.getElementById('prodPrice').value) || 0;
    const image = document.getElementById('prodImage').value.trim() || 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80';
    const desc = document.getElementById('prodDesc').value.trim();
    const available = document.getElementById('prodAvailable').checked;

    if (!name || price <= 0) {
        alert('Vui lòng nhập tên món và giá bán hợp lệ!');
        return;
    }

    const data = getAppData();
    if (id) {
        const p = data.products.find(item => item.id === id);
        if (p) {
            p.name = name;
            p.category = category;
            p.price = price;
            p.image = image;
            p.description = desc;
            p.available = available;
            p.combo = (category === 'COMBO');
        }
    } else {
        const newP = {
            id: 'P_' + Date.now(),
            code: 'M' + String(data.products.length + 1).padStart(2, '0'),
            name: name,
            category: category,
            price: price,
            image: image,
            description: desc,
            combo: (category === 'COMBO'),
            available: available
        };
        data.products.push(newP);
    }

    saveAppData(data);
    renderMenuTable();
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
}

function deleteProduct(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa món này khỏi menu?')) {
        const data = getAppData();
        data.products = data.products.filter(p => p.id !== productId);
        saveAppData(data);
        renderMenuTable();
    }
}

/* 5. STAFF & ROLES */
function renderStaffTable() {
    const table = document.getElementById('adminStaffTable');
    if (!table) return;

    const data = getAppData();
    table.innerHTML = data.staff.map(u => `
        <tr>
            <td class="fw-bold">${u.fullName}</td>
            <td><code>${u.username}</code></td>
            <td>${u.phone || '-'}</td>
            <td>
                <span class="badge ${u.role === 'ADMIN' ? 'bg-danger' : (u.role === 'CASHIER' ? 'bg-primary' : 'bg-warning text-dark')} fs-6">
                    ${u.role === 'ADMIN' ? 'Quản Trị Viên' : (u.role === 'CASHIER' ? 'Thu Ngân' : 'Pha Chế')}
                </span>
            </td>
            <td><span class="badge bg-success-subtle text-success border">Đang làm việc</span></td>
            <td class="text-center">
                <select class="form-select form-select-sm d-inline-block w-auto" onchange="changeStaffRole('${u.id}', this.value)">
                    <option value="CASHIER" ${u.role === 'CASHIER' ? 'selected' : ''}>Thu Ngân</option>
                    <option value="BARISTA" ${u.role === 'BARISTA' ? 'selected' : ''}>Pha Chế</option>
                    <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>Quản Trị Viên</option>
                </select>
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStaff('${u.id}')" title="Xóa nhân viên">
                    <i class="fa-solid fa-user-xmark"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function changeStaffRole(staffId, newRole) {
    const data = getAppData();
    const user = data.staff.find(s => s.id === staffId);
    if (user) {
        user.role = newRole;
        saveAppData(data);
        renderStaffTable();
        alert(`Đã cấp lại vai trò thành [ ${newRole === 'ADMIN' ? 'Quản Trị Viên' : (newRole === 'CASHIER' ? 'Thu Ngân' : 'Pha Chế')} ] cho nhân viên ${user.fullName}`);
    }
}

function openAddStaffModal() {
    document.getElementById('staffForm').reset();
    new bootstrap.Modal(document.getElementById('staffModal')).show();
}

function saveStaff() {
    const name = document.getElementById('staffFullName').value.trim();
    const username = document.getElementById('staffUsername').value.trim();
    const phone = document.getElementById('staffPhone').value.trim();
    const password = (document.getElementById('staffPassword')?.value || '123').trim();
    const role = document.getElementById('staffRole').value;

    if (!name || !username) {
        alert('Vui lòng nhập họ tên và tên đăng nhập!');
        return;
    }

    const data = getAppData();
    const existing = data.staff.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
        alert('Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!');
        return;
    }

    const newStaff = {
        id: 'U_' + Date.now(),
        fullName: name,
        username: username,
        password: password,
        phone: phone,
        role: role,
        active: true
    };

    data.staff.push(newStaff);
    saveAppData(data);
    renderStaffTable();
    bootstrap.Modal.getInstance(document.getElementById('staffModal')).hide();
    alert(`Thêm tài khoản nhân viên ${name} (${username}) với vai trò [ ${getRoleName(role)} ] thành công! Nhân viên có thể dùng tài khoản này để đăng nhập.`);
}

function deleteStaff(staffId) {
    const data = getAppData();
    if (data.staff.length <= 1) {
        alert('Hệ thống phải có ít nhất 1 nhân viên!');
        return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        data.staff = data.staff.filter(s => s.id !== staffId);
        saveAppData(data);
        renderStaffTable();
    }
}
