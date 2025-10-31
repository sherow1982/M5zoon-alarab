/**
 * Emirates Gifts English UI System v20251101
 * Complete user interface management for English version
 * Author: Emirates Gifts Development Team
 */

(function() {
    'use strict';
    
    console.log('📋 Initializing English UI System v20251101');
    
    /**
     * English UI Controller
     */
    const EnglishUI = {
        version: '20251101',
        
        /**
         * Initialize UI components
         */
        init() {
            this.setupNavigation();
            this.setupMobileMenu();
            this.setupProgressBar();
            this.setupBackToTop();
            this.setupImageLazyLoading();
            this.updateCartCounters();
            
            console.log('✅ English UI system initialized');
        },
        
        /**
         * Setup navigation functionality
         */
        setupNavigation() {
            // Smooth scrolling for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Focus for accessibility
                        if (targetElement.hasAttribute('tabindex')) {
                            targetElement.focus();
                        }
                    }
                });
            });
            
            // Active nav highlighting
            const currentPath = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && (href === currentPath || href === `./${currentPath}`)) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        },
        
        /**
         * Setup mobile menu
         */
        setupMobileMenu() {
            const menuToggle = document.getElementById('openSidebar');
            const sidebar = document.getElementById('mobileSidebar');
            const overlay = document.getElementById('mobileOverlay');
            const closeBtn = document.getElementById('closeSidebar');
            
            if (menuToggle && sidebar) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.add('active');
                    if (overlay) overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
            
            const closeMobileMenu = () => {
                if (sidebar) sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            };
            
            if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
            if (overlay) overlay.addEventListener('click', closeMobileMenu);
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        },
        
        /**
         * Setup scroll progress bar
         */
        setupProgressBar() {
            const progressBar = document.getElementById('progressBar');
            if (!progressBar) return;
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
            });
        },
        
        /**
         * Setup back to top button
         */
        setupBackToTop() {
            const backToTopBtn = document.getElementById('backToTop');
            if (!backToTopBtn) return;
            
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            });
            
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },
        
        /**
         * Setup lazy loading for images
         */
        setupImageLazyLoading() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.classList.remove('lazy');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        },
        
        /**
         * Update cart counters
         */
        updateCartCounters() {
            try {
                const cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
                const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                
                const counters = document.querySelectorAll('.cart-counter, .mobile-cart-counter');
                counters.forEach(counter => {
                    if (counter) {
                        counter.textContent = totalItems;
                        counter.style.display = totalItems > 0 ? 'flex' : 'none';
                    }
                });
                
                console.log(`🛒 English cart updated: ${totalItems} items`);
            } catch (error) {
                console.error('Error updating English cart counters:', error);
            }
        },
        
        /**
         * Show success notification
         */
        showNotification(message, type = 'success') {
            const existing = document.querySelector('.english-notification');
            if (existing) existing.remove();
            
            const notification = document.createElement('div');
            notification.className = 'english-notification';
            
            const bgColor = type === 'success' ? '#25D366' : '#e74c3c';
            const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
            
            notification.style.cssText = `
                position: fixed; top: 100px; right: 20px; z-index: 10000;
                background: linear-gradient(135deg, ${bgColor}, ${bgColor}CC);
                color: white; padding: 15px 20px; border-radius: 10px;
                font-weight: 600; font-family: 'Inter', sans-serif;
                box-shadow: 0 6px 20px ${bgColor}33;
                animation: slideInRight 0.4s ease; max-width: 300px;
                min-width: 250px; text-align: center;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                    <i class="fas ${icon}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 4000);
        },
        
        /**
         * Setup form enhancements
         */
        enhanceForms() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                // Add input validation styling
                const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
                
                inputs.forEach(input => {
                    input.addEventListener('blur', function() {
                        if (this.checkValidity()) {
                            this.style.borderColor = '#27ae60';
                        } else {
                            this.style.borderColor = '#e74c3c';
                        }
                    });
                    
                    input.addEventListener('input', function() {
                        this.style.borderColor = '';
                    });
                });
            });
        },
        
        /**
         * Setup English language optimizations
         */
        optimizeForEnglish() {
            // Ensure LTR direction
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en-US');
            
            // Update text alignment
            document.body.style.textAlign = 'left';
            document.body.style.direction = 'ltr';
        }
    };
    
    /**
     * CSS Injection for English UI
     */
    function injectEnglishCSS() {
        if (document.querySelector('#english-ui-css')) return;
        
        const style = document.createElement('style');
        style.id = 'english-ui-css';
        style.textContent = `
            /* English UI Animations */
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* English button hover effects */
            .btn-primary:hover, .btn-secondary:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            }
            
            /* Mobile menu improvements */
            .mobile-sidebar {
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            
            .mobile-sidebar.active {
                transform: translateX(0);
            }
            
            /* English form styling */
            .form-group input:focus,
            .form-group textarea:focus,
            .form-group select:focus {
                outline: 2px solid var(--primary-gold, #D4AF37);
                outline-offset: 2px;
            }
            
            /* Progress bar */
            .progress-bar {
                transition: width 0.3s ease;
            }
            
            /* Back to top button */
            .back-to-top {
                transition: all 0.3s ease;
            }
            
            .back-to-top:hover {
                background: var(--primary-gold, #D4AF37);
                color: var(--deep-blue, #1B2951);
                transform: scale(1.1);
            }
            
            /* Accessibility improvements */
            .skip-link:focus {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
            }
            
            /* Loading states */
            .loading-message {
                animation: pulse 2s ease-in-out infinite alternate;
            }
            
            @keyframes pulse {
                from { opacity: 0.6; }
                to { opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Auto-initialize system
     */
    function initialize() {
        injectEnglishCSS();
        EnglishUI.optimizeForEnglish();
        EnglishUI.init();
        EnglishUI.enhanceForms();
        
        // Listen for cart updates
        document.addEventListener('cartUpdated', () => {
            EnglishUI.updateCartCounters();
        });
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'emirates_shopping_cart') {
                EnglishUI.updateCartCounters();
            }
        });
    }
    
    // Export to global scope
    window.EnglishUI = EnglishUI;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();