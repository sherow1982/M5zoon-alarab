// Simple Cart System for English Version

// Cart state
let cart = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');

// Initialize cart
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing cart...');
    updateCartCounter();
    
    // If we're on the cart page, load cart items
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
});

// Update cart counter
function updateCartCounter() {
    const counters = document.querySelectorAll('.cart-counter');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    counters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Add to cart
function addToCart(product) {
    console.log('Adding to cart:', product);
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: parseFloat(product.price),
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCounter();
    
    // Show notification
    showSimpleNotification('Product added to cart!');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('emirates-cart-en', JSON.stringify(cart));
}

// Load cart page
function loadCartPage() {
    console.log('Loading cart page...');
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartWithItems) cartWithItems.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartWithItems) cartWithItems.style.display = 'block';
    
    // Load cart items
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(createCartItemHTML).join('');
        updateCartSummary();
    }
}

// Create cart item HTML
function createCartItemHTML(item) {
    return `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="quantity-btn">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="quantity-btn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button onclick="removeFromCart('${item.id}')" class="remove-btn" title="Remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// Update quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCounter();
        loadCartPage(); // Reload the page
    }
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCounter();
    loadCartPage(); // Reload the page
    showSimpleNotification('Item removed from cart');
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vat = subtotal * 0.05;
    const total = subtotal + vat;
    
    const subtotalEl = document.getElementById('cartSubtotal');
    const vatEl = document.getElementById('cartVat');
    const totalEl = document.getElementById('cartTotal');
    
    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + ' AED';
    if (vatEl) vatEl.textContent = vat.toFixed(2) + ' AED';
    if (totalEl) totalEl.textContent = total.toFixed(2) + ' AED';
}

// Simple notification
function showSimpleNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Global functions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.showSimpleNotification = showSimpleNotification;