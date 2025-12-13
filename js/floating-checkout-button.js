/**
 * زر عائم ديناميكي لإتمام الطلب
 * يظهر عند إضافة منتج للسلة
 * Emirates Gifts Store v2.2
 */

(function() {
    'use strict';
    
    // مفاتيح localStorage المحتملة
    const CART_KEYS = ['emirates_shopping_cart', 'emirates_cart', 'cart'];
    const TOTAL_KEYS = ['emirates_cart_total', 'totalPrice', 'total'];
    
    const FloatingCheckoutButton = {
        isVisible: false,
        
        /**
         * جلب بيانات السلة من localStorage
         */
        getCart() {
            try {
                for (const key of CART_KEYS) {
                    const data = localStorage.getItem(key);
                    if (data) {
                        console.log(`📍 تم العثور على السلة بمفتاح: ${key}`);
                        return JSON.parse(data);
                    }
                }
                return [];
            } catch (e) {
                console.error('❌ خطأ في قراءة السلة:', e);
                return [];
            }
        },
        
        /**
         * جلب الإجمالي من localStorage
         */
        getTotal() {
            try {
                for (const key of TOTAL_KEYS) {
                    const data = localStorage.getItem(key);
                    if (data) {
                        console.log(`📍 الإجمالي: ${data} (مفتاح: ${key})`);
                        return data;
                    }
                }
                return '0';
            } catch (e) {
                return '0';
            }
        },
        
        /**
         * إنشاء الزر العائم
         */
        create() {
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
                console.log('✅ الزر العائم ظاهر');
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
                console.log('❌ الزر العائم مخفي');
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
            console.log(`📍 تم تحديث الزر: ${count} عناصر - ${total} د.إ`);
        },
        
        /**
         * التحقق من حالة السلة
         */
        checkAndUpdate() {
            const cart = this.getCart();
            const total = this.getTotal();
            
            console.log('🔄 فحص السلة:', { عدد: cart.length, إجمالي: total });
            
            if (cart && Array.isArray(cart) && cart.length > 0) {
                const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
                this.show();
                this.update(totalItems, total);
                console.log('✅ الزر قيد العرض');
            } else {
                this.hide();
                console.log('❌ السلة فارغة');
            }
        },
        
        /**
         * الاستماع لأحداث تحديث السلة
         */
        listenToCartUpdates() {
            // الاستماع للحدث المخصص
            window.addEventListener('cartUpdated', () => {
                console.log('🔄 حدث cartUpdated');
                this.checkAndUpdate();
            });
            
            // الاستماع لتغييرات storage
            window.addEventListener('storage', (e) => {
                if (e.key && (e.key.includes('cart') || e.key.includes('total'))) {
                    console.log(`🔄 storage تغير: ${e.key}`);
                    setTimeout(() => this.checkAndUpdate(), 50);
                }
            });
            
            // فحص دوري: كل 300ms 
            setInterval(() => this.checkAndUpdate(), 300);
        },
        
        /**
         * التهيئة الكاملة
         */
        init() {
            console.log('🚀 بدء الزر العائم...');
            try {
                this.create();
                this.checkAndUpdate();
                this.listenToCartUpdates();
                console.log('✅ الزر العائم راهي للتربب');
            } catch (error) {
                console.error('❌ خطأ في الذر:', error);
            }
        }
    };
    
    // التهيئة عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => FloatingCheckoutButton.init(), 150);
        });
    } else {
        setTimeout(() => FloatingCheckoutButton.init(), 150);
    }
    
    // تعريض عام
    window.FloatingCheckoutButton = FloatingCheckoutButton;
})();
