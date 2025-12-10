/**
 * Emirates Gifts English Main System v20251101
 * Core functionality and initialization for English version
 * Author: Emirates Gifts Development Team
 */

(function() {
    'use strict';
    
    console.log('🏠 Initializing English Main System v20251101');
    
    /**
     * English Main Controller
     */
    const EnglishMain = {
        version: '20251101',
        initialized: false,
        
        /**
         * Initialize main system
         */
        init() {
            if (this.initialized) {
                console.log('⚠️ English main already initialized');
                return;
            }
            
            this.setupGlobalEventListeners();
            this.initializeComponents();
            this.setupPerformanceMonitoring();
            this.initializeAccessibility();
            this.setupErrorHandling();
            
            this.initialized = true;
            console.log('✅ English main system initialized');
        },
        
        /**
         * Setup global event listeners
         */
        setupGlobalEventListeners() {
            // Smooth scroll for hash links
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (link) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update URL without triggering reload
                        history.replaceState(null, null, `#${targetId}`);
                    }
                }
            });
            
            // Handle external links
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="http"], a[href^="https://"]');
                if (link && !link.hasAttribute('target')) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });
            
            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        },
        
        /**
         * Initialize components
         */
        initializeComponents() {
            this.initializeHeader();
            this.initializeMobileMenu();
            this.initializeScrollEffects();
            this.initializeImageHandling();
            this.initializeButtons();
        },
        
        /**
         * Initialize header functionality
         */
        initializeHeader() {
            const header = document.getElementById('header');
            if (!header) return;
            
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    header.style.transform = 'translateY(0)';
                }
                
                // Add background on scroll
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }, { passive: true });
        },
        
        /**
         * Initialize mobile menu
         */
        initializeMobileMenu() {
            const menuToggle = document.getElementById('openSidebar');
            const sidebar = document.getElementById('mobileSidebar');
            const overlay = document.getElementById('mobileOverlay');
            const closeBtn = document.getElementById('closeSidebar');
            
            if (!menuToggle || !sidebar) return;
            
            const openMenu = () => {
                sidebar.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                menuToggle.setAttribute('aria-expanded', 'true');
            };
            
            const closeMenu = () => {
                sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
            };
            
            menuToggle.addEventListener('click', openMenu);
            if (closeBtn) closeBtn.addEventListener('click', closeMenu);
            if (overlay) overlay.addEventListener('click', closeMenu);
            
            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                    closeMenu();
                }
            });
        },
        
        /**
         * Initialize scroll effects
         */
        initializeScrollEffects() {
            // Progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                window.addEventListener('scroll', () => {
                    const scrollTop = window.pageYOffset;
                    const docHeight = document.body.scrollHeight - window.innerHeight;
                    const scrollPercent = (scrollTop / docHeight) * 100;
                    progressBar.style.width = Math.min(scrollPercent, 100) + '%';
                }, { passive: true });
            }
            
            // Back to top button
            const backToTopBtn = document.getElementById('backToTop');
            if (backToTopBtn) {
                window.addEventListener('scroll', () => {
                    backToTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
                }, { passive: true });
                
                backToTopBtn.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
            
            // Reveal on scroll
            if ('IntersectionObserver' in window) {
                const revealObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            revealObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                document.querySelectorAll('.reveal-on-scroll, .product-card, .section-header').forEach(el => {
                    revealObserver.observe(el);
                });
            }
        },
        
        /**
         * Initialize image handling
         */
        initializeImageHandling() {
            // Lazy loading
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.classList.remove('lazy');
                                img.classList.add('loaded');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
            
            // Error handling for all images
            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('error', function() {
                    if (!this.dataset.errorHandled) {
                        this.dataset.errorHandled = 'true';
                        this.src = 'https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=Image+Not+Available';
                        this.alt = 'Image not available';
                    }
                });
            });
        },
        
        /**
         * Initialize button functionality
         */
        initializeButtons() {
            // Order Now buttons
            document.addEventListener('click', (e) => {
                const orderBtn = e.target.closest('.order-now-btn');
                if (orderBtn && !orderBtn.dataset.productId) {
                    // General order now - go to cart/checkout
                    e.preventDefault();
                    window.location.href = './checkout.html';
                }
            });
            
            // WhatsApp buttons
            document.addEventListener('click', (e) => {
                const whatsappBtn = e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
                if (whatsappBtn) {
                    // Track WhatsApp clicks
                    console.log('📞 WhatsApp contact initiated');
                }
            });
        },
        
        /**
         * Setup performance monitoring
         */
        setupPerformanceMonitoring() {
            // Performance metrics
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                    
                    console.log(`📡 English page load time: ${loadTime.toFixed(2)}ms`);
                    
                    if (loadTime > 3000) {
                        console.warn('⚠️ Slow page load detected');
                    }
                });
            }
            
            // Memory monitoring (if available)
            if ('memory' in performance) {
                setInterval(() => {
                    const memory = performance.memory;
                    if (memory.usedJSHeapSize > 50000000) { // 50MB
                        console.warn('⚠️ High memory usage detected');
                    }
                }, 60000); // Check every minute
            }
        },
        
        /**
         * Initialize accessibility features
         */
        initializeAccessibility() {
            // Skip link functionality
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.focus();
                        mainContent.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
            
            // Focus management for dynamic content
            document.addEventListener('focusin', (e) => {
                if (e.target.matches('.product-card, .cart-item, .form-group')) {
                    e.target.classList.add('focused');
                }
            });
            
            document.addEventListener('focusout', (e) => {
                if (e.target.matches('.product-card, .cart-item, .form-group')) {
                    e.target.classList.remove('focused');
                }
            });
        },
        
        /**
         * Setup global error handling
         */
        setupErrorHandling() {
            // Global error handler
            window.addEventListener('error', (e) => {
                console.error('🚨 Global error:', e.error);
                
                // Show user-friendly error for critical failures
                if (e.filename && e.filename.includes('.js')) {
                    this.showErrorMessage('Something went wrong. Please refresh the page.');
                }
            });
            
            // Unhandled promise rejections
            window.addEventListener('unhandledrejection', (e) => {
                console.error('🚨 Unhandled promise rejection:', e.reason);
                e.preventDefault(); // Prevent browser console error
            });
        },
        
        /**
         * Show error message to user
         */
        showErrorMessage(message, duration = 5000) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'global-error-message';
            errorDiv.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white; padding: 15px 25px; border-radius: 10px;
                font-weight: 600; font-family: 'Inter', sans-serif;
                box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
                z-index: 10000; max-width: 90%; text-align: center;
                animation: slideInDown 0.4s ease;
            `;
            
            errorDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: 10px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(errorDiv);
            
            // Auto remove after duration
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, duration);
        },
        
        /**
         * Utility functions
         */
        utils: {
            /**
             * Debounce function calls
             */
            debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            },
            
            /**
             * Throttle function calls
             */
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
                };
            },
            
            /**
             * Format currency for UAE
             */
            formatCurrency(amount) {
                return `${parseFloat(amount).toFixed(2)} AED`;
            },
            
            /**
             * Validate email
             */
            validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            
            /**
             * Validate UAE phone
             */
            validateUAEPhone(phone) {
                const uaePhoneRegex = /^(\+971|971|0)?[0-9]{9}$/;
                return uaePhoneRegex.test(phone.replace(/\s/g, ''));
            }
        }
    };
    
    /**
     * Add English-specific CSS
     */
    function addEnglishCSS() {
        if (document.querySelector('#english-main-css')) return;
        
        const style = document.createElement('style');
        style.id = 'english-main-css';
        style.textContent = `
            /* English Main System Styles */
            .keyboard-navigation *:focus {
                outline: 2px solid var(--primary-gold, #D4AF37) !important;
                outline-offset: 2px !important;
            }
            
            .header {
                transition: transform 0.3s ease, background 0.3s ease;
            }
            
            .header.scrolled {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }
            
            .focused {
                box-shadow: 0 0 0 2px var(--primary-gold, #D4AF37) !important;
                border-radius: 8px;
            }
            
            .revealed {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInDown {
                from {
                    transform: translate(-50%, -100%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
            
            /* Improve button interactions */
            .btn-primary, .btn-secondary {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .btn-primary:hover, .btn-secondary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            .btn-primary:active, .btn-secondary:active {
                transform: translateY(0);
            }
            
            /* Loading states */
            .loading-message {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px;
                color: var(--primary-gold, #D4AF37);
                font-weight: 600;
                animation: pulse 2s ease-in-out infinite alternate;
            }
            
            @keyframes pulse {
                from { opacity: 0.6; }
                to { opacity: 1; }
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .header {
                    transform: none !important; /* Disable header hiding on mobile */
                }
                
                .mobile-sidebar {
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .mobile-sidebar.active {
                    transform: translateX(0);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Auto-initialize system
     */
    function initialize() {
        addEnglishCSS();
        
        // Set English language attributes
        document.documentElement.setAttribute('lang', 'en-US');
        document.documentElement.setAttribute('dir', 'ltr');
        
        EnglishMain.init();
        
        console.log('✨ English main system ready');
    }
    
    // Export to global scope
    window.EnglishMain = EnglishMain;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();