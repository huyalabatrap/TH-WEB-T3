document.addEventListener("DOMContentLoaded", function() {
    // Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        alert("Vui lòng đăng nhập để xem lịch sử mua hàng!");
        window.location.href = "login.html";
        return;
    }

    // Hiển thị lịch sử đơn hàng
    displayOrderHistory();

    function displayOrderHistory() {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const userOrders = orders.filter((order) => order.email === user.email);
        const historyList = document.getElementById("historyList");

        if (userOrders.length === 0) {
            historyList.innerHTML =
                '<p class="empty-history">Bạn chưa có đơn hàng nào. <a href="shop.html">Mua sắm ngay</a></p>';
            return;
        }

        // Sắp xếp đơn hàng mới nhất trước
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        historyList.innerHTML = "";

        userOrders.forEach((order) => {
            const orderElement = document.createElement("div");
            orderElement.className = "order-card";

            // Tính tổng tiền
            let subtotal = 0;
            order.items.forEach((item) => {
                subtotal += item.price * item.quantity;
            });
            const total = subtotal + 30000; // Giả định phí vận chuyển 30,000đ

            // Định dạng ngày
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

            orderElement.innerHTML = `
                  <div class="order-header">
                      <div>
                          <h3>Đơn hàng #${order.id}</h3>
                          <p class="order-date">${formattedDate}</p>
                      </div>
                      <div class="order-status">${getStatusBadge(
                        order.status
                      )}</div>
                  </div>
                  <div class="order-summary">
                      <div class="order-items-preview">
                          ${getOrderItemsPreview(order.items)}
                      </div>
                      <div class="order-total">
                          <p>Tổng cộng: <span>${total.toLocaleString()}đ</span></p>
                      </div>
                  </div>
                  <div class="order-actions">
                      <a href="invoice.html?orderId=${
                        order.id
                      }" class="btn btn-view">Xem chi tiết</a>
                  </div>
              `;

            historyList.appendChild(orderElement);
        });
    }

    function getStatusBadge(status) {
        const statusText = {
            pending: "Đang xử lý",
            shipped: "Đang giao hàng",
            completed: "Hoàn thành",
            cancelled: "Đã hủy",
        };

        const statusClass = {
            pending: "status-pending",
            shipped: "status-shipped",
            completed: "status-completed",
            cancelled: "status-cancelled",
        };

        return `<span class="status-badge ${statusClass[status]}">${statusText[status]}</span>`;
    }

    function getOrderItemsPreview(items) {
        let preview = "";
        const maxItemsToShow = 2;

        for (let i = 0; i < Math.min(items.length, maxItemsToShow); i++) {
            preview += `<p>${items[i].name} x ${items[i].quantity}</p>`;
        }

        if (items.length > maxItemsToShow) {
            preview += `<p>+${items.length - maxItemsToShow} sản phẩm khác...</p>`;
        }

        return preview;
    }
});