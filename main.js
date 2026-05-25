// File: js/main.js
const menuContainer = document.getElementById("menu-container");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll("#category-filter button");

let selectionCategory = "Tất cả";
let searchQuery = "";

function renderMenu(dataToRender) {
    menuContainer.innerHTML = "";

    if (!dataToRender || dataToRender.length === 0) {
        // Áp dụng hiệu ứng jQuery fadeIn khi hiển thị thông báo rỗng (Mục 4 yêu cầu)
        $(menuContainer).html("<div class='col-12'><p class='text-center fs-5 mt-4 text-muted'>Không tìm thấy món ăn nào phù hợp.</p></div>").hide().fadeIn(400);
        return;
    }

    let htmlContent = "";

    dataToRender.forEach(item => {
        // Đổi từ item.conPhucVu sang tương tác với thuộc tính item.stock (Mục 3 cấu trúc dữ liệu)
        let badgeHtml = "";
        if (Number(item.stock) === 0) {
            badgeHtml = `<span class="badge bg-danger position-absolute top-0 end-0 m-2 fs-6">Hết món</span>`;
        }

        // Đổi các thuộc tính sang tiếng Anh chuẩn theo Schema MockAPI trong ảnh 3
        const cardStructure = `
            <div class="col food-item-card">
                <div class="card h-100 shadow-sm position-relative food-card">
                    ${badgeHtml}
                    <img src="${item.image}" class="card-img-top food-img" alt="${item.name}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <span class="badge bg-secondary mb-2">${item.category}</span>
                            <h5 class="card-title fw-bold">${item.name}</h5>
                            <p class="text-muted small">${item.description || ''}</p>
                        </div>
                        <div class="mt-3">
                            <p class="price mb-2">${Number(item.price).toLocaleString('vi-VN')} VND</p>
                            <button class="btn btn-outline-danger w-100 order-btn" ${Number(item.stock) === 0 ? 'disabled' : ''}>
                                ${Number(item.stock) === 0 ? 'Tạm hết hàng' : 'Xem chi tiết'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        htmlContent += cardStructure;
    });

    // Ép hiệu ứng fadeIn mượt mà bằng jQuery khi cập nhật danh sách món ăn (Mục 4 yêu cầu)
    $(menuContainer).html(htmlContent).hide().fadeIn(300);
}

function filterAndSearch() {
    // Đọc dữ liệu từ biến window.menuData lấy từ API về
    if (!window.menuData) return;

    const finalResult = window.menuData.filter(item => {
        const matchesCategory = selectionCategory === "Tất cả" || item.category === selectionCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    renderMenu(finalResult);
}

// Lắng nghe sự kiện click danh mục (Dùng Vanilla JS để đáp ứng mục 1)
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        selectionCategory = this.getAttribute("data-category");
        filterAndSearch();
    });
});

// Lắng nghe sự kiện gõ tìm kiếm
if (searchInput) {
    searchInput.addEventListener("input", function() {
        searchQuery = this.value;
        filterAndSearch();
    });
}

// Khi trang load xong, thực hiện kích hoạt hàm gọi dữ liệu từ API bên file api.js
document.addEventListener("DOMContentLoaded", function() {
    fetchMenuData();
});
