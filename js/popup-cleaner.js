// منظف الرسائل المنبثقة - يقوم بإزالة أي رسائل منبثقة مبرمجة أخرى

class PopupCleaner {
    constructor() {
        this.allowedPopupClass = 'single-popup-notification';
        this.init();
    }

    init() {
        this.startCleaning();
        this.observeForNewPopups();
        console.log('🧧 تم تفعيل منظف الرسائل المنبثقة - رسالة واحدة فقط');
    }

    startCleaning() {
        // تنظيف فوري
        this.cleanExistingPopups();
        
        // تنظيف دوري كل 5 ثوانٍ
        setInterval(() => {
            this.cleanExistingPopups();
        }, 5000);
    }

    cleanExistingPopups() {
        // قائمة بجميع أنواع الرسائل المنبثقة الشائعة
        const popupSelectors = [
            '.notification:not(.single-popup-notification)',
            '.popup:not(.single-popup-notification)',
            '.toast:not(.single-popup-notification)', 
            '.alert:not(.single-popup-notification)',
            '.modal:not(.single-popup-notification)',
            '.overlay:not(.single-popup-notification)',
            '.banner:not(.top-banner):not(.single-popup-notification)',
            '.popup-notification:not(.single-popup-notification)',
            '.notif:not(.single-popup-notification)',
            '.message-popup:not(.single-popup-notification)',
            '.floating-message:not(.single-popup-notification)',
            '.promo-popup:not(.single-popup-notification)',
            '[class*="popup"]:not(.single-popup-notification)',
            '[class*="notification"]:not(.single-popup-notification)',
            '[class*="alert"]:not(.single-popup-notification)',
            '[class*="toast"]:not(.single-popup-notification)',
            // رسائل التسويق الشائعة
            '.ab-notification',
            '.ab-popup',
            '.purchase-popup',
            '.sale-notification',
            '.discount-popup',
            '.offer-popup'
        ];

        let removedCount = 0;
        
        popupSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (!element.classList.contains(this.allowedPopupClass)) {
                        element.remove();
                        removedCount++;
                    }
                });
            } catch (e) {
                // تجاهل أي أخطاء في الاستعلام
            }
        });

        // إزالة العناصر ذات الموقع الثابت في زوايا الشاشة
        this.removeFixedPositionedPopups();

        if (removedCount > 0) {
            console.log(`🧧 تم إزالة ${removedCount} رسالة منبثقة غير مرغوب فيها`);
        }
    }

    removeFixedPositionedPopups() {
        // البحث عن عناصر ذات موقع ثابت في زوايا الشاشة
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            if (element.classList.contains(this.allowedPopupClass)) {
                return; // تجاهل الرسالة المرغوب فيها
            }

            const styles = window.getComputedStyle(element);
            
            // شروط العناصر المشبوهة
            const isFixedOrAbsolute = styles.position === 'fixed' || styles.position === 'absolute';
            const hasHighZIndex = parseInt(styles.zIndex) > 1000;
            const isInCorner = this.isElementInCorner(element, styles);
            const looksLikePopup = this.looksLikePopup(element);
            
            if (isFixedOrAbsolute && (hasHighZIndex || isInCorner || looksLikePopup)) {
                // تجنب إزالة عناصر هامة
                if (this.isImportantElement(element)) {
                    return;
                }
                
                element.remove();
                console.log('🧧 تم إزالة عنصر منبثق في زاوية الشاشة');
            }
        });
    }

    isElementInCorner(element, styles) {
        const bottom = parseInt(styles.bottom) || 0;
        const right = parseInt(styles.right) || 0;
        const top = parseInt(styles.top) || 0;
        const left = parseInt(styles.left) || 0;
        
        // في إحدى زوايا الشاشة
        return (bottom < 100 || top < 100) && (right < 100 || left < 100);
    }

    looksLikePopup(element) {
        const text = element.textContent?.toLowerCase() || '';
        const className = element.className?.toLowerCase() || '';
        
        // كلمات مفتاحية تدل على رسائل تسويقية أو إعلانات
        const popupKeywords = [
            'عميل', 'اشترى', 'منذ', 'دقيقة', 'خصم', 'عرض',
            'customer', 'bought', 'purchased', 'minutes', 'ago', 'discount', 'sale'
        ];
        
        return popupKeywords.some(keyword => 
            text.includes(keyword) || className.includes(keyword)
        );
    }

    isImportantElement(element) {
        const importantSelectors = [
            'header', 'nav', 'footer', 'main', '.header', '.nav', '.footer', '.main',
            '.menu', '.cart', '.search', '.logo', '.navigation',
            '.top-banner', // بانر الشحن في أعلى الصفحة
            '.back-to-top', // زر العودة لأعلى
            '.mobile-sidebar' // القائمة الجانبية
        ];
        
        return importantSelectors.some(selector => {
            return element.matches(selector) || element.closest(selector);
        });
    }

    observeForNewPopups() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // عقدة عنصر
                        // فحص العنصر الجديد
                        if (this.shouldRemoveElement(node)) {
                            setTimeout(() => {
                                if (node.parentNode && !node.classList.contains(this.allowedPopupClass)) {
                                    node.remove();
                                    console.log('🧧 تم إزالة رسالة منبثقة جديدة');
                                }
                            }, 100);
                        }
                        
                        // فحص العناصر الفرعية
                        node.querySelectorAll?.('*').forEach(child => {
                            if (this.shouldRemoveElement(child)) {
                                setTimeout(() => {
                                    if (child.parentNode && !child.classList.contains(this.allowedPopupClass)) {
                                        child.remove();
                                    }
                                }, 100);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    shouldRemoveElement(element) {
        if (!element || !element.classList) return false;
        if (element.classList.contains(this.allowedPopupClass)) return false;
        if (this.isImportantElement(element)) return false;
        
        const className = element.className.toLowerCase();
        const suspiciousClasses = [
            'notification', 'popup', 'toast', 'alert', 'modal', 'overlay',
            'banner', 'ab-', 'promo', 'discount', 'sale', 'offer'
        ];
        
        return suspiciousClasses.some(cls => className.includes(cls));
    }

    // وظيفة عامة للتنظيف اليدوي
    cleanNow() {
        this.cleanExistingPopups();
        console.log('🧧 تم تنظيف جميع الرسائل المنبثقة يدوياً');
    }
}

// تفعيل المنظف فوراً
const popupCleaner = new PopupCleaner();

// تصدير للاستخدام العام
window.popupCleaner = popupCleaner;

// اختصار لوحة مفاتيح للتنظيف اليدوي
// Ctrl+Alt+C لتنظيف جميع الرسائل
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        popupCleaner.cleanNow();
        alert('✅ تم تنظيف جميع الرسائل المنبثقة غير المرغوب فيها!');
    }
});

// التنظيف عند تحميل الصفحة
window.addEventListener('load', () => {
    setTimeout(() => {
        popupCleaner.cleanNow();
    }, 2000);
});

console.log('🧧✨ منظف الرسائل المنبثقة جاهز - بقاء رسالة واحدة فقط!');
