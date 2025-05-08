document.addEventListener("DOMContentLoaded", function() {
    // Giả lập phí vận chuyển
    const SHIPPING_FEE = 30000;

    // Các phần tử DOM
    const cartItemsContainer = document.getElementById("cartItems");
    const orderItemsContainer = document.getElementById("orderItems");
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkoutBtn");

    const orderSubtotalElement = document.getElementById("orderSubtotal");
    const orderShippingElement = document.getElementById("orderShipping");
    const orderTotalElement = document.getElementById("orderTotal");

    // Hiển thị giỏ hàng
    function displayCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            if (cartItemsContainer)
                cartItemsContainer.innerHTML =
                '<p class="empty-cart">Giỏ hàng của bạn đang trống</p>';
            if (checkoutBtn) checkoutBtn.style.display = "none";
            return;
        }

        if (checkoutBtn) checkoutBtn.style.display = "block";

        let subtotal = 0;
        let itemsHTML = "";

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            itemsHTML += `
                  <div class="cart-item">
                      <div class="item-image">
                          <img src="${item.image}" alt="${item.name}">
                      </div>
                      <div class="item-details">
                          <h3>${item.name}</h3>
                          <p class="item-price">${item.price.toLocaleString()}đ</p>
                          <div class="item-quantity">
                              <button class="quantity-btn minus" data-id="${
                                item.id
                              }">-</button>
                              <span>${item.quantity}</span>
                              <button class="quantity-btn plus" data-id="${
                                item.id
                              }">+</button>
                          </div>
                      </div>
                      <div class="item-total">
                          <p>${itemTotal.toLocaleString()}đ</p>
                          <button class="remove-item" data-id="${
                            item.id
                          }">Xóa</button>
                      </div>
                  </div>
              `;
        });

        const total = subtotal + SHIPPING_FEE;

        if (cartItemsContainer) cartItemsContainer.innerHTML = itemsHTML;
        if (orderItemsContainer)
            orderItemsContainer.innerHTML = itemsHTML.replace(
                /cart-item/g,
                "order-item"
            );

        if (subtotalElement)
            subtotalElement.textContent = subtotal.toLocaleString();
        if (shippingElement)
            shippingElement.textContent = SHIPPING_FEE.toLocaleString();
        if (totalElement) totalElement.textContent = total.toLocaleString();

        if (orderSubtotalElement)
            orderSubtotalElement.textContent = subtotal.toLocaleString();
        if (orderShippingElement)
            orderShippingElement.textContent = SHIPPING_FEE.toLocaleString();
        if (orderTotalElement)
            orderTotalElement.textContent = total.toLocaleString();

        // Thêm sự kiện cho các nút
        document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
            btn.addEventListener("click", function() {
                updateQuantity(parseInt(this.getAttribute("data-id")), -1);
            });
        });

        document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
            btn.addEventListener("click", function() {
                updateQuantity(parseInt(this.getAttribute("data-id")), 1);
            });
        });

        document.querySelectorAll(".remove-item").forEach((btn) => {
            btn.addEventListener("click", function() {
                removeItem(parseInt(this.getAttribute("data-id")));
            });
        });
    }

    // Cập nhật số lượng sản phẩm
    function updateQuantity(productId, change) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemIndex = cart.findIndex((item) => item.id === productId);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;

            // Nếu số lượng <= 0 thì xóa sản phẩm
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    function removeItem(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    // Xử lý thanh toán
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) {
                alert("Giỏ hàng của bạn đang trống!");
                return;
            }

            const user = JSON.parse(localStorage.getItem("currentUser"));
            if (!user) {
                alert("Vui lòng đăng nhập để thanh toán!");
                window.location.href = "login.html";
                return;
            }

            const name = document.getElementById("checkoutName").value || user.name;
            const email =
                document.getElementById("checkoutEmail").value || user.email;
            const phone =
                document.getElementById("checkoutPhone").value || user.phone;
            const address =
                document.getElementById("checkoutAddress").value || user.address;
            const paymentMethod = document.querySelector(
                'input[name="payment"]:checked'
            ).value;

            // Tạo đơn hàng
            const order = {
                id: "HD" + Date.now(),
                date: new Date().toISOString(),
                name,
                email,
                phone,
                address,
                paymentMethod,
                items: cart,
                status: "pending",
            };

            // Lưu đơn hàng
            const orders = JSON.parse(localStorage.getItem("orders")) || [];
            orders.push(order);
            localStorage.setItem("orders", JSON.stringify(orders));

            // Lưu đơn hàng cuối cùng để hiển thị hóa đơn
            localStorage.setItem("lastOrder", JSON.stringify(order));

            // Xóa giỏ hàng
            localStorage.removeItem("cart");

            // Chuyển đến trang hóa đơn
            window.location.href = "invoice.html";
        });
    }

    // Tự điền thông tin nếu đã đăng nhập
    function fillUserInfo() {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) return;

        if (document.getElementById("checkoutName"))
            document.getElementById("checkoutName").value = user.name;
        if (document.getElementById("checkoutEmail"))
            document.getElementById("checkoutEmail").value = user.email;
        if (document.getElementById("checkoutPhone"))
            document.getElementById("checkoutPhone").value = user.phone;
        if (document.getElementById("checkoutAddress"))
            document.getElementById("checkoutAddress").value = user.address;
    }

    // Khởi chạy
    displayCart();
    fillUserInfo();
});