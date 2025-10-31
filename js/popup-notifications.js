// نظام الرسالة المنبثقة الوحيدة - محسن للموبايل
class SinglePopupNotification {
    constructor() {
        this.customerNames = [
            'أحمد المنصوري', 'محمد النقبي', 'سالم الشامسي', 'خالد البلوشي', 'راشد الكعبي',
            'عبدالله الزعابي', 'سعيد المهيري', 'فيصل العتيبة', 'طارق الطاير',
            'فاطمة النعيمي', 'عائشة الشحي', 'مريم البدواوي', 'نورا الطنيجي', 'سارة القبيسي',
            'شما المزروعي', 'هند الرميثي', 'لطيفة الشرهان'
        ];
        
        this.products = [
            'عطر كوكو شانيل 100 مل', 'عطر جوتشي فلورا', 'عطر جوتشي بلوم',
            'عطر سوفاج ديور 100 مل', 'عطر فرزاتشي ايروس',
            'ساعة رولكس يخت ماستر', 'ساعة Rolex كلاسيكية',
            'ساعة اوميغا سواتش', 'ساعة رولكس أنيقة'
        ];
        
        this.isActive = true;
        this.currentPopup = null;
        this.popupInterval = null;
    }

    getRandomData() {
        const customer = this.customerNames[Math.floor(Math.random() * this.customerNames.length)];
        const product = this.products[Math.floor(Math.random() * this.products.length)];
        const timeAgo = Math.floor(Math.random() * 15) + 1;
        return { customer, product, timeAgo };
    }

