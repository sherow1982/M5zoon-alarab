// Cart JavaScript for English Version

// Global Variables
let cartItems = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
const TAX_RATE = 0.05; // 5% VAT
const FREE_SHIPPING_THRESHOLD = 50;

// Initialize Cart Page
document.addEventListener('DOMContentLoaded', function() {
    initializeCartPage();
});

function initializeCartPage() {
    loadCartItems();
    updateCartSummary();
    initializeCartInteractions();
    loadRecommendations();
    
    console.log('✅ Cart page initialized');
}

// Load Cart Items
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartItemsContainer) return;
    
    if (cartItems.length === 0) {
        cartItemsContainer.style.display = 'none';
        if (emptyCart) {
            emptyCart.style.display = 'block';
        }
        hideRecommendations();
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    if (emptyCart) {
        emptyCart.style.display = 'none';
    }
    
    cartItemsContainer.innerHTML = cartItems.map(item => createCartItemHTML(item)).join('');
    
    // Initialize cart item interactions
    initializeCartItemInteractions(cartItemsContainer);
    showRecommendations();
}

// Create Cart Item HTML
function createCartItemHTML(item) {
    const totalPrice = (item.price * item.quantity).toFixed(2);
    
    return `
        <div class="cart-item" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.title}</h3>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                <div class="quantity-controls">
                    <button class="quantity-btn btn-decrease" data-item-id="${item.id}" title="Decrease quantity">
                        <i class="fas fa-minus"></i>
                    </button>
                    <div class="quantity-display">${item.quantity}</div>
                    <button class="quantity-btn btn-increase" data-item-id="${item.id}" title="Increase quantity">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-total">$${totalPrice}</div>
                <button class="btn-remove" data-item-id="${item.id}" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// Initialize Cart Item Interactions
function initializeCartItemInteractions(container) {
    // Quantity controls
    const decreaseBtns = container.querySelectorAll('.btn-decrease');
    const increaseBtns = container.querySelectorAll('.btn-increase');
    const removeBtns = container.querySelectorAll('.btn-remove');
    
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            updateItemQuantity(itemId, -1);
        });
    });
    
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            updateItemQuantity(itemId, 1);
        });
    });
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            removeCartItem(itemId);
        });
    });
}

// Update Item Quantity
function updateItemQuantity(itemId, change) {
    const item = cartItems.find(item => item.id == itemId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeCartItem(itemId);
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    
    // Update display
    const cartItemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (cartItemElement) {
        const quantityDisplay = cartItemElement.querySelector('.quantity-display');
        const totalDisplay = cartItemElement.querySelector('.cart-item-total');
        
        quantityDisplay.textContent = newQuantity;
        totalDisplay.textContent = `$${(item.price * newQuantity).toFixed(2)}`;
        
        // Animate the change
        cartItemElement.style.transform = 'scale(1.02)';
        setTimeout(() => {
            cartItemElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateCartSummary();
    updateCartCounter();
    
    showNotification(`Quantity updated to ${newQuantity}`, 'success');
}

// Remove Cart Item
function removeCartItem(itemId) {
    const itemIndex = cartItems.findIndex(item => item.id == itemId);
    if (itemIndex === -1) return;
    
    const removedItem = cartItems[itemIndex];
    cartItems.splice(itemIndex, 1);
    saveCart();
    
    // Animate removal
    const cartItemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (cartItemElement) {
        cartItemElement.style.transform = 'translateX(-100%)';
        cartItemElement.style.opacity = '0';
        setTimeout(() => {
            loadCartItems(); // Reload entire cart
        }, 300);
    }
    
    updateCartSummary();
    updateCartCounter();
    
    showNotification(`${removedItem.title} removed from cart`, 'info');
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const tax = calculateTax(subtotal);
    const total = subtotal + shipping + tax;
    
    // Update summary displays
    const elements = {
        subtotal: document.getElementById('subtotal') || document.getElementById('subtotalAmount'),
        shipping: document.getElementById('shipping') || document.getElementById('shippingAmount'),
        tax: document.getElementById('tax') || document.getElementById('taxAmount'),
        total: document.getElementById('total') || document.getElementById('totalAmount')
    };
    
    if (elements.subtotal) elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.shipping) {
        if (shipping === 0) {
            elements.shipping.textContent = 'Free';
            elements.shipping.className = 'free-shipping';
        } else {
            elements.shipping.textContent = `$${shipping.toFixed(2)}`;
            elements.shipping.className = '';
        }
    }
    if (elements.tax) elements.tax.textContent = `$${tax.toFixed(2)}`;
    if (elements.total) elements.total.textContent = `$${total.toFixed(2)}`;
    
    // Update checkout button state
    const checkoutBtn = document.getElementById('proceedCheckout') || document.getElementById('completeOrder');
    if (checkoutBtn) {
        checkoutBtn.disabled = cartItems.length === 0;
    }
}

// Calculate Functions
function calculateSubtotal() {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateShipping(subtotal) {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 10;
}

function calculateTax(subtotal) {
    return subtotal * TAX_RATE;
}

// Save Cart
function saveCart() {
    localStorage.setItem('emirates-cart-en', JSON.stringify(cartItems));
    
    // Dispatch cart updated event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Update Cart Counter (for header)
function updateCartCounter() {
    const cartCounters = document.querySelectorAll('.cart-counter');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Initialize Cart Interactions
function initializeCartInteractions() {
    const proceedCheckout = document.getElementById('proceedCheckout');
    
    if (proceedCheckout) {
        proceedCheckout.addEventListener('click', function() {
            if (cartItems.length === 0) {
                showNotification('Your cart is empty', 'warning');
                return;
            }
            
            window.location.href = './checkout.html';
        });
    }
}

// Load Recommendations
async function loadRecommendations() {
    const recommendedGrid = document.getElementById('recommendedProducts');
    if (!recommendedGrid) return;
    
    try {
        // Load both perfumes and watches for recommendations
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('../data/otor.json'),
            fetch('../data/sa3at.json')
        ]);
        
        const perfumes = await perfumesResponse.json();
        const watches = await watchesResponse.json();
        
        // Get random recommendations (4 products)
        const allProducts = [...perfumes, ...watches];
        const recommendations = allProducts
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
            .map(product => ({
                ...product,
                translatedTitle: translateProductTitle(product.title || product.name),
                price: parseFloat(product.price) || Math.floor(Math.random() * 200) + 50
            }));
        
        recommendedGrid.innerHTML = recommendations.map(product => createRecommendationCard(product)).join('');
        
        // Initialize recommendation interactions
        initializeRecommendationCards(recommendedGrid);
        
    } catch (error) {
        console.error('Error loading recommendations:', error);
        hideRecommendations();
    }
}

// Create Recommendation Card
function createRecommendationCard(product) {
    const image = product.image || product.img || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop';
    
    return `
        <div class="product-card recommendation-card">
            <div class="product-image-container">
                <img src="${image}" alt="${product.translatedTitle}" class="product-image" loading="lazy">
                <div class="product-overlay">
                    <button class="btn-add-to-cart" data-product='${JSON.stringify(product)}' title="Add to Cart">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h4 class="product-title">${product.translatedTitle}</h4>
                <div class="product-rating">
                    <div class="stars">★★★★★</div>
                    <span class="review-count">(${Math.floor(Math.random() * 50) + 10})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                </div>
                <button class="btn-order-now" onclick="orderNow('${product.translatedTitle}', ${product.price})">
                    <i class="fas fa-credit-card"></i>
                    Order Now
                </button>
            </div>
        </div>
    `;
}

// Initialize Recommendation Cards
function initializeRecommendationCards(container) {
    const addToCartBtns = container.querySelectorAll('.btn-add-to-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productData = JSON.parse(this.getAttribute('data-product'));
            const newItem = {
                id: productData.id || Date.now(),
                title: productData.translatedTitle,
                price: parseFloat(productData.price),
                image: productData.image || productData.img || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
                quantity: 1
            };
            
            // Check if item already exists
            const existingItem = cartItems.find(item => item.id == newItem.id);
            if (existingItem) {
                existingItem.quantity += 1;
                showNotification('Quantity increased in cart', 'success');
            } else {
                cartItems.push(newItem);
                showNotification('Added to cart from recommendations', 'success');
            }
            
            saveCart();
            loadCartItems();
            updateCartSummary();
            updateCartCounter();
        });
    });
}

// Show/Hide Recommendations
function showRecommendations() {
    const recommendationsSection = document.getElementById('recommendationsSection');
    if (recommendationsSection && cartItems.length > 0) {
        recommendationsSection.style.display = 'block';
    }
}

function hideRecommendations() {
    const recommendationsSection = document.getElementById('recommendationsSection');
    if (recommendationsSection) {
        recommendationsSection.style.display = 'none';
    }
}

// Translation Helper (same as main-en.js)
function translateProductTitle(arabicTitle) {
    const translations = {
        'عطر': 'Perfume',
        'ساعة': 'Watch',
        'رجالي': 'Men\'s',
        'نسائي': 'Women\'s',
        'فاخر': 'Luxury',
        'ذهبي': 'Gold',
        'فضي': 'Silver',
        'أسود': 'Black',
        'أبيض': 'White',
        'أزرق': 'Blue',
        'أحمر': 'Red',
        'شرقي': 'Oriental',
        'غربي': 'Western',
        'كلاسيكي': 'Classic',
        'عصري': 'Modern'
    };
    
    if (!arabicTitle) return 'Premium Product';
    
    let translatedTitle = arabicTitle;
    Object.keys(translations).forEach(arabic => {
        translatedTitle = translatedTitle.replace(new RegExp(arabic, 'g'), translations[arabic]);
    });
    
    if (translatedTitle === arabicTitle) {
        return 'Premium Product';
    }
    
    return translatedTitle;
}

// Order Now Function
function orderNow(productName, price) {
    const message = `Hello! I'm interested in ordering:\n\n📱 Product: ${productName}\n💰 Price: $${price.toFixed(2)}\n\nPlease provide more details about availability and delivery to UAE.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Export functions for global access
window.CartPage = {
    updateItemQuantity,
    removeCartItem,
    orderNow
};

// Make functions globally accessible
window.updateItemQuantity = updateItemQuantity;
window.removeCartItem = removeCartItem;
window.orderNow = orderNow;