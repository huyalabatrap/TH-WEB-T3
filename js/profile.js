document.addEventListener("DOMContentLoaded", function() {
    // Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        alert("Vui lòng đăng nhập để xem hồ sơ!");
        window.location.href = "login.html";
        return;
    }

    // Khởi tạo tab
    initTabs();

    // Hiển thị thông tin người dùng
    displayUserInfo(user);

    // Xử lý thay đổi avatar
    setupAvatarChange();

    // Xử lý form thông tin cá nhân
    setupPersonalInfoForm();

    // Xử lý form đổi mật khẩu
    setupPasswordChangeForm();

    // Xử lý sổ địa chỉ
    setupAddressBook();

    // Xử lý đăng xuất
    document.getElementById("logoutLink").addEventListener("click", function(e) {
        e.preventDefault();
        handleLogout();
    });
});

function initTabs() {
    const tabLinks = document.querySelectorAll(".profile-menu a");

    tabLinks.forEach((link) => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            // Xóa active class từ tất cả các tab và link
            document
                .querySelectorAll(".profile-menu a")
                .forEach((el) => el.classList.remove("active"));
            document
                .querySelectorAll(".profile-tab")
                .forEach((el) => el.classList.remove("active"));

            // Thêm active class cho tab được chọn
            this.classList.add("active");
            const tabId = this.getAttribute("href").substring(1);
            document.getElementById(tabId).classList.add("active");
        });
    });
}

function displayUserInfo(user) {
    document.getElementById("profileName").value = user.name || "";
    document.getElementById("profileEmail").value = user.email || "";
    document.getElementById("profilePhone").value = user.phone || "";

    // Hiển thị avatar nếu có
    if (user.avatar) {
        document.getElementById("userAvatar").src = user.avatar;
    }
}

function setupAvatarChange() {
    const avatarInput = document.getElementById("avatarInput");
    const changeAvatarBtn = document.querySelector(".btn-change-avatar");

    changeAvatarBtn.addEventListener("click", function() {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(event) {
                const avatarUrl = event.target.result;
                document.getElementById("userAvatar").src = avatarUrl;

                // Lưu avatar vào thông tin người dùng
                const user = JSON.parse(localStorage.getItem("currentUser"));
                const users = JSON.parse(localStorage.getItem("users")) || [];

                user.avatar = avatarUrl;
                localStorage.setItem("currentUser", JSON.stringify(user));

                // Cập nhật trong danh sách users
                const userIndex = users.findIndex((u) => u.email === user.email);
                if (userIndex !== -1) {
                    users[userIndex].avatar = avatarUrl;
                    localStorage.setItem("users", JSON.stringify(users));
                }

                alert("Ảnh đại diện đã được cập nhật!");
            };

            reader.readAsDataURL(file);
        }
    });
}

function setupPersonalInfoForm() {
    const form = document.getElementById("personalInfoForm");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("profileName").value;
        const phone = document.getElementById("profilePhone").value;

        // Cập nhật thông tin người dùng
        const user = JSON.parse(localStorage.getItem("currentUser"));
        const users = JSON.parse(localStorage.getItem("users")) || [];

        user.name = name;
        user.phone = phone;
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Cập nhật trong danh sách users
        const userIndex = users.findIndex((u) => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex].name = name;
            users[userIndex].phone = phone;
            localStorage.setItem("users", JSON.stringify(users));
        }

        // Cập nhật tên hiển thị trên navigation
        const loginLink = document.querySelector(
            'nav ul li a[href="profile.html"]'
        );
        if (loginLink) loginLink.textContent = name;

        alert("Thông tin cá nhân đã được cập nhật!");
    });
}

function setupPasswordChangeForm() {
    const form = document.getElementById("changePasswordForm");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmNewPassword =
            document.getElementById("confirmNewPassword").value;

        // Kiểm tra mật khẩu hiện tại
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (currentPassword !== user.password) {
            alert("Mật khẩu hiện tại không đúng!");
            return;
        }

        // Kiểm tra mật khẩu mới
        if (newPassword !== confirmNewPassword) {
            alert("Mật khẩu mới không khớp!");
            return;
        }

        if (newPassword.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        // Cập nhật mật khẩu
        const users = JSON.parse(localStorage.getItem("users")) || [];

        user.password = newPassword;
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Cập nhật trong danh sách users
        const userIndex = users.findIndex((u) => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem("users", JSON.stringify(users));
        }

        alert("Mật khẩu đã được thay đổi thành công!");
        form.reset();
    });
}

