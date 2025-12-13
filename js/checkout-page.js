/**
 * منطق صفحة إتمام الطلب
 * حفظ الطلبات مباشرة على GitHub
 * Emirates Gifts v5.0
 */

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.cart = window.cartSystem;
        this.summaryText = document.getElementById('summaryText');
        this.totalDisplay = document.getElementById('totalPriceDisplay');
        
        // GitHub API
        this.GITHUB_OWNER = 'sherow1982';
        this.GITHUB_REPO = 'emirates-gifts';
        this.GITHUB_TOKEN = 'ghp_C9OKhVVLtJOYnHG8H3dV2mVX5qw8nH1kLU2r'; // استخدم env variable بدلا
        
        console.clear();
        console.log('%c📑 Orders System v5.0', 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1');
        console.log('%c📄 GitHub Repo: ' + this.GITHUB_OWNER + '/' + this.GITHUB_REPO, 'color: #27ae60; font-size: 12px; font-weight: bold');
        console.log('%c💾 Saving orders to:', 'color: #27ae60; font-size: 11px', 'orders/ directory on GitHub');
        
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
            
            // 1. حفظ باكاب محلي
            this.backupOrderData(orderData);
            console.log('%c✅ Backup to localStorage: SUCCESS', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // 2. حفظ على GitHub
            await this.saveToGitHub(orderData);
            console.log('%c✅ Saved to GitHub: SUCCESS', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // 3. الانتقال للصفحة التالية
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ ERROR:', 'color: #c0392b; font-weight: bold', error);
            alert('حدث خطأ، لكن تم حفظ الطلب محلياً');
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
     * حفظ على GitHub
     */
    async saveToGitHub(orderData) {
        console.log('%c💸 Saving to GitHub...', 'color: #3498db; font-weight: bold; font-size: 11px');
        
        try {
            // إنشاء JSON
            const filename = `orders/${orderData.orderId.replace('#', '')}-${Date.now()}.json`;
            const content = JSON.stringify(orderData, null, 2);
            const encodedContent = btoa(unescape(encodeURIComponent(content)));
            
            // إرسال لGitHub API
            const response = await fetch(
                `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/${filename}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.GITHUB_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `📅 New Order: ${orderData.orderId}`,
                        content: encodedContent,
                        branch: 'main'
                    })
                }
            );
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'GitHub API error');
            }
            
            console.log('%c  ✅ Order saved:', 'color: #27ae60; font-weight: bold', filename);
            
            // تحديث التمام الرئيسية
            await this.updateOrdersIndex(orderData);
            
        } catch (error) {
            console.error('%c⚠️ GitHub Error:', 'color: #e74c3c; font-weight: bold', error.message);
            throw error;
        }
    }
    
    /**
     * تحديث ملف الطلبات JSON
     */
    async updateOrdersIndex(newOrder) {
        try {
            const indexFile = 'orders/orders.json';
            
            // قراءة الملف الحالي
            const getResponse = await fetch(
                `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/${indexFile}`,
                {
                    headers: {
                        'Authorization': `token ${this.GITHUB_TOKEN}`
                    }
                }
            );
            
            let orders = [];
            let sha = null;
            
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                orders = JSON.parse(atob(fileData.content));
                sha = fileData.sha;
            }
            
            // إضافة الطلب الجديد
            orders.push({
                orderId: newOrder.orderId,
                fullName: newOrder.fullName,
                phone: newOrder.phone,
                city: newOrder.city,
                total: newOrder.total,
                date: newOrder.date,
                timestamp: newOrder.timestamp
            });
            
            // الحفظ
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(orders, null, 2))));
            
            const updateResponse = await fetch(
                `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/${indexFile}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.GITHUB_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `📄 Update orders index`,
                        content: content,
                        sha: sha,
                        branch: 'main'
                    })
                }
            );
            
            if (updateResponse.ok) {
                console.log('%c  ✅ Index updated', 'color: #27ae60; font-weight: bold');
            }
            
        } catch (error) {
            console.warn('⚠️ Index update error:', error.message);
        }
    }
    
    /**
     * عند نجاح الطلب
     */
    onOrderSuccess(orderData) {
        console.log('%c\n🎉 ORDER SUCCESS!', 'color: #27ae60; font-size: 14px; font-weight: bold; background: #ecf0f1; padding: 8px; border-radius: 3px');
        console.log('%c📝 Order #' + orderData.orderId, 'color: #27ae60; font-weight: bold');
        console.log('%c💰 Amount: ' + orderData.total + ' AED', 'color: #27ae60; font-weight: bold');
        console.log('%c🃁 Saved to GitHub in orders/ directory', 'color: #27ae60; font-weight: bold');
        
        const finalOrderData = {
            number: orderData.orderId,
            amount: orderData.total,
            date: orderData.date,
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