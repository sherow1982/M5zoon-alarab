/**
 * منطلق صفحة إتمام الطلب - محسّنة وبتوازن عالي
 * Emirates Gifts v11.0 - Fixed Navigation & Product Display
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        console.clear();
        console.log('%c🎪 Emirates Gifts v11.0', 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1');
        console.log('%c✅ Checkout Page - Fixed Navigation', 'color: #27ae60; font-size: 12px; font-weight: bold');
        
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
        
        // عرض ملخص المنتجات - بدون undefined
        const itemsList = items.map(item => {
            const itemName = item.title || item.name || 'منتج';
            return `${itemName} (x${item.quantity || 1})`;
        }).join(' + ');
        
        if (this.summaryText) {
            this.summaryText.textContent = itemsList;
        }
        
        if (this.totalDisplay) {
            this.totalDisplay.textContent = `الإجمالي: ${total.toFixed(2)} د.إ`;
        }
        
        // احفظ البيانات المخفية
        const p_name = document.getElementById('p_name');
        const p_price = document.getElementById('p_price');
        const o_date = document.getElementById('o_date');
        
        if (p_name) p_name.value = itemsList;
        if (p_price) p_price.value = total.toFixed(2);
        if (o_date) o_date.value = new Date().toLocaleString('ar-AE');
        
        // احفظ بيانات المنتجات الكاملة
        this.form.dataset.cartItems = JSON.stringify(items);
        console.log('%c📦 Cart loaded:', 'color: #3498db; font-weight: bold', items.length, 'منتجات');
    }
    
    showEmptyCart() {
        if (this.summaryText) {
            this.summaryText.innerHTML = '<span style="color: #e74c3c;">السلة فارغة!</span>';
        }
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
            // احصل على بيانات السلة
            const cartItems = JSON.parse(this.form.dataset.cartItems || '[]');
            
            if (cartItems.length === 0) {
                alert('السلة فارغة');
                this.submitBtn.disabled = false;
                return;
            }
            
            // حول المنتجات للصيغة الجديدة - بدون undefined
            const itemsFormatted = cartItems.map(item => ({
                name: item.title || item.name || 'منتج',
                url: item.url || `./products-showcase.html#${item.id || ''}`,
                price: `${(parseFloat(item.price) || 0).toFixed(2)} د.إ`,
                quantity: parseInt(item.quantity) || 1
            }));
            
            const totalPrice = cartItems.reduce((sum, item) => {
                const price = parseFloat(item.sale_price || item.price || 0);
                const qty = parseInt(item.quantity) || 1;
                return sum + (price * qty);
            }, 0);
            
            const orderData = {
                orderId: 'ORD-' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
                fullName: document.querySelector('input[name="customer_name"]').value,
                phone: phoneInput.value,
                city: document.querySelector('select[name="emirate"]').value,
                address: document.querySelector('textarea[name="address"]').value,
                items: itemsFormatted,
                total: totalPrice.toFixed(2),
                date: new Date().toLocaleString('ar-AE'),
                savedAt: new Date().toISOString()
            };
            
            console.log('%c📋 Order #' + orderData.orderId, 'color: #9b59b6; font-weight: bold');
            console.log('%c📦 Items:', 'color: #3498db; font-weight: bold', orderData.items);
            
            // 1️⃣ احفظ في localStorage
            this.saveToLocalStorage(orderData);
            console.log('%c💾 Saved to localStorage', 'color: #27ae60; font-weight: bold');
            
            // 2️⃣ الريدايركت الفوري
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ ERROR:', 'color: #c0392b; font-weight: bold', error);
            alert('حدث خطأ - يرجى المحاولة مرة أخرى');
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>تأكيد الطلب</span>';
        }
    }
    
    saveToLocalStorage(orderData) {
        try {
            const orders = JSON.parse(localStorage.getItem('emirates_orders')) || [];
            orders.push(orderData);
            localStorage.setItem('emirates_orders', JSON.stringify(orders));
            
            // JSONL format
            const jsonlLine = JSON.stringify(orderData) + '\n';
            let ordersText = localStorage.getItem('emirates_orders_jsonl') || '';
            ordersText += jsonlLine;
            localStorage.setItem('emirates_orders_jsonl', ordersText);
            
            console.log('%c✅ Order saved with full details', 'color: #27ae60; font-weight: bold');
        } catch (error) {
            console.error('❌ localStorage error:', error);
        }
    }
    
    onOrderSuccess(orderData) {
        console.log('%c\n🎉 ORDER CONFIRMED!', 'color: #27ae60; font-size: 13px; font-weight: bold; background: #ecf0f1; padding: 5px');
        console.log('%c✅ تم استقبال طلبك', 'color: #27ae60; font-weight: bold');
        console.log('%c📋 Order ID:', 'color: #3498db; font-weight: bold', orderData.orderId);
        console.log('%c👤 Customer:', 'color: #3498db; font-weight: bold', orderData.fullName);
        
        // احذف السلة
        if (this.cart) {
            this.cart.clearCart();
        }
        
        // الريدايركت الفورية بدون تأخير
        alert('✅ تم استقبال طلبك بنجاح!\n📋 رقم الطلبية: ' + orderData.orderId);
        
        // روح للمعرض مباشرة - بدون cache issues
        window.location.replace('./products-showcase.html');
    }
}

// تهيئة الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CheckoutPage();
    });
} else {
    new CheckoutPage();
}