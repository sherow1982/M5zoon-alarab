/**
 * منطق صفحة إتمام الطلب
 * معالجة بيانات المستخدم والطلب
 * Emirates Gifts v3.0
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        this.GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyWYpWnXV9wlo6sH-ABKR480ekh_9MsOSX0ypA9pMViSR7x5lDKCnBaVWwRr9pd_L2Nw/exec';
        
        if (!this.form) return;
        
        this.init();
    }
    
    /**
     * التهيئة
     */
    init() {
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
        
        if (items.length === 0) {
            this.showEmptyCart();
            return;
        }
        
        // عرض ملخص الطلب
        const itemsList = items.map(item => `${item.title} (x${item.quantity})`).join(' + ');
        this.summaryText.textContent = itemsList;
        this.totalDisplay.textContent = `الإجمالي: ${total.toFixed(2)} د.إ`;
        
        // حفظ البيانات في حقول مخفية
        document.getElementById('p_name').value = itemsList;
        document.getElementById('p_price').value = total.toFixed(2);
        document.getElementById('o_date').value = new Date().toLocaleString('ar-AE');
    }
    
    /**
     * عرض السلة الفارغة
     */
    showEmptyCart() {
        this.summaryText.innerHTML = '<span style="color: #e74c3c;">السلة فارغة!</span>';
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'لا توجد منتجات';
    }
    
    /**
     * تحقق من صحة البيانات
     */
    setupValidation() {
        // التحقق من رقم الهاتف
        const phoneInput = document.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                this.validatePhone(e.target);
            });
        }
        
        // التحقق من الاسم
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
        
        const error = input.nextElementSibling;
        if (error?.classList.contains('error-msg')) {
            error.style.display = !isValid && input.value.length > 0 ? 'block' : 'none';
        }
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
     * ربط حدث إرسال النموذج
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
        // التحقق النهائي
        if (!this.form.checkValidity()) {
            alert('يرجى ملء جميع الحقول بشكل صحيح');
            return;
        }
        
        const phoneInput = document.querySelector('input[name="phone"]');
        const uaeRegex = /^05\d{8}$/;
        
        if (!uaeRegex.test(phoneInput.value)) {
            alert('يرجى إدخال رقم هاتف إماراتي صحيح (05xxxxxxxx)');
            return;
        }
        
        // تحديث الزر
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري معالجة الطلب...';
        
        try {
            const formData = new FormData(this.form);
            
            const response = await fetch(this.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('فشل الاتصال');
            }
            
            // نجاح الطلب
            this.onOrderSuccess();
        } catch (error) {
            console.error('❌ خطأ الإرسال:', error);
            alert('حدث خطأ في معالجة الطلب. يرجى المحاولة مرة أخرى.');
            
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
        }
    }
    
    /**
     * عند نجاح الطلب
     */
    onOrderSuccess() {
        // حفظ بيانات الطلب
        const orderData = {
            number: '#' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
            amount: document.getElementById('p_price').value,
            date: new Date().toLocaleString('ar-AE'),
            timestamp: Date.now()
        };
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // تنظيف السلة
        this.cart.clearCart();
        
        // إرسال حدث
        window.dispatchEvent(new CustomEvent('orderSubmitted', { detail: orderData }));
        
        // الانتقال لصفحة الشكر
        window.location.href = './thank-you.html';
    }
}

// التهيئة عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CheckoutPage();
    });
} else {
    new CheckoutPage();
}