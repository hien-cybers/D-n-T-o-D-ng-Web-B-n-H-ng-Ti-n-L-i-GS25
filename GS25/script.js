// ==========================================
// 1. CẤU HÌNH & DỮ LIỆU
// ==========================================
const CONFIG = {
    ITEMS_PER_PAGE: 10,
    SHIPPING_FEE: 15000,
    INV: "gs25_inventory",
    USERS: "gs25_users",
    SESSION: "gs25_session"
};

const VN_LOCATIONS = {
    "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 7", "Quận 10", "Bình Thạnh", "Phú Nhuận", "Tân Bình", "Thủ Đức"],
    "Hà Nội": ["Hoàn Kiếm", "Đống Đa", "Ba Đình", "Hai Bà Trưng", "Hoàng Mai", "Thanh Xuân", "Long Biên", "Nam Từ Liêm", "Bắc Từ Liêm", "Cầu Giấy"],
    "Đà Nẵng": ["Hải Châu", "Cẩm Lệ", "Thanh Khê", "Liên Chiểu", "Ngũ Hành Sơn", "Sơn Trà"]
};

const API_BANKS = [
    { id: "MB", name: "MB Bank" }, { id: "VCB", name: "Vietcombank" }, { id: "ACB", name: "ACB" },
    { id: "TCB", name: "Techcombank" }, { id: "BIDV", name: "BIDV" }, { id: "ICB", name: "VietinBank" }
];

const db = {
    get: (key) => JSON.parse(localStorage.getItem(key)) || [],
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
};

