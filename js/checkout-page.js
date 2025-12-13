/**
 * منطلق صفحة إتمام الطلب
 * حفظ آمن في localStorage + JSON Download
 * Emirates Gifts v5.1
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        console.clear();
        console.log('%c📑 Orders System v5.1', 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1');
        console.log('%c💾 Storage: localStorage (Safe) + JSON Download', 'color: #27ae60; font-size: 12px; font-weight: bold');
        console.log('%c📄 No API keys needed - 100% secure', 'color: #27ae60; font-size: 11px');
        
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
            
            console.log('%c📋 ORDER DATA:', 'color: #9b59b6; font-weight: bold; font-size: 12px');
            console.table(orderData);
            
            // 1. حفظ محلي
            this.saveOrderLocally(orderData);
            console.log('%c✅ Saved to localStorage: SUCCESS', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // 2. تحميل JSON
            this.downloadOrderJSON(orderData);
            console.log('%c✅ Downloaded as JSON: ' + `order-${orderData.orderId.replace('#', '')}.json`, 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // 3. الانتقال
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ ERROR:', 'color: #c0392b; font-weight: bold', error);
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
        }
    }
    
    /**
     * حفظ محلياً
     */
    saveOrderLocally(orderData) {
        try {
            // آخر طلب
            localStorage.setItem('lastOrderDetails', JSON.stringify(orderData));
            
            // سجل كامل
            const ordersLog = JSON.parse(localStorage.getItem('ordersLog') || '[]');
            ordersLog.push({ 
                ...orderData, 
                backup_timestamp: new Date().toISOString() 
            });
            localStorage.setItem('ordersLog', JSON.stringify(ordersLog));
            
            console.log('%c💾 Total orders in storage:', 'color: #f39c12; font-weight: bold', ordersLog.length);
        } catch (error) {
            console.warn('⚠️ Storage error:', error);
        }
    }
    
    /**
     * تحميل JSON تلقائياً
     */
    downloadOrderJSON(orderData) {
        try {
            const jsonString = JSON.stringify(orderData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `order-${orderData.orderId.replace('#', '')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log('%c📄 File downloaded:', 'color: #27ae60; font-weight: bold', link.download);
        } catch (error) {
            console.warn('⚠️ Download error:', error);
        }
    }
    
    /**
     * عرض جميع الطلبات
     */
    static showAllOrders() {
        try {
            const orders = JSON.parse(localStorage.getItem('ordersLog') || '[]');
            console.log('%c📄 ALL ORDERS (localStorage)', 'color: #2a5298; font-size: 12px; font-weight: bold; background: #ecf0f1; padding: 5px');
            console.table(orders);
            console.log('%c📊 Total:', 'color: #27ae60; font-weight: bold', orders.length, 'orders');
            
            // تحميل الكل
            const json = JSON.stringify(orders, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'all-orders.json';
            link.click();
            URL.revokeObjectURL(url);
            
            console.log('%c📄 Exported as: all-orders.json', 'color: #27ae60; font-weight: bold');
        } catch (error) {
            console.error('❌ Error:', error);
        }
    }
    
    /**
     * عند نجاح الطلب
     */
    onOrderSuccess(orderData) {
        console.log('%c\n🎉 ORDER SUCCESS!', 'color: #27ae60; font-size: 14px; font-weight: bold; background: #ecf0f1; padding: 8px; border-radius: 3px');
        console.log('%c📝 Order #' + orderData.orderId, 'color: #27ae60; font-weight: bold');
        console.log('%c💰 Amount: ' + orderData.total + ' AED', 'color: #27ae60; font-weight: bold');
        console.log('%c💾 Saved locally + JSON downloaded', 'color: #27ae60; font-weight: bold');
        console.log('%c📄 Tip: CheckoutPage.showAllOrders() in console to export all', 'color: #3498db; font-weight: bold; font-size: 10px');
        
        const finalOrderData = {
            number: orderData.orderId,
            amount: orderData.total,
            date: orderData.date,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('lastOrder', JSON.stringify(finalOrderData));
        } catch (e) {
            console.warn('⚠️ Storage Error:', e);
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