// نظام الرسائل المنبثقة المحسّن - رسالة واحدة فقط
class SmartPopupNotifications {
    constructor() {
        this.customerNames = [
            'أحمد المنصوري', 'محمد النقبي', 'سالم الشامسي', 'خالد البلوشي', 'راشد الكعبي',
            'عبدالله الزعابي', 'سعيد المهيري', 'فيصل العتيبة', 'طارق الطاير',
            'حمدان بن راشد', 'زايد الشرقي', 'ماجد النيادي', 'جاسم الحوسني',
            'فاطمة النعيمي', 'عائشة الشحي', 'مريم البدواوي', 'نورا الطنيجي',
            'سارة القبيسي', 'شما المزروعي', 'هند الرميثي', 'لطيفة الشرهان'
        ];
        
        this.products = [
            'عطر كوكو شانيل 100 مل', 'عطر جوتشي فلورا', 'عطر جوتشي بلوم',
            'عطر سوفاج ديور 100 مل', 'عطر فرزاتشي ايروس',
            'ساعة رولكس يخت ماستر', 'ساعة Rolex كلاسيكية',
            'ساعة اوميغا سواتش', 'ساعة رولكس أنيقة'
        ];
        
        this.isActive = true;
        this.currentNotification = null;
        this.notificationInterval = null;
        this.lastShownTime = 0;
    }

    getRandomData() {
        const customer = this.customerNames[Math.floor(Math.random() * this.customerNames.length)];
        const product = this.products[Math.floor(Math.random() * this.products.length)];
        return { customer, product };
    }

