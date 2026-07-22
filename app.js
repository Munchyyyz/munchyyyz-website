// ==========================================
// --- 1. CONFIGURATION & STATE ---
// ==========================================
const whatsappNumber = "14024153307"; // ⚠️ Replace with your 10-digit WhatsApp Number (with country code 91)

let cart = JSON.parse(localStorage.getItem("munchyyyz_cart")) || [];
let currentCategory = "all";

// ==========================================
// --- 2. PRODUCT DATA ---
// ==========================================
const products = [
    {
        id: 1,
        name: "Large-sized Satin Scrunchie",
        category: "scrunchies",
        price: 59,
        description: "Ultra-soft premium silk scrunchie designed to prevent hair breakage.",
        image: "./images/Scrunchie1.png"
    },
    {
        id: 2,
        name: "Product yet to come",
        category: "bracelets",
        price: null,
        description: null,
        image: null
    },
    {
        id: 3,
        name: "Product yet to come",
        category: "necklaces",
        price: null,
        description: null,
        image: null
    },
    {
        id: 4,
        name: "Product yet to come",
        category: "bangles",
        price: null,
        description: null,
        image: null
    },
    {
        id: 5,
        name: "Product yet to come",
        category: "earrings",
        price: null,
        description: null,
        image: null
    }
];

// ==========================================
// --- 3. DOM ELEMENTS ---
// ==========================================
const productGrid = document.getElementById("product-grid");
const cartToggle = document.getElementById("cart-toggle");
const cartModal = document.getElementById("cart-modal");
const cartOverlay = document.getElementById("cart-overlay");
const closeCart = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

const checkoutModal = document.getElementById("checkout-modal");
const closeCheckout = document.getElementById("close-checkout");
const waForm = document.getElementById("whatsapp-checkout-form");
const floatingWaBtn = document.getElementById("floating-wa-btn");

