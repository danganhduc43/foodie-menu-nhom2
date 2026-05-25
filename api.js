const API_URL = "https://65abcdefg.mockapi.io/products"; 

// Hàm lấy danh sách món ăn từ MockAPI sử dụng jQuery AJAX (Thỏa mãn mục 2 & mục 4)
function fetchMenuData() {
    // 1. Hiển thị trạng thái Loading (Mục 2 yêu cầu)
    $("#menu-container").html(`
        <div class="col-12 text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Đang tải thực đơn...</p>
        </div>
    `);

    $.ajax({
        url: API_URL,
        type: "GET",
        dataType: "json",
        success: function(data) {
            // Lưu dữ liệu vào một biến toàn cục để file main.js xử lý lọc/tìm kiếm
            window.menuData = data; 
            // Gọi hàm render từ main.js
            renderMenu(data);
        },
        error: function(xhr, status, error) {
            // Xử lý lỗi khi API thất bại (Mục 2 yêu cầu)
            console.error("Lỗi gọi API:", error);
            $("#menu-container").html(`
                <div class="col-12 text-center my-5 text-danger">
                    <p class="fs-5 fw-bold">Không thể tải dữ liệu từ máy chủ. Vui lòng thử lại sau!</p>
                </div>
            `);
        }
    });
}
