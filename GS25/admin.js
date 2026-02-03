// --- LOGIC ---
let currentTab = "dashboard";
let revenueChart = null;

const getStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function parseDateHelper(str) {
    if(!str) return 0;
    if (str.includes('/')) {
        let datePart = str.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
        let timePart = str.match(/\d{1,2}:\d{1,2}:\d{1,2}/);
        if (datePart) {
            let [d, m, y] = datePart[0].split('/');
            let timeStr = timePart ? timePart[0] : "00:00:00";
            return new Date(`${y}-${m}-${d}T${timeStr}`).getTime();
        }
    }
    return new Date(str).getTime();
}

function estimateDeliveryTime(address) {
    if (!address) return "Chưa rõ";
    const addr = address.toLowerCase();
    if (addr.includes('quận 1') || addr.includes('quận 3') || addr.includes('quận 4')) return "15 - 20 phút";
    if (addr.includes('bình thạnh') || addr.includes('phú nhuận')) return "20 - 30 phút";
    if (addr.includes('thủ đức') || addr.includes('quận 7')) return "45 - 60 phút";
    return "30 - 45 phút";
}

function showToast(msg, type = "success") {
    const container = document.getElementById("toast-container");
    const t = document.createElement("div");
    const bg = type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700";
    t.className = `px-6 py-4 border rounded-xl font-bold text-xs uppercase shadow-lg flex items-center gap-3 animate-fade ${bg}`;
    t.innerHTML = `<i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}"></i> ${msg}`;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('-translate-x-full'); }

function logout() {
    if(confirm("Bạn có chắc muốn đăng xuất?")) {
        localStorage.removeItem("gs25_admin_session");
        window.location.href = "login.html";
    }
}

function showTab(tab) {
    currentTab = tab;
    document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("sidebar-active"));
    document.getElementById("nav-" + tab)?.classList.add("sidebar-active");
    
    document.getElementById("tab-title").innerText = tab === 'dashboard' ? 'TỔNG QUAN' : 
                                                    tab === 'orders' ? 'QUẢN LÝ ĐƠN HÀNG' :
                                                    tab === 'inventory' ? 'KHO HÀNG' :
                                                    tab === 'shipping' ? 'VẬN CHUYỂN' :
                                                    tab === 'recruitment' ? 'TUYỂN DỤNG' : 'THÀNH VIÊN';
    
    const content = document.getElementById("tab-content");
    content.innerHTML = "";

    if (tab === "dashboard") renderDashboard(content);
    if (tab === "inventory") renderInventory(content);
    if (tab === "orders") renderOrders(content);
    if (tab === "shipping") renderShipping(content);
    if (tab === "recruitment") renderRecruitment(content);
    if (tab === "members") renderMembers(content);
    
    if(window.innerWidth < 1024) document.getElementById('sidebar').classList.add('-translate-x-full');
}

