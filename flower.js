document.addEventListener("DOMContentLoaded", function() {
    let cart = [];
    let isLoggedIn = false;
    let username = "";

     // Tìm kiếm sản phẩm
     const searchInput = document.querySelector(".header-right .search input");
     searchInput.addEventListener("keyup", function(e) {
         const query = e.target.value.toLowerCase();
         const products = document.querySelectorAll(".box .img-item");
         let found = false;
 
         products.forEach(product => {
             const productName = product.querySelector(".nameflower").textContent.toLowerCase();
             const isMatch = productName.includes(query);
             product.parentElement.style.display = isMatch ? "block" : "none";
             if (isMatch && !found) {
                 product.scrollIntoView({ behavior: "smooth", block: "center" });
                 found = true;
             }
         });
     });

    // Thêm sản phẩm
    const addToCartButtons = document.querySelectorAll(".choice .add");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function() {
            const productName = this.parentElement.parentElement.querySelector(".nameflower").textContent;
            const productPrice = this.parentElement.parentElement.querySelector(".price p").textContent;
            const productImage = this.parentElement.parentElement.querySelector(".main-item").src;

            const existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
            }

            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: `Đã thêm ${productName} vào giỏ hàng.`,
                timer: 1500,
                showConfirmButton: false
            });

            updateCartIcon();
            displayCart();
        });
    });

    //Thông báo mua
    const buyButtons = document.querySelectorAll(".choice .buy");
    buyButtons.forEach(button => {
        button.addEventListener("click", function() {
            if (!isLoggedIn) {
                Swal.fire({
                    icon: 'error',
                    title: 'Chưa đăng nhập',
                    text: 'Vui lòng đăng nhập để mua hàng.'
                });
                return;
            }

            const productName = this.parentElement.parentElement.querySelector(".nameflower").textContent;
            const productPrice = this.parentElement.parentElement.querySelector(".price p").textContent;

            Swal.fire({
                title: 'Xác nhận mua hàng',
                text: `Bạn có muốn mua ${productName} với giá ${productPrice}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Mua',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Mua hàng thành công!',
                        text: `Cảm ơn bạn đã mua ${productName}.`
                    });
                }
            });
        });
    });

    // Login/Logout
    const loginButton = document.querySelector(".header-left .login p");
    loginButton.addEventListener("click", function() {
        if (!isLoggedIn) {
            Swal.fire({
                title: 'Đăng nhập',
                input: 'text',
                inputLabel: 'Nhập tên người dùng',
                inputPlaceholder: 'Tên người dùng',
                showCancelButton: true,
                confirmButtonText: 'Đăng nhập',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    username = result.value;
                    isLoggedIn = true;
                    Swal.fire({
                        icon: 'success',
                        title: `Xin chào, ${username}!`,
                        text: 'Bạn đã đăng nhập thành công.'
                    });
                    loginButton.textContent = `Xin chào, ${username} (Đăng xuất)`;
                }
            });
        } else {
            Swal.fire({
                title: 'Đăng xuất',
                text: 'Bạn có chắc chắn muốn đăng xuất?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Đăng xuất',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    isLoggedIn = false;
                    username = "";
                    Swal.fire({
                        icon: 'success',
                        title: 'Đã đăng xuất thành công'
                    });
                    loginButton.textContent = "Login/Logout";
                }
            });
        }
    });

    // Hiển thị nội dung giỏ hàng
    const cartIcon = document.querySelector(".header-right .icon_shop");
    cartIcon.addEventListener("click", function(event) {
        event.stopPropagation();
        displayCart();
    });

    function updateCartIcon() {
        const cartIcon = document.querySelector(".header-right .icon_shop");
        cartIcon.textContent = cart.length;
    }

    function displayCart() {
        let cartContent = document.querySelector(".cart-content");
        if (!cartContent) {
            cartContent = document.createElement("div");
            cartContent.classList.add("cart-content");
            document.body.appendChild(cartContent);
        }

        // Vị trí và kiểu của giỏ hàng
        cartContent.style.position = "fixed";
        cartContent.style.right = "20px";
        cartContent.style.top = "60px";
        cartContent.style.background = "#fff";
        cartContent.style.border = "1px solid #ddd";
        cartContent.style.padding = "15px";
        cartContent.style.width = "300px";
        cartContent.style.zIndex = "1000";

        cartContent.innerHTML = "<h3>Giỏ hàng của bạn</h3>";
        if (cart.length === 0) {
            cartContent.innerHTML += "<p>Giỏ hàng trống</p>";
        } else {
            cart.forEach((item, index) => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("cart-item");
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                    <p>${item.name}</p>
                    <p>Giá: ${item.price}</p>
                    <p>Số lượng: ${item.quantity}</p>
                    <button class="remove-item" data-index="${index}">Xóa</button>
                `;
                cartContent.appendChild(itemElement);
            });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        const removeButtons = cartContent.querySelectorAll(".remove-item");
        removeButtons.forEach(button => {
            button.addEventListener("click", function() {
                const index = button.getAttribute("data-index");
                Swal.fire({
                    title: 'Bạn có chắc chắn?',
                    text: "Sản phẩm sẽ bị xóa khỏi giỏ hàng!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Xóa',
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        cart.splice(index, 1);
                        updateCartIcon();
                        displayCart();
                        Swal.fire(
                            'Đã xóa!',
                            'Sản phẩm đã được xóa khỏi giỏ hàng.',
                            'success'
                        );
                    }
                });
            });
        });
    }

    // Đóng giỏ hàng.
    document.addEventListener("click", function(event) {
        const cartContent = document.querySelector(".cart-content");
        if (cartContent && !event.target.closest(".cart-content")) {
            cartContent.remove();
        }
    });
});
