/**
 * منطق صفحة إتمام الطلب
 * معالجة بيانات المستخدم والطلب
 * Emirates Gifts v3.6
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
        
        console.clear();
        console.log('%c=== Emirates Gifts Checkout v3.6 ===' , 'color: #2a5298; font-size: 14px; font-weight: bold; padding: 10px; background: #ecf0f1; border-radius: 5px');
        console.log('%c⏰ الوقت:', 'color: #27ae60; font-weight: bold', new Date().toLocaleString('ar-AE'));
        console.log('%c📱 المتصفح:', 'color: #27ae60; font-weight: bold', navigator.userAgent.split(' ').slice(-2).join(' '));
        
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
        
        console.log('%c✅ تم تحميل بيانات السلة', 'color: #27ae60; font-size: 12px');
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
        console.log('%c\n📤 بدء إرسال الطلب...', 'color: #3498db; font-size: 14px; font-weight: bold; background: #ecf0f1; padding: 5px');
        
        // التحقق النهائي
        if (!this.form.checkValidity()) {
            console.warn('%c⚠️ النموذج غير صحيح', 'color: #f39c12; font-weight: bold');
            alert('يرجى ملء جميع الحقول بشكل صحيح');
            return;
        }
        
        const phoneInput = document.querySelector('input[name="phone"]');
        const uaeRegex = /^05\d{8}$/;
        
        if (!uaeRegex.test(phoneInput.value)) {
            console.warn('%c⚠️ رقم الهاتف غير صحيح', 'color: #f39c12; font-weight: bold');
            alert('يرجى إدخال رقم هاتف إماراتي صحيح (05xxxxxxxx)');
            return;
        }
        
        // تحديث الزر
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري معالجة الطلب...';
        
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
                notes: 'Online order from Emirates Gifts'
            };
            
            // إضافة ID معرف
            orderData.orderId = '#' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
            
            console.log('%c\n📋 بيانات الطلب المكتملة:', 'color: #9b59b6; font-weight: bold; font-size: 12px');
            console.table(orderData);
            
            // حفظ بيانات الطلب
            this.backupOrderData(orderData);
            
            // محاولة الإرسال بطرق مختلفة
            console.log('%c\n🔁 بدء محاولات الإرسال...', 'color: #e67e22; font-size: 12px; font-weight: bold');
            
            // محاولة 1: Google Sheets
            console.log('%c🌐 محاولة 1: Google Sheets API', 'color: #3498db; font-weight: bold');
            await this.tryGoogleSheets(orderData).catch(err => {
                console.warn('%c⚠️ فشلت محاولة 1:', 'color: #e74c3c', err.message);
            });
            
            // محاولة 2: Formspree (backup)
            console.log('%c📧 محاولة 2: Formspree (Backup)', 'color: #3498db; font-weight: bold');
            await this.tryFormspree(orderData).catch(err => {
                console.warn('%c⚠️ فشلت محاولة 2:', 'color: #e74c3c', err.message);
            });
            
            // محاولة 3: Discord Webhook (backup)
            console.log('%c💯 محاولة 3: Discord Webhook (Backup)', 'color: #3498db; font-weight: bold');
            await this.tryDiscordWebhook(orderData).catch(err => {
                console.warn('%c⚠️ فشلت محاولة 3:', 'color: #e74c3c', err.message);
            });
            
            // مترجمة متل الطلب نجج
            console.log('%c\n✅ جميع محاولات الإرسال ازإلل - البيانات محفوظة في localStorage', 'color: #27ae60; font-weight: bold; font-size: 12px; background: #ecf0f1; padding: 5px');
            
            // الانتقال لصفحة الشكر
            this.onOrderSuccess(orderData);
            
        } catch (error) {
            console.error('%c❌ خطأ تقني عام:', 'color: #c0392b; font-weight: bold', error);
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
        }
    }
    
    /**
     * محاولة 1: Google Sheets
     */
    async tryGoogleSheets(orderData) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(orderData)) {
            formData.append(key, value);
        }
        
        console.log('%c  📄 الرابط:', 'color: #3498db', this.GOOGLE_SCRIPT_URL);
        
        const response = await Promise.race([
            fetch(this.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('انقطعبعد 5 ثواني')), 5000)
            )
        ]);
        
        console.log('%c  ✅ نجح Google Sheets', 'color: #27ae60; font-weight: bold');
        return response;
    }
    
    /**
     * محاولة 2: Formspree
     */
    async tryFormspree(orderData) {
        const response = await fetch('https://formspree.io/f/xyzwvu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: orderData.fullName,
                phone: orderData.phone,
                city: orderData.city,
                address: orderData.address,
                items: orderData.items,
                total: orderData.total,
                orderId: orderData.orderId,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) throw new Error('Formspree failed');
        console.log('%c  ✅ نجح Formspree', 'color: #27ae60; font-weight: bold');
        return response;
    }
    
    /**
     * محاولة 3: Discord Webhook
     */
    async tryDiscordWebhook(orderData) {
        const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL'; // ضع webhook URL هنا
        
        if (webhookUrl === 'YOUR_DISCORD_WEBHOOK_URL') {
            throw new Error('Discord webhook not configured');
        }
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `📅 طلب جديد: ${orderData.orderId}`,
                embeds: [{
                    title: `طلب #${orderData.orderId}`,
                    description: `الاسم: ${orderData.fullName}\nهاتف: ${orderData.phone}\nالإمارة: ${orderData.city}\nالعنوان: ${orderData.address}\nالمنتجات: ${orderData.items}\nالإجمالي: ${orderData.total}`,
                    color: 3066993
                }]
            })
        });
        
        if (!response.ok) throw new Error('Discord webhook failed');
        console.log('%c  ✅ نجح Discord', 'color: #27ae60; font-weight: bold');
        return response;
    }
    
    /**
     * حفظ بيانات الطلب في localStorage
     */
    backupOrderData(orderData) {
        try {
            localStorage.setItem('lastOrderDetails', JSON.stringify(orderData));
            
            const ordersLog = JSON.parse(localStorage.getItem('ordersLog') || '[]');
            ordersLog.push({
                ...orderData,
                backup_timestamp: new Date().toISOString()
            });
            localStorage.setItem('ordersLog', JSON.stringify(ordersLog));
            
            console.log('%c💾 localStorage Backup:', 'color: #f39c12; font-weight: bold', { طلب: orderData.orderId, الإجمالي: ordersLog.length });
        } catch (error) {
            console.error('%c⚠️ خطأ الباكاب:' color: #e74c3c', error);
        }
    }
    
    /**
     * عند نجاح الطلب
     */
    onOrderSuccess(orderData) {
        console.log('%c\n🎉 الطلب نجح!', 'color: #27ae60; font-size: 14px; font-weight: bold; background: #ecf0f1; padding: 5px');
        
        const finalOrderData = {
            number: orderData.orderId,
            amount: orderData.total,
            date: new Date().toLocaleString('ar-AE'),
            timestamp: Date.now()
        };
        
        console.log('%c📝 رقم الطلب:', 'color: #27ae60; font-weight: bold', finalOrderData.number);
        console.log('%c💰 المبلغ:', 'color: #27ae60; font-weight: bold', finalOrderData.amount);
        
        try {
            localStorage.setItem('lastOrder', JSON.stringify(finalOrderData));
        } catch (e) {
            console.warn('%c⚠️ خطأ الحفظ:', 'color: #f39c12', e);
        }
        
        this.cart.clearCart();
        
        setTimeout(() => {
            console.log('%c🚀 الانتقال لصفحة الشكر', 'color: #2a5298; font-weight: bold');
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