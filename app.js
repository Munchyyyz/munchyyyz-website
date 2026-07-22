// ==========================================
// --- 1. PRODUCT DATA ---
// ==========================================
const products = [
    {
        id: 1,
        name: "Large-sized Satin Scrunchie",
        price: 59,
        description: "Ultra-soft premium silk scrunchie designed to prevent hair breakage.",
        image: "./images/Scrunchie1.png"
    },
    {
        id: 2,
        name: "Product yet to come",
        price: null,
        description: null,
        image: null
    }
];

// ==========================================
// --- 2. STATE & GLOBALS ---
// ==========================================
let cart = [];
const whatsappNumber = "14024153307"; 

// DOM Elements
let productGrid, cartToggle, closeCartBtn, cartOverlay, cartModal, cartItemsContainer, cartCountEl, cartTotalEl;
let checkoutBtn, checkoutModal, closeCheckoutBtn, waForm, floatingWaBtn;

// ==========================================
// --- 3. CORE CART FUNCTIONS ---
// ==========================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.price === null) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
}

function changeQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }

    updateCartUI();
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    // Total Items Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountEl) {
        cartCountEl.innerText = totalCount;
        
        // Pop animation
        cartCountEl.classList.remove("cart-pop-animation");
        void cartCountEl.offsetWidth; 
        cartCountEl.classList.add("cart-pop-animation");
    }

    // Total Cost
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalEl) cartTotalEl.innerText = `₹${totalPrice}`;

    // Render Cart Items List
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-msg" style="text-align: center; color: var(--text-muted); margin-top: 2rem;">Your cart is currently empty.</p>`;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <div style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 600; margin-top: 2px;">
                        ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <span class="qty-count">${item.quantity}</span>
                    <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-action="remove" data-id="${item.id}">&times;</button>
                </div>
            </div>
        `).join('');
    }
}

// EXPOSE TO GLOBAL WINDOW IMMEDIATELY FOR ONCLICK HANDLERS
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeItem = removeItem;

// ==========================================
// --- 4. RENDER PRODUCTS ---
// ==========================================
function renderProducts() {
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => {
        // COMING SOON CARD
        if (product.price === null || product.price === undefined) {
            return `
                <div class="product-card placeholder-card">
                    <div class="product-img placeholder-img">✨ Coming Soon</div>
                    <h3>${product.name && product.name !== "null" ? product.name : "Product Coming Soon"}</h3>
                    <p>Stay tuned for our next launch!</p>
                    <div class="price-row">
                        <span class="price" style="color: var(--text-muted); font-size: 0.95rem;">TBA</span>
                        <button class="add-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Unavailable</button>
                    </div>
                </div>
            `;
        }

        // ACTIVE PRODUCT CARD
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price-row">
                    <span class="price">₹${product.price}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// --- 5. MODAL & EVENT CONTROLS ---
// ==========================================
function openCart() {
    if (cartModal && cartOverlay) {
        cartModal.classList.add("open");
        cartOverlay.classList.add("open");
    }
}

function closeCart() {
    if (cartModal && cartOverlay) {
        cartModal.classList.remove("open");
        cartOverlay.classList.remove("open");
    }
}

function initDOMElements() {
    productGrid = document.getElementById("product-grid");
    cartToggle = document.getElementById("cart-toggle");
    closeCartBtn = document.getElementById("close-cart");
    cartOverlay = document.getElementById("cart-overlay");
    cartModal = document.getElementById("cart-modal");
    cartItemsContainer = document.getElementById("cart-items");
    cartCountEl = document.getElementById("cart-count");
    cartTotalEl = document.getElementById("cart-total");

    checkoutBtn = document.getElementById("checkout-btn");
    checkoutModal = document.getElementById("checkout-modal");
    closeCheckoutBtn = document.getElementById("close-checkout");
    waForm = document.getElementById("whatsapp-checkout-form");
    floatingWaBtn = document.getElementById("floating-wa-btn");
}

function setupEventListeners() {
    // Cart drawer toggle
    if (cartToggle) cartToggle.addEventListener("click", openCart);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

    // Cart Quantity Controls (Event Delegation)
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", (e) => {
            const target = e.target;
            const id = parseInt(target.getAttribute("data-id"));
            const action = target.getAttribute("data-action");

            if (!id || !action) return;

            if (action === "increase") changeQuantity(id, 1);
            else if (action === "decrease") changeQuantity(id, -1);
            else if (action === "remove") removeItem(id);
        });
    }

    // Checkout Modal
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is currently empty!");
                return;
            }
            closeCart();
            if (checkoutModal) checkoutModal.style.display = "block";
        });
    }

    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener("click", () => {
            if (checkoutModal) checkoutModal.style.display = "none";
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === checkoutModal) {
            checkoutModal.style.display = "none";
        }
    });

    // WhatsApp Form Submit (Order Checkout)
    if (waForm) {
        waForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("cust-name").value;
            const address = document.getElementById("cust-address").value;

            let message = `🛍️ *NEW ORDER - MUNCHYYYZ*\n`;
            message += `----------------------------\n`;
            message += `👤 *Customer Name:* ${name}\n`;
            message += `📍 *Delivery Address:* ${address}\n`;
            message += `----------------------------\n`;
            message += `📦 *Order Details:*\n`;

            let total = 0;
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                message += `• ${item.name} (x${item.quantity}) - ₹${itemTotal}\n`;
            });

            message += `----------------------------\n`;
            message += `💰 *Total Amount:* ₹${total}\n\n`;
            message += `Hi! Please confirm my order.`;

            const encodedMessage = encodeURIComponent(message);
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(waUrl, "_blank");

            if (checkoutModal) checkoutModal.style.display = "none";
        });
    }

    // Floating Corner WhatsApp Support Button
    if (floatingWaBtn) {
        floatingWaBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const supportMsg = "Hello, I am reaching out to you regarding Munchyyyz items!";
            const encodedSupportMsg = encodeURIComponent(supportMsg);
            
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedSupportMsg}`, "_blank");
        });
    }
}

// ==========================================
// --- 6. INITIALIZATION ---
// ==========================================
function init() {
    initDOMElements();
    renderProducts();
    setupEventListeners();
}

// Run init on DOM load or immediately if already loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}