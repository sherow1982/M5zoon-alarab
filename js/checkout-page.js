/**
 * منطق صفحة إتمام الطلب
 * مباشرة لـ Google Sheets
 * Emirates Gifts v4.1
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        // رابط Google Sheets
        this.SHEETS_ID = '18T87KMCzvInuRoqbjwSQzIRFtb4xW71_LVNOCK5iHp0';
        this.GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyWYpWnXV9wlo6sH-ABKR480ekh_9MsOSX0ypA9pMViSR7x5lDKCnBaVWwRr9pd_L2Nw/exec';
        
        console.clear();
        console.log('%c🌐 Google Sheets Connected', 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1');
        console.log('%c📄 Sheets ID: ' + this.SHEETS_ID, 'color: #27ae60; font-size: 11px; font-weight: bold');
        
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
        console.log('%c\n📤 SUBMITTING ORDER...', 'color: #3498db; font-size: 14px; font-weight: bold; background: #ecf0f1; padding: 8px; border-radius: 3px');
        
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
                fullName: document.querySelector('input[name="customer_name"]').value,
                phone: phoneInput.value,
                city: document.querySelector('select[name="emirate"]').value,
                address: document.querySelector('textarea[name="address"]').value,
                items: document.getElementById('p_name').value,
                total: document.getElementById('p_price').value,
                paymentMethod: 'cash',
                notes: 'Online Order'
            };
            
            orderData.orderId = '#' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
            
            console.log('%c📋 ORDER DATA:', 'color: #9b59b6; font-weight: bold; font-size: 12px');
            console.table(orderData);
            
            // 1. حفظ باكاب محلي
            this.backupOrderData(orderData);
            console.log('%c✅ Backup to localStorage: SUCCESS', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // 2. الإرسال لGoogle Sheets
            this.sendToGoogleSheets(orderData);
            console.log('%c✅ Sent to Google Sheets', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // 3. الانتقال للصفحة التالية
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ ERROR:', 'color: #c0392b; font-weight: bold', error);
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
        }
    }
    
    /**
     * حفظ بيانات الطلب
     */
    backupOrderData(orderData) {
        try {
            localStorage.setItem('lastOrderDetails', JSON.stringify(orderData));
            const ordersLog = JSON.parse(localStorage.getItem('ordersLog') || '[]');
            ordersLog.push({ ...orderData, backup_timestamp: new Date().toISOString() });
            localStorage.setItem('ordersLog', JSON.stringify(ordersLog));
        } catch (error) {
            console.warn('⚠️ Backup error:', error);
        }
    }
    
    /**
     * إرسال باستخدام sendBeacon (موثوق)
     */
    sendToGoogleSheets(orderData) {
        try {
            console.log('%c🌐 Sending to Google Sheets...', 'color: #3498db; font-weight: bold; font-size: 11px');
            
            // إنشاء URLSearchParams
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(orderData)) {
                params.append(key, value);
            }
            
            // الجريبة 1: sendBeacon (الأقوى و موثوقة)
            if (navigator.sendBeacon) {
                const success = navigator.sendBeacon(this.GOOGLE_SCRIPT_URL, params);
                console.log('%c  ✅ sendBeacon queued:', 'color: #27ae60; font-weight: bold', success);
            } else {
                // العودة ل_fetch
                fetch(this.GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: params,
                    mode: 'no-cors',
                    keepalive: true
                }).catch(err => console.warn('⚠️ fetch:', err.message));
            }
        } catch (error) {
            console.error('%c⚠️ Google Sheets Error:', 'color: #e74c3c; font-weight: bold; font-size: 11px', error.message);
        }
    }
    
    /**
     * عند نجاح الطلب
     */
    onOrderSuccess(orderData) {
        console.log('%c\n🎉 ORDER SUCCESS!', 'color: #27ae60; font-size: 14px; font-weight: bold; background: #ecf0f1; padding: 8px; border-radius: 3px');
        console.log('%c📝 Order #' + orderData.orderId, 'color: #27ae60; font-weight: bold');
        console.log('%c💰 Amount: ' + orderData.total + ' AED', 'color: #27ae60; font-weight: bold');
        
        const finalOrderData = {
            number: orderData.orderId,
            amount: orderData.total,
            date: new Date().toLocaleString('ar-AE'),
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('lastOrder', JSON.stringify(finalOrderData));
        } catch (e) {
            console.warn('⚠️ LocalStorage Error:', e);
        }
        
        this.cart.clearCart();
        
        setTimeout(() => {
            console.log('%c🚀 Redirecting to Thank You Page...', 'color: #2a5298; font-weight: bold');
            window.location.href = './thank-you.html';
        }, 800);
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