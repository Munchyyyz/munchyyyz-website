// --- 1. Product Data ---
const products = [
    {
        id: 1,
        name: "Silk Satin Scrunchie",
        price: 199,
        description: "Ultra-soft premium silk scrunchie designed to prevent hair breakage.",
        image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Beaded Heart Bracelet",
        price: 349,
        description: "Handcrafted delicate glass bead bracelet with a gold-plated heart charm.",
        image: "https://images.unsplash.com/photo-1611591475179-625d1c22a76f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Pearl Dainty Hair Clip",
        price: 249,
        description: "Elegant freshwater pearl hairpin set to add a touch of luxury to your style.",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Velvet Ribbon Bow",
        price: 299,
        description: "Classic black velvet oversized bow clip made for effortless daily glam.",
        image: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?auto=format&fit=crop&w=600&q=80"
    }
];

// --- 2. Cart State ---
let cart = [];

// --- 3. DOM Elements ---
const productGrid = document.getElementById("product-grid");
const cartToggle = document.getElementById("cart-toggle");
const closeCartBtn = document.getElementById("close-cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");

// --- 4. Render Products to Page ---
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price-row">
                <span class="price">₹${product.price}</span>
                <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// --- 5. Cart Actions ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
}

function updateCartUI() {
    // Total Items Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.innerText = totalCount;

    // Total Cost
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.innerText = `₹${totalPrice}`;

    // Render Cart Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-msg">Your cart is currently empty.</p>`;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <div style="font-size: 0.85rem; color: #7A7571;">₹${item.price} x ${item.quantity}</div>
                </div>
                <strong style="color: #C5A059;">₹${item.price * item.quantity}</strong>
            </div>
        `).join('');
    }
}

// --- 6. Modal Toggles ---
function openCart() {
    cartModal.classList.add("open");
    cartOverlay.classList.add("open");
}

function closeCart() {
    cartModal.classList.remove("open");
    cartOverlay.classList.remove("open");
}

cartToggle.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// --- Initial Load ---
renderProducts();