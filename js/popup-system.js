// نظام البوب أب الاحترافي - متجر هدايا الإمارات
// يظهر كل 20 ثانية ويمكن إغلاقه على جميع الأجهزة

window.EmiratesPopupSystem = {
    isActive: true,
    interval: null,
    lastShown: 0,
    DISPLAY_INTERVAL: 20000, // 20 ثانية
    STORAGE_KEY: 'emirates_popup_dismissed',
    
    // إنشاء البوب أب
    createPopup() {
        const popup = document.createElement('div');
        popup.id = 'emirates-popup';
        popup.className = 'emirates-popup';
        
        popup.innerHTML = `
            <div class="popup-overlay"></div>
            <div class="popup-container">
                <button class="popup-close" onclick="EmiratesPopupSystem.dismissPopup()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="popup-content">
                    <div class="popup-icon">
                        🎁
                    </div>
                    <h3 class="popup-title">عروض حصرية لفترة محدودة!</h3>
                    <p class="popup-message">
                        احصل على خصم <strong>15%</strong> على جميع العطور عالية الجودة
                        <br>
                        <small>✨ توصيل مجاني خلال 1-3 أيام عمل</small>
                    </p>
                    
                    <div class="popup-actions">
                        <a href="./products-showcase.html" class="popup-btn primary">
                            <i class="fas fa-shopping-bag"></i>
                            تسوق الآن
                        </a>
                        <a href="https://wa.me/201110760081?text=مرحباً! أريد الاستفادة من العرض الحصري 15%" 
                           class="popup-btn secondary" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            واتساب
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        return popup;
    },
    
    // عرض البوب أب
    showPopup() {
        // تحقق من عدم وجود بوب أب مفتوح
        if (document.querySelector('#emirates-popup')) {
            return;
        }
        
        const now = Date.now();
        
        // تحقق من الوقت المنقضي منذ آخر عرض
        if (now - this.lastShown < this.DISPLAY_INTERVAL) {
            return;
        }
        
        // تحقق من عدم إغلاق المستخدم للبوب أب نهائياً
        if (localStorage.getItem(this.STORAGE_KEY) === 'true') {
            return;
        }
        
        const popup = this.createPopup();
        document.body.appendChild(popup);
        
        // تأثير الظهور
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);
        
        this.lastShown = now;
        
        // إغلاق تلقائي بعد 10 ثوان
        setTimeout(() => {
            this.hidePopup();
        }, 10000);
        
        console.log('🎪 تم عرض البوب أب الترويجي');
    },
    
    // إخفاء البوب أب
    hidePopup() {
        const popup = document.querySelector('#emirates-popup');
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 400);
        }
    },
    
    // إغلاق البوب أب نهائياً
    dismissPopup() {
        this.hidePopup();
        // حفظ حالة الإغلاق لمدة ساعة
        const dismissTime = Date.now() + (60 * 60 * 1000); // ساعة واحدة
        localStorage.setItem(this.STORAGE_KEY, 'true');
        setTimeout(() => {
            localStorage.removeItem(this.STORAGE_KEY);
        }, 60 * 60 * 1000);
        
        console.log('❌ تم إغلاق البوب أب نهائياً لمدة ساعة');
    },
    
    // بدء النظام
    start() {
        if (!this.isActive) return;
        
        // أول عرض بعد 20 ثانية من التحميل
        setTimeout(() => {
            this.showPopup();
        }, this.DISPLAY_INTERVAL);
        
        // عرض دوري كل 20 ثانية
        this.interval = setInterval(() => {
            this.showPopup();
        }, this.DISPLAY_INTERVAL);
        
        console.log('⏰ تم بدء نظام البوب أب - عرض كل 20 ثانية');
    },
    
    // إيقاف النظام
    stop() {
        this.isActive = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.hidePopup();
        
        console.log('⏹️ تم إيقاف نظام البوب أب');
    },
    
    // إضافة الستايل
    addStyles() {
        if (document.querySelector('#emirates-popup-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'emirates-popup-styles';
        style.textContent = `
            .emirates-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s ease;
            }
            
            .emirates-popup.show {
                opacity: 1;
                visibility: visible;
            }
            
            .popup-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            }
            
            .popup-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 450px;
                width: 90%;
                padding: 0;
                overflow: hidden;
                transition: transform 0.4s ease;
                border: 3px solid #D4AF37;
            }
            
            .emirates-popup.show .popup-container {
                transform: translate(-50%, -50%) scale(1);
            }
            
            .popup-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 35px;
                height: 35px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #666;
                transition: all 0.3s ease;
                z-index: 10001;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            
            .popup-close:hover {
                background: #C8102E;
                color: white;
                transform: rotate(90deg);
            }
            
            .popup-content {
                padding: 40px 30px 30px 30px;
                text-align: center;
                background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
                color: white;
                position: relative;
            }
            
            .popup-content::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 6px;
                background: linear-gradient(90deg, #00A16B, #C8102E, #D4AF37);
            }
            
            .popup-icon {
                font-size: 4rem;
                margin-bottom: 20px;
                display: block;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
            }
            
            .popup-title {
                font-size: 1.5rem;
                font-weight: 800;
                margin-bottom: 15px;
                color: white;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .popup-message {
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 25px;
                color: rgba(255, 255, 255, 0.95);
            }
            
            .popup-message strong {
                font-size: 1.3em;
                color: #FFE55C;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            }
            
            .popup-message small {
                display: block;
                margin-top: 8px;
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.9em;
            }
            
            .popup-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 25px;
            }
            
            .popup-btn {
                padding: 15px 20px;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 700;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.3s ease;
                cursor: pointer;
                font-family: 'Cairo', sans-serif;
            }
            
            .popup-btn.primary {
                background: white;
                color: #D4AF37;
                box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
            }
            
            .popup-btn.primary:hover {
                background: #f8f9fa;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4);
            }
            
            .popup-btn.secondary {
                background: #25D366;
                color: white;
                box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
            }
            
            .popup-btn.secondary:hover {
                background: #20b358;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
            }
            
            /* تصميم متجاوب للجوال */
            @media (max-width: 480px) {
                .popup-container {
                    max-width: 95%;
                    margin: 20px;
                }
                
                .popup-content {
                    padding: 30px 20px 25px 20px;
                }
                
                .popup-icon {
                    font-size: 3rem;
                }
                
                .popup-title {
                    font-size: 1.3rem;
                }
                
                .popup-message {
                    font-size: 1rem;
                }
                
                .popup-actions {
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
            }
            
            /* تأثيرات دخول وخروج */
            @keyframes popupFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.7);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            @keyframes popupFadeOut {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.7);
                }
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // تهيئة النظام
    init() {
        this.addStyles();
        
        // بدء العرض بعد تحميل الصفحة بالكامل
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.start();
            }, 2000); // انتظار 2 ثانية بعد تحميل الصفحة
        });
        
        console.log('🎪 تم تهيئة نظام البوب أب - عرض كل 20 ثانية');
    }
};

// بدء النظام تلقائياً
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        EmiratesPopupSystem.init();
    });
} else {
    EmiratesPopupSystem.init();
}