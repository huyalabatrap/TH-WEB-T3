document.addEventListener("DOMContentLoaded", function() {
    // Xử lý đăng nhập
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Kiểm tra thông tin đăng nhập
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(
                (u) => u.email === email && u.password === password
            );

            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                alert("Đăng nhập thành công!");
                window.location.href = "index.html";
            } else {
                alert("Email hoặc mật khẩu không đúng!");
            }
        });
    }

    // Xử lý đăng ký
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("regName").value;
            const email = document.getElementById("regEmail").value;
            const password = document.getElementById("regPassword").value;
            const confirmPassword =
                document.getElementById("regConfirmPassword").value;
            const phone = document.getElementById("regPhone").value;
            const address = document.getElementById("regAddress").value;

            // Kiểm tra mật khẩu
            if (password !== confirmPassword) {
                alert("Mật khẩu không khớp!");
                return;
            }

            // Kiểm tra email đã tồn tại chưa
            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some((u) => u.email === email)) {
                alert("Email đã được sử dụng!");
                return;
            }

            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                phone,
                address,
                avatar: "images/avatar-placeholder.png", // Avatar mặc định
                addresses: [], // Mảng địa chỉ (có thể dùng để lưu nhiều địa chỉ sau này)
            };

            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(newUser));

            alert("Đăng ký thành công! Bạn đã được đăng nhập tự động.");
            window.location.href = "index.html";
        });
    }

    // Kiểm tra trạng thái đăng nhập
    checkLoginStatus();
});

// Hàm kiểm tra trạng thái đăng nhập và cập nhật navbar
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const loginLink = document.querySelector('nav ul li a[href="login.html"]');
    const registerLink = document.querySelector(
        'nav ul li a[href="register.html"]'
    );

    if (user) {
        if (loginLink) loginLink.style.display = "none";
        if (registerLink) registerLink.textContent = "Đăng xuất";

        // Gán sự kiện đăng xuất
        if (registerLink) {
            registerLink.href = "#";
            registerLink.addEventListener("click", function(e) {
                e.preventDefault();
                handleLogout();
            });
        }
    }
}

// Hàm xử lý đăng xuất với xác nhận
function handleLogout() {
    const customConfirm = document.getElementById("customConfirm");
    const confirmCancel = document.querySelector(".confirm-btn-cancel");
    const confirmOk = document.querySelector(".confirm-btn-ok");

    if (!customConfirm || !confirmCancel || !confirmOk) {
        // Nếu chưa có HTML confirm custom thì xác nhận đơn giản
        if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        }
        return;
    }

    // Hiển thị hộp thoại xác nhận tùy chỉnh
    customConfirm.style.display = "flex";

    // Hủy
    confirmCancel.addEventListener("click", function() {
        customConfirm.style.display = "none";
    });

    // Xác nhận đăng xuất
    confirmOk.addEventListener("click", function() {
        localStorage.removeItem("currentUser");
        customConfirm.style.display = "none";
        window.location.href = "index.html";
    });

    // Đóng nếu click ra ngoài
    customConfirm.addEventListener("click", function(e) {
        if (e.target === customConfirm) {
            customConfirm.style.display = "none";
        }
    });
}