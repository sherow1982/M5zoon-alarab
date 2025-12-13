/**
 * منطق إضافة المنتج للسلة
 * يعمل على جميع صفحات المنتجات
 * Emirates Gifts v3.0
 */

class AddToCart {
    constructor() {
        this.cart = window.cartSystem;
        this.init();
    }
    
    /**
     * التهيئة
     */
    init() {
        // البحث عن أزرار "أضف للسلة"
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                this.handleAddToCart(e);
            }
        });
        
        console.log('✅ نظام إضافة للسلة فعال');
    }
    
    /**
     * معالجة إضافة المنتج
     */
    handleAddToCart(event) {
        event.preventDefault();
        
        const btn = event.target.closest('.add-to-cart-btn');
        const container = btn.closest('[data-product]') || btn.closest('[data-product-id]');
        
        if (!container) {
            console.error('❌ لم أجد بيانات المنتج');
            this.showNotification('خطأ في إضافة المنتج', 'error');
            return;
        }
        
        // استخراج بيانات المنتج
        const product = this.extractProductData(container);
        
        if (!product || !product.id) {
            console.error('❌ بيانات المنتج غير كاملة');
            this.showNotification('بيانات المنتج غير صحيحة', 'error');
            return;
        }
        
        // إضافة للسلة
        const success = this.cart.addProduct(product);
        
        if (success) {
            this.showNotification(`تم إضافة "${product.title}" للسلة`, 'success');
            this.animateButton(btn);
        } else {
            this.showNotification('فشل إضافة المنتج', 'error');
        }
    }
    
    /**
     * استخراج بيانات المنتج من الـ DOM
     */
    extractProductData(container) {
        return {
            id: container.dataset.productId || container.dataset.id || this.generateId(),
            title: container.dataset.productTitle || container.querySelector('h2, h3, .title')?.textContent?.trim(),
            price: container.dataset.productPrice || container.querySelector('[data-price]')?.textContent?.match(/\d+\.?\d*/)?.[0],
            sale_price: container.dataset.salePrice || container.dataset.productSalePrice || container.querySelector('[data-sale-price]')?.textContent?.match(/\d+\.?\d*/)?.[0],
            image_link: container.dataset.productImage || container.querySelector('img')?.src,
            image: container.dataset.productImage || container.querySelector('img')?.src
        };
    }
    
    /**
     * توليد معرّف فريد
     */
    generateId() {
        return 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * تأثير الزر
     */
    animateButton(btn) {
        const originalText = btn.innerHTML;
        const originalClass = btn.className;
        
        btn.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
        btn.classList.add('success');
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.className = originalClass;
        }, 2000);
    }
    
    /**
     * عرض إشعار
     */
    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // إضافة للصفحة
        document.body.appendChild(notification);
        
        // تأثير الظهور
        setTimeout(() => notification.classList.add('show'), 10);
        
        // الحذف التلقائي
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AddToCart();
    });
} else {
    new AddToCart();
}

// إضافة أنماط للإشعارات
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        max-width: 300px;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .notification-error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .notification-info {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 16px;
    }
    
    @media (max-width: 600px) {
        .notification {
            right: 10px;
            left: 10px;
            bottom: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);