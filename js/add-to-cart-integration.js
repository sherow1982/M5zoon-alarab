/**
 * نظام إضافة المنتجات للسلة - تكامل عام
 * متجر هدايا الإمارات
 * v2.0 - 2025
 * 
 * هذا الملف يوفر وظائف موحدة لإضافة المنتجات للسلة
 * من أي صفحة في الموقع (الرئيسية، المنتجات، الصفحات الفردية)
 */

'use strict';

const STORAGE_CONFIG = {
    CART_KEY: 'emirates_shopping_cart',
    TOTAL_KEY: 'emirates_cart_total',
    MAX_QUANTITY: 50
};

/**
 * نظام إدارة السلة الموحد
 */
const UnifiedCartManager = {
    getCart: function() {
        try {
            const cartData = localStorage.getItem(STORAGE_CONFIG.CART_KEY) ||
                           localStorage.getItem('emirates_cart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (e) {
            console.error('❌ خطأ في تحميل السلة:', e);
            return [];
        }
    },
    
    saveCart: function(cart) {
        try {
            localStorage.setItem(STORAGE_CONFIG.CART_KEY, JSON.stringify(cart));
            localStorage.setItem('emirates_cart', JSON.stringify(cart));
            return true;
        } catch (e) {
            console.error('❌ خطأ في حفظ السلة:', e);
            return false;
        }
    },
    
    addProduct: function(productData) {
        try {
            if (!productData || !productData.id) {
                return { success: false, message: 'بيانات المنتج غير صحيحة' };
            }
            
            const cart = this.getCart();
            const existingIndex = cart.findIndex(item => String(item.id) === String(productData.id));
            
            if (existingIndex !== -1) {
                const newQty = (cart[existingIndex].quantity || 1) + 1;
                if (newQty > STORAGE_CONFIG.MAX_QUANTITY) {
                    return { success: false, message: `الحد الأقصى للكمية هو ${STORAGE_CONFIG.MAX_QUANTITY}` };
                }
                cart[existingIndex].quantity = newQty;
                console.log(`📝 تم تحديث الكمية: ${productData.title} = ${newQty}`);
            } else {
                const newProduct = {
                    id: productData.id,
                    title: productData.title || productData.name || 'منتج',
                    price: parseFloat(productData.price || 0),
                    sale_price: parseFloat(productData.sale_price || productData.price || 0),
                    image_link: productData.image_link || productData.image || '',
                    quantity: 1,
                    type: productData.type || 'PRODUCT',
                    category: productData.category || 'عام'
                };
                cart.push(newProduct);
                console.log(`✅ تمت إضافة منتج جديد: ${newProduct.title}`);
            }
            
            if (!this.saveCart(cart)) {
                return { success: false, message: 'فشل في حفظ المنتج' };
            }
            
            this.updateTotal();
            this.updateAllBadges();
            
            return { success: true, message: `تمت إضافة "${productData.title}" للسلة`, cart: cart };
        } catch (error) {
            console.error('❌ خطأ في إضافة المنتج:', error);
            return { success: false, message: 'حدث خطأ غير متوقع' };
        }
    },
    
    updateTotal: function() {
        try {
            const cart = this.getCart();
            const total = cart.reduce((sum, item) => {
                const price = item.sale_price || item.price || 0;
                const qty = item.quantity || 1;
                return sum + (parseFloat(price) * qty);
            }, 0);
            
            localStorage.setItem(STORAGE_CONFIG.TOTAL_KEY, total.toFixed(2));
            localStorage.setItem('totalPrice', total.toFixed(2));
            return total.toFixed(2);
        } catch (e) {
            return '0.00';
        }
    },
    
    getTotalItems: function() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },
    
    updateAllBadges: function() {
        const totalItems = this.getTotalItems();
        const selectors = [
            '.cart-counter', '.cart-badge', '#cart-counter', '#cartBadge',
            '.header-cart-count', '.mobile-cart-counter', '[data-cart-count]'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.textContent = totalItems;
                element.style.display = totalItems > 0 ? 'inline-flex' : 'none';
            });
        });
    }
};

/**
 * نظام الإشعارات
 */
