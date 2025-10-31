/**
 * Emirates Gifts English Cart System v20251101
 * Complete shopping cart management for English version
 * Author: Emirates Gifts Development Team
 */

(function() {
    'use strict';
    
    console.log('🛒 Initializing English Cart System v20251101');
    
    /**
     * English Cart Manager
     */
    const EnglishCart = {
        version: '20251101',
        storageKey: 'emirates_shopping_cart',
        
        /**
         * Initialize cart system
         */
        init() {
            this.loadCartFromStorage();
            this.updateCartDisplay();
            this.setupEventListeners();
            
            console.log('✅ English cart system initialized');
        },
        
        /**
         * Add item to cart
         */
        addItem(product) {
            let cart = this.getCart();
            const existingIndex = cart.findIndex(item => item.id === product.id && item.category === product.category);
            
            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
                this.showNotification(`Increased quantity for "${product.title}"`);
            } else {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: parseFloat(product.price),
                    image: product.image,
                    category: product.category || 'product',
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
                this.showNotification(`"${product.title}" added to cart!`);
            }
            
            this.saveCart(cart);
            this.updateCartDisplay();
            this.dispatchCartUpdate();
        },
        
        /**
         * Remove item from cart
         */
        removeItem(productId, category) {
            let cart = this.getCart();
            cart = cart.filter(item => !(item.id === productId && item.category === category));
            
            this.saveCart(cart);
            this.updateCartDisplay();
            this.dispatchCartUpdate();
            this.showNotification('Item removed from cart', 'info');
        },
        
        /**
         * Update item quantity
         */
        updateQuantity(productId, category, newQuantity) {
            let cart = this.getCart();
            const itemIndex = cart.findIndex(item => item.id === productId && item.category === category);
            
            if (itemIndex > -1) {
                if (newQuantity <= 0) {
                    this.removeItem(productId, category);
                } else {
                    cart[itemIndex].quantity = newQuantity;
                    this.saveCart(cart);
                    this.updateCartDisplay();
                    this.dispatchCartUpdate();
                }
            }
        },
        
        /**
         * Clear entire cart
         */
        clearCart() {
            localStorage.removeItem(this.storageKey);
            this.updateCartDisplay();
            this.dispatchCartUpdate();
            this.showNotification('Cart cleared', 'info');
        },
        
        /**
         * Get cart items
         */
        getCart() {
            try {
                return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            } catch (error) {
                console.error('Error reading cart from storage:', error);
                return [];
            }
        },
        
        /**
         * Save cart to storage
         */
        saveCart(cart) {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(cart));
            } catch (error) {
                console.error('Error saving cart to storage:', error);
            }
        },
        
        /**
         * Load cart from storage
         */
        loadCartFromStorage() {
            const cart = this.getCart();
            console.log(`📦 Loaded ${cart.length} items from storage`);
        },
        
        /**
         * Update cart display throughout the site
         */
        updateCartDisplay() {
            const cart = this.getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Update cart counters
            const counters = document.querySelectorAll('.cart-counter, .mobile-cart-counter');
            counters.forEach(counter => {
                counter.textContent = totalItems;
                counter.style.display = totalItems > 0 ? 'flex' : 'none';
            });
            
            // Update cart page if we're on it
            if (window.location.pathname.includes('cart.html')) {
                this.renderCartPage(cart, totalPrice);
            }
            
            // Update checkout page if we're on it
            if (window.location.pathname.includes('checkout.html')) {
                this.renderCheckoutSummary(cart, totalPrice);
            }
        },
        
        /**
         * Render cart items on cart page
         */
        renderCartPage(cart, totalPrice) {
            const cartContent = document.getElementById('cartContent');
            const emptyCart = document.getElementById('emptyCart');
            const cartWithItems = document.getElementById('cartWithItems');
            
            if (!cartContent) return;
            
            if (cart.length === 0) {
                if (emptyCart) emptyCart.style.display = 'block';
                if (cartWithItems) cartWithItems.style.display = 'none';
            } else {
                if (emptyCart) emptyCart.style.display = 'none';
                if (cartWithItems) cartWithItems.style.display = 'block';
                
                this.renderCartItems(cart);
                this.updateCartTotals(totalPrice);
            }
        },
        
        /**
         * Render individual cart items
         */
        renderCartItems(cart) {
            const cartItemsContainer = document.getElementById('cartItems');
            if (!cartItemsContainer) return;
            
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}" data-category="${item.category}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/100x100/D4AF37/FFFFFF?text=Product'">
                    </div>
                    
                    <div class="item-details">
                        <h3 class="item-title">${item.title}</h3>
                        <div class="item-category">${this.getCategoryDisplay(item.category)}</div>
                        <div class="item-price">${item.price.toFixed(2)} AED</div>
                    </div>
                    
                    <div class="item-quantity">
                        <button class="quantity-btn" onclick="EnglishCart.updateQuantity('${item.id}', '${item.category}', ${item.quantity - 1})" aria-label="Decrease quantity">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="EnglishCart.updateQuantity('${item.id}', '${item.category}', ${item.quantity + 1})" aria-label="Increase quantity">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    
                    <div class="item-total">
                        ${(item.price * item.quantity).toFixed(2)} AED
                    </div>
                    
                    <button class="remove-item-btn" onclick="EnglishCart.removeItem('${item.id}', '${item.category}')" aria-label="Remove ${item.title} from cart">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        },
        
        /**
         * Update cart totals display
         */
        updateCartTotals(totalPrice) {
            const subtotal = totalPrice;
            const vat = totalPrice * 0.05; // 5% UAE VAT
            const total = subtotal + vat;
            
            const elements = {
                cartSubtotal: document.getElementById('cartSubtotal'),
                cartVat: document.getElementById('cartVat'),
                cartTotal: document.getElementById('cartTotal')
            };
            
            if (elements.cartSubtotal) elements.cartSubtotal.textContent = `${subtotal.toFixed(2)} AED`;
            if (elements.cartVat) elements.cartVat.textContent = `${vat.toFixed(2)} AED`;
            if (elements.cartTotal) elements.cartTotal.textContent = `${total.toFixed(2)} AED`;
        },
        
        /**
         * Render checkout summary
         */
        renderCheckoutSummary(cart, totalPrice) {
            const summaryContent = document.getElementById('summaryContent');
            const summaryTotals = document.getElementById('summaryTotals');
            
            if (!summaryContent) return;
            
            if (cart.length === 0) {
                summaryContent.innerHTML = `
                    <div class="empty-order">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="./products-showcase.html" class="btn-primary" target="_blank" rel="noopener">
                            <i class="fas fa-shopping-bag"></i>
                            Start Shopping
                        </a>
                    </div>
                `;
                if (summaryTotals) summaryTotals.style.display = 'none';
            } else {
                summaryContent.innerHTML = cart.map(item => `
                    <div class="summary-item">
                        <img src="${item.image}" alt="${item.title}" class="summary-item-image">
                        <div class="summary-item-details">
                            <h4>${item.title}</h4>
                            <div class="summary-item-quantity">Qty: ${item.quantity}</div>
                            <div class="summary-item-price">${(item.price * item.quantity).toFixed(2)} AED</div>
                        </div>
                    </div>
                `).join('');
                
                if (summaryTotals) {
                    summaryTotals.style.display = 'block';
                    this.updateCheckoutTotals(totalPrice);
                }
            }
        },
        
        /**
         * Update checkout totals
         */
        updateCheckoutTotals(totalPrice) {
            const subtotal = totalPrice;
            const vat = totalPrice * 0.05;
            const total = subtotal + vat;
            
            const elements = {
                subtotalAmount: document.getElementById('subtotalAmount'),
                vatAmount: document.getElementById('vatAmount'),
                finalAmount: document.getElementById('finalAmount')
            };
            
            if (elements.subtotalAmount) elements.subtotalAmount.textContent = `${subtotal.toFixed(2)} AED`;
            if (elements.vatAmount) elements.vatAmount.textContent = `${vat.toFixed(2)} AED`;
            if (elements.finalAmount) elements.finalAmount.textContent = `${total.toFixed(2)} AED`;
        },
        
        /**
         * Get category display name
         */
        getCategoryDisplay(category) {
            const categoryMap = {
                'perfume': '🌸 Perfume',
                'watch': '⏰ Watch',
                'gift': '🎁 Gift'
            };
            return categoryMap[category] || '🛍️ Product';
        },
        
        /**
         * Setup event listeners
         */
        setupEventListeners() {
            // Listen for storage changes from other tabs
            window.addEventListener('storage', (e) => {
                if (e.key === this.storageKey) {
                    this.updateCartDisplay();
                }
            });
            
            // Clear cart button
            const clearCartBtn = document.getElementById('clearCartBtn');
            if (clearCartBtn) {
                clearCartBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                        this.clearCart();
                    }
                });
            }
        },
        
        /**
         * Dispatch cart update event
         */
        dispatchCartUpdate() {
            const event = new CustomEvent('cartUpdated', {
                detail: {
                    cart: this.getCart(),
                    timestamp: new Date().toISOString()
                }
            });
            document.dispatchEvent(event);
        },
        
        /**
         * Show notification
         */
        showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `cart-notification cart-notification-${type}`;
            
            const bgColor = type === 'success' ? '#25D366' : type === 'error' ? '#e74c3c' : '#3498db';
            const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
            
            notification.style.cssText = `
                position: fixed; top: 100px; right: 20px; z-index: 10000;
                background: linear-gradient(135deg, ${bgColor}, ${bgColor}CC);
                color: white; padding: 15px 20px; border-radius: 10px;
                font-weight: 600; font-family: 'Inter', sans-serif;
                box-shadow: 0 6px 20px ${bgColor}33;
                animation: slideInRight 0.4s ease; max-width: 300px;
                min-width: 250px;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas ${icon}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 4000);
        },
        
        /**
         * Generate WhatsApp order message
         */
        generateWhatsAppMessage() {
            const cart = this.getCart();
            if (cart.length === 0) return '';
            
            let message = '🛒 *New Order from Emirates Gifts Store*\n\n';
            message += '📋 *Order Details:*\n';
            
            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.title}\n`;
                message += `   ${this.getCategoryDisplay(item.category)}\n`;
                message += `   Quantity: ${item.quantity}\n`;
                message += `   Price: ${(item.price * item.quantity).toFixed(2)} AED\n\n`;
            });
            
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const vat = totalPrice * 0.05;
            const total = totalPrice + vat;
            
            message += `💰 *Order Summary:*\n`;
            message += `Subtotal: ${totalPrice.toFixed(2)} AED\n`;
            message += `UAE VAT (5%): ${vat.toFixed(2)} AED\n`;
            message += `**Total: ${total.toFixed(2)} AED**\n\n`;
            message += `🚀 *Delivery: Express delivery within 1-3 business days*\n\n`;
            message += `✨ Thank you for choosing Emirates Gifts!`;
            
            return encodeURIComponent(message);
        }
    };
    
    // Export to global scope
    window.EnglishCart = EnglishCart;
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            EnglishCart.init();
        });
    } else {
        EnglishCart.init();
    }
    
})();