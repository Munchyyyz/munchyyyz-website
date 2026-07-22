// --- 1. Product Data ---
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
        description: "null",
        image: "null"
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

// ==========================================
// --- 7. WHATSAPP CHECKOUT LOGIC ---
// ==========================================

const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutBtn = document.getElementById("close-checkout");
const waForm = document.getElementById("whatsapp-checkout-form");

// Your US WhatsApp Number (+1 402-415-3307)
const whatsappNumber = "14024153307"; 

// Open Delivery Modal when Proceed to Checkout is clicked
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is currently empty!");
            return;
        }
        // Close the side cart drawer first
        closeCart();
        // Open the WhatsApp details modal
        checkoutModal.style.display = "block";
    });
}

// Close WhatsApp Modal
if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener("click", () => {
        checkoutModal.style.display = "none";
    });
}

// Handle Form Submission & Send to WhatsApp
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

        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(waUrl, "_blank");

        // Close modal
        checkoutModal.style.display = "none";
    });
}