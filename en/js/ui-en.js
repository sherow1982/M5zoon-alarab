// UI JavaScript for English Version

// UI State Management
class UIManager {
    constructor() {
        this.isLoading = false;
        this.activeModals = [];
        this.notifications = [];
    }
    
    // Loading States
    showLoading(element, message = 'Loading...') {
        if (!element) return;
        
        element.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <span>${message}</span>
            </div>
        `;
        element.classList.add('loading');
        this.isLoading = true;
    }
    
    hideLoading(element) {
        if (!element) return;
        
        element.classList.remove('loading');
        this.isLoading = false;
    }
    
    // Modal Management
    openModal(modalElement) {
        if (!modalElement) return;
        
        modalElement.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.activeModals.push(modalElement);
        
        // Add escape key listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modalElement);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    closeModal(modalElement) {
        if (!modalElement) return;
        
        modalElement.classList.remove('active');
        
        setTimeout(() => {
            modalElement.remove();
            const index = this.activeModals.indexOf(modalElement);
            if (index > -1) {
                this.activeModals.splice(index, 1);
            }
            
            if (this.activeModals.length === 0) {
                document.body.style.overflow = '';
            }
        }, 300);
    }
    
    // Notification System
    showNotification(message, type = 'info', duration = 4000) {
        const notification = this.createNotification(message, type);
        document.body.appendChild(notification);
        this.notifications.push(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        return notification;
    }
    
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="uiManager.removeNotification(this.parentElement)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return notification;
    }
    
    removeNotification(notification) {
        if (!notification) return;
        
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // Animation Helpers
    animateIn(element, animationClass = 'animate-in', delay = 0) {
        setTimeout(() => {
            element.classList.add(animationClass);
        }, delay);
    }
    
    animateOut(element, animationClass = 'animate-out') {
        element.classList.add(animationClass);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 300);
        });
    }
    
    // Scroll Utilities
    smoothScrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;
        
        const headerHeight = document.getElementById('header')?.offsetHeight || 80;
        const targetPosition = element.offsetTop - headerHeight - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    // Form Helpers
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validatePhone(phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    // Device Detection
    isMobile() {
        return window.innerWidth <= 768;
    }
    
    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }
    
    isDesktop() {
        return window.innerWidth > 1024;
    }
    
    // Performance Utilities
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            }
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Create global UI manager instance
const uiManager = new UIManager();

// Global UI Event Handlers
document.addEventListener('DOMContentLoaded', function() {
    initializeGlobalUI();
});

function initializeGlobalUI() {
    initializeScrollEffects();
    initializeLazyLoading();
    initializeKeyboardNavigation();
    initializeAccessibilityFeatures();
    
    console.log('✅ Global UI initialized');
}

// Scroll Effects
function initializeScrollEffects() {
    // Progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', uiManager.throttle(function() {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        }, 16));
    }
    
    // Parallax effects
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', uiManager.throttle(function() {
            const scrolled = window.scrollY;
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16));
    }
    
    // Reveal on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.animate-on-scroll, .section-header, .product-card, .service-card');
    animateElements.forEach(el => observer.observe(el));
}

// Lazy Loading
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazyload');
                    img.classList.add('lazyloaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img.lazyload').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Keyboard Navigation
function initializeKeyboardNavigation() {
    // Tab navigation enhancements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Arrow key navigation for product grids
    const productGrids = document.querySelectorAll('.products-grid');
    productGrids.forEach(grid => {
        grid.addEventListener('keydown', function(e) {
            const focusedCard = document.activeElement.closest('.product-card');
            if (!focusedCard) return;
            
            const cards = Array.from(grid.querySelectorAll('.product-card'));
            const currentIndex = cards.indexOf(focusedCard);
            let nextIndex;
            
            switch(e.key) {
                case 'ArrowRight':
                    nextIndex = (currentIndex + 1) % cards.length;
                    break;
                case 'ArrowLeft':
                    nextIndex = (currentIndex - 1 + cards.length) % cards.length;
                    break;
                case 'ArrowDown':
                    const columns = Math.floor(grid.offsetWidth / 320); // Approximate card width
                    nextIndex = Math.min(currentIndex + columns, cards.length - 1);
                    break;
                case 'ArrowUp':
                    const cols = Math.floor(grid.offsetWidth / 320);
                    nextIndex = Math.max(currentIndex - cols, 0);
                    break;
                default:
                    return;
            }
            
            e.preventDefault();
            cards[nextIndex]?.focus();
        });
    });
}

// Accessibility Features
function initializeAccessibilityFeatures() {
    // Focus management
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Trap focus in modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const activeModal = document.querySelector('.modal.active, .quick-view-modal.active, .welcome-popup.active');
            if (activeModal) {
                trapFocus(e, activeModal);
            }
        }
    });
    
    // ARIA live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function trapFocus(e, modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

// Announce to screen readers
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
    }
}

// Image Error Handling
function handleImageError(img) {
    img.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop';
    img.alt = 'Product image unavailable';
    img.style.opacity = '0.7';
}

// Add error handlers to all images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
});

// Performance Monitoring
function monitorPerformance() {
    // Monitor loading times
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Report slow loading
            if (loadTime > 3000) {
                console.warn('Slow page load detected');
            }
        });
    }
    
    // Monitor memory usage (if available)
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > 50000000) { // 50MB
                console.warn('High memory usage detected');
            }
        }, 30000);
    }
}

// Export for global access
window.uiManager = uiManager;
window.announceToScreenReader = announceToScreenReader;
window.handleImageError = handleImageError;

// Initialize performance monitoring
if (typeof window !== 'undefined') {
    monitorPerformance();
}