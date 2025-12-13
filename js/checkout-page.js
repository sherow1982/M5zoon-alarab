/**
 * منطلق صفحة إتمام الطلب
 * حفظ مباشر على GitHub عبر API
 * Emirates Gifts v9.0 - GitHub Native
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        // GitHub Config
        this.GITHUB_OWNER = 'sherow1982';
        this.GITHUB_REPO = 'emirates-gifts';
        this.GITHUB_TOKEN = localStorage.getItem('github_token');
        
        if (chrome && chrome.runtime) {
            chrome.runtime.onMessage.addListener(() => false);
        }
        
        console.clear();
        console.log('%c🤖 Emirates Gifts v9.0', 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1');
        console.log('%c💾 Direct GitHub API Integration', 'color: #27ae60; font-size: 12px; font-weight: bold');
        console.log('%c⚠️ Token: ' + (this.GITHUB_TOKEN ? '✅ Loaded' : '❌ Not found'), 'color: ' + (this.GITHUB_TOKEN ? '#27ae60' : '#e74c3c'));
        
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
        
        if (!this.GITHUB_TOKEN) {
            alert('يرجى إدخال GitHub Token');
            const token = prompt('ادخل GitHub Token الخاص بك:');
            if (token) {
                localStorage.setItem('github_token', token);
                this.GITHUB_TOKEN = token;
            } else {
                return;
            }
        }
        
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
        
        try {
            const orderData = {
                orderId: '#' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
                fullName: document.querySelector('input[name="customer_name"]').value,
                phone: phoneInput.value,
                city: document.querySelector('select[name="emirate"]').value,
                address: document.querySelector('textarea[name="address"]').value,
                items: document.getElementById('p_name').value,
                total: document.getElementById('p_price').value,
                date: new Date().toLocaleString('ar-AE'),
                timestamp: new Date().toISOString()
            };
            
            console.log('%c📝 Order #' + orderData.orderId, 'color: #9b59b6; font-weight: bold');
            
            // Save JSON
            await this.saveOrderJSON(orderData);
            console.log('%c✅ JSON saved to GitHub', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // Update CSV
            await this.updateOrdersCSV(orderData);
            console.log('%c✅ CSV updated', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ ERROR:', 'color: #c0392b; font-weight: bold', error.message);
            alert('خطأ: ' + error.message);
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
        }
    }
    
    async saveOrderJSON(orderData) {
        const filename = `orders/${orderData.orderId.replace('#', '')}-${Date.now()}.json`;
        const content = JSON.stringify(orderData, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        const response = await fetch(
            `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/${filename}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `📄 New order: ${orderData.orderId}`,
                    content: encodedContent
                })
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`JSON save failed: ${error.message}`);
        }
    }
    
    async updateOrdersCSV(orderData) {
        const csvFile = 'orders/new-orders.csv';
        const csvRow = `${orderData.orderId},${orderData.fullName},${orderData.phone},${orderData.city},"${orderData.items}",${orderData.total},${orderData.date}`;
        
        let sha = null;
        let csvContent = '';
        
        try {
            const getRes = await fetch(
                `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/${csvFile}`,
                { 
                    headers: { 
                        'Authorization': `token ${this.GITHUB_TOKEN}`
                    } 
                }
            );
            
            if (getRes.ok) {
                const fileData = await getRes.json();
                sha = fileData.sha;
                csvContent = decodeURIComponent(atob(fileData.content));
            }
        } catch (e) {
            console.log('📝 CSV file not found, will create new');
        }
        
        const newCSV = csvContent + (csvContent ? '\n' : '') + csvRow;
        const encodedContent = btoa(unescape(encodeURIComponent(newCSV)));
        
        const response = await fetch(
            `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/${csvFile}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `📋 Add order: ${orderData.orderId}`,
                    content: encodedContent,
                    sha: sha
                })
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`CSV update failed: ${error.message}`);
        }
    }
    
    onOrderSuccess(orderData) {
        console.log('%c\n🎉 ORDER CONFIRMED!', 'color: #27ae60; font-size: 13px; font-weight: bold; background: #ecf0f1; padding: 5px');
        console.log('%c✅ تم حفظ الطلب على GitHub', 'color: #27ae60; font-weight: bold');
        console.log('%b🔗 https://github.com/sherow1982/emirates-gifts/tree/main/orders', 'color: #3498db; font-weight: bold; font-size: 10px');
        
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