// 1. Khai báo biến Global
const API_URL = "https://6a1481de6c7db8aac054a844.mockapi.io/foodsmenu"; 
const CAT_API_URL = "https://6a1702221b90031f81b1e17c.mockapi.io/categories";
let foods = []; 
let cart = [];  

// 2. Hàm Render Món ăn
function renderFoods(list) {
    const foodList = document.getElementById("foodList");
    if (!foodList) return;
    foodList.innerHTML = list.map(food => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card food-card shadow h-100">
                <span class="badge ${food.status ? 'bg-success' : 'bg-danger'} badge-custom">
                    ${food.status ? 'Còn món' : 'Hết món'}
                </span>
                <img src="${food.image}" class="card-img-top food-img" onerror="this.src='https://via.placeholder.com/200'">
                <div class="card-body d-flex flex-column">
                    <h4 class="fw-bold">${food.name}</h4>
                    <p class="text-muted small mb-2">${food.description}</p>
                    <div class="price mb-3">${Number(food.price).toLocaleString()} VNĐ</div>
                    <button class="btn btn-warning mt-auto" ${!food.status ? "disabled" : ""} 
                        onclick="addToCart('${food.name}', ${food.price})">🛒 Đặt món</button>
                        <button class="btn btn-danger mt-2" onclick="deleteFood('${food.id}')">🗑️ Xóa món</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 3. Hàm Fetch dữ liệu (Foods & Categories)
function fetchFoodsFromServer() {
    if (typeof $ !== 'undefined') $("#loadingSpinner").show();
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            foods = data;
            renderFoods(foods);
            if (typeof $ !== 'undefined') $("#loadingSpinner").hide();
        })
        .catch(error => {
            if (typeof $ !== 'undefined') $("#loadingSpinner").hide();
            console.error("Lỗi:", error);
        });
}
// Hàm xử lý xóa món ăn
function deleteFood(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa món này khỏi menu không?")) return;

    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
    .then(res => {
        if (res.ok) {
            alert("Xóa thành công!");
            // Gọi lại hàm load dữ liệu để cập nhật giao diện ngay lập tức
            fetchFoodsFromServer(); 
        } else {
            alert("Có lỗi xảy ra khi xóa!");
        }
    })
    .catch(err => console.error("Lỗi:", err));
}

// Thay link này bằng link API "categories" của bạn

function loadCategories() {
    fetch(CAT_API_URL)
        .then(res => res.json())
        .then(data => {
            console.log("Dữ liệu danh mục nhận được:", data); 

            // Cải tiến: Kiểm tra xem data có đúng là mảng không trước khi chạy forEach
            if (Array.isArray(data)) {
                const adminSelect = document.getElementById("adminFoodCategory");
                const filterSelect = document.getElementById("categoryFilter");
                
                // Reset nội dung
                adminSelect.innerHTML = '<option value="">Chọn danh mục...</option>';
                filterSelect.innerHTML = '<option value="all">Tất cả danh mục</option>';
                
                // Đổ dữ liệu
                data.forEach(cat => {
                    // Kiểm tra xem cat có thuộc tính name không
                    if (cat.name) {
                        adminSelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
                        filterSelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
                    }
                });
            } else {
                console.error("Lỗi: Dữ liệu API không phải là một mảng (Array). Kiểm tra lại định dạng JSON trên MockAPI.");
            }
        })
        .catch(err => console.error("Lỗi khi load danh mục:", err));
}

// 4. Các hàm Giỏ hàng
function addToCart(name, price) {
    const item = cart.find(i => i.name === name);
    if (item) { item.quantity++; } else { cart.push({ name, price, quantity: 1 }); }
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById("cartItems");
    const totalContainer = document.getElementById("cartTotal");
    const footerContainer = document.getElementById("cartFooter");
    const countDisplay = document.getElementById("cartCount");
    
    let html = "";
    let total = 0;
    let totalQuantity = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalQuantity += item.quantity;
        html += `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span>${item.name}</span>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, -1)">-</button>
                    <span class="mx-2">${item.quantity.toString().padStart(2, '0')}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, 1)">+</button>
                    <button class="btn btn-sm btn-danger ms-2" onclick="removeItem(${index})">x</button>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = html;
    totalContainer.innerText = total.toLocaleString() + " VNĐ";
    countDisplay.innerText = `(${totalQuantity})`;
    footerContainer.innerHTML = cart.length > 0 
        ? `<button class="btn btn-success w-100 mt-3 fw-bold" onclick="checkout()">💳 THANH TOÁN NGAY</button>`
        : "<p class='text-muted text-center'>Giỏ hàng đang trống!</p>";
}

function updateQty(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    renderCart();
}

function removeItem(index) { cart.splice(index, 1); renderCart(); }

function checkout() { 
    alert("Thanh toán thành công! Tổng hóa đơn: " + document.getElementById("cartTotal").innerText);
    cart = []; 
    renderCart();
    const cartOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('miniCart'));
    if (cartOffcanvas) cartOffcanvas.hide();
}

// 5. Logic Search & Filter
const filter = () => {
    const kw = document.getElementById("searchInput").value.toLowerCase();
    const cat = document.getElementById("categoryFilter").value;
    const filteredList = foods.filter(f => (cat === "all" || f.category === cat) && f.name.toLowerCase().includes(kw));
    renderFoods(filteredList);
};

document.getElementById("searchInput").addEventListener("input", filter);
document.getElementById("categoryFilter").addEventListener("change", filter);

// 6. Xử lý Form Admin & Khởi chạy
$(document).ready(function() {
    loadCategories();

    $("#addFoodForm").on("submit", function(event) {
        event.preventDefault();
        const newFood = {
            name: $("#adminFoodName").val(),
            category: $("#adminFoodCategory").val(),
            price: Number($("#adminFoodPrice").val()),
            image: $("#adminFoodImage").val(),
            description: $("#adminFoodDesc").val(),
            status: true
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newFood)
        })
        .then(() => {
            alert("Thêm món thành công!");
            $("#addFoodForm")[0].reset();
            fetchFoodsFromServer(); 
        });
    });
});
