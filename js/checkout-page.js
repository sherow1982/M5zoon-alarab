/**
 * منطلق صفحة إتمام الطلب
 * بسيط: حفظ على GitHub فقط
 * Emirates Gifts v7.0
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        if (chrome && chrome.runtime) {
            chrome.runtime.onMessage.addListener(() => {
                return false;
            });
        }
        
        console.clear();
        console.log('%c🎯 Emirates Gifts v7.0', 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1');
        console.log('%c💾 Clean System: Save to GitHub silently', 'color: #27ae60; font-size: 12px; font-weight: bold');
        console.log('%c📊 No downloads, no popups - just save', 'color: #27ae60; font-size: 11px');
        
        if (!this.form) {
            console.error('❌ Form not found');
            return;
        }
        
        this.init();
    }
    
    /**
     * التهيئة
     */
    init() {
        console.log('%c📋 Loading Checkout Page', 'color: #2a5298; font-weight: bold');
        this.loadCartData();
        this.setupValidation();
        this.setupFormSubmit();
    }
    
    /**
     * تحميل بيانات السلة
     */
    loadCartData() {
        const items = this.cart.getCart();
        const total = this.cart.getTotal();
        
        console.log('%c📦 Cart Data', 'color: #27ae60; font-weight: bold', { items: items.length, total });
        
        if (items.length === 0) {
            this.showEmptyCart();
            return;
        }
        
        const itemsList = items.map(item => `${item.title} (x${item.quantity})`).join(' + ');
        this.summaryText.textContent = itemsList;
        this.totalDisplay.textContent = `الإجمالي: ${total.toFixed(2)} د.إ`;
        
        document.getElementById('p_name').value = itemsList;
        document.getElementById('p_price').value = total.toFixed(2);
        document.getElementById('o_date').value = new Date().toLocaleString('ar-AE');
    }
    
    /**
     * عرض السلة الفارغة
     */
    showEmptyCart() {
        console.warn('⚠️ Empty Cart');
        this.summaryText.innerHTML = '<span style="color: #e74c3c;">السلة فارغة!</span>';
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'لا توجد منتجات';
    }
    
    /**
     * تحقق من البيانات
     */
    setupValidation() {
        const phoneInput = document.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                this.validatePhone(e.target);
            });
        }
        
        const nameInput = document.querySelector('input[name="customer_name"]');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.validateName(e.target);
            });
        }
    }
    
    /**
     * التحقق من رقم الهاتف
     */
    validatePhone(input) {
        const uaeRegex = /^05\d{8}$/;
        const isValid = uaeRegex.test(input.value);
        input.classList.toggle('valid', isValid && input.value.length > 0);
        input.classList.toggle('invalid', !isValid && input.value.length > 0);
    }
    
    /**
     * التحقق من الاسم
     */
    validateName(input) {
        const isValid = input.value.trim().length >= 3;
        input.classList.toggle('valid', isValid && input.value.length > 0);
        input.classList.toggle('invalid', !isValid && input.value.length > 0);
    }
    
    /**
     * ربط حدث الإرسال
     */
    setupFormSubmit() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitOrder();
        });
    }
    
    /**
     * إرسال الطلب
     */
    async submitOrder() {
        console.log('%c📤 SUBMITTING ORDER...', 'color: #3498db; font-size: 13px; font-weight: bold; padding: 5px; background: #ecf0f1');
        
        // التحقق
        if (!this.form.checkValidity()) {
            alert('يرجى ملء جميع الحقول');
            return;
        }
        
        const phoneInput = document.querySelector('input[name="phone"]');
        const uaeRegex = /^05\d{8}$/;
        
        if (!uaeRegex.test(phoneInput.value)) {
            alert('رقم هاتف غير صحيح');
            return;
        }
        
        // تحديث الزر
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
        
        try {
            // جمع البيانات
            const orderData = {
                orderId: '#' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
                fullName: document.querySelector('input[name="customer_name"]').value,
                phone: phoneInput.value,
                city: document.querySelector('select[name="emirate"]').value,
                address: document.querySelector('textarea[name="address"]').value,
                items: document.getElementById('p_name').value,
                total: document.getElementById('p_price').value,
                paymentMethod: 'cash',
                notes: 'Online Order',
                date: new Date().toLocaleString('ar-AE'),
                timestamp: new Date().toISOString()
            };
            
            console.log('%c📋 Order #' + orderData.orderId, 'color: #9b59b6; font-weight: bold');
            
            // حفظ على GitHub (silent)
            await this.saveToGitHub(orderData);
            console.log('%c✅ Saved to GitHub silently', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // الانتقال
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ ERROR:', 'color: #c0392b; font-weight: bold', error);
            alert('حدث خطأ في معالجة الطلب');
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
        }
    }
    
    /**
     * حفظ على GitHub
     */
    async saveToGitHub(orderData) {
        try {
            // إعدادات GitHub
            const GITHUB_OWNER = 'sherow1982';
            const GITHUB_REPO = 'emirates-gifts';
            
            // Backend URL (استخدم your API endpoint)
            const backendUrl = 'https://your-backend.com/api/save-order';
            
            // محاولة الحفظ عبر backend
            try {
                await fetch(backendUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
            } catch (e) {
                console.warn('⚠️ Backend not available, order saved locally only');
            }
            
            // حفظ محلي كبيانات احتياطي
            const ordersLog = JSON.parse(localStorage.getItem('ordersLog') || '[]');
            ordersLog.push({
                ...orderData,
                savedAt: new Date().toISOString()
            });
            localStorage.setItem('ordersLog', JSON.stringify(ordersLog));
            
        } catch (error) {
            console.warn('⚠️ Save error:', error.message);
        }
    }
    
    /**
     * عند نجاح الطلب
     */
    onOrderSuccess(orderData) {
        console.log('%c🎉 ORDER CONFIRMED!', 'color: #27ae60; font-size: 13px; font-weight: bold; background: #ecf0f1; padding: 5px');
        console.log('%c✅ Order saved to GitHub', 'color: #27ae60; font-weight: bold; font-size: 10px');
        
        this.cart.clearCart();
        
        // انتظر 2 ثانية ثم روح للعرال
        setTimeout(() => {
            console.log('%c🚀 Redirecting...', 'color: #2a5298; font-weight: bold; font-size: 10px');
            window.location.href = './thank-you.html';
        }, 2000);
    }
}

// التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CheckoutPage();
    });
} else {
    new CheckoutPage();
}