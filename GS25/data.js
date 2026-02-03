/**
 * GS25 LIFESTYLE PLATFORM CORE - FINAL UPGRADED
 * Lead Developer: Đức Hiển
 * Chức năng: Kho hàng, Giỏ hàng, Membership Tier, Menu Dropdown, Thanh toán QR, Lịch sử & Bảo mật, Vòng quay may mắn.
 */

// --- 1. CẤU HÌNH & DỮ LIỆU GỐC ---
const CONFIG = {
    ITEMS_PER_PAGE: 10,
    SHIPPING_FEE: 15000,
    KEYS: {
        INV: "gs25_inventory",
        USERS: "gs25_users",
        SESSION: "gs25_session"
    }
};

const db = {
    get: (key) => JSON.parse(localStorage.getItem(key)) || [],
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
};

// --- 🆕 KHỞI TẠO DỮ LIỆU MẪU (NẾU TRỐNG) ---
// --- 🆕 KHỞI TẠO SIÊU KHO HÀNG (200 MÓN) ---
function initData() {
    let existingInv = db.get(CONFIG.KEYS.INV);
    
    // Nếu kho chưa đủ 200 món thì mới nạp thêm
    if (existingInv.length < 200) {
        const baseProducts = [
            { name: "Cơm Nắm Cá Hồi Mayo", price: 15000, category: "food", img: "https://gs25.com.vn/images/products/com-nam-ca-hoi.png" },
            { name: "Mì Trộn Indomie", price: 28000, category: "food", img: "https://gs25.com.vn/images/products/mi-tron.png" },
            { name: "Trà Sữa Nướng", price: 35000, category: "drink", img: "https://gs25.com.vn/images/products/tra-sua.png" },
            { name: "Sandwich Gà Teriyaki", price: 22000, category: "food", img: "https://gs25.com.vn/images/products/sandwich.png" },
            { name: "Cà Phê Sữa Đá", price: 20000, category: "drink", img: "https://gs25.com.vn/images/products/cafe-sua.png" },
            { name: "Tokbokki Cay", price: 32000, category: "food", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
            { name: "Sữa Chuối Binggrae", price: 25000, category: "drink", img: "https://images.unsplash.com/photo-1550583724-1255818c0533?w=200" },
            { name: "Gà Rán Juso", price: 35000, category: "food", img: "https://images.unsplash.com/photo-1562607351-5f63d9790149?w=200" },
            { name: "Trà Đào Cam Sả", price: 29000, category: "drink", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200" },
            { name: "Bánh Bao Kim Sa", price: 16000, category: "food", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200" }
        ];

        const fullInv = [];
        for (let i = 1; i <= 200; i++) {
            // Lấy xoay vòng từ danh sách gốc để đảm bảo có hình ảnh đẹp
            const base = baseProducts[i % baseProducts.length];
            fullInv.push({
                id: i,
                // Tạo tên biến thể để khách hàng không thấy trùng lặp
                name: `${base.name} #${i.toString().padStart(3, '0')}`, 
                // Biến thiên giá nhẹ (+/- 2000đ) cho thực tế
                price: base.price + (i % 5 * 1000), 
                category: base.category,
                // Stock ngẫu nhiên từ 10 - 100
                stock: Math.floor(Math.random() * 90) + 10,
                image: base.image || base.img // Hỗ trợ cả 2 tên biến
            });
        }
        
        db.set(CONFIG.KEYS.INV, fullInv);
        inventory = fullInv; // Cập nhật lại biến inventory hiện hành
    }

    // Phần User giữ nguyên
    if (db.get(CONFIG.KEYS.USERS).length === 0) {
        db.set(CONFIG.KEYS.USERS, [{ name: "Đức Hiển", phone: "0123", password: "123", role: "admin", points: 5000, history: [], address: "Quận 1, TP.HCM" }]);
    }
}

let state = {
    currentPage: 1,
    currentCategory: "all",
    currentSearch: "",
    currentSort: "default",
    orderType: "pickup",
    selectedPaymentMethod: "Tiền mặt",
    voucherDiscount: 0 
};

initData();
let inventory = db.get(CONFIG.KEYS.INV);
let currentUser = db.get(CONFIG.KEYS.SESSION);
const getCartKey = () => currentUser ? `gs25_cart_${currentUser.phone}` : "gs25_cart_guest";
let cart = db.get(getCartKey());

// --- 2. LOGIC HIỂN THỊ & TÌM KIẾM ---
function renderHome() {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    let filtered = inventory.filter(p => {
        const catMatch = state.currentCategory === "all" || p.category === state.currentCategory;
        const searchMatch = p.name.toLowerCase().includes(state.currentSearch.toLowerCase());
        return catMatch && searchMatch;
    });

    if (state.currentSort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (state.currentSort === "price-desc") filtered.sort((a, b) => b.price - a.price);

    const totalPages = Math.ceil(filtered.length / CONFIG.ITEMS_PER_PAGE);
    const data = filtered.slice((state.currentPage - 1) * CONFIG.ITEMS_PER_PAGE, state.currentPage * CONFIG.ITEMS_PER_PAGE);

    grid.innerHTML = data.length ? data.map(p => `
        <div class="product-card p-5 rounded-[35px] flex flex-col animate-fade relative border border-white/5 shadow-sm">
            <div class="h-40 bg-white/5 rounded-[28px] flex items-center justify-center p-4 mb-4 relative overflow-hidden">
                ${p.stock < 10 && p.stock > 0 ? `<span class="absolute top-2 left-2 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-lg z-10 uppercase">Sắp hết</span>` : ""}
                <img src="${p.image}" class="h-full object-contain hover:scale-110 transition duration-500" onerror="this.src='https://placehold.co/200x200?text=GS25'">
            </div>
            <h3 class="font-bold text-white text-[11px] uppercase line-clamp-2 h-8 mb-2 leading-tight">${p.name}</h3>
            <div class="flex justify-between items-center mt-auto">
                <div class="flex flex-col">
                    <span class="text-gs-cyan font-black text-lg italic">${p.price.toLocaleString()}₫</span>
                    <span class="text-[9px] text-gray-400 font-bold uppercase italic">Kho: ${p.stock}</span>
                </div>
                <button onclick="addToCart(${p.id})" class="w-10 h-10 bg-gs-blue text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            ${p.stock <= 0 ? `<div class="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] rounded-[35px] flex items-center justify-center font-black text-white z-20 text-xs uppercase italic">Tạm hết hàng</div>` : ""}
        </div>`).join("") : `<div class="col-span-full py-20 text-center opacity-40 font-black italic text-slate-400 uppercase">Trống dữ liệu...</div>`;

    renderPagination(totalPages);
}

function searchProduct() {
    state.currentSearch = document.getElementById("main-search")?.value || "";
    state.currentPage = 1;
    renderHome();
}

function changeSort(val) {
    state.currentSort = val;
    renderHome();
}

function renderPagination(total) {
    const container = document.getElementById("pagination-container");
    if (!container) return;
    let html = "";
    for (let i = 1; i <= total; i++) {
        html += `<button onclick="changePage(${i})" class="w-8 h-8 rounded-xl font-bold text-xs transition ${i === state.currentPage ? 'bg-gs-blue text-white shadow-lg scale-110' : 'bg-white/10 text-slate-400 border border-white/5 hover:bg-white/20'}">${i}</button>`;
    }
    container.innerHTML = html;
}

// --- 3. QUẢN LÝ GIỎ HÀNG ---
function addToCart(id) {
    const p = inventory.find(x => x.id === id);
    if (!p || p.stock <= 0) return showToast("Sản phẩm đã hết hàng!", "error");

    const item = cart.find(x => x.id === id);
    if (item) {
        if (item.quantity < p.stock) item.quantity++;
        else return showToast("Đã đạt giới hạn tồn kho!", "error");
    } else {
        cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 });
    }
    syncCart();
    showToast(`Đã thêm ${p.name} vào giỏ`);
}

function syncCart() {
    db.set(getCartKey(), cart);
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.innerText = cart.reduce((s, i) => s + i.quantity, 0);

    const list = document.getElementById("cart-items");
    if (!list) return;

    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    list.innerHTML = cart.length ? cart.map((i, idx) => `
        <div class="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 mb-2 animate-fade">
            <img src="${i.image}" class="w-10 h-10 object-contain rounded-lg bg-white">
            <div class="flex-1 font-bold text-[10px] uppercase text-white line-clamp-1 italic">${i.name}</div>
            <div class="flex items-center gap-2 bg-white/10 p-1 rounded-xl">
                <button onclick="updateQty(${idx},-1)" class="w-6 h-6 bg-white/10 rounded-lg font-black text-white">-</button>
                <span class="text-[10px] font-black w-4 text-center text-white">${i.quantity}</span>
                <button onclick="updateQty(${idx},1)" class="w-6 h-6 bg-white/10 rounded-lg font-black text-white">+</button>
            </div>
        </div>`).join("") : `<div class="py-10 text-center opacity-20 italic font-black text-slate-400 uppercase text-[10px]">Giỏ hàng đang trống</div>`;

    const shipFee = state.orderType === "delivery" ? CONFIG.SHIPPING_FEE : 0;
    const finalPrice = subtotal + shipFee - state.voucherDiscount;

    const totalPriceEl = document.getElementById("cart-total-price");
    if (totalPriceEl) totalPriceEl.innerText = subtotal.toLocaleString() + "₫";
    
    if (document.getElementById("checkout-subtotal")) {
        document.getElementById("checkout-subtotal").innerText = subtotal.toLocaleString() + "₫";
        
        const voucherLine = document.getElementById("voucher-line");
        if (state.voucherDiscount > 0) {
            if (!voucherLine) {
                const finalLine = document.getElementById("checkout-final-price").parentElement;
                finalLine.insertAdjacentHTML('beforebegin', `
                    <div id="voucher-line" class="flex justify-between text-xs text-gs-cyan uppercase mb-4 italic">
                        <span>Giảm giá Voucher:</span>
                        <span>-${state.voucherDiscount.toLocaleString()}₫</span>
                    </div>
                `);
            } else {
                voucherLine.querySelector('span:last-child').innerText = `-${state.voucherDiscount.toLocaleString()}₫`;
                voucherLine.classList.remove('hidden');
            }
        } else if (voucherLine) {
            voucherLine.classList.add('hidden');
        }

        document.getElementById("checkout-final-price").innerText = (finalPrice < 0 ? 0 : finalPrice).toLocaleString() + "₫";
    }
}

function updateQty(idx, delta) {
    const item = cart[idx];
    const p = inventory.find(x => x.id === item.id);
    if (!p) return;
    if (delta > 0 && item.quantity >= p.stock) return showToast("Kho không đủ hàng!", "error");
    item.quantity += delta;
    if (item.quantity <= 0) cart.splice(idx, 1);
    syncCart();
}

// --- 4. THANH TOÁN & ĐƠN HÀNG ---
function calculateETA(city) {
    const area = (city || "").toLowerCase();
    let mins = 30;
    if (area.includes("quận 1") || area.includes("quận 3")) mins = 20;
    const now = new Date();
    now.setMinutes(now.getMinutes() + mins);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function applyVoucher() {
    const input = document.getElementById("voucher-input");
    const code = input ? input.value.trim().toUpperCase() : "";
    
    if (!code) return showToast("Vui lòng nhập mã!", "error");

    if (code === "GS25FREE") {
        if (state.voucherDiscount > 0) return showToast("Mã đã được áp dụng rồi!", "info");
        state.voucherDiscount = 20000;
        showToast("Đã áp dụng mã giảm 20k!", "success");
        if(typeof celebrate === "function") celebrate();
        updateCartUI();
    } else {
        showToast("Mã không hợp lệ!", "error");
    }
}

function processOrder() {
    if (!currentUser) return showToast("Vui lòng đăng nhập!", "error");
    if (cart.length === 0) return showToast("Giỏ hàng trống!", "error");

    let fullAddress = "Nhận tại cửa hàng GS25";
    let cityInput = document.getElementById("shipping-city");
    let city = cityInput ? cityInput.value.trim() : "";

    if (state.orderType === "delivery") {
        const addrInput = document.getElementById("shipping-address");
        const addr = addrInput ? addrInput.value.trim() : "";
        if (!addr || !city) return showToast("Vui lòng nhập đầy đủ địa chỉ!", "error");
        fullAddress = `${addr}, ${city}`;
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipFee = state.orderType === "delivery" ? CONFIG.SHIPPING_FEE : 0;
    
    cart.forEach(item => {
        let p = inventory.find(x => x.id === item.id);
        if(p) p.stock -= item.quantity;
    });
    db.set(CONFIG.KEYS.INV, inventory);

    const order = {
        id: "GS" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        date: new Date().toLocaleString(),
        items: [...cart],
        total: subtotal + shipFee - state.voucherDiscount,
        status: "Thành công",
        type: state.orderType,
        payment: state.selectedPaymentMethod,
        address: fullAddress
    };

    let allUsers = db.get(CONFIG.KEYS.USERS);
    const uIdx = allUsers.findIndex(u => u.phone === currentUser.phone);
    
    if (uIdx !== -1) {
        allUsers[uIdx].history = allUsers[uIdx].history || [];
        allUsers[uIdx].history.unshift(order);
        allUsers[uIdx].points = (allUsers[uIdx].points || 0) + Math.floor(subtotal / 1000);

        db.set(CONFIG.KEYS.USERS, allUsers);
        db.set(CONFIG.KEYS.SESSION, allUsers[uIdx]);
        currentUser = allUsers[uIdx]; 
        
        db.set(getCartKey(), []);
        cart = [];
        state.voucherDiscount = 0; 
        
        showToast("Đặt hàng thành công!", "success");
        if(typeof celebrate === "function") celebrate();
        showInvoice(order);
        
        updateCartUI();
        updateAuthUI();
        closeCheckoutModal();
        renderHome();
    }
}

function showInvoice(order) {
    const els = { id: "inv-id", date: "inv-date", type: "inv-type", total: "inv-total", items: "inv-items" };
    if(document.getElementById(els.id)) document.getElementById(els.id).innerText = order.id;
    if(document.getElementById(els.date)) document.getElementById(els.date).innerText = order.date;
    if(document.getElementById(els.type)) document.getElementById(els.type).innerText = order.type === 'delivery' ? "Giao hàng" : "Tại quầy";
    if(document.getElementById(els.total)) document.getElementById(els.total).innerText = order.total.toLocaleString() + "₫";
    
    const itemContainer = document.getElementById(els.items);
    if(itemContainer) {
        itemContainer.innerHTML = order.items.map(i => `
            <div class="flex justify-between uppercase font-mono text-[10px] py-2 border-b border-dashed border-white/10">
                <span class="flex-1 text-white">${i.name} x${i.quantity}</span>
                <span class="font-black text-gs-cyan">${(i.price * i.quantity).toLocaleString()}₫</span>
            </div>`).join("");
    }
    document.getElementById("invoice-modal")?.classList.remove("hidden");
}

// --- 5. LOGIC HỘI VIÊN & BẢO MẬT ---
function getMemberTier(pts) {
    if (pts >= 5000) return { name: "Hội viên Kim Cương", color: "text-blue-400" };
    if (pts >= 1000) return { name: "Hội viên Vàng", color: "text-yellow-400" };
    return { name: "Hội viên Bạc", color: "text-slate-400" };
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;
    const user = JSON.parse(localStorage.getItem(CONFIG.KEYS.SESSION));

    if (user) {
        const tier = getMemberTier(user.points || 0);
        authSection.innerHTML = `
            <div class="relative">
                <div onclick="toggleUserMenu(event)" class="flex items-center gap-3 bg-white/5 p-2 pr-5 rounded-2xl cursor-pointer hover:bg-white/10 transition border border-white/5" id="user-menu-button">
                    <div class="w-10 h-10 bg-gs-blue text-white rounded-xl flex items-center justify-center font-black italic shadow-lg">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="text-left hidden lg:block leading-none pointer-events-none">
                        <p class="text-[10px] font-black uppercase text-white mb-1">${user.name}</p>
                        <p class="text-[8px] ${tier.color} font-bold tracking-tighter">${user.points || 0} PTS - ${tier.name}</p>
                    </div>
                    <i class="fa-solid fa-chevron-down text-[8px] text-slate-500 ml-2 pointer-events-none"></i>
                </div>

                <div id="user-dropdown-menu" class="absolute top-full right-0 mt-3 w-64 bg-[#011627] rounded-[30px] shadow-2xl border border-white/10 overflow-hidden hidden animate-fade z-[999]">
                    <div class="p-5 border-b border-white/5 bg-white/5">
                        <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tài khoản hội viên</p>
                        <p class="text-xs font-bold text-gs-cyan italic">${user.phone}</p>
                    </div>
                    
                    <nav class="p-2">
                        <button onclick="menuAction(toggleProfileModal)" class="w-full text-left px-5 py-3 text-[11px] font-bold hover:bg-gs-blue hover:text-white rounded-2xl transition uppercase italic flex items-center gap-3">
                            <i class="fa-solid fa-user-circle text-gs-cyan"></i> Cập nhật hồ sơ
                        </button>
                        <button onclick="menuAction(toggleHistoryModal)" class="w-full text-left px-5 py-3 text-[11px] font-bold hover:bg-gs-blue hover:text-white rounded-2xl transition uppercase italic flex items-center gap-3">
                            <i class="fa-solid fa-clock-rotate-left text-gs-cyan"></i> Lịch sử mua hàng
                        </button>
                        <button onclick="menuAction(togglePasswordModal)" class="w-full text-left px-5 py-3 text-[11px] font-bold hover:bg-gs-blue hover:text-white rounded-2xl transition uppercase italic flex items-center gap-3">
                            <i class="fa-solid fa-shield-halved text-gs-cyan"></i> Đổi mật khẩu
                        </button>
                        <div class="h-px bg-white/5 my-2 mx-4"></div>
                        <button onclick="logout()" class="w-full text-left px-5 py-3 text-[11px] font-black text-red-400 hover:bg-red-500/10 rounded-2xl transition uppercase italic flex items-center gap-3 mt-1">
                            <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                        </button>
                    </nav>
                </div>
            </div>`;
    } else {
        authSection.innerHTML = `<button onclick="location.href='login.html'" class="btn-pill-gs25 !py-2 !px-6 !text-[10px]">Đăng nhập</button>`;
    }
}

function menuAction(callback) {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.add('hidden');
    callback();
}

// --- 6. HÀM ĐIỀU KHIỂN & TIỆN ÍCH ---
function logout() {
    if (confirm("Hiển chắc chắn muốn đăng xuất khỏi GS25?")) {
        localStorage.removeItem(CONFIG.KEYS.SESSION);
        showToast("Hẹn gặp lại Hiển!");
        setTimeout(() => window.location.replace("login.html"), 1000);
    }
}

function showToast(msg, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const t = document.createElement("div");
    t.className = `px-6 py-4 rounded-2xl shadow-xl font-bold text-[10px] uppercase italic animate-fade flex items-center gap-3 pointer-events-auto ${
        type === 'success' ? 'bg-slate-900 text-white' : (type === 'error' ? 'bg-red-500 text-white' : 'bg-gs-blue text-white')
    }`;
    t.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle text-gs-cyan' : 'fa-circle-info'}"></i> ${msg}`;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function saveProfile() {
    const nameInput = document.getElementById('edit-name');
    const name = nameInput ? nameInput.value.trim() : "";
    const phoneInput = document.getElementById('edit-phone');
    const phone = phoneInput ? phoneInput.value.trim() : (currentUser ? currentUser.phone : "");
    const addrInput = document.getElementById('edit-address');
    const addr = addrInput ? addrInput.value.trim() : "";

    if (!name) return showToast("Họ tên không được trống!", "error");

    let users = db.get(CONFIG.KEYS.USERS);
    const idx = users.findIndex(u => u.phone === currentUser.phone);
    if (idx !== -1) {
        users[idx].name = name;
        users[idx].phone = phone;
        users[idx].address = addr;
        db.set(CONFIG.KEYS.USERS, users);
        db.set(CONFIG.KEYS.SESSION, users[idx]);
        currentUser = users[idx];
        showToast("Cập nhật thành công!");
        toggleProfileModal(); 
        updateAuthUI();
    }
}

function savePassword() {
    const oldP = document.getElementById('old-pass')?.value;
    const newP = document.getElementById('new-pass')?.value;
    if (oldP !== currentUser.password) return showToast("Mật khẩu hiện tại sai!", "error");
    if (!newP || newP.length < 4) return showToast("Mật khẩu mới quá ngắn!", "error");

    let users = db.get(CONFIG.KEYS.USERS);
    const idx = users.findIndex(u => u.phone === currentUser.phone);
    users[idx].password = newP;
    db.set(CONFIG.KEYS.USERS, users);
    db.set(CONFIG.KEYS.SESSION, users[idx]);
    currentUser = users[idx];
    showToast("Đã đổi mật khẩu!");
    togglePasswordModal();
}

function setOrderType(type) {
    state.orderType = type;
    const isDeli = type === "delivery";
    document.getElementById("btn-delivery")?.classList.toggle("border-gs-blue", isDeli);
    document.getElementById("btn-pickup")?.classList.toggle("border-gs-blue", !isDeli);
    document.getElementById("ship-fee-line")?.classList.toggle("hidden", !isDeli);
    document.getElementById("delivery-info")?.classList.toggle("hidden", !isDeli);
    updateCartUI();
}

function selectPayment(method, btn) {
    state.selectedPaymentMethod = method;
    document.querySelectorAll(".pay-method-btn").forEach(el => el.classList.remove("border-gs-blue", "bg-gs-blue/20"));
    btn.classList.add("border-gs-blue", "bg-gs-blue/20");
}

function toggleProfileModal() {
    const m = document.getElementById('profile-modal');
    m?.classList.toggle('hidden');
    if (!m?.classList.contains('hidden') && currentUser) {
        if(document.getElementById('edit-name')) document.getElementById('edit-name').value = currentUser.name;
        if(document.getElementById('edit-phone')) document.getElementById('edit-phone').value = currentUser.phone;
        if(document.getElementById('edit-address')) document.getElementById('edit-address').value = currentUser.address || "";
        const tier = getMemberTier(currentUser.points || 0);
        const rankDisplay = document.getElementById('user-rank-display');
        if(rankDisplay) rankDisplay.innerText = tier.name;
    }
}

function togglePasswordModal() { document.getElementById('password-modal')?.classList.toggle('hidden'); }
function toggleHistoryModal() { 
    const m = document.getElementById("history-modal");
    m?.classList.toggle("hidden");
    if (!m?.classList.contains("hidden")) renderOrderHistory();
}
function toggleCart() { document.getElementById("cart-modal")?.classList.toggle("hidden"); }
function closeCheckoutModal() { document.getElementById("checkout-modal")?.classList.add("hidden"); }

function checkout() {
    if (cart.length === 0) return showToast("Giỏ hàng đang trống!", "error");
    document.getElementById("checkout-modal")?.classList.remove("hidden");
    const addrInput = document.getElementById("shipping-address");
    if (addrInput && currentUser?.address) addrInput.value = currentUser.address;
    updateCartUI();
}

function changeCategory(cat, btn) {
    state.currentCategory = cat;
    state.currentPage = 1;
    document.querySelectorAll(".cat-btn").forEach(el => el.classList.remove("bg-gs-blue", "text-white", "shadow-lg"));
    btn.classList.add("bg-gs-blue", "text-white", "shadow-lg");
    renderHome();
}

function changePage(p) { state.currentPage = p; renderHome(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

window.onload = () => {
    updateAuthUI();
    renderHome();
    updateCartUI();
};

function toggleUserMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.toggle('hidden');
}

window.addEventListener('click', function(e) {
    const menu = document.getElementById('user-dropdown-menu');
    const button = document.getElementById('user-menu-button');
    if (menu && !menu.contains(e.target) && !button.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

function renderOrderHistory() {
    const container = document.getElementById("history-content");
    if (!container) return;

    if (!currentUser || !currentUser.history || currentUser.history.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 opacity-30">
                <i class="fa-solid fa-box-open text-6xl mb-4 text-white"></i>
                <p class="font-black uppercase italic text-[10px] text-white">Chưa có đơn hàng nào</p>
            </div>`;
        return;
    }

    container.innerHTML = currentUser.history.map(order => `
        <div class="bg-white/5 border border-white/10 rounded-[30px] p-6 animate-fade mb-4">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <p class="text-gs-cyan font-black text-[10px] uppercase tracking-widest">${order.id}</p>
                    <p class="text-slate-400 text-[9px] uppercase font-bold">${order.date}</p>
                </div>
                <span class="bg-gs-blue/20 text-gs-cyan px-3 py-1 rounded-lg text-[8px] font-black uppercase italic">
                    ${order.status}
                </span>
            </div>
            <div class="space-y-2 mb-4">
                ${order.items.map(item => `
                    <div class="flex justify-between text-[10px] font-bold">
                        <span class="text-slate-300">${item.name} x${item.quantity}</span>
                        <span class="text-white">${(item.price * item.quantity).toLocaleString()}₫</span>
                    </div>
                `).join('')}
            </div>
            <div class="pt-4 border-t border-dashed border-white/10 flex justify-between items-center">
                <span class="text-[9px] font-black uppercase text-slate-500 italic">Tổng thanh toán</span>
                <span class="text-gs-cyan font-black text-lg italic">${order.total.toLocaleString()}₫</span>
            </div>
        </div>
    `).join('');
}