// --- RENDER FUNCTIONS ---
function renderDashboard(container) {
    const users = getStorage("gs25_users");
    const inv = getStorage("gs25_inventory");
    let rev = 0, count = 0;
    users.forEach(u => (u.history || []).forEach(o => { count++; if (o.status === "Hoàn thành") rev += o.total; }));

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade">
            <div class="card p-6 border-l-4 border-l-[#00D2FF] bg-white">
                <div class="flex justify-between">
                    <div>
                        <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Doanh thu</p>
                        <h2 class="text-3xl font-black text-slate-800 mt-2">${rev.toLocaleString()}₫</h2>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-gs-primary"><i class="fa-solid fa-wallet"></i></div>
                </div>
            </div>
            <div class="card p-6 border-l-4 border-l-purple-500 bg-white">
                <div class="flex justify-between">
                    <div>
                        <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Đơn hàng</p>
                        <h2 class="text-3xl font-black text-slate-800 mt-2">${count}</h2>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500"><i class="fa-solid fa-bag-shopping"></i></div>
                </div>
            </div>
            <div class="card p-6 border-l-4 border-l-orange-500 bg-white">
                <div class="flex justify-between">
                    <div>
                        <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Sắp hết hàng</p>
                        <h2 class="text-3xl font-black text-slate-800 mt-2">${inv.filter(p => p.stock < 10).length}</h2>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500"><i class="fa-solid fa-triangle-exclamation"></i></div>
                </div>
            </div>
            <div class="card p-6 border-l-4 border-l-emerald-500 bg-white">
                <div class="flex justify-between">
                    <div>
                        <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Thành viên</p>
                        <h2 class="text-3xl font-black text-slate-800 mt-2">${users.length}</h2>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><i class="fa-solid fa-users"></i></div>
                </div>
            </div>
        </div>
        <div class="card p-6 h-96 animate-fade bg-white"><canvas id="revenueChart"></canvas></div>`;
    initChart();
}

function initChart() {
    setTimeout(() => {
        const ctx = document.getElementById("revenueChart").getContext("2d");
        if (revenueChart) revenueChart.destroy();
        revenueChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
                datasets: [{
                    label: "Doanh thu (Triệu VNĐ)",
                    data: [15, 23, 18, 35, 29, 51, 48],
                    borderColor: "#007CBA",
                    backgroundColor: "rgba(0, 124, 186, 0.1)",
                    fill: true, tension: 0.4,
                    pointBackgroundColor: "#00D2FF",
                    pointBorderColor: "#fff",
                    pointRadius: 6
                }]
            },
            options: { 
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#0f172a', font: { family: 'Plus Jakarta Sans', weight: 'bold' } } } },
                scales: {
                    y: { ticks: { color: '#64748b' }, grid: { color: '#f1f5f9' } },
                    x: { ticks: { color: '#64748b' }, grid: { color: '#f1f5f9' } }
                }
            }
        });
    }, 100);
}

function renderInventory(container) {
    const inv = getStorage("gs25_inventory");
    container.innerHTML = `
        <div class="card overflow-hidden animate-fade bg-white">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="font-bold text-slate-800 uppercase text-xs tracking-wider">Danh sách sản phẩm</h3>
                <button onclick="openAddModal()" class="btn btn-primary shadow-lg">+ Thêm món</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead><tr><th>Sản phẩm</th><th>Kho</th><th>Giá</th><th class="text-right">Hành động</th></tr></thead>
                    <tbody>${inv.map(p => `
                        <tr>
                            <td class="flex items-center gap-4">
                                <img src="${p.image}" class="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-200">
                                <div><p class="font-bold text-sm text-slate-800">${p.name}</p><p class="text-[10px] text-slate-500 uppercase tracking-wide">${p.category}</p></div>
                            </td>
                            <td><span class="badge ${p.stock < 10 ? 'badge-cancel' : 'badge-shipping'}">${p.stock}</span></td>
                            <td class="font-bold text-gs-primary">${p.price.toLocaleString()}₫</td>
                            <td class="text-right">
                                <button onclick="openEditModal(${p.id})" class="text-slate-400 hover:text-blue-600 px-2 transition"><i class="fa-solid fa-pen-to-square"></i></button>
                                <button onclick="deleteProduct(${p.id})" class="text-slate-400 hover:text-red-600 px-2 transition"><i class="fa-solid fa-trash-can"></i></button>
                            </td>
                        </tr>`).join("")}</tbody>
                </table>
            </div>
        </div>`;
}

function renderOrders(container) {
    const users = getStorage("gs25_users");
    let orders = [];
    users.forEach((u, uIdx) => (u.history || []).forEach((o, oIdx) => {
        orders.push({ ...o, customer: u.name, uIdx, oIdx, phone: u.phone });
    }));
    
    // Sắp xếp: Mới nhất lên đầu
    orders.sort((a,b) => parseDateHelper(b.date) - parseDateHelper(a.date));

    container.innerHTML = `
    <div class="card overflow-hidden animate-fade bg-white">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead><tr><th>ID</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Dự kiến</th><th class="text-right">Thao tác</th></tr></thead>
                <tbody>${orders.map(o => `
                    <tr>
                        <td class="font-black text-gs-primary">#${o.id}</td>
                        <td><div class="font-bold text-slate-800">${o.customer}</div><div class="text-[10px] text-slate-500 font-mono">${o.phone}</div></td>
                        <td class="font-bold text-slate-800">${o.total.toLocaleString()}₫</td>
                        <td><span class="badge ${getStatusBadge(o.status)}">${o.status}</span></td>
                        <td class="text-xs text-slate-500 italic"><i class="fa-regular fa-clock mr-1"></i>${estimateDeliveryTime(o.address)}</td>
                        <td class="text-right">
                            <div class="flex justify-end gap-2">
                                ${o.status === "Đang xử lý" ? `
                                    <button onclick="updateStatus(${o.uIdx}, ${o.oIdx}, 'Đã hủy')" class="btn-action btn-danger" title="Hủy">Hủy</button>
                                    <button onclick="updateStatus(${o.uIdx}, ${o.oIdx}, 'Đang giao')" class="btn-action btn-warning" title="Giao hàng">Giao</button>
                                    <button onclick="updateStatus(${o.uIdx}, ${o.oIdx}, 'Hoàn thành')" class="btn-action btn-success" title="Hoàn tất">Xong</button>
                                ` : o.status === "Đang giao" ? `
                                    <button onclick="updateStatus(${o.uIdx}, ${o.oIdx}, 'Hoàn thành')" class="btn-action btn-success">Hoàn tất</button>
                                ` : `<button onclick="viewBill('${o.uIdx}', '${o.oIdx}')" class="btn-action btn-ghost">Xem Bill</button>`}
                            </div>
                        </td>
                    </tr>`).join("")}</tbody>
            </table>
        </div>
    </div>`;
}

function renderShipping(container) {
    const users = getStorage("gs25_users");
    let delis = [];
    users.forEach((u, uIdx) => (u.history || []).forEach((o, oIdx) => {
        if (o.type === "delivery" || o.status === 'Đang giao') delis.push({ ...o, customer: u.name, phone: u.phone, uIdx, oIdx });
    }));
    delis.sort((a,b) => parseDateHelper(b.date) - parseDateHelper(a.date));

    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade">${delis.map(o => {
        const isDone = o.status === "Hoàn thành";
        return `
        <div class="card p-6 flex flex-col ${isDone ? 'opacity-50 grayscale' : ''} bg-white">
            <div class="flex justify-between items-center mb-4">
                <span class="badge ${getStatusBadge(o.status)}">${o.status}</span>
                <h4 class="font-black text-lg text-slate-800 tracking-widest">#${o.id}</h4>
            </div>
            
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                <p class="font-bold text-sm mb-1 text-slate-800"><i class="fa-solid fa-user mr-2 text-gs-primary"></i>${o.customer}</p>
                <p class="text-xs text-slate-500 mb-2 pl-6">${o.phone}</p>
                <p class="text-xs text-slate-600 border-t border-slate-200 pt-2 mt-2"><i class="fa-solid fa-location-dot mr-2 text-red-500"></i>${o.address}</p>
            </div>

            <div class="flex gap-2 mt-auto">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}" target="_blank" class="flex-1 btn btn-ghost text-center"><i class="fa-solid fa-map-location-dot"></i> Maps</a>
                ${!isDone ? `<button onclick="updateStatus(${o.uIdx}, ${o.oIdx}, 'Hoàn thành')" class="flex-1 btn btn-success">Xác nhận</button>` : ``}
            </div>
        </div>`;
    }).join("")}</div>`;
}

