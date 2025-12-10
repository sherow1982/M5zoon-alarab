// نظام واجهة المستخدم - متجر هدايا الإمارات
// تم إصلاح جميع الأخطاء في الكونسول

// دالة آمنة للحصول على العنصر
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`⚠️ العنصر غير موجود: ${id}`);
        return null;
    }
    return element;
}

// دالة آمنة لإضافة/إزالة الكلاسات
function safeToggleClass(element, className, condition) {
    if (!element) return;
    
    try {
        if (condition) {
            if (!element.classList.contains(className)) {
                element.classList.add(className);
            }
        } else {
            if (element.classList.contains(className)) {
                element.classList.remove(className);
            }
        }
    } catch (error) {
        console.warn(`⚠️ خطأ في إدارة الكلاس ${className}:`, error);
    }
}

// متغيرات العناصر
let backToTopButton = null;
let header = null;
let progressBar = null;
let mobileMenuBtn = null;
let mobileSidebar = null;
let mobileOverlay = null;

// دالة تهيئة العناصر
function initElements() {
    backToTopButton = safeGetElement('backToTop') || safeGetElement('back-to-top');
    header = safeGetElement('header');
    progressBar = safeGetElement('progressBar');
    mobileMenuBtn = safeGetElement('openSidebar');
    mobileSidebar = safeGetElement('mobileSidebar');
    mobileOverlay = safeGetElement('mobileOverlay');
    
    console.log('🔄 تم تهيئة عناصر UI:', {
        backToTop: !!backToTopButton,
        header: !!header,
        progressBar: !!progressBar,
        mobileMenu: !!mobileMenuBtn
    });
}

// دالة التمرير الآمنة
const scrollFunction = () => {
    try {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        
        // زر العودة للأعلى
        safeToggleClass(backToTopButton, 'show', scrollY > 300);
        
        // الهيدر الثابت
        safeToggleClass(header, 'scrolled', scrollY > 100);
        
        // شريط التقدم
        if (progressBar) {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollPercent = scrollY / (docHeight - winHeight);
            const progressWidth = Math.min(Math.max(scrollPercent * 100, 0), 100);
            progressBar.style.width = `${progressWidth}%`;
        }
        
    } catch (error) {
        console.warn('⚠️ خطأ في دالة التمرير:', error);
    }
};

// دالة العودة للأعلى
const scrollToTop = () => {
    try {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } catch (error) {
        // fallback للمتصفحات القديمة
        window.scrollTo(0, 0);
    }
};

// دالة فتح/إغلاق القائمة الجانبية
function toggleMobileMenu(show) {
    try {
        safeToggleClass(mobileSidebar, 'show', show);
        safeToggleClass(mobileOverlay, 'show', show);
        safeToggleClass(document.body, 'menu-open', show);
    } catch (error) {
        console.warn('⚠️ خطأ في إدارة القائمة الجانبية:', error);
    }
}

// دالة التنقل السلس
function smoothScroll(target) {
    try {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    } catch (error) {
        console.warn(`⚠️ خطأ في التنقل السلس إلى: ${target}`, error);
    }
}

// تهيئة الأحداث
function initEventListeners() {
    // حدث التمرير
    window.addEventListener('scroll', scrollFunction, { passive: true });
    
    // زر العودة للأعلى
    if (backToTopButton) {
        backToTopButton.addEventListener('click', scrollToTop);
    }
    
    // قائمة الجوال
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
    }
    
    // إغلاق القائمة الجانبية
    const closeMobileBtn = safeGetElement('closeSidebar');
    if (closeMobileBtn) {
        closeMobileBtn.addEventListener('click', () => toggleMobileMenu(false));
    }
    
    // إغلاق عند النقر خارج القائمة
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));
    }
    
    // التنقل السلس للروابط الداخلية
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = link.getAttribute('href');
            smoothScroll(target);
        }
    });
    
    console.log('✅ تم تهيئة جميع أحداث UI بنجاح');
}

// دالة إضافة ستايل ديناميكي
function addDynamicStyles() {
    if (document.querySelector('#dynamic-ui-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'dynamic-ui-styles';
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #D4AF37, #B8941F);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.4s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background: linear-gradient(135deg, #B8941F, #D4AF37);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6);
        }
        
        .header.scrolled {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 4px;
            background: linear-gradient(90deg, #D4AF37, #00A16B, #C8102E);
            z-index: 9999;
            transition: width 0.3s ease;
        }
        
        .mobile-sidebar.show {
            transform: translateX(0);
        }
        
        .mobile-overlay.show {
            display: block;
            opacity: 1;
        }
        
        body.menu-open {
            overflow: hidden;
        }
    `;
    
    document.head.appendChild(style);
}

// تهيئة شاملة عند تحميل الصفحة
function initUI() {
    try {
        console.log('🚀 بدء تهيئة واجهة المستخدم...');
        
        // تهيئة العناصر
        initElements();
        
        // إضافة الستايلات
        addDynamicStyles();
        
        // تهيئة الأحداث
        initEventListeners();
        
        // تشغيل دالة التمرير مرة واحدة
        scrollFunction();
        
        console.log('✅ تم تهيئة واجهة المستخدم بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة واجهة المستخدم:', error);
    }
}

// التهيئة عند تحميل DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}

// التهيئة عند تحميل النافذة (احتياطي)
window.addEventListener('load', () => {
    setTimeout(initUI, 500);
});

// تصدير الواجهات للاستخدام الخارجي
window.UISystem = {
    initUI,
    scrollToTop,
    toggleMobileMenu,
    smoothScroll,
    scrollFunction
};

console.log('📋 نظام واجهة المستخدم محمل ومجهز');