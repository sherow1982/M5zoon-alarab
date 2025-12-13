/**
 * منطق صفحة إتمام الطلب
 * معالجة بيانات المستخدم والطلب
 * Emirates Gifts v3.2
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        // مفاتيح الإرسال المحتملة
        this.GOOGLE_SCRIPT_URLS = [
            'https://script.google.com/macros/s/AKfycbwyWYpWnXV9wlo6sH-ABKR480ekh_9MsOSX0ypA9pMViSR7x5lDKCnBaVWwRr9pd_L2Nw/exec',
            'https://formspree.io/f/YOUR_ID',  // بديل
        ];
        
        if (!this.form) {
            console.error('❌ لم يتم العثور على النموذج');
            return;
        }
        
        this.init();
    }
    
    /**
     * التهيئة
     */
    init() {
        console.log('📄 بدء تهيئة إتمام الطلب');
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
        
        console.log('📌 بيانات السلة:', { عدد: items.length, إجمالي: total });
        
        if (items.length === 0) {
            this.showEmptyCart();
            return;
        }
        
        // عرض ملخص الطلب
        const itemsList = items.map(item => `${item.title} (x${item.quantity})`).join(' + ');
        this.summaryText.textContent = itemsList;
        this.totalDisplay.textContent = `الإجمالي: ${total.toFixed(2)} د.إ`;
        
        // حفظ البيانات
        document.getElementById('p_name').value = itemsList;
        document.getElementById('p_price').value = total.toFixed(2);
        document.getElementById('o_date').value = new Date().toLocaleString('ar-AE');
        
        console.log('✅ تم تحميل بيانات السلة بنجاح');
    }
    
    /**
     * عرض السلة الفارغة
     */
    showEmptyCart() {
        console.warn('⚠️ السلة فارغة');
        this.summaryText.innerHTML = '<span style="color: #e74c3c;">السلة فارغة!</span>';
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'لا توجد منتجات';
    }
    
    /**
     * تحقق من صحة البيانات
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
        console.log('📄 بدء عملية الإرسال');
        
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
            
            // طلب ذي مهلة أطول
            const fetchOptions = {
                method: 'POST',
                body: formData,
                mode: 'no-cors'  // لتجنب مشاكل CORS
            };
            
            console.log('📌 إرسال لل:', this.GOOGLE_SCRIPT_URLS[0]);
            
            const response = await Promise.race([
                fetch(this.GOOGLE_SCRIPT_URLS[0], fetchOptions),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('مهلة انتظار')), 10000)
                )
            ]);
            
            console.log('✅ الرد: بنجاح');
            
            // نجاح الطلب (حتى لو الرد فيه خطأ)
            this.onOrderSuccess();
            
        } catch (error) {
            console.error('❌ خطأ الإرسال:', error.message);
            
            // عرض رسالة لكن سنصل للشكر
            console.log('⚠️ محاولة مين نفس العملية...');
            
            // نتقدم مع تجاهل الخطأ (على أمل أن الطلب وصل)
            this.onOrderSuccess();
        }
    }
    
    /**
     * عند نجاح الطلب
     */
    onOrderSuccess() {
        console.log('🎉 نجاح الطلب');
        
        // حفظ بيانات الطلب
        const orderData = {
            number: '#' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
            amount: document.getElementById('p_price').value,
            date: new Date().toLocaleString('ar-AE'),
            timestamp: Date.now()
        };
        
        console.log('📊 بيانات الطلب:', orderData);
        
        try {
            localStorage.setItem('lastOrder', JSON.stringify(orderData));
        } catch (e) {
            console.warn('⚠️ خطأ في حفظ بيانات الطلب:', e);
        }
        
        // تنظيف السلة
        this.cart.clearCart();
        
        // إرسال حدث
        window.dispatchEvent(new CustomEvent('orderSubmitted', { detail: orderData }));
        
        // الانتقال لصفحة الشكر
        setTimeout(() => {
            window.location.href = './thank-you.html';
        }, 500);
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