function renderRecruitment(container) {
    const apps = getStorage("gs25_applications");
    const jobs = getStorage("gs25_jobs");

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade">
            <div class="card p-6 bg-white">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold uppercase text-xs text-slate-500 tracking-wider">Vị trí đang tuyển</h3>
                    <button onclick="openJobModal()" class="btn btn-primary text-xs">+ Thêm</button>
                </div>
                <div class="space-y-3">
                    ${jobs.length === 0 ? '<p class="text-slate-400 text-xs italic text-center py-4">Chưa có vị trí nào</p>' : jobs.map((j, i) => `
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center hover:bg-slate-100 transition">
                        <div><p class="font-bold text-sm text-gs-primary">${j.title}</p><p class="text-xs text-slate-500 mt-1">${j.branch} • <span class="text-slate-800 font-bold">${j.salary}</span></p></div>
                        <button onclick="deleteJob(${i})" class="text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-trash-can"></i></button>
                    </div>`).join("")}
                </div>
            </div>
            <div class="card p-6 bg-white">
                <h3 class="font-bold uppercase text-xs text-slate-500 mb-4 tracking-wider">Hồ sơ ứng viên (${apps.length})</h3>
                <div class="space-y-3">
                    ${apps.length === 0 ? '<p class="text-slate-400 text-xs italic text-center py-4">Chưa có hồ sơ nào</p>' : apps.map((a, i) => `
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 group hover:bg-slate-100 transition">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <p class="font-bold text-sm text-slate-800">${a.user}</p>
                                <p class="text-xs text-slate-500 font-mono mt-0.5">${a.phone}</p>
                            </div>
                            <span class="badge badge-shipping text-[9px]">${a.job}</span>
                        </div>
                        <p class="text-xs text-slate-600 italic mb-3">"${a.intro || 'Không có giới thiệu'}"</p>
                        <div class="flex gap-2 pt-2 border-t border-slate-200">
                            <button onclick="acceptApp(${i})" class="flex-1 btn-action btn-success"><i class="fa-solid fa-check mr-1"></i> Duyệt</button>
                            <button onclick="rejectApp(${i})" class="flex-1 btn-action btn-danger"><i class="fa-solid fa-xmark mr-1"></i> Loại</button>
                        </div>
                    </div>`).join("")}
                </div>
            </div>
        </div>`;
}

function renderMembers(container) {
    const users = getStorage("gs25_users");
    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade">${users.map(u => `
        <div class="card p-6 flex items-center gap-4 hover:shadow-md transition bg-white">
            <img src="${u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=007CBA&color=fff`}" class="w-14 h-14 rounded-full border-2 border-slate-200 p-0.5">
            <div>
                <p class="font-bold text-sm text-slate-800">${u.name}</p>
                <p class="text-xs text-slate-500 my-0.5">${u.phone}</p>
                <span class="badge badge-shipping mt-1 inline-block text-[9px]">${u.points.toLocaleString()} PTS</span>
            </div>
        </div>`).join("")}</div>`;
}

