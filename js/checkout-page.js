/**
 * منطق صفحة إتمام الطلب
 * معالجة بيانات المستخدم والطلب
 * Emirates Gifts v3.4
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        // URL Google Sheets
        this.GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyWYpWnXV9wlo6sH-ABKR480ekh_9MsOSX0ypA9pMViSR7x5lDKCnBaVWwRr9pd_L2Nw/exec';
        
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
        console.log('%c📋 بدء تهيئة إتمام الطلب', 'color: #2a5298; font-size: 13px; font-weight: bold');
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
        
        console.log('%c📦 بيانات السلة المحملة', 'color: #27ae60; font-weight: bold', { عدد: items.length, إجمالي: total });
        
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
        
        console.log('%c✅ تم تحميل بيانات السلة بنجاح', 'color: #27ae60; font-size: 12px');
    }
    
    /**
     * عرض السلة الفارغة
     */
    showEmptyCart() {
        console.warn('%c⚠️ السلة فارغة', 'color: #e74c3c; font-weight: bold');
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
        console.log('%c📤 بدء إرسال الطلب...', 'color: #3498db; font-size: 14px; font-weight: bold');
        
        // التحقق النهائي
        if (!this.form.checkValidity()) {
            console.warn('%c⚠️ النموذج غير صحيح', 'color: #f39c12; font-weight: bold');
            alert('يرجى ملء جميع الحقول بشكل صحيح');
            return;
        }
        
        const phoneInput = document.querySelector('input[name="phone"]');
        const uaeRegex = /^05\d{8}$/;
        
        if (!uaeRegex.test(phoneInput.value)) {
            console.warn('%c⚠️ رقم الهاتف غير صحيح', 'color: #f39c12; font-weight: bold', phoneInput.value);
            alert('يرجى إدخال رقم هاتف إماراتي صحيح (05xxxxxxxx)');
            return;
        }
        
        // تحديث الزر
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري معالجة الطلب...';
        
        try {
            const formData = new FormData(this.form);
            
            // جمع البيانات
            const orderData = {
                customer_name: document.querySelector('input[name="customer_name"]').value,
                phone: phoneInput.value,
                emirate: document.querySelector('select[name="emirate"]').value,
                address: document.querySelector('textarea[name="address"]').value,
                product_name: document.getElementById('p_name').value,
                total_price: document.getElementById('p_price').value,
                order_date: new Date().toLocaleString('ar-AE'),
                timestamp: new Date().toISOString()
            };
            
            console.log('%c📋 بيانات الطلب الكاملة:', 'color: #9b59b6; font-weight: bold', orderData);
            
            // حفظ البيانات في localStorage أولاً (backup)
            this.backupOrderData(orderData);
            
            // محاولة الإرسال لـ Google Sheets (بدون انتظار)
            this.sendToGoogleSheets(formData)
                .then(response => {
                    console.log('%c✅ نجح الإرسال إلى Google Sheets!', 'color: #27ae60; font-weight: bold; font-size: 13px');
                })
                .catch(error => {
                    console.error('%c⚠️ فشل الإرسال إلى Google Sheets (لكن البيانات محفوظة في localStorage)', 'color: #e74c3c; font-weight: bold; font-size: 13px', error);
                })
                .finally(() => {
                    // الانتقال على أي حال
                    console.log('%c🚀 الانتقال لصفحة الشكر...', 'color: #2a5298; font-weight: bold; font-size: 13px');
                    this.onOrderSuccess();
                });
            
        } catch (error) {
            console.error('%c❌ خطأ تقني عام:', 'color: #c0392b; font-weight: bold; font-size: 13px', error);
            alert('عذراً حدث خطأ. يرجى المحاولة لاحقاً.');
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
        }
    }
    
    /**
     * حفظ بيانات الطلب في localStorage
     */
    backupOrderData(orderData) {
        try {
            // حفظ تفاصيل الطلب الكاملة
            localStorage.setItem('lastOrderDetails', JSON.stringify(orderData));
            
            // إضافة إلى سجل الطلبات
            const ordersLog = JSON.parse(localStorage.getItem('ordersLog') || '[]');
            ordersLog.push({
                ...orderData,
                backup_timestamp: new Date().toISOString()
            });
            localStorage.setItem('ordersLog', JSON.stringify(ordersLog));
            
            console.log('%c💾 تم حفظ البيانات في localStorage (backup)', 'color: #f39c12; font-weight: bold; font-size: 12px');
            console.log('%c📊 إجمالي الطلبات المحفوظة:', 'color: #f39c12', ordersLog.length);
        } catch (error) {
            console.error('%c⚠️ خطأ في حفظ البيانات:', 'color: #e74c3c', error);
        }
    }
    
    /**
     * إرسال البيانات لـ Google Sheets
     */
    async sendToGoogleSheets(formData) {
        console.log('%c🌐 جاري الاتصال بـ Google Sheets...', 'color: #3498db; font-size: 12px');
        console.log('%c🔗 URL:', 'color: #3498db; font-size: 11px', this.GOOGLE_SCRIPT_URL);
        
        try {
            const response = await Promise.race([
                fetch(this.GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('انتهت مهلة الانتظار')), 8000)
                )
            ]);
            
            console.log('%c✅ وصل الرد من Google Sheets', 'color: #27ae60; font-size: 12px');
            return response;
        } catch (error) {
            console.error('%c❌ خطأ في الاتصال:', 'color: #c0392b; font-size: 12px', error.message);
            throw error;
        }
    }
    
    /**
     * عند نجاح الطلب
     */
    onOrderSuccess() {
        console.log('%c🎉 الطلب نجح! الانتقال الآن...', 'color: #27ae60; font-size: 14px; font-weight: bold');
        
        // حفظ بيانات الطلب النهائية
        const orderData = {
            number: '#' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
            amount: document.getElementById('p_price').value,
            date: new Date().toLocaleString('ar-AE'),
            timestamp: Date.now()
        };
        
        console.log('%c📝 رقم الطلب:', 'color: #27ae60; font-weight: bold', orderData.number);
        console.log('%c💰 الإجمالي:', 'color: #27ae60; font-weight: bold', orderData.amount);
        
        try {
            localStorage.setItem('lastOrder', JSON.stringify(orderData));
        } catch (e) {
            console.warn('%c⚠️ خطأ حفظ البيانات النهائية:', 'color: #f39c12', e);
        }
        
        // تنظيف السلة
        this.cart.clearCart();
        console.log('%c🧹 تم تنظيف السلة', 'color: #95a5a6; font-size: 12px');
        
        // الانتقال لصفحة الشكر
        setTimeout(() => {
            console.log('%c🔄 الانتقال إلى صفحة الشكر...', 'color: #2a5298; font-weight: bold; font-size: 12px');
            window.location.href = './thank-you.html';
        }, 800);
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