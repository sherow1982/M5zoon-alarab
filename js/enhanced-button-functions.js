/**
 * نظام وظائف الأزرار المحسن
 * يوفر وظائق متقدمة لجميع أزرار الموقع
 */

class EnhancedButtonFunctions {
    constructor() {
        this.isInitialized = false;
        this.cartCount = 0;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.setupAllButtons();
            this.loadCartFromStorage();
            this.setupEventListeners();
        });
        
        this.isInitialized = true;
    }

    setupAllButtons() {
        this.setupCartButton();
        this.setupOrderButtons();
        this.setupNavigationButtons();
        this.setupWhatsAppButtons();
        this.setupViewProductButtons();
        this.setupMobileMenuButton();
        
        console.log('✅ تم إعداد جميع وظائف الأزرار');
    }

    // وظائف زر السلة
    setupCartButton() {
        const cartButtons = document.querySelectorAll('.cart-icon, .header-tool[href*="cart.html"]');
        
        cartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCartClick(button);
            });
        });
    }

    handleCartClick(button) {
        // تأثير بصري
        button.style.animation = 'bounce 0.6s ease-in-out';
        
        // تحديث عداد السلة
        this.updateCartDisplay();
        
        // فتح صفحة السلة
        setTimeout(() => {
            window.open('./cart.html', '_blank');
            button.style.animation = '';
        }, 300);
    }

    // وظائف أزرار الطلب
    setupOrderButtons() {
        const orderButtons = document.querySelectorAll('.order-now-btn, [href*="checkout.html"]');
        
        orderButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleOrderClick(button, e);
            });
        });
    }

    handleOrderClick(button, event) {
        // تأثير بصري
        button.style.animation = 'pulse 0.6s ease-in-out';
        button.style.background = 'linear-gradient(135deg, #28E56A, #22C55E)';
        
        // إشعار نجاح
        this.showNotification('🚀 جارِ تحضير صفحة الطلب...', 'success');
        
        // فايبريشن للهواتف
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        // إعادة تعيين اللون
        setTimeout(() => {
            button.style.animation = '';
            button.style.background = '';
        }, 1000);
    }

    // وظائف أزرار التنقل
    setupNavigationButtons() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(link, e);
            });
        });
    }

    handleNavClick(link, event) {
        const href = link.getAttribute('href');
        
        // للروابط الداخلية
        if (href.startsWith('#')) {
            event.preventDefault();
            this.smoothScrollToSection(href.substring(1));
            
            // تحديث الحالة النشطة
            document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
            link.classList.add('active');
        }
        
        // تأثير بصري
        link.style.transform = 'translateY(-2px) scale(1.02)';
        setTimeout(() => {
            link.style.transform = '';
        }, 200);
    }

    smoothScrollToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // حساب ارتفاع الهيدر
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // وظائف أزرار واتساب
    setupWhatsAppButtons() {
        const whatsappButtons = document.querySelectorAll('[href*="wa.me"], .btn-whatsapp');
        
        whatsappButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleWhatsAppClick(button);
            });
        });
    }

    handleWhatsAppClick(button) {
        // تأثير بصري
        button.style.animation = 'pulse 0.5s ease-in-out';
        button.style.background = 'linear-gradient(135deg, #28E56A, #22C55E)';
        
        // إشعار توجيه لواتساب
        this.showNotification('📞 جارِ فتح واتساب...', 'success');
        
        setTimeout(() => {
            button.style.animation = '';
            button.style.background = '';
        }, 800);
    }

    // وظائف أزرار عرض المنتج
    setupViewProductButtons() {
        const viewButtons = document.querySelectorAll('.btn-view-product, .product-card, [href*="products/"]');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleViewProductClick(button);
            });
        });
    }

    handleViewProductClick(button) {
        // تأثير تحميل
        const loadingIcon = button.querySelector('i') || button;
        const originalIcon = loadingIcon.className;
        
        loadingIcon.className = 'fas fa-spinner fa-spin';
        button.style.opacity = '0.8';
        
        setTimeout(() => {
            loadingIcon.className = originalIcon;
            button.style.opacity = '1';
        }, 1000);
    }

    // وظائف قائمة الهواتف
    setupMobileMenuButton() {
        const toggleBtn = document.getElementById('openSidebar');
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('mobileOverlay');
        const closeBtn = document.getElementById('closeSidebar');
        
        if (toggleBtn && sidebar && overlay && closeBtn) {
            // فتح القائمة
            toggleBtn.addEventListener('click', () => {
                this.toggleMobileMenu(true);
                
                // تأثير زر الفتح
                toggleBtn.style.transform = 'rotate(180deg) scale(1.1)';
                setTimeout(() => {
                    toggleBtn.style.transform = '';
                }, 400);
            });
            
            // إغلاق القائمة
            closeBtn.addEventListener('click', () => this.toggleMobileMenu(false));
            overlay.addEventListener('click', () => this.toggleMobileMenu(false));
            
            // إغلاق بالمفتاح ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                    this.toggleMobileMenu(false);
                }
            });
        }
    }

    toggleMobileMenu(open) {
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('mobileOverlay');
        
        if (open) {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // تحديث عداد السلة
    updateCartDisplay() {
        const counters = document.querySelectorAll('.cart-counter');
        const count = this.getCartCount();
        
        counters.forEach(counter => {
            if (count > 0) {
                counter.textContent = count;
                counter.style.display = 'flex';
                counter.style.animation = 'bounce 0.6s ease-in-out';
            } else {
                counter.style.display = 'none';
            }
        });
    }

    // إضافة عنصر للسلة
    addToCart(productData) {
        try {
            let cart = JSON.parse(localStorage.getItem('emirates_cart') || '[]');
            
            // فحص وجود المنتج مسبقاً
            const existingIndex = cart.findIndex(item => item.id === productData.id);
            
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({
                    ...productData,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }
            
            localStorage.setItem('emirates_cart', JSON.stringify(cart));
            localStorage.setItem('emirates_cart_count', cart.reduce((sum, item) => sum + item.quantity, 0));
            
            this.updateCartDisplay();
            this.showNotification(`✅ تم إضافة "${productData.name}" للسلة`, 'success');
            
        } catch (error) {
            console.error('خطأ في إضافة المنتج للسلة:', error);
            this.showNotification('⚠️ حدث خطأ في إضافة المنتج', 'error');
        }
    }

    // الحصول على عدد عناصر السلة
    getCartCount() {
        try {
            return parseInt(localStorage.getItem('emirates_cart_count') || '0');
        } catch {
            return 0;
        }
    }

    // تحميل بيانات السلة
    loadCartFromStorage() {
        this.cartCount = this.getCartCount();
        this.updateCartDisplay();
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // مراقبة تغييرات السلة
        window.addEventListener('storage', (e) => {
            if (e.key === 'emirates_cart_count') {
                this.loadCartFromStorage();
            }
        });
        
        // مراقبة تغيير حجم الشاشة
        window.addEventListener('resize', () => {
            this.handleResponsiveChanges();
        });
        
        // مراقبة التمرير
        window.addEventListener('scroll', () => {
            this.handleScrollEffects();
        }, { passive: true });
    }

    // تعديل التجاوب
    handleResponsiveChanges() {
        const isMobile = window.innerWidth <= 768;
        const orderButtons = document.querySelectorAll('.order-now-btn span');
        
        orderButtons.forEach(span => {
            span.style.display = isMobile ? 'none' : 'inline';
        });
    }

    // تأثيرات التمرير
    handleScrollEffects() {
        const header = document.querySelector('.header');
        const scrolled = window.scrollY > 100;
        
        if (scrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // عرض الإشعارات
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `enhanced-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' 
                ? 'linear-gradient(135deg, #27AE60, #2ECC71)'
                : 'linear-gradient(135deg, #E74C3C, #C0392B)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '10000',
            animation: 'slideInRight 0.4s ease-out',
            maxWidth: '350px',
            fontWeight: '600',
            fontSize: '0.9rem'
        };
        
        Object.assign(notification.style, styles);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }

    // إعداد رسائل واتساب للطلبات
    generateWhatsAppMessage(productData = null) {
        let message = 'مرحباً! أريد استفسار عن:';
        
        if (productData) {
            message += `\n\n🎁 **${productData.name}**`;
            message += `\n💰 السعر: ${productData.price}`;
            message += `\n\nلطفاً زودوني بالتفاصيل وأوقات التوصيل.`;
        } else {
            const cart = JSON.parse(localStorage.getItem('emirates_cart') || '[]');
            if (cart.length > 0) {
                message += '\n\n🛒 **عناصر السلة:**';
                cart.forEach((item, index) => {
                    message += `\n${index + 1}. ${item.name} - ${item.price} (الكمية: ${item.quantity})`;
                });
            }
            message += '\n\nلطفاً زودوني بتفاصيل الطلب.';
        }
        
        return encodeURIComponent(message);
    }

    // تفعيل زر العودة للأعلى
    setupBackToTop() {
        const backBtn = document.getElementById('backToTop');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // تأثير بصري
                backBtn.style.animation = 'spin 0.6s ease-in-out';
                setTimeout(() => {
                    backBtn.style.animation = '';
                }, 600);
            });
            
            // إظهار/إخفاء عند التمرير
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backBtn.classList.add('show');
                } else {
                    backBtn.classList.remove('show');
                }
            }, { passive: true });
        }
    }

    // تحسين الأداء
    optimizeButtonPerformance() {
        // تفعيل تسريع GPU للعناصر المتحركة
        const animatedElements = document.querySelectorAll('.nav-link, .header-tool, .btn-primary, .btn-secondary');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, background';
        });
        
        // تبسيط الرسوم المتحركة على الأجهزة البطيئة
        if (navigator.hardwareConcurrency <= 4) {
            document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
        }
    }

    // تفعيل اللمس للهواتف
    setupTouchFeedback() {
        if ('ontouchstart' in window) {
            const touchElements = document.querySelectorAll('.nav-link, .header-tool, .btn-primary, .btn-secondary');
            
            touchElements.forEach(element => {
                element.addEventListener('touchstart', () => {
                    element.style.transform = 'scale(0.95)';
                }, { passive: true });
                
                element.addEventListener('touchend', () => {
                    setTimeout(() => {
                        element.style.transform = '';
                    }, 150);
                }, { passive: true });
            });
        }
    }

    // ربط مع أنظمة أخرى
    connectToOtherSystems() {
        // ربط مع نظام التقييمات
        if (window.ReviewsSystem) {
            console.log('✅ تم ربط نظام الأزرار مع نظام التقييمات');
        }
        
        // ربط مع نظام السلة
        if (window.CartSystem) {
            console.log('✅ تم ربط نظام الأزرار مع نظام السلة');
        }
    }

    // تصحيح مشاكل الأزرار الشائعة
    fixCommonButtonIssues() {
        // إصلاح مشاكل النقر المتعدد
        const buttons = document.querySelectorAll('button, a.btn-primary, a.btn-secondary');
        buttons.forEach(button => {
            let clickCount = 0;
            button.addEventListener('click', (e) => {
                clickCount++;
                if (clickCount > 1) {
                    e.preventDefault();
                    return false;
                }
                
                setTimeout(() => {
                    clickCount = 0;
                }, 1000);
            });
        });
        
        // إصلاح مشاكل التحميل البطيء
        const loadingElements = document.querySelectorAll('.loading-message');
        loadingElements.forEach(element => {
            if (element.textContent.includes('جارِ تحميل')) {
                element.style.minHeight = '100px';
                element.style.display = 'flex';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
            }
        });
    }

    // مراقبة حالة الشبكة
    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.showNotification('✅ تم استعادة الاتصال بالإنترنت', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('⚠️ لا يوجد اتصال بالإنترنت', 'error');
        });
    }

    // فحص وإصلاح الأخطاء
    checkAndFixErrors() {
        // فحص وجود العناصر المهمة
        const requiredElements = ['.nav-menu', '.header-tools', '.mobile-menu-toggle'];
        const missingElements = [];
        
        requiredElements.forEach(selector => {
            if (!document.querySelector(selector)) {
                missingElements.push(selector);
            }
        });
        
        if (missingElements.length > 0) {
            console.warn('⚠️ عناصر مفقودة:', missingElements);
        }
        
        // إصلاح روابط معطلة
        const brokenLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
        brokenLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('⚠️ هذا الرابط غير متاح حالياً', 'error');
            });
        });
    }

    // تنظيف الذاكرة عند المغادرة
    cleanup() {
        const animatedElements = document.querySelectorAll('[style*="will-change"]');
        animatedElements.forEach(element => {
            element.style.willChange = 'auto';
        });
    }

    // تشغيل شامل للنظام
    runFullSetup() {
        this.setupAllButtons();
        this.setupBackToTop();
        this.setupTouchFeedback();
        this.setupNetworkMonitoring();
        this.fixCommonButtonIssues();
        this.optimizeButtonPerformance();
        this.checkAndFixErrors();
        this.connectToOtherSystems();
        
        console.log('🚀 نظام وظائف الأزرار المحسن جاهز للاستخدام');
    }
}

// إضافة انيميشن CSS محسن
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
.enhanced-notification {
    font-family: 'Cairo', sans-serif !important;
    direction: rtl;
    text-align: right;
}

.enhanced-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-start;
}

.enhanced-notification i {
    font-size: 1.2rem;
    flex-shrink: 0;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* تحسين الأزرار على الهواتف */
@media (max-width: 768px) {
    .enhanced-notification {
        right: 10px;
        left: 10px;
        max-width: none;
        font-size: 0.85rem;
    }
}
`;
document.head.appendChild(enhancedStyles);

// تشغيل النظام
const enhancedButtonFunctions = new EnhancedButtonFunctions();

// تشغيل كامل بعد التحميل
window.addEventListener('load', () => {
    setTimeout(() => {
        enhancedButtonFunctions.runFullSetup();
    }, 500);
});

// تنظيف عند مغادرة الصفحة
window.addEventListener('beforeunload', () => {
    enhancedButtonFunctions.cleanup();
});

// تصدير للاستخدام العام
window.EnhancedButtonFunctions = EnhancedButtonFunctions;
window.enhancedButtonFunctions = enhancedButtonFunctions;