document.addEventListener("DOMContentLoaded", function() {
    // Dữ liệu sản phẩm
    const products = [{
            id: 1,
            name: "Máy in canon 2900",
            price: 3500000,
            image: "../img/mayincanon2900.jpg",
            category: "tools",
            description: "Máy in canon 2900",
        },
        {
            id: 2,
            name: "Máy in phun màu Epson",
            price: 4500000,
            image: "../img/mayinphunmau.jpg",
            category: "power-tools",
            description: "Máy in phun màu đa năng Epson L3250",
        },
        {
            id: 3,
            name: "Máy in HP laserjet MFP",
            price: 4200000,
            image: "../img/mayinlaser.jpg",
            category: "paint",
            description: "Máy in laser trắng đen đa năng HP LaserJet 135W135W",
        },
        {
            id: 4,
            name: "Máy in Laser HP M211d",
            price: 2990000,
            image: "../img/mayinlaserM211d.jpg",
            category: "tools",
            description: "Máy in Laser đen trắng HP M211d 9YF82A",
        },
        {
            id: 5,
            name: "Máy scan Brother ADS",
            price: 7700000,
            image: "../img/mayscanads.jpg..",
            category: "power-tools",
            description: "Máy scan Brother ADS-3100",
        },
        {
            id: 6,
            name: "Máy scan Plustek SN8016U",
            price: 63500000,
            image: "../img/mayscanPlustek.jpg",
            category: "plumbing",
            description: "Máy scan Plustek SN8016U",
        },
        {
            id: 7,
            name: "Máy Scan Canon Lide 400",
            price: 2500000,
            image: "../img/scancanon.jpg",
            category: "electrical",
            description: "Máy Scan Canon Lide 400",
        },
        {
            id: 8,
            name: "Máy quét HP ScanJet Pro2000 S2",
            price: 7400000,
            image: "../img/scanjetpro2000s2.jpg",
            category: "paint",
            description: "Máy quét HP ScanJet Pro 2000 S2 Sheet-feed (6FW06A)",
        },
    ];

    const productsContainer = document.getElementById("productsContainer");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    // Hiển thị sản phẩm
    function displayProducts(productsToDisplay) {
        productsContainer.innerHTML = "";

        if (productsToDisplay.length === 0) {
            productsContainer.innerHTML =
                '<p class="no-products">Không tìm thấy sản phẩm phù hợp</p>';
            return;
        }

        productsToDisplay.forEach((product) => {
            const productElement = document.createElement("div");
            productElement.className = "product-card";
            productElement.innerHTML = `
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-price">${product.price.toLocaleString()}đ</p>
            <button class="btn add-to-cart" data-id="${
              product.id
            }">Thêm vào giỏ</button>
          </div>
        `;
            productsContainer.appendChild(productElement);
        });

        // Sự kiện thêm vào giỏ
        document.querySelectorAll(".add-to-cart").forEach((button) => {
            button.addEventListener("click", function() {
                const productId = parseInt(this.getAttribute("data-id"));
                addToCart(productId);
            });
        });
    }

    // Lọc sản phẩm
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        let filtered = products;

        if (category !== "all") {
            filtered = filtered.filter((p) => p.category === category);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (p) =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        displayProducts(filtered);
    }

    // Thêm vào giỏ hàng
    function addToCart(productId) {
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item.id === productId);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    }

    // Đăng ký sự kiện tìm kiếm và lọc
    searchInput.addEventListener("input", filterProducts);
    categoryFilter.addEventListener("change", filterProducts);

    // Hiển thị ban đầu
    displayProducts(products);
});