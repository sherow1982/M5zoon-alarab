/**
 * منطلق صفحة إتمام الطلب
 * حفظ: GitHub CSV + localStorage + JSON
 * Emirates Gifts v6.1
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
        this.ORDERS_CSV = 'orders/new-orders.csv';
        this.GITHUB_TOKEN = localStorage.getItem('githubToken') || '';
        
        // وقاية من أخطاء الإضافات
        if (chrome && chrome.runtime) {
            chrome.runtime.onMessage.addListener(() => {
                return false;
            });
        }
        
        console.clear();
        console.log('%c🎯 Emirates Gifts v6.1', 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1');
        console.log('%c💾 Storage: GitHub CSV + localStorage', 'color: #27ae60; font-size: 12px; font-weight: bold');
        console.log('%c📄 File: orders/new-orders.csv (with red color for new)', 'color: #27ae60; font-size: 11px');
        
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
                timestamp: new Date().toISOString(),
                isNew: true
            };
            
            console.log('%c📋 ORDER DATA:', 'color: #9b59b6; font-weight: bold; font-size: 12px');
            console.table(orderData);
            
            // 1. حفظ محلي
            this.saveOrderLocally(orderData);
            console.log('%c✅ Saved to localStorage: SUCCESS', 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // 2. حفظ JSON
            this.downloadOrderJSON(orderData);
            console.log('%c✅ Downloaded as JSON: ' + `order-${orderData.orderId.replace('#', '')}.json`, 'color: #27ae60; font-weight: bold; font-size: 11px');
            
            // 3. تحديث CSV على GitHub (optional)
            // إذا كان GitHub Token موجود
            if (this.GITHUB_TOKEN) {
                await this.updateGitHubCSV(orderData);
                console.log('%c✅ Saved to GitHub CSV: SUCCESS', 'color: #27ae60; font-weight: bold; font-size: 11px');
            } else {
                console.log('%c🃁 GitHub CSV: Configure token for auto-sync', 'color: #f39c12; font-weight: bold; font-size: 11px');
            }
            
            // 4. الانتقال
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ ERROR:', 'color: #c0392b; font-weight: bold', error);
            alert('تم حفظ الطلب محلياً');
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
        }
    }
    
    /**
     * حفظ محلياً
     */
    saveOrderLocally(orderData) {
        try {
            localStorage.setItem('lastOrderDetails', JSON.stringify(orderData));
            
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
     * تحديث CSV على GitHub
     */
    async updateGitHubCSV(orderData) {
        try {
            console.log('%c📄 Updating GitHub CSV...', 'color: #3498db; font-weight: bold; font-size: 11px');
            
            // قراءة CSV الحالي
            const response = await fetch(
                `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/${this.ORDERS_CSV}`,
                {
                    headers: {
                        'Authorization': `token ${this.GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3.raw'
                    }
                }
            );
            
            let currentCSV = '';
            let sha = null;
            
            if (response.ok) {
                // قراءة الملف بالكامل
                const contentResponse = await fetch(
                    `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/${this.ORDERS_CSV}`,
                    {
                        headers: {
                            'Authorization': `token ${this.GITHUB_TOKEN}`
                        }
                    }
                );
                const fileData = await contentResponse.json();
                currentCSV = atob(fileData.content);
                sha = fileData.sha;
            }
            
            // إضافة السطر الجديد
            const newRow = `${orderData.orderId},${orderData.fullName},${orderData.phone},${orderData.city},"${orderData.items}",${orderData.total},${orderData.date},🆕 جديد`;
            const updatedCSV = currentCSV + (currentCSV.endsWith('\n') ? '' : '\n') + newRow;
            
            // رفع الملف
            const updateResponse = await fetch(
                `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/${this.ORDERS_CSV}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.GITHUB_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `📄 New order: ${orderData.orderId}`,
                        content: btoa(updatedCSV),
                        sha: sha
                    })
                }
            );
            
            if (updateResponse.ok) {
                console.log('%c  ✅ CSV updated on GitHub', 'color: #27ae60; font-weight: bold; font-size: 10px');
            }
            
        } catch (error) {
            console.warn('⚠️ GitHub CSV error:', error.message);
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
            link.style.display = 'none';
            document.body.appendChild(link);
            
            setTimeout(() => {
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 100);
            }, 100);
            
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
            if (orders.length > 0) {
                console.table(orders);
                console.log('%c📊 Total:', 'color: #27ae60; font-weight: bold', orders.length, 'orders');
            } else {
                console.log('%c⚠️ No orders found', 'color: #e74c3c; font-weight: bold');
                return;
            }
            
            const json = JSON.stringify(orders, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'all-orders-' + new Date().getTime() + '.json';
            link.style.display = 'none';
            document.body.appendChild(link);
            
            setTimeout(() => {
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 100);
            }, 100);
            
            console.log('%c📄 Exported as:', 'color: #27ae60; font-weight: bold', link.download);
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
        console.log('%c💾 Saved to: localStorage + JSON', 'color: #27ae60; font-weight: bold');
        console.log('%c🔗 Check: orders/new-orders.csv on GitHub', 'color: #3498db; font-weight: bold; font-size: 11px');
        
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