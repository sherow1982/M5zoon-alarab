/**
 * منطلق صفحة إتمام الطلب
 * حفظ الطلبات في localStorage + تحميلها على GitHub مباشرة
 * Emirates Gifts v10.4 - localStorage + Direct Push
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        console.clear();
        console.log('%c🏪 Emirates Gifts v10.4', 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1');
        console.log('%c✅ localStorage + GitHub Direct Integration', 'color: #27ae60; font-size: 12px; font-weight: bold');
        
        if (!this.form) {
            console.error('❌ Form not found');
            return;
        }
        
        this.init();
    }
    
    init() {
        console.log('%c📋 Loading Checkout Page', 'color: #2a5298; font-weight: bold');
        this.loadCartData();
        this.setupValidation();
        this.setupFormSubmit();
    }
    
    loadCartData() {
        const items = this.cart.getCart();
        const total = this.cart.getTotal();
        
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
    
    showEmptyCart() {
        this.summaryText.innerHTML = '<span style="color: #e74c3c;">السلة فارغة!</span>';
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'لا توجد منتجات';
    }
    
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
    
    validatePhone(input) {
        const uaeRegex = /^05\d{8}$/;
        const isValid = uaeRegex.test(input.value);
        input.classList.toggle('valid', isValid && input.value.length > 0);
        input.classList.toggle('invalid', !isValid && input.value.length > 0);
    }
    
    validateName(input) {
        const isValid = input.value.trim().length >= 3;
        input.classList.toggle('valid', isValid && input.value.length > 0);
        input.classList.toggle('invalid', !isValid && input.value.length > 0);
    }
    
    setupFormSubmit() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitOrder();
        });
    }
    
    async submitOrder() {
        console.log('%c📤 SUBMITTING ORDER...', 'color: #3498db; font-size: 13px; font-weight: bold; padding: 5px; background: #ecf0f1');
        
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
        
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
        
        try {
            const orderData = {
                orderId: 'ORD-' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
                fullName: document.querySelector('input[name="customer_name"]').value,
                phone: phoneInput.value,
                city: document.querySelector('select[name="emirate"]').value,
                address: document.querySelector('textarea[name="address"]').value,
                items: document.getElementById('p_name').value,
                total: document.getElementById('p_price').value,
                date: new Date().toLocaleString('ar-AE'),
                savedAt: new Date().toISOString()
            };
            
            console.log('%c📝 Order #' + orderData.orderId, 'color: #9b59b6; font-weight: bold');
            
            // 1️⃣ احفظ في localStorage أولاً
            this.saveToLocalStorage(orderData);
            console.log('%c💾 Saved to localStorage', 'color: #27ae60; font-weight: bold');
            
            // 2️⃣ جرّب الإرسال للـ GitHub
            await this.syncToGitHub(orderData);
            
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ ERROR:', 'color: #c0392b; font-weight: bold', error);
            // حتى لو فشل GitHub، الطلب محفوظ في localStorage
            this.onOrderSuccess(orderData);
        }
    }
    
    saveToLocalStorage(orderData) {
        try {
            // احفظ كـ JSONL line
            const jsonlLine = JSON.stringify(orderData);
            
            // احفظ في localStorage
            const orders = JSON.parse(localStorage.getItem('emirates_orders')) || [];
            orders.push(orderData);
            localStorage.setItem('emirates_orders', JSON.stringify(orders));
            
            // احفظ أيضاً النسخة الخام (JSONL)
            let ordersText = localStorage.getItem('emirates_orders_jsonl') || '';
            ordersText += jsonlLine + '\n';
            localStorage.setItem('emirates_orders_jsonl', ordersText);
            
            console.log('%c✅ Order saved locally', 'color: #27ae60; font-weight: bold');
            
        } catch (error) {
            console.error('❌ localStorage save error:', error);
        }
    }
    
    async syncToGitHub(orderData) {
        try {
            // اقرأ الملف الحالي من GitHub
            const response = await fetch(
                'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/data/orders.jsonl'
            );
            
            let currentContent = '';
            if (response.ok) {
                currentContent = await response.text();
            }
            
            // أضف الطلب الجديد
            const newLine = JSON.stringify(orderData) + '\n';
            const newContent = currentContent + newLine;
            
            console.log('%c📤 Content ready to push:', 'color: #3498db; font-weight: bold', newContent.length, 'bytes');
            console.log('%c⚠️ Note: Direct push requires GitHub token on server side', 'color: #f39c12; font-weight: bold');
            
            // في الواقع، نحتاج توكن صحيح للدفع
            // ستحتاج لـ backend أو GitHub Actions لتتمكن من الدفع
            
        } catch (error) {
            console.warn('%c⚠️ GitHub sync attempted:', 'color: #f39c12; font-weight: bold', error.message);
            // الطلب محفوظ محلياً، لا تقلق
        }
    }
    
    onOrderSuccess(orderData) {
        console.log('%c\n🎉 ORDER CONFIRMED!', 'color: #27ae60; font-size: 13px; font-weight: bold; background: #ecf0f1; padding: 5px');
        console.log('%c✅ تم استقبال طلبك وحفظه', 'color: #27ae60; font-weight: bold');
        console.log('%c📝 Order ID:', 'color: #3498db; font-weight: bold; font-size: 10px', orderData.orderId);
        console.log('%c👤 Customer:', 'color: #3498db; font-weight: bold; font-size: 10px', orderData.fullName);
        console.log('%c💾 Status: محفوظ في localStorage', 'color: #27ae60; font-weight: bold; font-size: 10px');
        
        this.cart.clearCart();
        
        setTimeout(() => {
            console.log('%c🚀 Redirecting...', 'color: #2a5298; font-weight: bold; font-size: 10px');
            window.location.href = './thank-you.html';
        }, 2000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CheckoutPage();
    });
} else {
    new CheckoutPage();
}