// --- ACTIONS ---
function handleProductSubmit(e) {
    e.preventDefault();
    let inv = getStorage("gs25_inventory");
    const id = document.getElementById("prod-id").value;
    const item = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById("prod-name").value,
        price: parseInt(document.getElementById("prod-price").value),
        stock: parseInt(document.getElementById("prod-stock").value),
        category: document.getElementById("prod-cat").value,
        image: document.getElementById("prod-img").value || "https://gs25.com.vn/images/products/com-nam-ca-hoi.png"
    };
    if(id) { const idx = inv.findIndex(x => x.id == id); if(idx > -1) inv[idx] = item; } else inv.unshift(item);
    setStorage("gs25_inventory", inv);
    closeProductModal(); showTab("inventory"); showToast("Đã lưu sản phẩm");
}

function updateStatus(uIdx, oIdx, status) {
    let users = getStorage("gs25_users");
    let inv = getStorage("gs25_inventory");
    let o = users[uIdx].history[oIdx];

    if ((status === "Hoàn thành" || status === "Đang giao") && !o.isStockDeducted) {
        o.items.forEach(i => { let p = inv.find(x => x.id === i.id); if(p) p.stock -= i.quantity; });
        o.isStockDeducted = true; setStorage("gs25_inventory", inv);
    }
    
    o.status = status;
    setStorage("gs25_users", users);
    showToast(`Đã cập nhật: ${status}`);
    showTab(currentTab);
}