// ==========================================
// 2. KHỞI TẠO DỮ LIỆU
// ==========================================
// ==========================================
// 2. KHỞI TẠO DỮ LIỆU (100 MÓN KHÁC NHAU)
// ==========================================
function initData() {
    // Kiểm tra xem đã có dữ liệu chưa, nếu chưa thì mới tạo
    let inv = db.get(CONFIG.INV);
    
    // Nếu kho rỗng hoặc ít hơn 10 món (dữ liệu cũ), thì reset lại 100 món mới
    if (inv.length < 10) {
        
        // 1. DANH SÁCH 100 TÊN MÓN ĂN THỰC TẾ
        const menuItems = [
            // --- FOOD (40 món) ---
            // Cơm nắm & Kimbap
            { n: "Cơm Nắm Cá Ngừ Mayo", c: "food", p: 16000 },
            { n: "Cơm Nắm Gà Cay Phô Mai", c: "food", p: 17000 },
            { n: "Cơm Nắm Thịt Nướng BBQ", c: "food", p: 18000 },
            { n: "Cơm Nắm Kim Chi Phô Mai", c: "food", p: 16000 },
            { n: "Cơm Nắm Tôm Sốt Thái", c: "food", p: 19000 },
            { n: "Cơm Nắm Bò Bulgogi", c: "food", p: 18000 },
            { n: "Kimbap Truyền Thống", c: "food", p: 35000 },
            { n: "Kimbap Chiên Xù", c: "food", p: 38000 },
            { n: "Kimbap Gà Teriyaki", c: "food", p: 37000 },
            { n: "Samgak Kimbap Trứng Cá", c: "food", p: 22000 },
            // Sandwich & Burger
            { n: "Sandwich Gà Quay Jack", c: "food", p: 28000 },
            { n: "Sandwich Trứng Mayo", c: "food", p: 25000 },
            { n: "Sandwich Jambon Phô Mai", c: "food", p: 27000 },
            { n: "Sandwich Thanh Cua", c: "food", p: 26000 },
            { n: "Sandwich Bò BBQ", c: "food", p: 30000 },
            { n: "Burger Bò Phô Mai Tan Chảy", c: "food", p: 45000 },
            { n: "Burger Gà Giòn Cay", c: "food", p: 42000 },
            { n: "Burger Tôm Sốt Tartar", c: "food", p: 48000 },
            { n: "Bánh Mì Que Pate", c: "food", p: 15000 },
            { n: "Bánh Mì Xúc Xích", c: "food", p: 20000 },
            // Bento & Mì
            { n: "Hộp Cơm Gà Xối Mỡ", c: "food", p: 45000 },
            { n: "Hộp Cơm Sườn Cốt Lết", c: "food", p: 48000 },
            { n: "Hộp Cơm Bò Xào Tiêu Đen", c: "food", p: 50000 },
            { n: "Hộp Cơm Cá Thu Kho Tộ", c: "food", p: 47000 },
            { n: "Hộp Cơm Gà Sốt Cay Hàn Quốc", c: "food", p: 46000 },
            { n: "Mì Trộn Indomie Đặc Biệt", c: "food", p: 12000 },
            { n: "Mì Ý Sốt Bò Bằm", c: "food", p: 38000 },
            { n: "Mì Tương Đen Bắc Kinh", c: "food", p: 42000 },
            { n: "Mì Cay Hải Sản 7 Cấp Độ", c: "food", p: 45000 },
            { n: "Bún Thái Hải Sản Chua Cay", c: "food", p: 35000 },
            { n: "Miến Trộn Hàn Quốc", c: "food", p: 40000 },
            { n: "Tokbokki Sốt Cay", c: "food", p: 35000 },
            { n: "Tokbokki Phô Mai", c: "food", p: 45000 },
            { n: "Súp Chả Cá Hàn Quốc", c: "food", p: 25000 },
            { n: "Xúc Xích Lốc Xoáy", c: "food", p: 20000 },
            { n: "Gà Rán GS25 (Đùi)", c: "food", p: 32000 },
            { n: "Gà Rán GS25 (Cánh)", c: "food", p: 30000 },
            { n: "Bánh Bao Trứng Muối", c: "food", p: 18000 },
            { n: "Bánh Bao Xá Xíu", c: "food", p: 18000 },
            { n: "Dimsum Hải Sản", c: "food", p: 32000 },

            // --- DRINK (30 món) ---
            // Cà phê
            { n: "Cà Phê Đá Sài Gòn", c: "drink", p: 18000 },
            { n: "Cà Phê Sữa Đá", c: "drink", p: 20000 },
            { n: "Bạc Xỉu Đá", c: "drink", p: 22000 },
            { n: "Cà Phê Muối Biển", c: "drink", p: 25000 },
            { n: "Latte Đá", c: "drink", p: 28000 },
            { n: "Cappuccino Nóng", c: "drink", p: 30000 },
            { n: "Americano Đá", c: "drink", p: 25000 },
            { n: "Cold Brew Cam Sả", c: "drink", p: 35000 },
            // Trà & Trà Sữa
            { n: "Trà Sữa Truyền Thống", c: "drink", p: 25000 },
            { n: "Trà Sữa Trân Châu Đường Đen", c: "drink", p: 35000 },
            { n: "Trà Sữa Matcha", c: "drink", p: 28000 },
            { n: "Trà Sữa Khoai Môn", c: "drink", p: 28000 },
            { n: "Trà Đào Cam Sả", c: "drink", p: 32000 },
            { n: "Trà Vải Hạt Chia", c: "drink", p: 32000 },
            { n: "Trà Ổi Hồng", c: "drink", p: 32000 },
            { n: "Trà Chanh Dây", c: "drink", p: 28000 },
            { n: "Hồng Trà Macchiato", c: "drink", p: 30000 },
            { n: "Lục Trà Nhài", c: "drink", p: 22000 },
            // Nước ngọt & Khác
            { n: "Coca Cola (Lon)", c: "drink", p: 10000 },
            { n: "Pepsi (Lon)", c: "drink", p: 10000 },
            { n: "7Up (Lon)", c: "drink", p: 10000 },
            { n: "Sting Dâu", c: "drink", p: 12000 },
            { n: "Redbull Thái", c: "drink", p: 15000 },
            { n: "Nước Suối Aquafina", c: "drink", p: 6000 },
            { n: "Nước Suối Dasani", c: "drink", p: 6000 },
            { n: "Sữa Tươi Vinamilk", c: "drink", p: 8000 },
            { n: "Sữa Chua Uống Yomost", c: "drink", p: 9000 },
            { n: "Nước Ép Cam Twister", c: "drink", p: 12000 },
            { n: "Soda Blue Ocean", c: "drink", p: 25000 },
            { n: "Mojito Dâu Tằm", c: "drink", p: 28000 },

            // --- SNACK (30 món) ---
            { n: "Snack Lay's Tự Nhiên", c: "snack", p: 16000 },
            { n: "Snack Lay's Tảo Biển", c: "snack", p: 16000 },
            { n: "Snack Oishi Bắp Ngọt", c: "snack", p: 6000 },
            { n: "Snack Oishi Tôm Cay", c: "snack", p: 6000 },
            { n: "Snack Poca Mực Nướng", c: "snack", p: 6000 },
            { n: "Bánh Swing Bít Tết", c: "snack", p: 18000 },
            { n: "Bánh Tráng Trộn Tắc", c: "snack", p: 20000 },
            { n: "Cơm Cháy Chà Bông", c: "snack", p: 25000 },
            { n: "Khô Gà Lá Chanh", c: "snack", p: 35000 },
            { n: "Khô Bò Miếng", c: "snack", p: 45000 },
            { n: "Đậu Phộng Da Cá", c: "snack", p: 12000 },
            { n: "Hạt Điều Rang Muối", c: "snack", p: 30000 },
            { n: "Hướng Dương Vị Dừa", c: "snack", p: 15000 },
            { n: "Bánh Oreo Vani", c: "snack", p: 15000 },
            { n: "Bánh Cosy Dừa", c: "snack", p: 12000 },
            { n: "Bánh ChocoPie (Hộp 2)", c: "snack", p: 10000 },
            { n: "Bánh Custas (Hộp 2)", c: "snack", p: 10000 },
            { n: "Kẹo Dẻo Chupa Chups", c: "snack", p: 8000 },
            { n: "Kẹo Mút Chupa Chups", c: "snack", p: 2000 },
            { n: "Kẹo Gum Doublemint", c: "snack", p: 5000 },
            { n: "Sing-gum Cool Air", c: "snack", p: 5000 },
            { n: "Sô-cô-la KitKat", c: "snack", p: 10000 },
            { n: "Sô-cô-la M&M", c: "snack", p: 15000 },
            { n: "Bánh Que Pocky Dâu", c: "snack", p: 12000 },
            { n: "Bánh Que Pocky Matcha", c: "snack", p: 12000 },
            { n: "Mì Trẻ Em Enaak", c: "snack", p: 5000 },
            { n: "Rong Biển Ăn Liền", c: "snack", p: 10000 },
            { n: "Xúc Xích Vissan (Cây)", c: "snack", p: 5000 },
            { n: "Trứng Cút Bắc Thảo", c: "snack", p: 25000 },
            { n: "Chân Vịt Cay Tứ Xuyên", c: "snack", p: 12000 }
        ];

        // 2. TẠO DỮ LIỆU ĐẦY ĐỦ
        let megaInv = menuItems.map((item, index) => ({
            id: index + 1,
            name: item.n,
            category: item.c,
            price: item.p,
            stock: Math.floor(Math.random() * 50) + 10, // Random tồn kho từ 10 - 60
            // Tạo ảnh tự động có tên món ăn để không bị trùng và lỗi ảnh
            image: `https://placehold.co/300x300/007CBA/ffffff?text=${encodeURIComponent(item.n.split(' ').slice(0, 3).join('\n'))}`
        }));

        db.set(CONFIG.INV, megaInv);
        location.reload(); // Tải lại trang để cập nhật ngay lập tức
    }

    // Tạo Admin mặc định nếu chưa có
    if (db.get(CONFIG.USERS).length === 0) {
        db.set(CONFIG.USERS, [{ name: "Admin", phone: "0123", password: "123", role: "admin", points: 5000, history: [], address: "" }]);
    }
}
// ==========================================
// 3. STATE
// ==========================================
let state = { currentPage: 1, currentCategory: "all", currentSearch: "", orderType: "pickup", paymentMethod: "Tiền mặt" };
let isTransferDone = false; 
let discountAmount = 0;

