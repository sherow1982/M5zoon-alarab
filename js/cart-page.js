/**
 * منطق صفحة السلة
 * عرض وإدارة منتجات السلة
 * Emirates Gifts v3.0
 */

class CartPage {
    constructor() {
        this.cartContainer = document.getElementById('cartContent');
        this.cart = window.cartSystem;
        
        if (!this.cartContainer) {
            console.warn('⚠️ عنصر السلة غير موجود في الصفحة');
            return;
        }
        
        this.init();
    }
    
    /**
     * التهيئة
     */
    init() {
        this.render();
        
        // الاستماع للتحديثات
        window.addEventListener('cartUpdated', () => this.render());
        
        // تنظيف السلة الفارغة بعد الإرسال
        window.addEventListener('orderSubmitted', () => this.onOrderSubmitted());
    }
    
    /**
     * عرض السلة
     */
    render() {
        const items = this.cart.getCart();
        const total = this.cart.getTotal();
        
        // السلة فارغة
        if (items.length === 0) {
            this.renderEmptyCart();
            return;
        }
        
        this.renderCart(items, total);
        this.setupEventListeners();
    }
    
    /**
     * عرض السلة الفارغة
     */
    renderEmptyCart() {
        this.cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h2>سلة التسوق فارغة</h2>
                <p>لم تقم بإضافة أي منتجات بعد</p>
                <div class="empty-actions">
                    <a href="./products-showcase.html" class="btn-primary">
                        <i class="fas fa-shopping-bag"></i> استكشف المنتجات
                    </a>
                    <a href="./" class="btn-secondary">
                        <i class="fas fa-home"></i> العودة للرئيسية
                    </a>
                </div>
            </div>
        `;
    }
    
    /**
     * عرض السلة مع المنتجات
     */
    renderCart(items, total) {
        let totalItems = 0;
        
        const itemsHTML = items.map(item => {
            const quantity = parseInt(item.quantity) || 1;
            totalItems += quantity;
            const itemTotal = (item.sale_price || item.price) * quantity;
            
            return `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image_link}" 
                             alt="${item.title}"
                             onerror="this.src='https://via.placeholder.com/100/D4AF37/FFFFFF?text=منتج'">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.title}</h3>
                        <p class="item-price">${(item.sale_price || item.price).toFixed(2)} د.إ</p>
                        <div class="quantity-control">
                            <button class="qty-btn decrease" data-product-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="qty-input" 
                                   value="${quantity}" 
                                   min="1" 
                                   data-product-id="${item.id}">
                            <button class="qty-btn increase" data-product-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="remove-btn" data-product-id="${item.id}">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        ${itemTotal.toFixed(2)} د.إ
                    </div>
                </div>
            `;
        }).join('');
        
        this.cartContainer.innerHTML = `
            <div class="cart-layout">
                <div class="cart-items-section">
                    <h2>منتجاتك (${totalItems})</h2>
                    <div class="cart-items-list">
                        ${itemsHTML}
                    </div>
                </div>
                
                <div class="cart-summary">
                    <h3>ملخص الطلب</h3>
                    <div class="summary-row">
                        <span>عدد المنتجات:</span>
                        <strong>${totalItems} قطعة</strong>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row">
                        <span>الإجمالي الجزئي:</span>
                        <strong>${total.toFixed(2)} د.إ</strong>
                    </div>
                    <div class="summary-row">
                        <span>الشحن:</span>
                        <strong class="free">مجاني ✓</strong>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row total">
                        <span>الإجمالي النهائي:</span>
                        <strong>${total.toFixed(2)} د.إ</strong>
                    </div>
                    
                    <div class="summary-actions">
                        <a href="./checkout.html" class="btn-checkout">
                            <i class="fas fa-credit-card"></i> إتمام الطلب
                        </a>
                        <a href="./products-showcase.html" class="btn-continue">
                            <i class="fas fa-plus"></i> إضافة منتجات
                        </a>
                        <button class="btn-clear">
                            <i class="fas fa-trash-alt"></i> إفراغ السلة
                        </button>
                    </div>
                    
                    <div class="shipping-info">
                        <div><i class="fas fa-truck"></i> توصيل 1-3 أيام</div>
                        <div><i class="fas fa-undo"></i> إرجاع 14 يوم مجاني</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * ربط أحداث الأزرار
     */
    setupEventListeners() {
        // زيادة الكمية
        document.querySelectorAll('.qty-btn.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.dataset.productId;
                const input = document.querySelector(`[data-product-id="${productId}"].qty-input`);
                const newQty = parseInt(input.value) + 1;
                this.cart.updateQuantity(productId, newQty);
            });
        });
        
        // تقليل الكمية
        document.querySelectorAll('.qty-btn.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                const input = document.querySelector(`[data-product-id="${productId}"].qty-input`);
                const newQty = Math.max(1, parseInt(input.value) - 1);
                this.cart.updateQuantity(productId, newQty);
            });
        });
        
        // تحديث من الـ input
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', () => {
                const productId = input.dataset.productId;
                const newQty = Math.max(1, parseInt(input.value) || 1);
                this.cart.updateQuantity(productId, newQty);
            });
        });
        
        // حذف المنتج
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                if (confirm('هل تريد حذف هذا المنتج؟')) {
                    this.cart.removeProduct(productId);
                }
            });
        });
        
        // إفراغ السلة
        document.querySelector('.btn-clear')?.addEventListener('click', () => {
            if (confirm('هل تريد إفراغ السلة بالكامل؟')) {
                this.cart.clearCart();
            }
        });
    }
    
    /**
     * عند إرسال الطلب بنجاح
     */
    onOrderSubmitted() {
        this.cart.clearCart();
        this.render();
    }
}

// التهيئة عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CartPage();
    });
} else {
    new CartPage();
}