function setupAddressBook() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const addressList = document.getElementById("addressList");
    const addAddressBtn = document.querySelector(".btn-add-address");
    const addressFormContainer = document.getElementById("addressFormContainer");
    const cancelAddressBtn = document.querySelector(
        ".address-form-container .btn-cancel"
    );
    const addressForm = document.getElementById("addressForm");

    // Hiển thị danh sách địa chỉ
    function displayAddresses() {
        addressList.innerHTML = "";

        if (!user.addresses || user.addresses.length === 0) {
            addressList.innerHTML = "<p>Bạn chưa có địa chỉ nào.</p>";
            return;
        }

        user.addresses.forEach((address, index) => {
            const addressCard = document.createElement("div");
            addressCard.className = "address-card";
            addressCard.innerHTML = `
                  <h4>${address.name} ${
          address.isDefault ? '<span class="address-default">Mặc định</span>' : ""
        }</h4>
                  <p>${address.street}</p>
                  <p>${address.district}, ${address.city}</p>
                  <p>Điện thoại: ${address.phone}</p>
                  <div class="address-actions">
                      <button class="btn-edit-address" data-index="${index}">Sửa</button>
                      <button class="btn-delete-address" data-index="${index}">Xóa</button>
                      ${
                        !address.isDefault
                          ? '<button class="btn-set-default" data-index="${index}">Đặt làm mặc định</button>'
                          : ""
                      }
                  </div>
              `;
            addressList.appendChild(addressCard);
        });

        // Thêm sự kiện cho các nút
        document.querySelectorAll(".btn-edit-address").forEach((btn) => {
            btn.addEventListener("click", function() {
                editAddress(parseInt(this.getAttribute("data-index")));
            });
        });

        document.querySelectorAll(".btn-delete-address").forEach((btn) => {
            btn.addEventListener("click", function() {
                deleteAddress(parseInt(this.getAttribute("data-index")));
            });
        });

        document.querySelectorAll(".btn-set-default").forEach((btn) => {
            btn.addEventListener("click", function() {
                setDefaultAddress(parseInt(this.getAttribute("data-index")));
            });
        });
    }

    // Thêm địa chỉ mới
    addAddressBtn.addEventListener("click", function() {
        addressFormContainer.style.display = "block";
        addressForm.reset();
        addressForm.scrollIntoView({ behavior: "smooth" });
    });

    // Hủy thêm địa chỉ
    cancelAddressBtn.addEventListener("click", function() {
        addressFormContainer.style.display = "none";
    });

    // Xử lý form địa chỉ
    addressForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const addressData = {
            name: document.getElementById("addressName").value,
            phone: document.getElementById("addressPhone").value,
            street: document.getElementById("addressStreet").value,
            city: document.getElementById("addressCity").value,
            district: document.getElementById("addressDistrict").value,
            isDefault: !user.addresses || user.addresses.length === 0,
        };

        // Thêm địa chỉ mới
        if (!user.addresses) user.addresses = [];
        user.addresses.push(addressData);

        // Cập nhật localStorage
        updateUserData(user);

        // Ẩn form và hiển thị lại danh sách
        addressFormContainer.style.display = "none";
        displayAddresses();
        alert("Địa chỉ đã được thêm thành công!");
    });

    // Sửa địa chỉ
    function editAddress(index) {
        const address = user.addresses[index];

        document.getElementById("addressName").value = address.name;
        document.getElementById("addressPhone").value = address.phone;
        document.getElementById("addressStreet").value = address.street;
        document.getElementById("addressCity").value = address.city;
        document.getElementById("addressDistrict").value = address.district;

        addressFormContainer.style.display = "block";
        addressForm.scrollIntoView({ behavior: "smooth" });

        // Thay đổi hành vi form từ thêm thành sửa
        addressForm.onsubmit = function(e) {
            e.preventDefault();

            user.addresses[index] = {
                name: document.getElementById("addressName").value,
                phone: document.getElementById("addressPhone").value,
                street: document.getElementById("addressStreet").value,
                city: document.getElementById("addressCity").value,
                district: document.getElementById("addressDistrict").value,
                isDefault: user.addresses[index].isDefault,
            };

            updateUserData(user);
            addressFormContainer.style.display = "none";
            displayAddresses();
            alert("Địa chỉ đã được cập nhật!");
        };
    }

    // Xóa địa chỉ
    function deleteAddress(index) {
        if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
            // Không cho xóa nếu là địa chỉ mặc định duy nhất
            if (
                user.addresses[index].isDefault &&
                user.addresses.filter((a) => a.isDefault).length === 1
            ) {
                alert("Không thể xóa địa chỉ mặc định duy nhất!");
                return;
            }

            user.addresses.splice(index, 1);
            updateUserData(user);
            displayAddresses();
            alert("Địa chỉ đã được xóa!");
        }
    }

    // Đặt làm địa chỉ mặc định
    function setDefaultAddress(index) {
        user.addresses.forEach((addr, i) => {
            addr.isDefault = i === index;
        });

        updateUserData(user);
        displayAddresses();
        alert("Đã đặt địa chỉ mặc định thành công!");
    }

    // Cập nhật dữ liệu người dùng
    function updateUserData(updatedUser) {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex((u) => u.email === updatedUser.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem("users", JSON.stringify(users));
        }
    }

    // Hiển thị danh sách địa chỉ ban đầu
    displayAddresses();
}