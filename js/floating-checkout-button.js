/**
 * زر عائم ديناميكي لإتمام الطلب
 * يظهر عند إضافة منتج للسلة
 * Emirates Gifts Store v2.1
 */

(function() {
    'use strict';
    
    const FloatingCheckoutButton = {
        isVisible: false,
        
        /**
         * إنشاء الزر العائم
         */
        create() {
            // إذا كان موجود بالفعل، لا تنشئ نسخة جديدة
            if (document.getElementById('floating-checkout-btn')) {
                return;
            }
            
            const button = document.createElement('div');
            button.id = 'floating-checkout-btn';
            button.className = 'floating-checkout-btn hidden';
            button.innerHTML = `
                <a href="./checkout.html" class="floating-btn-content" aria-label="اذهب لإتمام الطلب">
                    <div class="floating-btn-icon">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="floating-btn-badge" id="floating-cart-count">1</span>
                    </div>
                    <div class="floating-btn-text">
                        <div class="floating-btn-title">اتمم طلبك</div>
                        <div class="floating-btn-price" id="floating-total-price">0 د.إ</div>
                    </div>
                    <div class="floating-btn-arrow">
                        <i class="fas fa-chevron-left"></i>
                    </div>
                </a>
            `;
            
            document.body.appendChild(button);
            console.log('✅ تم إنشاء الزر العائم');
        },
        
        /**
         * إظهار الزر العائم
         */
        show() {
            const button = document.getElementById('floating-checkout-btn');
            if (button) {
                button.classList.remove('hidden');
                button.classList.add('visible');
                this.isVisible = true;
                console.log('📍 الزر العائم ظاهر');
            }
        },
        
        /**
         * إخفاء الزر العائم
         */
        hide() {
            const button = document.getElementById('floating-checkout-btn');
            if (button) {
                button.classList.remove('visible');
                button.classList.add('hidden');
                this.isVisible = false;
                console.log('📍 الزر العائم مخفي');
            }
        },
        
        /**
         * تحديث معلومات الزر
         */
        update(count, total) {
            const countElement = document.getElementById('floating-cart-count');
            const priceElement = document.getElementById('floating-total-price');
            
            if (countElement) {
                countElement.textContent = count;
            }
            if (priceElement) {
                priceElement.textContent = `${total} د.إ`;
            }
        },
        
        /**
         * التحقق من حالة السلة وتحديث الزر
         */
        checkAndUpdate() {
            // جلب بيانات السلة من localStorage
            const cartKey = 'emirates_shopping_cart';
            const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            const totalKey = 'emirates_cart_total';
            const total = localStorage.getItem(totalKey) || '0';
            
            if (cart.length > 0) {
                this.show();
                this.update(cart.length, total);
            } else {
                this.hide();
            }
        },
        
        /**
         * الاستماع لأحداث تحديث السلة
         */
        listenToCartUpdates() {
            // الاستماع للحدث المخصص من نظام السلة
            window.addEventListener('cartUpdated', () => {
                console.log('🔄 السلة تحدثت - تحديث الزر العائم');
                this.checkAndUpdate();
            });
            
            // الاستماع لتغييرات localStorage
            window.addEventListener('storage', (e) => {
                if (e.key && (e.key.includes('cart') || e.key.includes('total'))) {
                    console.log('🔄 تحديث من localStorage');
                    this.checkAndUpdate();
                }
            });
        },
        
        /**
         * التهيئة الكاملة
         */
        init() {
            console.log('🚀 بدء تهيئة الزر العائم...');
            this.create();
            this.checkAndUpdate();
            this.listenToCartUpdates();
        }
    };
    
    // التهيئة عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => FloatingCheckoutButton.init(), 100);
        });
    } else {
        setTimeout(() => FloatingCheckoutButton.init(), 100);
    }
    
    // تعريض الكائن عام
    window.FloatingCheckoutButton = FloatingCheckoutButton;
})();
