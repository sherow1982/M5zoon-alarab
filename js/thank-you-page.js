/**
 * صفحة شكراً
 * عرض بيانات الطلب والاحتفالات
 * Emirates Gifts v3.0
 */

class ThankYouPage {
    constructor() {
        this.orderNumber = document.getElementById('orderNumber');
        this.orderAmount = document.getElementById('orderAmount');
        this.orderTime = document.getElementById('orderTime');
        
        this.init();
    }
    
    /**
     * التهيئة
     */
    init() {
        this.displayOrderData();
        this.createConfetti();
        this.startAutoCleanup();
    }
    
    /**
     * عرض بيانات الطلب
     */
    displayOrderData() {
        try {
            const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
            
            if (!lastOrder) {
                this.showDefaultData();
                return;
            }
            
            // عرض البيانات
            this.orderNumber.textContent = lastOrder.number;
            this.orderAmount.textContent = lastOrder.amount + ' د.إ';
            this.orderTime.textContent = lastOrder.date;
            
            console.log('✅ تم تحميل بيانات الطلب بنجاح');
        } catch (error) {
            console.error('❌ خطأ تحميل البيانات:', error);
            this.showDefaultData();
        }
    }
    
    /**
     * عرض بيانات افتراضية
     */
    showDefaultData() {
        const now = new Date();
        this.orderNumber.textContent = '#' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        this.orderAmount.textContent = '0 د.إ';
        this.orderTime.textContent = now.toLocaleString('ar-AE');
    }
    
    /**
     * إنشاء مأثرات احتفالية
     */
    createConfetti() {
        const colors = ['#D4AF37', '#25D366', '#1e3c72', '#FFD700', '#FF6B6B'];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(particle);
            
            // حذف العنصر بعد الانتهاء
            setTimeout(() => particle.remove(), 3000);
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
            console.log('✅ تم تنظيف بيانات السلة');
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

// إضافة أنماط CSS للمأثرات
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