const NotificationManager = {
    show: function(type, message, duration = 4000) {
        const oldNotifications = document.querySelectorAll('[data-notification]');
        oldNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.setAttribute('data-notification', type);
        notification.setAttribute('role', 'status');
        
        const bgColor = type === 'success' 
            ? 'linear-gradient(135deg, #25D366, #20B358)' 
            : 'linear-gradient(135deg, #e74c3c, #c0392b)';
        const icon = type === 'success' ? '✅' : '⚠️';
        
        notification.style.cssText = `
            position: fixed; bottom: 30px; left: 30px;
            background: ${bgColor}; color: white; padding: 18px 25px;
            border-radius: 12px; font-weight: 700; font-size: 1rem;
            z-index: 9999; max-width: 380px; box-shadow: 0 8px 25px rgba(0,0,0,0.25);
            font-family: 'Cairo', sans-serif; animation: slideInUp 0.4s ease-out;
            display: flex; align-items: center; gap: 12px;
        `;
        
        notification.innerHTML = `<span style="font-size: 1.5rem;">${icon}</span><span>${message}</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutDown 0.4s ease-in forwards';
                setTimeout(() => notification.remove(), 400);
            }
        }, duration);
    },
    
    success: function(productTitle) {
        this.show('success', `✅ تمت إضافة "${productTitle}" للسلة بنجاح!`);
    },
    
    error: function(message) {
        this.show('error', `⚠️ ${message}`);
    }
};

/**
 * معالج النقر على أزرار إضافة للسلة
 */
function handleAddToCart(button, productData = null) {
    if (!button) return;
    
    const originalHTML = button.innerHTML;
    const originalDisabled = button.disabled;
    const originalBg = button.style.backgroundColor;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارِ الإضافة...';
    button.style.backgroundColor = '#95a5a6';
    
    setTimeout(() => {
        if (!productData) {
            productData = extractProductDataFromButton(button);
        }
        
        if (!productData) {
            NotificationManager.error('لم يتم العثور على بيانات المنتج');
            restoreButton(button, originalHTML, originalDisabled, originalBg);
            return;
        }
        
        const result = UnifiedCartManager.addProduct(productData);
        
        if (result.success) {
            button.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة!';
            button.style.backgroundColor = '#25D366';
            NotificationManager.success(productData.title);
            setTimeout(() => restoreButton(button, originalHTML, originalDisabled, originalBg), 2500);
        } else {
            NotificationManager.error(result.message);
            restoreButton(button, originalHTML, originalDisabled, originalBg);
        }
    }, 600);
}

/**
 * استخراج بيانات المنتج من الزر
 */
function extractProductDataFromButton(button) {
    try {
        const productId = button.getAttribute('data-product-id') || button.getAttribute('data-id');
        if (!productId) return null;
        
        return {
            id: productId,
            title: button.getAttribute('data-title') || 'منتج',
            price: parseFloat(button.getAttribute('data-price') || '0'),
            sale_price: parseFloat(button.getAttribute('data-sale-price') || button.getAttribute('data-price') || '0'),
            image_link: button.getAttribute('data-image') || '',
            category: button.getAttribute('data-category') || 'عام',
            type: button.getAttribute('data-type') || 'PRODUCT'
        };
    } catch (e) {
        return null;
    }
}

/**
 * استرجاع حالة الزر الأصلية
 */
function restoreButton(button, originalHTML, originalDisabled, originalBg) {
    button.innerHTML = originalHTML;
    button.disabled = originalDisabled;
    button.style.backgroundColor = originalBg;
}

/**
 * إضافة أنماط CSS
 */
function addCartStyles() {
    if (document.getElementById('unified-cart-styles')) return;
    const style = document.createElement('style');
    style.id = 'unified-cart-styles';
    style.textContent = `
        @keyframes slideInUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideOutDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } }
        .add-to-cart-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .add-to-cart-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    `;
    document.head.appendChild(style);
}

/**
 * تهيئة النظام
 */
function initializeCartSystem() {
    console.log('🛒 تهيئة نظام السلة الموحد...');
    try {
        addCartStyles();
        UnifiedCartManager.updateAllBadges();
        
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.add-to-cart-btn, .btn-add-to-cart, [data-action="add-to-cart"]');
            if (btn && !btn.disabled) {
                e.preventDefault();
                handleAddToCart(btn);
            }
        }, true);
        
        console.log('✅ نظام السلة جاهز!');
    } catch (error) {
        console.error('❌ خطأ في التهيئة:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCartSystem);
} else {
    initializeCartSystem();
}

window.UnifiedCartManager = UnifiedCartManager;
window.handleAddToCart = handleAddToCart;
