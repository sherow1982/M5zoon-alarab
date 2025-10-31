/**
 * نظام إصلاح أزرار التنقل وتحسين التفاعل
 * يحسّن من تجربة المستخدم مع الأزرار والروابط
 */

class NavigationButtonsFix {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // انتظار تحميل الصفحة بالكامل
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
        
        this.isInitialized = true;
    }

    setupNavigation() {
        this.setupActiveStates();
        this.setupSmoothScrolling();
        this.setupButtonEffects();
        this.setupMobileMenu();
        this.setupHeaderScrollEffect();
        this.setupOrderButtons();
        this.setupCartButtons();
        
        console.log('✅ تم إصلاح أزرار التنقل بنجاح');
    }

    setupActiveStates() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === './' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
                link.classList.add('active');
            } else if (href !== './' && currentPath.includes(href.replace('./', '').replace('.html', ''))) {
                link.classList.add('active');
            }
        });
    }

    setupSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // تحسين الانتقال السلس
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // تحديث الرابط النشط
                    document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.nav-link, .btn-primary, .btn-secondary, .header-tool');
        
        buttons.forEach(button => {
            // تأثير الضغط
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(1px) scale(0.98)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = '';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
            
            // تأثير النقر باللمس
            button.addEventListener('touchstart', () => {
                button.classList.add('touched');
            }, { passive: true });
            
            button.addEventListener('touchend', () => {
                setTimeout(() => {
                    button.classList.remove('touched');
                }, 150);
            }, { passive: true });
        });
    }

    setupMobileMenu() {
        const toggleBtn = document.getElementById('openSidebar');
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('mobileOverlay');
        const closeBtn = document.getElementById('closeSidebar');
        
        if (toggleBtn && sidebar && overlay && closeBtn) {
            // فتح القائمة
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.add('open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // تأثير بصري
                toggleBtn.style.transform = 'scale(1.1) rotate(180deg)';
                setTimeout(() => {
                    toggleBtn.style.transform = '';
                }, 300);
            });
            
            // إغلاق القائمة
            const closeMobileMenu = () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            };
            
            closeBtn.addEventListener('click', closeMobileMenu);
            overlay.addEventListener('click', closeMobileMenu);
            
            // إغلاق بالضغط على ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                    closeMobileMenu();
                }
            });
        }
    }

    setupHeaderScrollEffect() {
        const header = document.getElementById('header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // إخفاء/إظهار الهيدر عند التمرير
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    setupOrderButtons() {
        const orderButtons = document.querySelectorAll('.order-now-btn');
        
        orderButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // تأثير بصري للنقر
                button.style.animation = 'pulse 0.6s ease-in-out';
                
                // تنظيف الانيميشن بعد الانتهاء
                setTimeout(() => {
                    button.style.animation = '';
                }, 600);
                
                // إضافة فايبريشن للهواتف
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
            });
        });
    }

    setupCartButtons() {
        const cartIcons = document.querySelectorAll('.cart-icon');
        
        cartIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                // تأثير بصري
                icon.style.animation = 'bounce 0.6s ease-in-out';
                
                setTimeout(() => {
                    icon.style.animation = '';
                }, 600);
            });
        });
    }

    // تحديث عداد السلة
    updateCartCounter(count) {
        const counters = document.querySelectorAll('.cart-counter');
        counters.forEach(counter => {
            if (count > 0) {
                counter.textContent = count;
                counter.style.display = 'flex';
                counter.style.animation = 'bounce 0.5s ease-in-out';
            } else {
                counter.style.display = 'none';
            }
        });
    }

    // تفعيل وضع التحميل
    setLoadingState(element, isLoading = true) {
        if (isLoading) {
            element.style.opacity = '0.7';
            element.style.pointerEvents = 'none';
            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + element.innerHTML;
        } else {
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
            element.innerHTML = element.innerHTML.replace(/<i class="fas fa-spinner fa-spin"><\/i>\s*/, '');
        }
    }

    // تفعيل تأثير النجاح
    showSuccessEffect(element) {
        const originalBg = element.style.background;
        element.style.background = 'linear-gradient(135deg, #27AE60, #2ECC71)';
        element.style.color = 'white';
        element.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            element.style.background = originalBg;
            element.style.color = '';
            element.style.transform = '';
        }, 1000);
    }

    // تفعيل انيميشن التحميل للقائمة
    animateMenuLoad() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.add('loaded');
        }
    }

    // إضافة tooltips للأزرار
    addTooltips() {
        const tooltips = {
            '.cart-icon': 'عرض السلة',
            '.order-now-btn': 'إتمام الطلب فوراً',
            '.mobile-menu-toggle': 'فتح القائمة'
        };
        
        Object.entries(tooltips).forEach(([selector, text]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.setAttribute('title', text);
                element.setAttribute('aria-label', text);
            });
        });
    }

    // تحسين الوصول للكيبورد
    setupKeyboardNavigation() {
        const focusableElements = document.querySelectorAll('.nav-link, .header-tool, .btn-primary, .btn-secondary');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '3px solid #FFD700';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
            
            // التفاعل بالمفاتيح
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    // إضافة تأثيرات صوتية (اختيارية)
    setupSoundEffects() {
        const buttons = document.querySelectorAll('.nav-link, .header-tool');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // إضافة تأثير صوتي بسيط (اختياري)
                try {
                    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LDMxgSU7Pn6IFsJAUwbczr1IQRABJjruN7CgEAABIEBwUGTgEAABYKCQgICgEAABEEBwUGTgEAABYKCQgICgEAABEEBwUGTgEAABYKCQgICgEAABEEBwUGTgEAABYKCQgIC');
                    audio.volume = 0.1;
                    audio.play().catch(() => {}); // تجاهل أخطاء الصوت
                } catch (e) {
                    // تجاهل في حالة عدم دعم الصوت
                }
            });
        });
    }

    // تحسين الأداء والذاكرة
    optimizePerformance() {
        // تبسيط الانيميشن على الهواتف البطيئة
        if (window.innerWidth < 768) {
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (reducedMotionQuery.matches) {
                document.documentElement.style.setProperty('--transition', 'all 0.1s ease');
            }
        }
        
        // تحسين GPU للعناصر المتحركة
        const animatedElements = document.querySelectorAll('.nav-link, .header-tool');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform';
        });
    }

    // تحديث الحالة بعد تحميل المحتوى
    updateAfterContentLoad() {
        // تحديث عداد السلة من localStorage
        const cartCount = localStorage.getItem('emirates_cart_count') || 0;
        this.updateCartCounter(parseInt(cartCount));
        
        // تفعيل انيميشن التحميل
        this.animateMenuLoad();
        
        // تفعيل tooltips
        this.addTooltips();
        
        // تفعيل التنقل بالكيبورد
        this.setupKeyboardNavigation();
        
        // تحسين الأداء
        this.optimizePerformance();
    }

    // إعادة تعيين الأزرار للوضع الصحيح
    resetButtonStates() {
        const buttons = document.querySelectorAll('.nav-link, .header-tool, .btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            button.style.transform = '';
            button.style.animation = '';
            button.classList.remove('touched', 'loading');
        });
    }

    // تفعيل إشعارات الحالة
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `button-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #27AE60, #2ECC71)' : 'linear-gradient(135deg, #E74C3C, #C0392B)'};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.4s ease-out;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            font-size: 0.9rem;
        `;
        
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
}

