/**
 * صفحة شكراً
 * عرض بيانات الطلبية الكاملة ومروحة الاحتفالات
 * Emirates Gifts v4.0 - Full Order Display
 */

class ThankYouPage {
    constructor() {
        this.orderNumberEl = document.getElementById('orderNumber');
        this.orderAmountEl = document.getElementById('orderAmount');
        this.orderTimeEl = document.getElementById('orderTime');
        this.customerInfoEl = document.getElementById('customerInfo');
        this.productsSectionEl = document.getElementById('productsSection');
        this.productsListEl = document.getElementById('productsList');
        
        this.init();
    }
    
    /**
     * التهيئة
     */
    init() {
        console.log('%c🎉 Thank You Page Loaded', 'color: #25D366; font-size: 14px; font-weight: bold;');
        this.displayOrderData();
        this.createConfetti();
        this.startAutoCleanup();
    }
    
    /**
     * عرض بيانات الطلبية
     */
    displayOrderData() {
        try {
            // اطلب آخر طلب من localStorage
            const orders = JSON.parse(localStorage.getItem('emirates_orders')) || [];
            
            if (orders.length === 0) {
                console.warn('⚠️ لا طلبيات محفوظة');
                this.showDefaultData();
                return;
            }
            
            // خذ آخر طلب
            const lastOrder = orders[orders.length - 1];
            
            console.log('%c📋 عرض الطلبية:', 'color: #3498db; font-weight: bold;', lastOrder);
            
            // عرض رقم الطلبية والمبلغ
            this.orderNumberEl.textContent = lastOrder.orderId;
            this.orderAmountEl.innerHTML = `💰 الإجمالي: <span style="color: #D4AF37; font-weight: 700;">${lastOrder.total}</span>`;
            this.orderTimeEl.textContent = `🕓 ${lastOrder.date}`;
            
            // عرض بيانات العميل
            this.displayCustomerInfo(lastOrder);
            
            // عرض ملخص المنتجات
            if (Array.isArray(lastOrder.items) && lastOrder.items.length > 0) {
                this.displayProducts(lastOrder.items);
            }
            
            console.log('%c✅ تم تحميل بيانات الطلبية بنجاح', 'color: #27ae60; font-weight: bold;');
            
        } catch (error) {
            console.error('%c❌ خطأ تحميل البيانات:', 'color: #c0392b; font-weight: bold;', error);
            this.showDefaultData();
        }
    }
    
    /**
     * عرض بيانات العميل
     */
    displayCustomerInfo(order) {
        document.getElementById('customerName').textContent = order.fullName || '-';
        document.getElementById('customerPhone').textContent = order.phone || '-';
        document.getElementById('customerCity').textContent = order.city || '-';
        document.getElementById('customerAddress').textContent = order.address || '-';
        this.customerInfoEl.style.display = 'block';
    }
    
    /**
     * عرض المنتجات
     */
    displayProducts(items) {
        let html = '';
        
        items.forEach((item, index) => {
            html += `
                <div class="product-item">
                    <div style="flex: 1;">
                        <div class="product-name">• ${item.name}</div>
                        <div style="font-size: 12px; color: #999; margin-top: 4px;">
                            💵 ${item.price}
                        </div>
                    </div>
                    <div class="product-qty" style="white-space: nowrap; margin-left: 10px;">
                        x${item.quantity}
                    </div>
                </div>
            `;
        });
        
        this.productsListEl.innerHTML = html;
        this.productsSectionEl.style.display = 'block';
    }
    
    /**
     * عرض بيانات افتراضية
     */
    showDefaultData() {
        const now = new Date();
        this.orderNumberEl.textContent = '#' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        this.orderAmountEl.innerHTML = `💰 الإجمالي: <span style="color: #D4AF37; font-weight: 700;">0 د.إ</span>`;
        this.orderTimeEl.textContent = `🕓 ${now.toLocaleString('ar-AE')}`;
    }
    
    /**
     * إنشاء مؤثرات احتفالية
     */
    createConfetti() {
        const colors = ['#D4AF37', '#25D366', '#1e3c72', '#FFD700', '#FF6B6B'];
        const particleCount = 60;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = Math.random() * 0.5 + 's';
            particle.style.animationDuration = (Math.random() * 1 + 2.5) + 's';
            document.body.appendChild(particle);
            
            // حذف العنصر بعد الانتهاء
            setTimeout(() => particle.remove(), 3500);
        }
    }
    
    /**
     * تنظيف البيانات تلقائياً
     */
    startAutoCleanup() {
        setTimeout(() => {
            localStorage.removeItem('emirates_cart_data');
            localStorage.removeItem('emirates_cart_total');
            localStorage.removeItem('emirates_cart_count');
            console.log('%c✅ تم تنظيف بيانات السلة', 'color: #27ae60; font-weight: bold;');
        }, 5000);
    }
}

// التهيئة عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ThankYouPage();
    });
} else {
    new ThankYouPage();
}

// إضافة أنماط CSS للمؤثرات
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-100vh) rotateZ(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotateZ(720deg) scale(0);
            opacity: 0;
        }
    }
    
    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        pointer-events: none;
        animation: confettiFall 3s ease-in forwards;
        z-index: 9999;
    }
`;
document.head.appendChild(style);