function handleJobSubmit(e) {
    e.preventDefault();
    let jobs = getStorage("gs25_jobs");
    jobs.unshift({ 
        title: document.getElementById("job-title-input").value, 
        branch: document.getElementById("job-branch-input").value, 
        salary: document.getElementById("job-salary-input").value, 
        type: document.getElementById("job-type-input").value 
    });
    setStorage("gs25_jobs", jobs); closeJobModal(); showTab("recruitment"); showToast("Đã đăng tin tuyển dụng");
}

function acceptApp(i) {
    if(confirm("Duyệt hồ sơ này?")) {
        let apps = getStorage("gs25_applications");
        apps.splice(i, 1);
        setStorage("gs25_applications", apps);
        showTab("recruitment");
        showToast("Đã duyệt hồ sơ!");
    }
}

function rejectApp(i) {
    if(confirm("Loại hồ sơ này?")) {
        let apps = getStorage("gs25_applications");
        apps.splice(i, 1);
        setStorage("gs25_applications", apps);
        showTab("recruitment");
        showToast("Đã loại hồ sơ", "error");
    }
}

// --- UTILS ---
function getStatusBadge(s) {
    if(s === "Hoàn thành") return "badge-success";
    if(s === "Đang giao") return "badge-shipping";
    if(s === "Đã hủy") return "badge-cancel";
    return "badge-pending";
}
function openAddModal() { document.getElementById("prod-id").value=""; document.getElementById("product-modal").classList.remove("hidden"); }
function openEditModal(id) { 
    const p = getStorage("gs25_inventory").find(x => x.id === id);
    document.getElementById("prod-id").value=p.id; document.getElementById("prod-name").value=p.name; document.getElementById("prod-price").value=p.price; document.getElementById("prod-stock").value=p.stock; document.getElementById("prod-img").value=p.image; 
    document.getElementById("product-modal").classList.remove("hidden"); 
}
function closeProductModal() { document.getElementById("product-modal").classList.add("hidden"); }
function openJobModal() { document.getElementById("add-job-modal").classList.remove("hidden"); }
function closeJobModal() { document.getElementById("add-job-modal").classList.add("hidden"); }
function deleteProduct(id) { if(confirm("Xóa?")) { setStorage("gs25_inventory", getStorage("gs25_inventory").filter(x => x.id !== id)); showTab("inventory"); } }
function deleteJob(i) { let j = getStorage("gs25_jobs"); j.splice(i,1); setStorage("gs25_jobs", j); showTab("recruitment"); }

function viewBill(u, o) {
    const ord = getStorage("gs25_users")[u].history[o];
    document.getElementById("bill-content").innerHTML = `
        <div class="text-center mb-6 pb-4 border-b border-dashed border-slate-300"><h2 class="text-2xl font-black text-gs-primary">GS25</h2><p class="text-xs uppercase text-slate-400">Hóa đơn bán hàng</p><p class="text-xs text-slate-500 mt-1">${ord.date}</p></div>
        <div class="space-y-2 mb-6 text-sm font-mono text-slate-700">${ord.items.map(i => `<div class="flex justify-between"><span>${i.name} x${i.quantity}</span><span>${(i.price*i.quantity).toLocaleString()}₫</span></div>`).join("")}</div>
        <div class="flex justify-between font-black text-lg border-t border-slate-300 pt-4 text-slate-800"><span>TỔNG:</span><span class="text-gs-primary">${ord.total.toLocaleString()}₫</span></div>`;
    document.getElementById("bill-modal").classList.remove("hidden");
}
function closeBillModal() { document.getElementById("bill-modal").classList.add("hidden"); }
function exportOrdersCSV() {
     let csv = "\uFEFFMã,Khách,Tiền,Trạng thái,Ngày\n" + getStorage("gs25_users").flatMap(u => (u.history||[]).map(o => `${o.id},${u.name},${o.total},${o.status},${o.date}`)).join("\n");
     const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8;"})); link.download = "GS25_Report.csv"; link.click();
}

window.onload = () => showTab("dashboard");