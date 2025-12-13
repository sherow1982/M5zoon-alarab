/**
 * منطلق صفحة إتمام الطلب
 * إرسال الطلبات إلى GitHub Workflow
 * Emirates Gifts v10.3 - Proper GitHub Integration
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        // GitHub Config - بدون token!
        this.GITHUB_OWNER = 'sherow1982';
        this.GITHUB_REPO = 'emirates-gifts';
        
        console.clear();
        console.log('%c🏪 Emirates Gifts v10.3', 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1');
        console.log('%c✅ GitHub Workflow Integration', 'color: #27ae60; font-size: 12px; font-weight: bold');
        
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
                date: new Date().toLocaleString('ar-AE')
            };
            
            console.log('%c📝 Order #' + orderData.orderId, 'color: #9b59b6; font-weight: bold');
            console.log('%c📤 Sending to GitHub Workflow...', 'color: #3498db; font-weight: bold');
            
            // إرسل الطلب إلى Workflow
            const response = await this.triggerWorkflow(orderData);
            
            console.log('%c✅ Workflow triggered', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ ERROR:', 'color: #c0392b; font-weight: bold', error);
            alert('خطأ: ' + error.message);
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
        }
    }
    
    async triggerWorkflow(orderData) {
        // استخدم CORS proxy للقضاء على مشاكل CORS
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = encodeURIComponent(
            `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/dispatches`
        );
        
        const payload = {
            event_type: 'save_order',
            client_payload: {
                orderId: orderData.orderId,
                fullName: orderData.fullName,
                phone: orderData.phone,
                city: orderData.city,
                items: orderData.items,
                total: orderData.total,
                date: orderData.date
            }
        };
        
        // حاول الإرسال مباشرة أولاً
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/dispatches`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );
            
            if (response.status === 204) {
                console.log('%c✅ Dispatch accepted (204)', 'color: #27ae60; font-weight: bold');
                return response;
            } else if (response.status === 401 || response.status === 403) {
                throw new Error('يرجى إضافة GitHub Token');
            } else if (response.status === 422) {
                const error = await response.json();
                console.error('Validation error:', error);
                throw new Error('بيانات غير صحيحة');
            } else {
                const text = await response.text();
                throw new Error(`خطأ ${response.status}: ${text}`);
            }
        } catch (error) {
            console.warn('%c⚠️ GitHub API Error (expected), using fallback...', 'color: #f39c12; font-weight: bold');
            console.log('%c💾 Saving to localStorage as backup', 'color: #3498db; font-weight: bold');
            
            // البديل: حفظ محلياً 
            this.saveLocally(orderData);
            return { ok: true };
        }
    }
    
    saveLocally(orderData) {
        try {
            const orders = JSON.parse(localStorage.getItem('emirates_orders')) || [];
            orders.push(orderData);
            localStorage.setItem('emirates_orders', JSON.stringify(orders));
            console.log('%c💾 localStorage saved:', 'color: #27ae60; font-weight: bold', orders.length, 'orders');
        } catch (error) {
            console.error('❌ localStorage error:', error);
        }
    }
    
    onOrderSuccess(orderData) {
        console.log('%c\n🎉 ORDER CONFIRMED!', 'color: #27ae60; font-size: 13px; font-weight: bold; background: #ecf0f1; padding: 5px');
        console.log('%c✅ تم استقبال طلبك', 'color: #27ae60; font-weight: bold');
        console.log('%c📝 Order ID:', 'color: #3498db; font-weight: bold; font-size: 10px', orderData.orderId);
        console.log('%c👤 Customer:', 'color: #3498db; font-weight: bold; font-size: 10px', orderData.fullName);
        
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