initData();
let inventory = db.get(CONFIG.INV);
let currentUser = db.get(CONFIG.SESSION);
if (Array.isArray(currentUser) && currentUser.length === 0) currentUser = null;
let cart = currentUser ? (db.get(`cart_${currentUser.phone}`) || []) : [];

// ==========================================
// 4. RENDER GIAO DIỆN
// ==========================================
function renderHome() {
    const grid = document.getElementById("product-grid");
    if (!grid) return;
    let filtered = inventory.filter(p => {
        const matchCat = state.currentCategory === "all" || p.category === state.currentCategory;
        const matchSearch = p.name.toLowerCase().includes(state.currentSearch.toLowerCase());
        return matchCat && matchSearch;
    });
    const totalPages = Math.ceil(filtered.length / CONFIG.ITEMS_PER_PAGE);
    const data = filtered.slice((state.currentPage - 1) * CONFIG.ITEMS_PER_PAGE, state.currentPage * CONFIG.ITEMS_PER_PAGE);
    
    grid.innerHTML = data.map((p, index) => `
        <div class="product-card p-5 flex flex-col animate-fade group relative" style="animation-delay: ${index * 0.05}s">
            ${p.stock <= 0 ? `<div class="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm"><span class="text-red-500 font-black text-xl border-4 border-red-500 p-2 rounded -rotate-12 uppercase">Hết hàng</span></div>` : ''}
            <button onclick="showProductDetail(${p.id})" class="absolute top-3 right-3 bg-white shadow-md w-9 h-9 rounded-full flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all z-10 hover:text-gs-primary transform hover:scale-110"><i class="fa-solid fa-eye text-xs"></i></button>
            <div class="h-40 flex items-center justify-center mb-4 relative" onclick="showProductDetail(${p.id})">
                <div class="absolute inset-0 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-all duration-500"></div>
                <img src="${p.image}" class="h-full object-contain relative z-10 cursor-pointer ${p.stock <= 0 ? 'grayscale opacity-50' : ''}">
            </div>
            <h3 class="font-bold text-xs uppercase italic mb-1 text-slate-800 truncate tracking-wide">${p.name}</h3>
            <div class="flex items-center gap-2 mb-3"><span class="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold">Kho: ${p.stock}</span></div>
            <div class="flex justify-between items-center mt-auto pt-3 border-t border-slate-100">
                <span class="text-gs-primary font-black italic text-lg">${p.price.toLocaleString()}₫</span>
                <button onclick="addToCart(${p.id})" ${p.stock <= 0 ? 'disabled' : ''} class="w-9 h-9 ${p.stock <= 0 ? 'bg-slate-100 cursor-not-allowed text-slate-300' : 'bg-gs-primary text-white hover:bg-blue-600'} rounded-full shadow-lg transition-all transform hover:rotate-90 flex items-center justify-center"><i class="fa-solid fa-plus text-xs font-bold"></i></button>
            </div>
        </div>`).join("");
    renderPagination(totalPages);
}

