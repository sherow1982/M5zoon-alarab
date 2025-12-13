/**
 * منطلق إضافة المنتج للسلة - محسّنة
 * يعمل على جميع صفحات المنتجات
 * Emirates Gifts v3.4 - Fixed undefined & navigation
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
        
        console.log('%c✅ نظام إضافة للسلة فعال', 'color: #27ae60; font-weight: bold');
    }
    
    /**
     * معالجة إضافة المنتج
     */
    handleAddToCart(event) {
        event.preventDefault();
        
        const btn = event.target.closest('.add-to-cart-btn');
        const container = btn.closest('[data-product]') || btn.closest('[data-product-id]') || btn.closest('.product-card') || btn.closest('.product-item');
        
        if (!container) {
            console.error('❌ لم أجد بيانات المنتج');
            this.showNotification('خطأ في إضافة المنتج', 'error');
            return;
        }
        
        // استخراج البيانات بشكل آمن (بدون undefined)
        const product = this.extractProductData(container);
        
        if (!product || !product.id) {
            console.error('❌ بيانات المنتج غير كاملة');
            this.showNotification('بيانات المنتج غير صحيحة', 'error');
            return;
        }
        
        // التحقق من البيانات
        if (!product.title || product.title === 'undefined' || product.title.trim() === '') {
            console.warn('⚠️ اسم المنتج غير تام');
            product.title = 'منتج';
        }
        
        if (product.price <= 0) {
            console.warn('⚠️ السعر غير محدد');
            product.price = 0;
        }
        
        console.log('%c📦 بيانات المنتج:', 'color: #3498db; font-weight: bold', product);
        
        // إضافة للسلة
        const success = this.cart.addProduct(product);
        
        if (success) {
            console.log('%c✅ تم الإضافة', 'color: #27ae60; font-weight: bold', product.title);
            this.showNotification(`تم الإضافة "‮${product.title}‭" ✅`, 'success');
            this.animateButton(btn);
            
            // الثلاثيات - الدهاب للخروج مباشرة (بلا تأخير)
            setTimeout(() => {
                console.log('%c🚀 الذهاب للخروج...', 'color: #e74c3c; font-weight: bold');
                window.location.href = './checkout.html';
            }, 500);
        } else {
            this.showNotification('فشل إضافة المنتج', 'error');
        }
    }
    
    /**
     * استخراج بيانات المنتج بآمان (بدون undefined)
     */
    extractProductData(container) {
        // البحث في data attributes
        let productId = container.dataset.productId || container.dataset.id;
        let productTitle = container.dataset.productTitle || container.dataset.title;
        let productPrice = container.dataset.productPrice || container.dataset.price;
        let productSalePrice = container.dataset.salePrice || container.dataset.productSalePrice;
        let productImage = container.dataset.productImage || container.dataset.image;
        
        // البحث في DOM elements إذا لم تكن موجودة
        if (!productTitle) {
            const titleElement = container.querySelector('h2, h3, [class*="title"], [class*="name"]');
            if (titleElement) {
                productTitle = titleElement.textContent.trim();
            }
        }
        
        if (!productPrice) {
            const priceElement = container.querySelector('[data-price], [class*="price"], .cost');
            if (priceElement) {
                const match = priceElement.textContent.match(/\d+\.?\d*/);
                if (match) productPrice = match[0];
            }
        }
        
        if (!productImage) {
            const imgElement = container.querySelector('img');
            if (imgElement) {
                productImage = imgElement.src || imgElement.dataset.src;
            }
        }
        
        // الصيغة النهايبية - بدون undefined
        return {
            id: productId || this.generateId(),
            title: productTitle && productTitle !== 'undefined' ? productTitle : 'منتج',
            price: parseFloat(productPrice) || 0,
            sale_price: parseFloat(productSalePrice) || parseFloat(productPrice) || 0,
            image_link: productImage,
            image: productImage,
            url: container.querySelector('a')?.href,
            quantity: 1
        };
    }
    
    /**
     * توليد معرف فريد
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
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.className = originalClass;
            btn.disabled = false;
        }, 1000);
    }
    
    /**
     * عرض إشعار
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
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

// أنماط الإشعارات
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