// إضافة انيميشن CSS إضافية
const additionalStyles = `
<style>
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

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

.touched {
    transform: scale(0.95) !important;
    transition: transform 0.1s ease !important;
}

/* تحسين الأزرار على الهواتف */
@media (max-width: 768px) {
    .nav-menu {
        gap: 5px;
    }
    
    .nav-link {
        padding: 12px 14px;
        font-size: 0.85rem;
        min-width: 75px;
    }
    
    .header-tools {
        gap: 8px;
    }
    
    .header-tool {
        width: 44px;
        height: 44px;
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .nav-link {
        padding: 10px 12px;
        font-size: 0.8rem;
        min-width: 65px;
    }
    
    .header-tool {
        width: 40px;
        height: 40px;
        font-size: 1rem;
    }
    
    .order-now-btn span {
        display: none;
    }
}
</style>
`;

// تطبيق الأنماط الإضافية
if (!document.querySelector('#navigation-buttons-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'navigation-buttons-styles';
    styleElement.innerHTML = additionalStyles;
    document.head.appendChild(styleElement);
}

// تشغيل النظام
فonst navigationFix = new NavigationButtonsFix();

// تحديث بعد تحميل المحتوى
window.addEventListener('load', () => {
    setTimeout(() => {
        navigationFix.updateAfterContentLoad();
    }, 1000);
});

// تصدير للاستخدام العام
window.NavigationButtonsFix = NavigationButtonsFix;
window.navigationFix = navigationFix;