function renderPagination(total) {
    const container = document.getElementById("pagination-container");
    let html = "";
    for(let i=1; i<=total; i++) {
        if (i === 1 || i === total || (i >= state.currentPage - 1 && i <= state.currentPage + 1)) {
            const activeClass = state.currentPage === i ? 'bg-gs-primary text-white shadow-lg scale-110' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200';
            html += `<button onclick="goToPage(${i})" class="w-10 h-10 rounded-xl font-black text-xs transition-all ${activeClass}">${i}</button>`;
        }
    }
    container.innerHTML = html;
}

function goToPage(p) { state.currentPage = p; renderHome(); window.scrollTo({top: 400, behavior:'smooth'}); }
function changeCategory(cat, btn) {
    state.currentCategory = cat; state.currentPage = 1;
    document.querySelectorAll(".cat-btn").forEach(b => { b.classList.remove("active-cat"); b.classList.add("text-slate-500"); b.classList.remove("bg-gs-primary", "text-white"); });
    btn.classList.add("active-cat"); btn.classList.remove("text-slate-500"); btn.classList.add("bg-gs-primary", "text-white");
    renderHome();
}

function updateAuthUI() {
    const el = document.getElementById('auth-section');
    let user = db.get(CONFIG.SESSION);
    if (Array.isArray(user) && user.length === 0) user = null;
    if (user && user.name) {
        currentUser = user; 
        const avatar = user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=007CBA&color=fff`;
        el.innerHTML = `
        <div class="relative group">
            <div onclick="toggleUserMenu(event)" id="user-menu-button" class="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full cursor-pointer border border-slate-200 hover:border-gs-primary hover:shadow-md transition-all">
                <img src="${avatar}" class="w-9 h-9 rounded-full object-cover border-2 border-slate-100">
                <div class="text-left hidden lg:block leading-none">
                    <p class="text-[10px] font-bold uppercase text-slate-800 mb-0.5">${user.name}</p>
                    <p class="text-[9px] text-gs-primary font-bold">${user.points.toLocaleString()} PTS</p>
                </div>
            </div>
            <div id="user-dropdown-menu" class="hidden absolute top-full right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl p-2 overflow-hidden animate-fade border border-slate-100 z-50">
                <button onclick="toggleHistoryModal()" class="w-full text-left p-3 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-gs-primary rounded-xl uppercase transition flex items-center gap-3"><i class="fa-solid fa-clock-rotate-left w-4"></i> Lịch sử</button>
                <button onclick="toggleProfileModal()" class="w-full text-left p-3 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-gs-primary rounded-xl uppercase transition flex items-center gap-3"><i class="fa-solid fa-user-gear w-4"></i> Hồ sơ</button>
                <button onclick="togglePasswordModal()" class="w-full text-left p-3 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-gs-primary rounded-xl uppercase transition flex items-center gap-3"><i class="fa-solid fa-key w-4"></i> Đổi mật khẩu</button>
                <div class="mt-2 pt-2 border-t border-slate-100"><button onclick="logout()" class="w-full text-left p-3 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-xl transition uppercase flex items-center gap-3"><i class="fa-solid fa-power-off w-4"></i> Đăng xuất</button></div>
            </div>
        </div>`;
    } else { 
        currentUser = null;
        el.innerHTML = `<button onclick="window.location.href='login.html'" class="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm">Đăng nhập</button>`; 
    }
}

// ==========================================
// 5. GIỎ HÀNG & LOGIC (FIXED)
// ==========================================
function addToCart(id) {
    if(!currentUser) { showToast("Vui lòng đăng nhập!"); setTimeout(() => window.location.href='login.html', 1500); return; }
    let p = inventory.find(x => x.id === id);
    if(p.stock <= 0) return showToast("Hết hàng!");
    let item = cart.find(x => x.id === id);
    if (item) {
        if(item.quantity < p.stock) item.quantity++;
        else return showToast("Số lượng trong kho không đủ!");
    } else { cart.push({...p, quantity: 1}); }
    syncCart(); showToast(`Đã thêm ${p.name}`);
}
function syncCart() { if(currentUser) db.set(`cart_${currentUser.phone}`, cart); updateCartUI(); }

function updateQuantity(id, change) {
    let item = cart.find(x => x.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
             removeFromCart(id);
             return;
        }
        let p = inventory.find(x => x.id === id);
        if (item.quantity > p.stock) {
            item.quantity = p.stock;
            showToast("Đã đạt giới hạn kho!");
        }
        syncCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    syncCart();
}

function updateCartUI() {
    document.getElementById("cart-count").innerText = cart.reduce((s, i) => s + i.quantity, 0);
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    document.getElementById("cart-total-price").innerText = total.toLocaleString() + "₫";
    document.getElementById("cart-items").innerHTML = cart.map((i, idx) => `
        <div class="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3 group relative">
            <img src="${i.image}" class="w-14 h-14 object-contain rounded-xl bg-white p-1">
            <div class="flex-1">
                <div class="font-bold text-xs uppercase text-slate-800 line-clamp-1">${i.name}</div>
                <div class="flex items-center gap-2 mt-2">
                     <button onclick="updateQuantity(${i.id}, -1)" class="btn-qty btn-qty-minus">-</button>
                     <span class="text-xs font-bold text-gs-primary w-6 text-center">${i.quantity}</span>
                     <button onclick="updateQuantity(${i.id}, 1)" class="btn-qty btn-qty-plus">+</button>
                </div>
            </div>
            <div class="flex flex-col items-end gap-2">
                <span class="font-black text-gs-primary text-sm">${(i.price * i.quantity).toLocaleString()}₫</span>
                <button onclick="removeFromCart(${i.id})" class="btn-delete-item"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>`).join("");
}

// ==========================================
// 6. THANH TOÁN (CHECKOUT)
// ==========================================
function openCheckout() {
    if(cart.length === 0) return showToast("Giỏ hàng trống!");
    if(!currentUser) return window.location.href='login.html';
    renderCities(); renderBanks();
    document.getElementById("cart-modal").classList.add("hidden"); 
    document.getElementById("checkout-modal").classList.remove("hidden");
    discountAmount = 0; 
    document.getElementById("promo-message").classList.add("hidden");
    document.getElementById("promo-code-input").value = "";
    updateCheckoutTotal();
    
    // Reset state
    isTransferDone = false;
    document.getElementById("section-transfer-input").classList.add("hidden");
    document.getElementById("section-qr-scan").classList.add("hidden");
    document.getElementById("btn-final-confirm").classList.remove("hidden");
    
    // Default select cash
    selectPayment('Tiền mặt', document.querySelector('.pay-method-btn'));
}
function closeCheckoutModal() { document.getElementById("checkout-modal").classList.add("hidden"); }

function renderCities() {
    const citySelect = document.getElementById("shipping-city");
    citySelect.innerHTML = '<option value="">Chọn Tỉnh/TP</option>';
    Object.keys(VN_LOCATIONS).forEach(city => { citySelect.innerHTML += `<option value="${city}">${city}</option>`; });
}
function renderDistricts() {
    const city = document.getElementById("shipping-city").value;
    const distSelect = document.getElementById("shipping-district");
    distSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
    if(city && VN_LOCATIONS[city]) { VN_LOCATIONS[city].forEach(d => { distSelect.innerHTML += `<option value="${d}">${d}</option>`; }); }
}
function renderBanks() {
     const bankSelect = document.getElementById("bank-list-transfer");
     bankSelect.innerHTML = "";
     API_BANKS.forEach(bank => { bankSelect.innerHTML += `<option value="${bank.id}">${bank.name}</option>`; });
}

function setOrderType(t) {
    state.orderType = t;
    const btnP = document.getElementById("btn-pickup");
    const btnD = document.getElementById("btn-delivery");
    const info = document.getElementById("delivery-info");
    
    if(t === 'pickup') {
        btnP.className = "flex-1 py-3 border border-gs-primary bg-blue-50 text-gs-primary rounded-xl font-bold text-xs uppercase transition";
        btnD.className = "flex-1 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase transition";
        info.classList.add("hidden");
    } else {
        btnD.className = "flex-1 py-3 border border-gs-primary bg-blue-50 text-gs-primary rounded-xl font-bold text-xs uppercase transition";
        btnP.className = "flex-1 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase transition";
        info.classList.remove("hidden");
    }
    updateCheckoutTotal();
}

function selectPayment(m, btn) {
    state.paymentMethod = m;
    document.querySelectorAll(".pay-method-btn").forEach(b => {
        b.className = "pay-method-btn flex items-center gap-3 p-3 rounded-xl cursor-pointer";
        b.querySelector("i").className = b.querySelector("i").className.replace("text-gs-primary", "text-slate-400");
        b.querySelector("span").className = "font-bold text-sm text-slate-700";
        b.classList.remove("active");
    });
    btn.classList.add("active");
    btn.querySelector("i").className = btn.querySelector("i").className.replace("text-slate-400", "text-gs-primary");
    btn.querySelector("span").className = "font-bold text-sm text-gs-primary";

    const divTransferInput = document.getElementById("section-transfer-input");
    const divQR = document.getElementById("section-qr-scan");
    const btnFinal = document.getElementById("btn-final-confirm");

    if(m === 'Ngân hàng') {
        divTransferInput.classList.remove("hidden");
        divQR.classList.add("hidden"); // Hide QR initially
        btnFinal.classList.add("hidden");
        document.getElementById("transfer-amount").value = updateCheckoutTotal();
    } else {
        divTransferInput.classList.add("hidden");
        divQR.classList.add("hidden");
        btnFinal.classList.remove("hidden");
        isTransferDone = false;
    }
}

function applyPromoCode() {
    const code = document.getElementById("promo-code-input").value.toUpperCase();
    const msg = document.getElementById("promo-message");
    
    if (code === "GS25") {
        discountAmount = 10000;
        msg.innerHTML = '<span class="text-green-600"><i class="fa-solid fa-check"></i> Đã giảm 10.000đ</span>';
        msg.classList.remove("hidden");
    } else if (code === "FREESHIP") {
         discountAmount = 15000;
         msg.innerHTML = '<span class="text-green-600"><i class="fa-solid fa-check"></i> Đã giảm 15.000đ</span>';
         msg.classList.remove("hidden");
    } else {
        discountAmount = 0;
        msg.innerHTML = '<span class="text-red-500"><i class="fa-solid fa-circle-exclamation"></i> Mã không hợp lệ</span>';
        msg.classList.remove("hidden");
    }
    updateCheckoutTotal();
}

function updateCheckoutTotal() {
    const sub = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = state.orderType === 'delivery' ? CONFIG.SHIPPING_FEE : 0;
    const total = Math.max(0, sub + shipping - discountAmount);
    
    document.getElementById("checkout-final-price").innerText = total.toLocaleString() + "₫";
    
    const transferInput = document.getElementById("transfer-amount");
    if(transferInput) transferInput.value = total;
    
    return total;
}

function showQRSection() {
    const bankId = document.getElementById("bank-list-transfer").value || "MB"; 
    const accountNo = document.getElementById("bank-account-transfer").value || "0933973950";
    const amount = document.getElementById("transfer-amount").value || 0;
    const template = "compact2";
    const description = "GS25 PAY";
    
    if(!accountNo || !amount) return showToast("Vui lòng nhập đủ thông tin!");

    const url = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${description}`;
    document.getElementById("qr-code-img").src = url;
    document.getElementById("qr-bank-name").innerText = bankId + " BANK";
    
    document.getElementById("section-transfer-input").classList.add("hidden"); 
    document.getElementById("section-qr-scan").classList.remove("hidden"); 
}

function confirmTransferDone() {
    isTransferDone = true;
    processOrder();
}

function copyToClipboard(text) {
     navigator.clipboard.writeText(text);
     showToast("Đã sao chép STK!");
}

function processOrder() {
    let addr = "Tại quầy GS25";
    if(state.orderType === 'delivery') {
        const street = document.getElementById("shipping-street").value;
        const city = document.getElementById("shipping-city").value;
        const district = document.getElementById("shipping-district").value;
        if(!street || !city || !district) return showToast("Vui lòng nhập đủ địa chỉ!");
        addr = `${street}, ${district}, ${city}`;
    }

    const total = updateCheckoutTotal(); 
    const orderId = "GS" + Math.random().toString(36).substr(2, 6).toUpperCase();

    const order = {
        id: orderId,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: total,
        payment: state.paymentMethod,
        type: state.orderType,
        address: addr,
        status: "Đang xử lý",
        isStockDeducted: false 
    };

    let users = db.get(CONFIG.USERS);
    let idx = users.findIndex(u => u.phone === currentUser.phone);
    if(idx > -1) {
        users[idx].history.unshift(order);
        users[idx].points += Math.floor(total / 1000); 
        db.set(CONFIG.USERS, users);
        db.set(CONFIG.SESSION, users[idx]);
        currentUser = users[idx];
    }

    db.set(`cart_${currentUser.phone}`, []);
    cart = [];
    syncCart();
    closeCheckoutModal();
    showInvoice(order);
    updateAuthUI();
    renderHome(); 
    showToast("Đặt hàng thành công!");
}

function showInvoice(o) {
    document.getElementById("inv-date").innerText = o.date;
    document.getElementById("inv-total").innerText = o.total.toLocaleString() + "₫";
    document.getElementById("inv-items").innerHTML = o.items.map(i => `<div class="flex justify-between border-b border-dashed border-slate-200 pb-1 mb-1"><span>${i.name} (x${i.quantity})</span><span>${(i.price*i.quantity).toLocaleString()}</span></div>`).join("");
    document.getElementById("invoice-modal").classList.remove("hidden");
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#007CBA', '#00D2FF', '#FFFFFF'] });
}

function openRecruitModal() { document.getElementById("recruit-modal").classList.remove("hidden"); }
function closeRecruitModal() { document.getElementById("recruit-modal").classList.add("hidden"); }

function submitApplication() {
    const name = document.getElementById("recruit-name").value;
    const phone = document.getElementById("recruit-phone").value;
    const job = document.getElementById("recruit-job").value;
    const intro = document.getElementById("recruit-intro").value;
    
    if(!name || !phone) return showToast("Vui lòng nhập đủ thông tin!");
    
    let apps = db.get("gs25_applications") || [];
    apps.push({ user: name, phone: phone, job: job, intro: intro });
    db.set("gs25_applications", apps);
    
    closeRecruitModal();
    showToast("Đã gửi hồ sơ thành công!");
}

function toggleCart() { document.getElementById("cart-modal").classList.toggle("hidden"); }
function toggleUserMenu(e) { e.stopPropagation(); document.getElementById("user-dropdown-menu").classList.toggle("hidden"); }
function logout() { localStorage.removeItem(CONFIG.SESSION); location.reload(); }
function showToast(m) {
    const container = document.getElementById("toast-container");
    const t = document.createElement("div");
    t.className = "bg-white text-gs-primary border border-gs-primary/20 px-6 py-4 rounded-xl font-bold text-xs shadow-xl flex items-center gap-3 animate-fade backdrop-blur-md";
    t.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${m}`;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(20px)'; setTimeout(() => t.remove(), 500); }, 3000);
}
function toggleProductDetail() { document.getElementById('product-detail-modal').classList.toggle("hidden"); }
function showProductDetail(id) {
    const p = inventory.find(x => x.id === id); if(!p) return;
    document.getElementById('detail-img').src = p.image; document.getElementById('detail-name').innerText = p.name; document.getElementById('detail-price').innerText = p.price.toLocaleString() + '₫';
    document.getElementById('detail-add-btn').onclick = () => { addToCart(id); toggleProductDetail(); }; toggleProductDetail();
}
function toggleHistoryModal() { 
    const m = document.getElementById("history-modal"); m.classList.toggle("hidden"); 
    if(!m.classList.contains("hidden")) {
        const c = document.getElementById("history-content");
        if(!currentUser.history || currentUser.history.length === 0) c.innerHTML = `<div class="text-slate-400 text-center text-sm py-10">Chưa có đơn hàng nào.</div>`;
        else c.innerHTML = currentUser.history.map(o => `<div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-gs-primary transition mb-2"><div class="flex justify-between font-black text-gs-primary text-[10px] mb-1"><span>#${o.id}</span><span>${o.total.toLocaleString()}₫</span></div><div class="text-[9px] text-slate-600 line-clamp-1">${o.items.map(it => it.name).join(", ")}</div><div class="text-[8px] text-slate-400 mt-2 italic text-right flex justify-between"><span>${o.status || 'Đang xử lý'}</span><span>${o.date}</span></div></div>`).join("");
    }
}
function toggleProfileModal() { 
    const m = document.getElementById('profile-modal'); 
    m.classList.toggle('hidden'); 
    if(!m.classList.contains('hidden')) { 
        document.getElementById('edit-name').value = currentUser.name; 
        document.getElementById('edit-phone').value = currentUser.phone; 
        document.getElementById('edit-address').value = currentUser.address;
        document.getElementById('edit-email').value = currentUser.email || "";
        document.getElementById('edit-dob').value = currentUser.dob || "";
        document.getElementById('edit-avatar').value = currentUser.avatar || "";
        document.getElementById('profile-avatar-preview').src = currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}&background=007CBA&color=fff`;
    } 
}
function togglePasswordModal() { document.getElementById('password-modal').classList.toggle('hidden'); }
function saveProfile() { 
    let users = db.get(CONFIG.USERS); 
    let idx = users.findIndex(u => u.phone === currentUser.phone); 
    if(idx > -1) { 
        users[idx].name = document.getElementById('edit-name').value; 
        users[idx].phone = document.getElementById('edit-phone').value; 
        users[idx].address = document.getElementById('edit-address').value; 
        users[idx].email = document.getElementById('edit-email').value;
        users[idx].dob = document.getElementById('edit-dob').value;
        users[idx].avatar = document.getElementById('edit-avatar').value;

        db.set(CONFIG.USERS, users); 
        db.set(CONFIG.SESSION, users[idx]); 
        currentUser = users[idx]; 
        showToast("Cập nhật thành công!"); 
        updateAuthUI(); 
        toggleProfileModal(); 
    } 
}
function savePassword() { const oldP = document.getElementById('old-pass').value; const newP = document.getElementById('new-pass').value; if(oldP !== currentUser.password) return showToast("Mật khẩu cũ sai!"); let users = db.get(CONFIG.USERS); let idx = users.findIndex(u => u.phone === currentUser.phone); users[idx].password = newP; db.set(CONFIG.USERS, users); db.set(CONFIG.SESSION, users[idx]); currentUser = users[idx]; showToast("Đổi mật khẩu thành công!"); togglePasswordModal(); }
function searchProduct() { state.currentSearch = document.getElementById("main-search").value; state.currentPage = 1; renderHome(); }
function startTimer() { let h=2, m=59, s=59; setInterval(() => { s--; if(s<0) { s=59; m--; } if(m<0) { m=59; h--; } document.getElementById('countdown').innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`; }, 1000); }

window.onload = () => { startTimer(); renderHome(); updateAuthUI(); if(currentUser) updateCartUI(); };
window.onclick = (e) => { 
    if(!e.target.closest('#user-menu-button')) document.getElementById("user-dropdown-menu")?.classList.add("hidden"); 
};
