// نظام السلة المحسّن - متجر هدايا الإمارات

// دالة تحديث عداد السلة
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('emirates-cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const counters = document.querySelectorAll('.cart-counter, #cart-count, .cart-badge');
    counters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
        
        if (totalItems > 0) {
            counter.classList.add('has-items');
        } else {
            counter.classList.remove('has-items');
        }
    });
}

// دالة إضافة منتج للسلة مع التوجه التلقائي
function addToCart(productData, ratingData) {
    let cart = JSON.parse(localStorage.getItem('emirates-cart')) || [];
    
    const existingIndex = cart.findIndex(item => item.id === productData.id);
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            ...productData,
            quantity: 1,
            rating: ratingData,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('emirates-cart', JSON.stringify(cart));
    updateCartCounter();
    showCartNotification(productData.title);
    
    // التوجه لصفحة السلة بعد ثانيتين
    setTimeout(() => {
        window.location.href = './cart.html';
    }, 2000);
}

// دالة إظهار رسالة التأكيد
function showCartNotification(productTitle) {
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="success-icon">✅</div>
            <div class="notification-text">
                <strong>تم الإضافة بنجاح!</strong>
                <p>"${productTitle}" أضيف إلى سلة التسوق</p>
                <small>🔄 جاري التحويل للسلة...</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 2500);
}

// دالة إضافة مستمعي أزرار السلة
function addCartButtonListeners() {
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalHTML = this.innerHTML;
            this.innerHTML = '<span>⏳</span> جاري الإضافة...';
            this.disabled = true;
            this.style.background = '#95a5a6';
            
            const productData = JSON.parse(this.getAttribute('data-product'));
            const ratingData = JSON.parse(this.getAttribute('data-rating') || '{}');
            
            setTimeout(() => {
                addToCart(productData, ratingData);
            }, 800);
        });
    });
}

// CSS لنظام السلة والإشعارات
function addCartSystemCSS() {
    if (!document.querySelector('#cart-system-css')) {
        const css = `
            <style id="cart-system-css">
            .cart-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(39, 174, 96, 0.3);
                z-index: 10000;
                animation: slideInNotification 0.5s ease-out;
                max-width: 350px;
            }
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 15px;
            }
            .success-icon {
                font-size: 24px;
                margin-top: 2px;
            }
            .notification-text strong {
                font-size: 16px;
                display: block;
                margin-bottom: 5px;
            }
            .notification-text p {
                margin: 0 0 8px 0;
                font-size: 14px;
                opacity: 0.9;
            }
            .notification-text small {
                font-size: 12px;
                opacity: 0.8;
            }
            .cart-counter, .cart-badge {
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                padding: 4px 8px;
                font-size: 12px;
                font-weight: bold;
                min-width: 20px;
                text-align: center;
                position: absolute;
                top: -8px;
                right: -8px;
            }
            .cart-counter.has-items, .cart-badge.has-items {
                animation: pulseCart 2s infinite;
            }
            .btn-add-to-cart {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                min-height: 44px;
            }
            .btn-add-to-cart:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            }
            .btn-add-to-cart:disabled {
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            @keyframes slideInNotification {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes pulseCart {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            @media (max-width: 768px) {
                .cart-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', css);
    }
}

// تشغيل نظام السلة
document.addEventListener('DOMContentLoaded', () => {
    addCartSystemCSS();
    updateCartCounter();
    
    setTimeout(() => {
        addCartButtonListeners();
    }, 1000);
});

window.CartSystem = {
    addToCart,
    updateCartCounter,
    showCartNotification,
    addCartButtonListeners
};