// ==========================================
// --- 4. RENDER PRODUCTS WITH FILTER ---
// ==========================================
function renderProducts() {
    if (!productGrid) return;

    const filteredProducts = currentCategory === "all" 
        ? products 
        : products.filter(p => p.category === currentCategory);

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 2rem;">No products found in this category yet!</p>`;
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => {
        // PLACEHOLDER CARD (Upcoming products)
        if (product.price === null || product.price === undefined) {
            return `
                <div class="product-card placeholder-card">
                    <div class="placeholder-img">✨ Coming Soon</div>
                    <h3>${product.name || "Product yet to come"}</h3>
                    <p>Stay tuned for our next launch!</p>
                    <div class="price-row">
                        <span class="price" style="color: #888; font-size: 0.95rem;">TBA</span>
                        <button class="add-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Unavailable</button>
                    </div>
                </div>
            `;
        }

        // ACTIVE PRODUCT CARD
        return `
            <div class="product-card">
                <div class="img-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
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
// --- 5. CART SYSTEM LOGIC ---
// ==========================================
function saveCart() {
    localStorage.setItem("munchyyyz_cart", JSON.stringify(cart));
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCount) cartCount.textContent = totalCount;
    if (cartTotal) cartTotal.textContent = `₹${totalPrice}`;

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-msg">Your cart is currently empty.</p>`;
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">&times;</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.price === null) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    openCart();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function openCart() {
    if (cartModal) cartModal.classList.add("active");
    if (cartOverlay) cartOverlay.classList.add("active");
}

function closeCartModal() {
    if (cartModal) cartModal.classList.remove("active");
    if (cartOverlay) cartOverlay.classList.remove("active");
}

// ==========================================
// --- 6. CHECKOUT & PRICING CALCULATIONS ---
// ==========================================
function updateModalTotals() {
    const orderTypeSelect = document.getElementById("order-type");
    const orderType = orderTypeSelect ? orderTypeSelect.value : "Delivery";
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const subtotalElem = document.getElementById("summary-subtotal");
    const deliveryChargeElem = document.getElementById("summary-delivery-charge");
    const grandTotalElem = document.getElementById("summary-grand-total");

    if (subtotalElem) subtotalElem.textContent = `₹${subtotal}`;
    
    if (deliveryChargeElem) {
        if (orderType === "Delivery") {
            deliveryChargeElem.textContent = "TBD (Based on distance)";
            deliveryChargeElem.style.color = "#d97706";
        } else {
            deliveryChargeElem.textContent = "FREE";
            deliveryChargeElem.style.color = "#2e7d32";
        }
    }
    
    if (grandTotalElem) {
        grandTotalElem.textContent = (orderType === "Delivery") ? `₹${subtotal} + Delivery` : `₹${subtotal}`;
    }
}

function openCheckout() {
    if (cart.length === 0) return;
    closeCartModal();
    updateModalTotals();
    if (checkoutModal) checkoutModal.style.display = "flex";
}

// ==========================================
// --- 7. EVENT LISTENERS ---
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();

    // Cart Sidebar Toggle
    if (cartToggle) cartToggle.addEventListener("click", openCart);
    if (closeCart) closeCart.addEventListener("click", closeCartModal);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCartModal);
    if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);

    // Checkout Modal Close
    if (closeCheckout) {
        closeCheckout.addEventListener("click", () => {
            if (checkoutModal) checkoutModal.style.display = "none";
        });
    }

    // Category Filter Buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentCategory = e.target.getAttribute("data-category");
            renderProducts();
        });
    });

    // Dynamic Delivery vs Pickup Toggle
    const orderTypeSelect = document.getElementById("order-type");
    const addressSection = document.getElementById("address-section");
    const addressInputs = document.querySelectorAll(".addr-field");

    if (orderTypeSelect) {
        orderTypeSelect.addEventListener("change", (e) => {
            const isDelivery = e.target.value === "Delivery";

            if (addressSection) {
                addressSection.style.display = isDelivery ? "block" : "none";
            }

            addressInputs.forEach(input => {
                if (isDelivery) {
                    input.setAttribute("required", "true");
                } else {
                    input.removeAttribute("required");
                }
            });

            updateModalTotals();
        });
    }

    // WhatsApp Form Submission
    if (waForm) {
        waForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("cust-name").value;
            const phone = document.getElementById("cust-phone").value;
            const orderType = document.getElementById("order-type").value;

            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            let message = `🛍️ *NEW ORDER - MUNCHYYYZ*\n`;
            message += `----------------------------\n`;
            message += `👤 *Customer Name:* ${name}\n`;
            message += `📞 *Phone:* ${phone}\n`;
            message += `🚚 *Order Type:* ${orderType}\n`;

            if (orderType === "Delivery") {
                const flat = document.getElementById("addr-flat").value;
                const floor = document.getElementById("addr-floor").value;
                const street = document.getElementById("addr-street").value;
                const landmark = document.getElementById("addr-landmark").value;
                const city = document.getElementById("addr-city").value;
                const pincode = document.getElementById("addr-pincode").value;

                message += `\n📍 *DELIVERY ADDRESS:*\n`;
                message += `• Flat/Bldg: ${flat}\n`;
                message += `• Floor: ${floor}\n`;
                message += `• Street/Area: ${street}\n`;
                if (landmark.trim() !== "") {
                    message += `• Landmark: ${landmark}\n`;
                }
                message += `• City & Pincode: ${city} - ${pincode}\n`;
            } else {
                message += `📍 *Option:* Self Pickup requested\n`;
            }

            message += `----------------------------\n`;
            message += `📦 *ORDER ITEMS:*\n`;

            cart.forEach(item => {
                message += `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
            });

            message += `----------------------------\n`;
            message += `💵 *Subtotal:* ₹${subtotal}\n`;
            if (orderType === "Delivery") {
                message += `🚚 *Delivery Fee:* To be calculated based on address distance\n`;
                message += `💰 *Subtotal to pay:* ₹${subtotal} + Delivery Charge\n\n`;
                message += `Hi! Please calculate the delivery fee for my address and confirm my order.`;
            } else {
                message += `🚚 *Delivery Fee:* FREE (Self Pickup)\n`;
                message += `💰 *FINAL AMOUNT:* ₹${subtotal}\n\n`;
                message += `Hi! Please confirm my pickup order.`;
            }

            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(waUrl, "_blank");

            if (checkoutModal) checkoutModal.style.display = "none";
        });
    }

    // Floating Support Button
    if (floatingWaBtn) {
        floatingWaBtn.setAttribute("href", `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi MUNCHYYYZ! I have a question about your collection.")}`);
        floatingWaBtn.setAttribute("target", "_blank");
    }
});