    showPopup() {
        // إزالة أي رسالة موجودة
        if (this.currentPopup) {
            this.hidePopup();
        }

        const { customer, product, timeAgo } = this.getRandomData();
        
        this.currentPopup = document.createElement('div');
        this.currentPopup.className = 'single-popup-notification';
        
        // تطبيق الأنماط مباشرة
        this.currentPopup.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #25D366, #20B358);
            color: white;
            padding: 20px 25px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(37, 211, 102, 0.3);
            z-index: 10000;
            font-family: 'Cairo', Arial, sans-serif;
            font-weight: 600;
            font-size: 15px;
            max-width: 380px;
            animation: popupBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            cursor: pointer;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
        `;

        this.currentPopup.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 15px; position: relative;">
                <!-- زر الإغلاق الواضح -->
                <button onclick="window.SinglePopupSystem.hidePopup()" 
                        style="position: absolute; top: -15px; right: -15px; 
                               background: #ff4757; color: white; 
                               border: none; width: 35px; height: 35px; 
                               border-radius: 50%; cursor: pointer; 
                               font-size: 18px; font-weight: bold;
                               box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
                               display: flex; align-items: center; justify-content: center;
                               transition: all 0.3s ease;"
                        onmouseover="this.style.transform='scale(1.15)'; this.style.boxShadow='0 6px 20px rgba(255, 71, 87, 0.6)'"
                        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(255, 71, 87, 0.4)'"
                        aria-label="إغلاق الإشعار">
                    ✕
                </button>
                
                <!-- أيقونة التسوق -->
                <div style="flex-shrink: 0; margin-top: 3px;">
                    <div style="width: 50px; height: 50px; background: rgba(255, 255, 255, 0.2); 
                                border-radius: 50%; display: flex; align-items: center; 
                                justify-content: center; font-size: 22px;
                                box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);">
                        🛍️
                    </div>
                </div>
                
                <!-- محتوى الرسالة -->
                <div style="flex: 1; line-height: 1.4;">
                    <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px; display: flex; align-items: center; gap: 5px;">
                        🔥 عميل جديد اشترى الآن:
                    </div>
                    <div style="font-weight: 800; margin-bottom: 8px; color: #FFD700; font-size: 16px;">
                        ${customer}
                    </div>
                    <div style="font-size: 13px; opacity: 0.9; line-height: 1.3; margin-bottom: 6px;">
                        "${product}"
                    </div>
                    <div style="font-size: 11px; opacity: 0.7; display: flex; align-items: center; gap: 5px;">
                        ⏰ منذ ${timeAgo} دقيقة • مع ضمان الجودة
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.currentPopup);
        
        // إخفاء تلقائي بعد 10 ثوانٍ
        setTimeout(() => {
            this.hidePopup();
        }, 10000);
        
        // النقر للانتقال للمنتجات
        this.currentPopup.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                window.open('./products-showcase.html', '_blank');
            }
        });
    }

    hidePopup() {
        if (this.currentPopup && this.currentPopup.parentNode) {
            this.currentPopup.style.animation = 'popupBounceOut 0.5s ease-in forwards';
            setTimeout(() => {
                if (this.currentPopup && this.currentPopup.parentNode) {
                    this.currentPopup.remove();
                    this.currentPopup = null;
                }
            }, 500);
        }
    }

    startSystem() {
        if (!this.isActive) return;

        console.log('🔔 تم تشغيل نظام الرسالة المنبثقة - كل 20 ثانية');
        
        // أول رسالة بعد 6 ثوانِ
        setTimeout(() => {
            this.showPopup();
        }, 6000);

        // تكرار كل 20 ثانية (رسالة واحدة فقط)
        this.popupInterval = setInterval(() => {
            if (this.isActive && !this.currentPopup) {
                this.showPopup();
            }
        }, 20000);
    }

    stopSystem() {
        this.isActive = false;
        if (this.popupInterval) {
            clearInterval(this.popupInterval);
            this.popupInterval = null;
        }
        this.hidePopup();
    }

    addPopupStyles() {
        // تجنب إضافة الأنماط أكثر من مرة
        if (document.querySelector('#single-popup-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'single-popup-styles';
        style.textContent = `
            /* أنيميشن الرسالة المنبثقة */
            @keyframes popupBounceIn {
                0% { 
                    transform: translateX(120%) scale(0.7); 
                    opacity: 0; 
                }
                60% {
                    transform: translateX(-10px) scale(1.05);
                    opacity: 0.9;
                }
                100% { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
            }
            
            @keyframes popupBounceOut {
                0% { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
                100% { 
                    transform: translateX(120%) scale(0.8); 
                    opacity: 0; 
                }
            }
            
            /* تأثيرات التفاعل */
            .single-popup-notification:hover {
                transform: translateY(-3px) scale(1.02) !important;
                box-shadow: 0 15px 50px rgba(37, 211, 102, 0.5) !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            /* تصميم متجاوب للهواتف الذكية */
            @media (max-width: 480px) {
                .single-popup-notification {
                    left: 10px !important;
                    right: 10px !important;
                    bottom: 10px !important;
                    max-width: none !important;
                    width: calc(100vw - 20px) !important;
                    padding: 16px 18px !important;
                    font-size: 14px !important;
                    border-radius: 16px !important;
                }
                
                .single-popup-notification button {
                    top: -12px !important;
                    right: -12px !important;
                    width: 32px !important;
                    height: 32px !important;
                    font-size: 16px !important;
                }
            }
            
            /* تصميم للهواتف المتوسطة */
            @media (min-width: 481px) and (max-width: 768px) {
                .single-popup-notification {
                    left: 15px !important;
                    right: 15px !important;
                    bottom: 15px !important;
                    max-width: none !important;
                    width: calc(100vw - 30px) !important;
                    padding: 18px 20px !important;
                    font-size: 15px !important;
                }
            }
            
            /* تصميم للتابلت */
            @media (min-width: 769px) and (max-width: 1024px) {
                .single-popup-notification {
                    max-width: 360px !important;
                    bottom: 25px !important;
                    right: 25px !important;
                    font-size: 15px !important;
                }
            }
            
            /* تصميم للشاشات الكبيرة */
            @media (min-width: 1025px) {
                .single-popup-notification {
                    max-width: 400px !important;
                    bottom: 30px !important;
                    right: 30px !important;
                    font-size: 16px !important;
                }
            }
            
            /* تأكد من ظهور الرسالة فوق كل شيء */
            .single-popup-notification {
                z-index: 999999 !important;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// النظام الرئيسي
document.addEventListener('DOMContentLoaded', function() {
    const popupSystem = new SinglePopupNotification();
    
    // إضافة الأنماط
    popupSystem.addPopupStyles();
    
    // إنشاء نظام الرسالة الواحدة
    let currentNotification = null;
    let notificationTimer = null;
    
    function showSingleNotification() {
        // إزالة أي رسالة موجودة
        if (currentNotification) {
            hideSingleNotification();
        }
        
        const data = popupSystem.getRandomData();
        
        currentNotification = document.createElement('div');
        currentNotification.className = 'single-popup-notification';
        
        // تطبيق التصميم المتجاوب
        currentNotification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #25D366, #20B358);
            color: white;
            padding: 20px 25px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(37, 211, 102, 0.3);
            z-index: 999999;
            font-family: 'Cairo', Arial, sans-serif;
            font-weight: 600;
            font-size: 15px;
            max-width: 380px;
            animation: popupBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            cursor: pointer;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;

        currentNotification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 15px; position: relative;">
                <!-- زر الإغلاق الواضح -->
                <button onclick="hideSingleNotification()" 
                        style="position: absolute; top: -15px; right: -15px; 
                               background: #ff4757; color: white; 
                               border: none; width: 35px; height: 35px; 
                               border-radius: 50%; cursor: pointer; 
                               font-size: 18px; font-weight: bold;
                               box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
                               display: flex; align-items: center; justify-content: center;
                               transition: all 0.3s ease;"
                        onmouseover="this.style.transform='scale(1.15)'"
                        onmouseout="this.style.transform='scale(1)'"
                        title="إغلاق">
                    ✕
                </button>
                
                <!-- رمز التسوق -->
                <div style="flex-shrink: 0; margin-top: 3px;">
                    <div style="width: 50px; height: 50px; background: rgba(255, 255, 255, 0.2); 
                                border-radius: 50%; display: flex; align-items: center; 
                                justify-content: center; font-size: 24px;">
                        🛍️
                    </div>
                </div>
                
                <!-- محتوى الرسالة -->
                <div style="flex: 1; line-height: 1.4;">
                    <div style="font-size: 12px; opacity: 0.85; margin-bottom: 4px;">
                        🔥 عميل جديد اشترى:
                    </div>
                    <div style="font-weight: 800; margin-bottom: 8px; color: #FFD700; font-size: 16px;">
                        ${data.customer}
                    </div>
                    <div style="font-size: 13px; opacity: 0.9; line-height: 1.3; margin-bottom: 6px;">
                        "${data.product}"
                    </div>
                    <div style="font-size: 11px; opacity: 0.7; display: flex; align-items: center; gap: 5px;">
                        ⏰ منذ ${data.timeAgo} دقيقة
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(currentNotification);
        
        // إخفاء تلقائي بعد 12 ثانية
        setTimeout(() => {
            hideSingleNotification();
        }, 12000);
        
        // النقر للانتقال للمنتجات
        currentNotification.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                window.open('./products-showcase.html', '_blank');
            }
        });
    }
    
    function hideSingleNotification() {
        if (currentNotification && currentNotification.parentNode) {
            currentNotification.style.animation = 'popupBounceOut 0.5s ease-in forwards';
            setTimeout(() => {
                if (currentNotification && currentNotification.parentNode) {
                    currentNotification.remove();
                    currentNotification = null;
                }
            }, 500);
        }
    }
    
    // جعل الدوال متاحة عالمياً
    window.showSingleNotification = showSingleNotification;
    window.hideSingleNotification = hideSingleNotification;
    window.SinglePopupSystem = { hidePopup: hideSingleNotification };
    
    // بدء النظام بعد تحميل الصفحة
    window.addEventListener('load', () => {
        // أول رسالة بعد 8 ثوانٍ
        setTimeout(showSingleNotification, 8000);
        
        // تكرار كل 20 ثانية (رسالة واحدة فقط)
        notificationTimer = setInterval(() => {
            if (!currentNotification) {
                showSingleNotification();
            }
        }, 20000);
    });
    
    // إيقاف عند إغلاق الصفحة
    window.addEventListener('beforeunload', () => {
        if (notificationTimer) {
            clearInterval(notificationTimer);
        }
        hideSingleNotification();
    });
    
    console.log('🎯 تم تفعيل نظام الرسالة المنبثقة الواحدة - كل 20 ثانية مع تصميم متجاوب');
});