    createSingleNotification() {
        // تأكد من عدم وجود رسالة قديمة
        if (this.currentNotification) {
            this.hideNotification();
        }

        const { customer, product } = this.getRandomData();
        
        this.currentNotification = document.createElement('div');
        this.currentNotification.className = 'smart-popup-notification';
        
        // أنماط CSS مدمجة لضمان التوافق مع جميع الأجهزة
        this.currentNotification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 10px 35px rgba(102, 126, 234, 0.4);
            z-index: 10001;
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: 600;
            font-size: 16px;
            max-width: 380px;
            width: calc(100vw - 40px);
            animation: popupSlideIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            cursor: pointer;
            border: 3px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(15px);
            transform-origin: bottom right;
        `;

        this.currentNotification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; position: relative;">
                <button onclick="window.SmartPopupNotifications.hideNotification()" 
                        style="position: absolute; top: -10px; right: -10px; 
                               background: rgba(255, 255, 255, 0.9); color: #333; 
                               border: none; width: 30px; height: 30px; 
                               border-radius: 50%; cursor: pointer; 
                               font-size: 16px; font-weight: bold;
                               box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                               display: flex; align-items: center; justify-content: center;
                               transition: all 0.3s ease;"
                        onmouseover="this.style.background='#ff4757'; this.style.color='white'; this.style.transform='scale(1.1)'"
                        onmouseout="this.style.background='rgba(255, 255, 255, 0.9)'; this.style.color='#333'; this.style.transform='scale(1)'"
                        aria-label="إغلاق الإشعار">
                    ×
                </button>
                
                <div style="flex-shrink: 0; margin-top: 5px;">
                    <div style="width: 55px; height: 55px; background: rgba(255, 255, 255, 0.25); 
                                border-radius: 50%; display: flex; align-items: center; 
                                justify-content: center; font-size: 24px;
                                box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);">
                        🛍️
                    </div>
                </div>
                
                <div style="flex: 1; line-height: 1.4;">
                    <div style="font-size: 13px; opacity: 0.85; margin-bottom: 3px;">
                        📷 عميل جديد اشترى الآن:
                    </div>
                    <div style="font-weight: 800; margin-bottom: 8px; color: #FFD700; font-size: 17px;">
                        ${customer}
                    </div>
                    <div style="font-size: 14px; opacity: 0.95; line-height: 1.3;">
                        "اشترى ${product} مع ضمان الجودة"
                    </div>
                    <div style="font-size: 11px; margin-top: 6px; opacity: 0.7; display: flex; align-items: center; gap: 5px;">
                        <i class="fas fa-clock" style="font-size: 10px;"></i>
                        منذ ${Math.floor(Math.random() * 15) + 1} دقيقة
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.currentNotification);
        
        // إخفاء تلقائي بعد 12 ثانية
        setTimeout(() => {
            this.hideNotification();
        }, 12000);
        
        // حدث النقر للانتقال للمنتجات
        this.currentNotification.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                window.open('./products-showcase.html', '_blank');
            }
        });
    }

    hideNotification() {
        if (this.currentNotification && this.currentNotification.parentNode) {
            this.currentNotification.style.animation = 'popupSlideOut 0.5s ease-in forwards';
            setTimeout(() => {
                if (this.currentNotification && this.currentNotification.parentNode) {
                    this.currentNotification.remove();
                    this.currentNotification = null;
                }
            }, 500);
        }
    }

    startNotifications() {
        if (!this.isActive) return;

        // عرض أول رسالة بعد 8 ثوانِ
        setTimeout(() => {
            this.createSingleNotification();
        }, 8000);

        // تكرار كل 20 ثانية (رسالة واحدة فقط)
        this.notificationInterval = setInterval(() => {
            if (this.isActive && !this.currentNotification) {
                this.createSingleNotification();
            }
        }, 20000);
    }

    stopNotifications() {
        this.isActive = false;
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
            this.notificationInterval = null;
        }
        this.hideNotification();
    }

    addResponsiveCSS() {
        if (document.querySelector('#smart-popup-css')) return;
        
        const style = document.createElement('style');
        style.id = 'smart-popup-css';
        style.textContent = `
            /* أنماشن الرسائل المنبثقة */
            @keyframes popupSlideIn {
                0% { 
                    transform: translateX(120%) scale(0.8); 
                    opacity: 0; 
                }
                50% {
                    transform: translateX(0) scale(1.05);
                    opacity: 0.8;
                }
                100% { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
            }
            
            @keyframes popupSlideOut {
                0% { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
                100% { 
                    transform: translateX(120%) scale(0.9); 
                    opacity: 0; 
                }
            }
            
            /* تأثيرات التفاعل */
            .smart-popup-notification:hover {
                transform: translateY(-5px) scale(1.02);
                box-shadow: 0 15px 45px rgba(102, 126, 234, 0.6);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* تصميم متجاوب للهواتف */
            @media (max-width: 768px) {
                .smart-popup-notification {
                    left: 15px !important;
                    right: 15px !important;
                    bottom: 15px !important;
                    max-width: none !important;
                    width: calc(100vw - 30px) !important;
                    padding: 18px !important;
                    font-size: 15px !important;
                    border-radius: 18px !important;
                }
                
                .smart-popup-notification button {
                    top: -8px !important;
                    right: -8px !important;
                    width: 32px !important;
                    height: 32px !important;
                    font-size: 18px !important;
                }
            }
            
            /* تصميم متجاوب للأجهزة اللوحية */
            @media (min-width: 769px) and (max-width: 1024px) {
                .smart-popup-notification {
                    max-width: 350px !important;
                    bottom: 25px !important;
                    right: 25px !important;
                    font-size: 15px !important;
                }
            }
            
            /* تصميم للشاشات الكبيرة */
            @media (min-width: 1025px) {
                .smart-popup-notification {
                    max-width: 400px !important;
                    bottom: 30px !important;
                    right: 30px !important;
                    font-size: 16px !important;
                }
            }
            
            /* تصميم للشاشات العريضة جداً */
            @media (min-width: 1400px) {
                .smart-popup-notification {
                    max-width: 450px !important;
                    bottom: 40px !important;
                    right: 40px !important;
                    font-size: 17px !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    init() {
        if (!this.isActive) return;
        
        console.log('🔔 تم تفعيل نظام الرسائل المنبثقة الذكي');
        
        // إضافة CSS
        this.addResponsiveCSS();
        
        // بدء عرض الرسائل
        this.startNotifications();
    }

    destroy() {
        console.log('📵 تم إيقاف نظام الرسائل المنبثقة');
        this.stopNotifications();
    }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء مثيل عام للنظام
    window.SmartPopupNotifications = new SmartPopupNotifications();
    
    // بدء النظام بعد تحميل الصفحة بالكامل
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.SmartPopupNotifications.init();
        }, 3000);
    });
    
    // إيقاف عند إغلاق النافذة
    window.addEventListener('beforeunload', () => {
        if (window.SmartPopupNotifications) {
            window.SmartPopupNotifications.destroy();
        }
    });
    
    console.log('🎆 تم تحميل نظام الرسائل المنبثقة الذكي - رسالة واحدة كل 20 ثانية');
});