// نظام سلة التسوق المحسّن - متجر هدايا الإمارات
// وظائف متقدمة: إضافة فورية + انتقال للسلة + عداد تلقائي

class EnhancedCartSystem {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.setupCartCounter();
        this.setupQuickAddButtons();
        this.setupCartPage();
        this.addCartStyles();
    }

    loadCart() {
        const stored = localStorage.getItem('emirates_shopping_cart');
        return stored ? JSON.parse(stored) : [];
    }

    saveCart() {
        localStorage.setItem('emirates_shopping_cart', JSON.stringify(this.cart));
        this.updateCartCounter();
        this.updateCartDisplay();
    }

    // إعداد عداد السلة في الشريط العلوي
    setupCartCounter() {
        // إنشاء عداد السلة إذا لم يوجد
        let cartCounter = document.querySelector('.cart-counter');
        if (!cartCounter) {
            const cartIcon = document.querySelector('.cart-icon, [href*="cart"]');
            if (cartIcon) {
                cartCounter = document.createElement('span');
                cartCounter.className = 'cart-counter';
                cartCounter.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ff4757;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    font-weight: bold;
                    z-index: 1000;
                `;
                
                cartIcon.style.position = 'relative';
                cartIcon.appendChild(cartCounter);
            }
        }
        
        this.updateCartCounter();
    }

    updateCartCounter() {
        const totalItems = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const counters = document.querySelectorAll('.cart-counter');
        
        counters.forEach(counter => {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'flex' : 'none';
            
            // حركة تنبيه عند الإضافة
            if (totalItems > 0) {
                counter.style.animation = 'cartBounce 0.6s ease';
                setTimeout(() => {
                    counter.style.animation = '';
                }, 600);
            }
        });
    }

    // إعداد أزرار الإضافة الفورية
    setupQuickAddButtons() {
        document.querySelectorAll('.quick-add-btn, .add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = btn.closest('.product-card, .product-item, .product-details');
                if (productCard) {
                    const productData = this.extractProductData(productCard);
                    this.addToCartQuick(productData);
                }
            });
        });

        // أزرار "اطلب فوراً" الجديدة
        document.querySelectorAll('.order-now-btn, .buy-now').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = btn.closest('.product-card, .product-item, .product-details');
                if (productCard) {
                    const productData = this.extractProductData(productCard);
                    this.orderNow(productData);
                }
            });
        });
    }

    extractProductData(element) {
        const nameEl = element.querySelector('.product-name, .product-title, h1');
        const priceEl = element.querySelector('.product-price, .price, .current-price');
        const imageEl = element.querySelector('.product-image img, .main-image img, img');
        const idEl = element.dataset?.productId || 
                    element.querySelector('[data-product-id]')?.dataset?.productId ||
                    Math.random().toString(36).substr(2, 9);

        return {
            id: idEl,
            name: nameEl?.textContent?.trim() || 'منتج',
            price: this.extractPrice(priceEl?.textContent || '0'),
            priceText: priceEl?.textContent?.trim() || '0 درهم',
            image: imageEl?.src || '/images/placeholder.jpg',
            url: window.location.href,
            quantity: 1,
            timestamp: new Date().toISOString()
        };
    }

    extractPrice(priceText) {
        const match = priceText.match(/([\d,]+(?:\.\d+)?)/g);
        return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    }

    // إضافة عادية للسلة
    addToCartQuick(product) {
        const existingIndex = this.cart.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            this.cart[existingIndex].quantity += 1;
        } else {
            this.cart.push(product);
        }
        
        this.saveCart();
        this.showCartNotification(`تم إضافة "${product.name}" للسلة`);
    }

    // اطلب فوراً: إضافة للسلة + انتقال
    orderNow(product) {
        // إضافة للسلة
        this.addToCartQuick(product);
        
        // عرض إشعار نجاح
        this.showCartNotification(`تم إضافة "${product.name}" للسلة! جاري الانتقال...`, 2000);
        
        // الانتقال للسلة بعد ثانيتين
        setTimeout(() => {
            window.open('cart.html', '_blank');
        }, 2000);
    }

    // إعداد صفحة السلة
    setupCartPage() {
        if (window.location.pathname.includes('cart')) {
            this.displayCartContents();
            this.setupCartActions();
        }
    }

    displayCartContents() {
        const cartContainer = document.querySelector('#cart-items, .cart-container, .shopping-cart');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = this.getEmptyCartHTML();
            return;
        }

        cartContainer.innerHTML = `
            <div class="cart-header">
                <h2>سلة التسوق (${this.cart.length} منتج)</h2>
            </div>
            
            <div class="cart-items-list">
                ${this.cart.map(item => this.generateCartItemHTML(item)).join('')}
            </div>
            
            <div class="cart-summary">
                ${this.generateCartSummaryHTML()}
            </div>
            
            <div class="cart-actions">
                ${this.generateCartActionsHTML()}
            </div>
        `;
    }

    generateCartItemHTML(item) {
        return `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='/images/placeholder.jpg'">
                </div>
                
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <div class="item-price">${item.priceText}</div>
                    <div class="item-meta">متوفر • شحن فوري</div>
                </div>
                
                <div class="item-quantity">
                    <button class="qty-btn minus" data-action="decrease" data-item-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="qty-btn plus" data-action="increase" data-item-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div class="item-subtotal">
                    ${(item.price * item.quantity).toLocaleString()} درهم
                </div>
                
                <button class="remove-item" data-item-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }

    generateCartSummaryHTML() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 200 ? 0 : 25; // شحن مجاني فوق 200 درهم
        const total = subtotal + shipping;
        
        return `
            <div class="summary-row">
                <span>المجموع الجزئي:</span>
                <span>${subtotal.toLocaleString()} درهم</span>
            </div>
            
            <div class="summary-row">
                <span>رسوم الشحن:</span>
                <span class="${shipping === 0 ? 'free-shipping' : ''}">
                    ${shipping === 0 ? 'مجاني 🎉' : shipping + ' درهم'}
                </span>
            </div>
            
            ${shipping > 0 ? `
                <div class="shipping-notice">
                    أضف ${(200 - subtotal).toLocaleString()} درهم للحصول على شحن مجاني!
                </div>
            ` : ''}
            
            <div class="summary-row total-row">
                <span>المجموع النهائي:</span>
                <span>${total.toLocaleString()} درهم</span>
            </div>
        `;
    }

    generateCartActionsHTML() {
        return `
            <div class="action-buttons">
                <button class="continue-shopping">
                    <i class="fas fa-arrow-left"></i>
                    متابعة التسوق
                </button>
                
                <button class="clear-cart">
                    <i class="fas fa-trash"></i>
                    إفراغ السلة
                </button>
                
                <button class="proceed-checkout">
                    <i class="fas fa-credit-card"></i>
                    إتمام الطلب
                </button>
                
                <button class="whatsapp-order">
                    <i class="fab fa-whatsapp"></i>
                    طلب عبر واتساب
                </button>
            </div>
        `;
    }

    setupCartActions() {
        // تغيير الكمية
        document.addEventListener('click', (e) => {
            if (e.target.matches('.qty-btn') || e.target.closest('.qty-btn')) {
                const btn = e.target.closest('.qty-btn');
                const action = btn.dataset.action;
                const itemId = btn.dataset.itemId;
                
                if (action === 'increase') {
                    this.increaseQuantity(itemId);
                } else if (action === 'decrease') {
                    this.decreaseQuantity(itemId);
                }
            }
            
            // إزالة عنصر
            if (e.target.matches('.remove-item') || e.target.closest('.remove-item')) {
                const btn = e.target.closest('.remove-item');
                const itemId = btn.dataset.itemId;
                this.removeItem(itemId);
            }
            
            // أزرار العمليات
            if (e.target.matches('.clear-cart')) {
                this.clearCart();
            }
            
            if (e.target.matches('.continue-shopping')) {
                window.history.back();
            }
            
            if (e.target.matches('.proceed-checkout')) {
                this.proceedToCheckout();
            }
            
            if (e.target.matches('.whatsapp-order')) {
                this.sendWhatsAppOrder();
            }
        });
    }

    increaseQuantity(itemId) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity++;
            this.saveCart();
        }
    }

    decreaseQuantity(itemId) {
        const item = this.cart.find(item => item.id === itemId);
        if (item && item.quantity > 1) {
            item.quantity--;
            this.saveCart();
        } else if (item && item.quantity === 1) {
            this.removeItem(itemId);
        }
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.showCartNotification('تم حذف المنتج من السلة');
    }

    clearCart() {
        if (confirm('هل أنت متأكد من إفراغ السلة بالكامل؟')) {
            this.cart = [];
            this.saveCart();
            this.showCartNotification('تم إفراغ السلة بنجاح');
        }
    }

    updateCartDisplay() {
        if (window.location.pathname.includes('cart')) {
            this.displayCartContents();
        }
    }

    // إتمام الطلب عبر واتساب
    sendWhatsAppOrder() {
        if (this.cart.length === 0) {
            this.showCartNotification('السلة فارغة', 'error');
            return;
        }
        
        const orderDetails = this.generateWhatsAppMessage();
        const whatsappURL = `https://wa.me/971501234567?text=${encodeURIComponent(orderDetails)}`;
        
        window.open(whatsappURL, '_blank');
    }

    generateWhatsAppMessage() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = total > 200 ? 0 : 25;
        const finalTotal = total + shipping;
        
        let message = "🛍️ *طلب جديد من متجر هدايا الإمارات*\n\n";
        
        message += "*تفاصيل الطلب:*\n";
        this.cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   • السعر: ${item.priceText}\n`;
            message += `   • الكمية: ${item.quantity}\n`;
            message += `   • المجموع: ${(item.price * item.quantity).toLocaleString()} درهم\n\n`;
        });
        
        message += "*ملخص الفاتورة:*\n";
        message += `• قيمة المنتجات: ${total.toLocaleString()} درهم\n`;
        message += `• رسوم الشحن: ${shipping === 0 ? 'مجاني 🎉' : shipping + ' درهم'}\n`;
        message += `• *المجموع النهائي: ${finalTotal.toLocaleString()} درهم*\n\n`;
        
        message += "🚚 *معلومات الشحن:*\n";
        message += "• مدة التوصيل: 1-3 أيام عمل\n";
        message += "• ضمان الإرجاع: 14 يوم + مصاريف الشحن\n\n";
        
        message += "أرجو تأكيد الطلب وإرسال بيانات التوصيل.";
        
        return message;
    }

    generateCartActionsHTML() {
        return `
            <button class="action-btn continue-shopping">
                <i class="fas fa-arrow-right"></i>
                متابعة التسوق
            </button>
            
            <button class="action-btn primary-btn whatsapp-order">
                <i class="fab fa-whatsapp"></i>
                إتمام الطلب عبر واتساب
            </button>
        `;
    }

    getEmptyCartHTML() {
        return `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>سلتك فارغة</h3>
                <p>ابدأ بإضافة منتجات من متجرنا المميز</p>
                <button class="browse-products">
                    <i class="fas fa-store"></i>
                    تصفح المنتجات
                </button>
            </div>
        `;
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showCartNotification('السلة فارغة', 'error');
            return;
        }
        
        // فتح صفحة الدفع أو واتساب
        this.sendWhatsAppOrder();
    }

    showCartNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#25D366' : '#ff4757'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            max-width: 400px;
            animation: slideInRight 0.4s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, duration);
    }

    addCartStyles() {
        const style = document.createElement('style');
        style.id = 'enhanced-cart-styles';
        style.textContent = `
            @keyframes cartBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .cart-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px;
                border: 1px solid #eee;
                border-radius: 12px;
                margin-bottom: 15px;
                background: white;
                transition: all 0.3s;
            }
            
            .cart-item:hover {
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }
            
            .item-image {
                width: 80px;
                height: 80px;
                border-radius: 8px;
                overflow: hidden;
                flex-shrink: 0;
            }
            
            .item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .item-details {
                flex: 1;
                min-width: 0;
            }
            
            .item-name {
                font-size: 1.1rem;
                font-weight: bold;
                margin-bottom: 8px;
                color: #333;
            }
            
            .item-price {
                color: #D4AF37;
                font-weight: bold;
                font-size: 1rem;
            }
            
            .item-meta {
                color: #25D366;
                font-size: 0.85rem;
                margin-top: 5px;
            }
            
            .item-quantity {
                display: flex;
                align-items: center;
                gap: 10px;
                background: #f8f9fa;
                border-radius: 25px;
                padding: 5px;
            }
            
            .qty-btn {
                width: 35px;
                height: 35px;
                border: none;
                background: #D4AF37;
                color: white;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }
            
            .qty-btn:hover {
                background: #B8860B;
                transform: scale(1.1);
            }
            
            .qty-number {
                font-weight: bold;
                min-width: 30px;
                text-align: center;
                font-size: 1.1rem;
            }
            
            .item-subtotal {
                font-weight: bold;
                font-size: 1.1rem;
                color: #333;
                min-width: 120px;
                text-align: center;
            }
            
            .remove-item {
                background: #ff4757;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .remove-item:hover {
                background: #ff3742;
                transform: scale(1.1);
            }
            
            .cart-summary {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 15px;
                padding: 25px;
                margin: 20px 0;
                border: 2px solid #D4AF37;
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 1rem;
            }
            
            .total-row {
                border-top: 2px solid #D4AF37;
                padding-top: 15px;
                margin-top: 15px;
                font-size: 1.3rem;
                font-weight: bold;
                color: #D4AF37;
            }
            
            .free-shipping {
                color: #25D366 !important;
                font-weight: bold;
            }
            
            .shipping-notice {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 10px;
                border-radius: 8px;
                text-align: center;
                margin: 10px 0;
                font-size: 0.9rem;
            }
            
            .action-buttons {
                display: flex;
                gap: 15px;
                margin-top: 25px;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .action-btn {
                padding: 15px 25px;
                border: 2px solid #ddd;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Cairo', sans-serif;
                font-weight: 600;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 160px;
                justify-content: center;
            }
            
            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            
            .primary-btn {
                background: linear-gradient(135deg, #25D366, #20c05c);
                border-color: #25D366;
                color: white;
            }
            
            .primary-btn:hover {
                background: linear-gradient(135deg, #20c05c, #1ea952);
            }
            
            .empty-cart {
                text-align: center;
                padding: 60px 20px;
                color: #666;
            }
            
            .empty-cart-icon {
                font-size: 4rem;
                color: #ddd;
                margin-bottom: 20px;
            }
            
            .browse-products {
                background: linear-gradient(135deg, #D4AF37, #B8860B);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 8px;
                font-family: 'Cairo', sans-serif;
                font-weight: 600;
                cursor: pointer;
                margin-top: 20px;
                transition: transform 0.3s;
                display: inline-flex;
                align-items: center;
                gap: 10px;
            }
            
            .browse-products:hover {
                transform: translateY(-2px);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            /* تحسينات للهواتف */
            @media (max-width: 768px) {
                .cart-item {
                    flex-direction: column;
                    text-align: center;
                    gap: 10px;
                }
                
                .item-details {
                    order: 2;
                }
                
                .item-quantity {
                    order: 3;
                }
                
                .item-subtotal {
                    order: 4;
                    font-size: 1.2rem;
                }
                
                .remove-item {
                    order: 5;
                }
                
                .action-buttons {
                    flex-direction: column;
                }
                
                .action-btn {
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// تشغيل نظام السلة عند تحميل الصفحة
const cartSystem = new EnhancedCartSystem();

// تصدير للوظائف العامة
window.EmiratesCart = cartSystem;