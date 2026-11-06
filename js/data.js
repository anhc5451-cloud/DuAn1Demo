/* =============================================================
   SHARED DATA, AUTH & UTILITIES - POLY COFFEE MANAGEMENT SYSTEM
   ============================================================= */

const DEFAULT_PRODUCTS = [
    // ----------------- 1. CÀ PHÊ (14 MÓN) -----------------
    { id: 'P01', code: 'CF01', name: 'Cà Phê Sữa Đá', category: 'COFFEE', price: 29000, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80', description: 'Robusta Buôn Ma Thuột phối sữa đặc béo ngậy truyền thống', combo: false, available: true },
    { id: 'P02', code: 'CF02', name: 'Cà Phê Đen Phin Đá', category: 'COFFEE', price: 25000, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80', description: 'Cà phê nguyên chất pha phin đậm vị truyền thống', combo: false, available: true },
    { id: 'P03', code: 'CF03', name: 'Bạc Xỉu Sữa Tươi 3 Tầng', category: 'COFFEE', price: 35000, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80', description: 'Nhiều sữa ít cà phê, béo ngậy ngọt dịu thơm hương vani', combo: false, available: true },
    { id: 'P04', code: 'CF04', name: 'Cà Phê Muối Xứ Huế', category: 'COFFEE', price: 35000, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80', description: 'Lớp kem mặn béo mịn hoà quyện cùng cà phê phin đậm đà', combo: false, available: true },
    { id: 'P05', code: 'CF05', name: 'Caramel Macchiato Đá', category: 'COFFEE', price: 45000, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&q=80', description: 'Espresso thơm nồng quyện sữa tươi thanh trùng và xốt caramel', combo: false, available: true },
    { id: 'P06', code: 'CF06', name: 'Americano Đá Mát Lạnh', category: 'COFFEE', price: 32000, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80', description: 'Espresso Arabica nguyên chất pha nước mát thanh khiết', combo: false, available: true },
    { id: 'P07', code: 'CF07', name: 'Cappuccino Bọt Sữa Mịn', category: 'COFFEE', price: 42000, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&q=80', description: 'Tỉ lệ vàng giữa espresso, sữa nóng và lớp bọt sữa dày mịn', combo: false, available: true },
    { id: 'P08', code: 'CF08', name: 'Cold Brew Cam Vàng', category: 'COFFEE', price: 45000, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80', description: 'Cà phê ủ lạnh 16 tiếng kết hợp tép cam vàng tươi thanh khiết', combo: false, available: true },
    { id: 'P09', code: 'CF09', name: 'Cà Phê Trứng Hà Nội', category: 'COFFEE', price: 39000, image: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=500&q=80', description: 'Kem trứng đánh bông mịn béo thơm ngậy phủ lên cà phê nóng đậm', combo: false, available: true },
    { id: 'P10', code: 'CF10', name: 'Espresso Con Panna', category: 'COFFEE', price: 35000, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80', description: 'Một shot Espresso đậm đà phủ lớp kem tươi béo ngậy ngọt ngào', combo: false, available: true },
    { id: 'P11', code: 'CF11', name: 'Affogato Kem Vani Rót Cà Phê', category: 'COFFEE', price: 45000, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500&q=80', description: 'Viên kem Gelato Vani hảo hạng rót sốt Espresso nóng hổi', combo: false, available: true },
    { id: 'P12', code: 'CF12', name: 'Cà Phê Cốt Dừa Đá Xay', category: 'COFFEE', price: 42000, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80', description: 'Cốt dừa béo bùi đá xay mịn quyện vị cà phê đen thơm đắng', combo: false, available: true },
    { id: 'P13', code: 'CF13', name: 'Flat White Chuẩn Úc', category: 'COFFEE', price: 45000, image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&q=80', description: 'Double shot espresso đậm đà cùng lớp microfoam sữa siêu mịn', combo: false, available: true },
    { id: 'P14', code: 'CF14', name: 'Cold Brew Bưởi Hồng Nhiệt Đới', category: 'COFFEE', price: 48000, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80', description: 'Cà phê ủ lạnh thanh mát quyện tép bưởi hồng tươi chua ngọt', combo: false, available: true },

    // ----------------- 2. TRÀ & TRÁI CÂY (11 MÓN) -----------------
    { id: 'P15', code: 'TR01', name: 'Trà Đào Cam Sả', category: 'TEA', price: 42000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80', description: 'Đào giòn ngọt, cam vàng thanh mát cùng hương sả thư thái', combo: false, available: true },
    { id: 'P16', code: 'TR02', name: 'Trà Vải Hoa Hồng', category: 'TEA', price: 45000, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', description: 'Hương hoa hồng quý phái kết hợp trái vải tươi mọng nước', combo: false, available: true },
    { id: 'P17', code: 'TR03', name: 'Trà Sen Vàng Macchiato', category: 'TEA', price: 45000, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80', description: 'Hạt sen bùi thơm, thạch củ năng giòn và lớp milk foam béo mặn', combo: false, available: true },
    { id: 'P18', code: 'TR04', name: 'Trà Oolong Dâu Tằm', category: 'TEA', price: 42000, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80', description: 'Trà ô long thượng hạng kết hợp mứt dâu tằm chua ngọt giải nhiệt', combo: false, available: true },
    { id: 'P19', code: 'TR05', name: 'Trà Sữa Trân Châu Đường Đen', category: 'TEA', price: 39000, image: 'https://images.unsplash.com/photo-1558857563-b37fe927ec0e?w=500&q=80', description: 'Trân châu dẻo dai nấu đường nâu quyện trà sữa thơm béo', combo: false, available: true },
    { id: 'P20', code: 'TR06', name: 'Trà Lài Dưa Lưới Hạt Chia', category: 'TEA', price: 42000, image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500&q=80', description: 'Trà lài thơm nức kết hợp dưa lưới ngọt mát và hạt chia healthy', combo: false, available: true },
    { id: 'P21', code: 'TR07', name: 'Trà Mãng Cầu Xiêm Tươi', category: 'TEA', price: 45000, image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=500&q=80', description: 'Mãng cầu tươi dầm ngọt chua dịu giải khát cực đã mùa hè', combo: false, available: true },
    { id: 'P22', code: 'TR08', name: 'Trà Bưởi Hồng Mật Ong', category: 'TEA', price: 42000, image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&q=80', description: 'Trà xanh thanh mát quyện mật ong rừng và tép bưởi hồng mọng', combo: false, available: true },
    { id: 'P23', code: 'TR09', name: 'Trà Xanh Hoa Nhài Macchiato', category: 'TEA', price: 39000, image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500&q=80', description: 'Trà nhài thơm thoang thoảng phủ lớp bọt sữa Macchiato mặn béo', combo: false, available: true },
    { id: 'P24', code: 'TR10', name: 'Trà Đen Kem Trứng Khò', category: 'TEA', price: 42000, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&q=80', description: 'Lớp kem trứng nướng đường nâu giòn xèo trên nền trà đen đậm đà', combo: false, available: true },
    { id: 'P25', code: 'TR11', name: 'Trà Kim Quất Xí Muội', category: 'TEA', price: 35000, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', description: 'Vị chua của quất tươi kết hợp xí muội mặn ngọt kích thích vị giác', combo: false, available: true },

    // ----------------- 3. ĐÁ XAY & SINH TỐ (9 MÓN) -----------------
    { id: 'P26', code: 'DX01', name: 'Matcha Đá Xay Kem Cheese', category: 'FREEZE', price: 49000, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&q=80', description: 'Matcha Uji Nhật Bản đá xay mịn phủ kem cheese béo ngậy', combo: false, available: true },
    { id: 'P27', code: 'DX02', name: 'Socola Cookie Đá Xay', category: 'FREEZE', price: 49000, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80', description: 'Vụn bánh Oreo xay nhuyễn cùng socola và kem whipping cream', combo: false, available: true },
    { id: 'P28', code: 'DX03', name: 'Caramel Cà Phê Freeze', category: 'FREEZE', price: 49000, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80', description: 'Đá xay cà phê thơm đậm đà kèm thạch cà phê dai giòn', combo: false, available: true },
    { id: 'P29', code: 'DX04', name: 'Sinh Tố Bơ Dừa Béo Bùi', category: 'FREEZE', price: 45000, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&q=80', description: 'Bơ sáp Đắk Lắk xay nhuyễn cùng sữa dừa béo bùi dinh dưỡng', combo: false, available: true },
    { id: 'P30', code: 'DX05', name: 'Freeze Trà Xanh Đậu Đỏ', category: 'FREEZE', price: 52000, image: 'https://images.unsplash.com/photo-1558857563-b37fe927ec0e?w=500&q=80', description: 'Matcha đá xay ngọt mát kết hợp đậu đỏ Azuki bùi dẻo Nhật Bản', combo: false, available: true },
    { id: 'P31', code: 'DX06', name: 'Choco Mint Đá Xay Bạc Hà', category: 'FREEZE', price: 49000, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80', description: 'Hương bạc hà mát lạnh the nồng kết hợp socola đen nguyên chất', combo: false, available: true },
    { id: 'P32', code: 'DX07', name: 'Sinh Tố Dâu Chuối Yến Mạch', category: 'FREEZE', price: 48000, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&q=80', description: 'Dâu tây Đà Lạt, chuối chín và yến mạch giàu năng lượng', combo: false, available: true },
    { id: 'P33', code: 'DX08', name: 'Chanh Tuyết Bạc Hà Mát Lạnh', category: 'FREEZE', price: 38000, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', description: 'Chanh tươi đá tuyết chua ngọt sảng khoái đánh tan mệt mỏi', combo: false, available: true },
    { id: 'P34', code: 'DX09', name: 'Sinh Tố Xoài Chanh Dây', category: 'FREEZE', price: 45000, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&q=80', description: 'Xoài cát chín mọng ngọt lịm hoà quyện chanh leo chua dịu', combo: false, available: true },

    // ----------------- 4. BÁNH NGỌT & ĂN KÈM (5 MÓN) -----------------
    { id: 'P35', code: 'BN01', name: 'Bánh Croissant Bơ Pháp', category: 'PASTRY', price: 32000, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80', description: 'Bánh sừng bò ngàn lớp thơm lừng bơ Pháp, vỏ giòn ruột xốp', combo: false, available: true },
    { id: 'P36', code: 'BN02', name: 'Bánh Tiramisu Ý Cacao', category: 'PASTRY', price: 39000, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80', description: 'Phô mai Mascarpone mềm tan quyện hương rượu rum và cà phê', combo: false, available: true },
    { id: 'P37', code: 'BN03', name: 'Bánh Phô Mai Nướng Basque', category: 'PASTRY', price: 42000, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80', description: 'Cháy mặt xém thơm lừng, bên trong béo ngậy tan chảy', combo: false, available: true },
    { id: 'P38', code: 'BN04', name: 'Bánh Mousse Đào Sữa Chua', category: 'PASTRY', price: 38000, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80', description: 'Vị chua ngọt thanh nhẹ từ đào tươi và sữa chua Hy Lạp', combo: false, available: true },
    { id: 'P39', code: 'BN05', name: 'Bánh Su Kem Vani Hokkaido', category: 'PASTRY', price: 30000, image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?w=500&q=80', description: 'Vỏ bánh xốp giòn nhân kem sữa tươi Hokkaido mát lạnh ngọt dịu', combo: false, available: true },

    // ----------------- 5. COMBO TIẾT KIỆM (5 COMBO) -----------------
    { id: 'P40', code: 'CB01', name: '🔥 Combo Sáng Tỉnh Táo', category: 'COMBO', price: 52000, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80', description: '1 Cà Phê Sữa Đá + 1 Bánh Croissant Bơ (Tiết kiệm 9.000đ)', combo: true, available: true },
    { id: 'P41', code: 'CB02', name: '🔥 Combo Trà Chiều Ngọt Ngào', category: 'COMBO', price: 69000, image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&q=80', description: '1 Trà Đào Cam Sả + 1 Bánh Tiramisu Cacao (Tiết kiệm 12.000đ)', combo: true, available: true },
    { id: 'P42', code: 'CB03', name: '🔥 Combo Năng Lượng Đôi', category: 'COMBO', price: 95000, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80', description: '2 Cà Phê Muối + 1 Bánh Phô Mai Nướng Basque (Tiết kiệm 17.000đ)', combo: true, available: true },
    { id: 'P43', code: 'CB04', name: '🔥 Combo Bữa Xế Ngọt Ngào', category: 'COMBO', price: 72000, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80', description: '1 Socola Cookie Đá Xay + 1 Bánh Su Kem Vani (Tiết kiệm 7.000đ)', combo: true, available: true },
    { id: 'P44', code: 'CB05', name: '🔥 Combo Đậm Đà Buôn Mê', category: 'COMBO', price: 75000, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80', description: '2 Cà Phê Đen Phin Đá + 1 Bánh Croissant Bơ Pháp (Tiết kiệm 7.000đ)', combo: true, available: true }
];

const DEFAULT_STAFF = [
    { id: 'U01', username: 'admin', password: '123', fullName: 'Nguyễn Quản Trị', phone: '0909111222', role: 'ADMIN', active: true },
    { id: 'U02', username: 'lananh', password: '123', fullName: 'Trần Thị Lan Anh', phone: '0909333444', role: 'CASHIER', active: true },
    { id: 'U03', username: 'hoangnam', password: '123', fullName: 'Lê Hoàng Nam', phone: '0909555666', role: 'BARISTA', active: true }
];

function initDefaultBuzzers() {
    let buzzers = [];
    for (let i = 1; i <= 20; i++) {
        buzzers.push({
            number: i,
            status: 'AVAILABLE', // AVAILABLE, BREWING, READY
            orderId: null,
            orderCode: null
        });
    }
    return buzzers;
}

// Global state accessor (Auto-sync to 44 items if older data had fewer items)
function getAppData() {
    let savedProducts = JSON.parse(localStorage.getItem('poly_products'));
    if (!savedProducts || savedProducts.length < 35) {
        savedProducts = DEFAULT_PRODUCTS;
        localStorage.setItem('poly_products', JSON.stringify(DEFAULT_PRODUCTS));
    }

    return {
        products: savedProducts,
        staff: JSON.parse(localStorage.getItem('poly_staff')) || DEFAULT_STAFF,
        buzzers: JSON.parse(localStorage.getItem('poly_buzzers')) || initDefaultBuzzers(),
        orders: JSON.parse(localStorage.getItem('poly_orders')) || []
    };
}

function saveAppData(data) {
    if (data.products) localStorage.setItem('poly_products', JSON.stringify(data.products));
    if (data.staff) localStorage.setItem('poly_staff', JSON.stringify(data.staff));
    if (data.buzzers) localStorage.setItem('poly_buzzers', JSON.stringify(data.buzzers));
    if (data.orders) localStorage.setItem('poly_orders', JSON.stringify(data.orders));
}

/* =============================================================
   AUTHENTICATION & ACCESS CONTROL (CHẶN TRUY CẬP KHÔNG PHÉP)
   ============================================================= */
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('poly_logged_in_user'));
}

function setLoggedInUser(user) {
    localStorage.setItem('poly_logged_in_user', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('poly_logged_in_user');
    window.location.href = 'index.html';
}

function requireAuth(allowedRole) {
    const user = getLoggedInUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }

    if (allowedRole && user.role !== allowedRole && user.role !== 'ADMIN') {
        alert(`Quyền truy cập bị từ chối!\nTài khoản [ ${user.fullName} ] có vai trò là [ ${getRoleName(user.role)} ], không thể truy cập trang này.`);
        if (user.role === 'CASHIER') {
            window.location.href = 'cashier.html';
        } else if (user.role === 'BARISTA') {
            window.location.href = 'barista.html';
        } else {
            window.location.href = 'index.html';
        }
        return null;
    }

    return user;
}

function getRoleName(role) {
    switch (role) {
        case 'ADMIN': return 'Quản Trị Viên';
        case 'CASHIER': return 'Nhân viên Thu Ngân';
        case 'BARISTA': return 'Pha Chế Barista';
        default: return role;
    }
}

/* =============================================================
   AUDIO SYNTHESIZER FOR NOTIFICATIONS
   ============================================================= */
function playChimeSound(type = 'ready') {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (type === 'ready') {
            // Ding-Dong
            playTone(ctx, 587.33, 0.05, 0.4);
            setTimeout(() => playTone(ctx, 880.00, 0.05, 0.7), 160);
        } else if (type === 'call') {
            // Call chime
            playTone(ctx, 523.25, 0.05, 0.3);
            setTimeout(() => playTone(ctx, 659.25, 0.05, 0.3), 150);
            setTimeout(() => playTone(ctx, 783.99, 0.05, 0.6), 300);
        }
    } catch (e) {
        console.log("Audio awaiting gesture");
    }
}

function playTone(ctx, freq, attack, decay) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + attack + decay);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + attack + decay);
}

function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
}

function updateClock() {
    const timeElem = document.getElementById('currentTime');
    if (timeElem) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElem.innerText = `${hours}:${minutes}`;
    }
}

/* NAVBAR INITIALIZATION */
function initNavbar() {
    const user = getLoggedInUser();
    if (user) {
        const nameElem = document.getElementById('navbarUserName');
        if (nameElem) nameElem.innerText = user.fullName;

        const roleElem = document.getElementById('navbarUserRole');
        if (roleElem) roleElem.innerText = getRoleName(user.role);
    }

    updateClock();
    setInterval(updateClock, 1000);

    updateNavbarBadges();
    setInterval(updateNavbarBadges, 2500);
}

function updateNavbarBadges() {
    const data = getAppData();
    const pendingOrders = data.orders.filter(o => o.status === 'PENDING').length;
    const badgeKitchen = document.getElementById('badgePendingKitchen');
    if (badgeKitchen) {
        badgeKitchen.innerText = pendingOrders;
    }

    const readyBuzzers = data.buzzers.filter(b => b.status === 'READY').length;
    const badgeCashier = document.getElementById('badgeReadyCashier');
    if (badgeCashier) {
        if (readyBuzzers > 0) {
            badgeCashier.style.display = 'inline-block';
            badgeCashier.innerText = readyBuzzers + ' THẺ XONG';
        } else {
            badgeCashier.style.display = 'none';
        }
    }
}

function resetSampleData() {
    if (confirm('Khôi phục toàn bộ dữ liệu mẫu (món ăn, thẻ rung, tài khoản nhân viên)?')) {
        localStorage.clear();
        saveAppData({
            products: DEFAULT_PRODUCTS,
            staff: DEFAULT_STAFF,
            buzzers: initDefaultBuzzers(),
            orders: []
        });
        location.reload();
    }
}
