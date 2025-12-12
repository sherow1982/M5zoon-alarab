/**
 * Emirates Gifts - Unified Application Initialization
 * Consolidates ALL startup workflows into ONE efficient workflow
 * Date: December 12, 2025
 */

(function() {
    'use strict';

    // ===== UNIFIED APP INITIALIZATION WORKFLOW =====
    
    const AppInitialization = {
        
        // ===== PHASE 1: EARLY INITIALIZATION (Immediate) =====
        initializeEarly: function() {
            // 1.1: Suppress Extension Errors (BFCache)
            this.suppressExtensionErrors();
            
            // 1.2: Remove Redundant CSP Tags
            this.removeRedundantCSP();
            
            // 1.3: Set Up Global Error Handlers
            this.setupErrorHandlers();
            
            console.log('[PHASE 1] ✅ Early initialization complete');
        },

        // ===== PHASE 2: DOM READY (After DOM Loaded) =====
        initializeOnDOMReady: function() {
            // 2.1: Initialize Language System
            this.initLanguageSystem();
            
            // 2.2: Initialize Header/Footer
            this.initHeaderFooter();
            
            // 2.3: Initialize Navigation
            this.initNavigation();
            
            // 2.4: Initialize Storage
            this.initStorage();
            
            console.log('[PHASE 2] ✅ DOM ready initialization complete');
        },

        // ===== PHASE 3: FULL LOAD (After Resources Loaded) =====
        initializeOnFullLoad: function() {
            // 3.1: Initialize Product System
            this.initProductSystem();
            
            // 3.2: Initialize Cart System
            this.initCartSystem();
            
            // 3.3: Initialize Event Listeners
            this.initEventListeners();
            
            // 3.4: Initialize Performance Monitoring
            this.initPerformanceMonitoring();
            
            console.log('[PHASE 3] ✅ Full load initialization complete');
            console.log('[WORKFLOW] ✅ ALL systems initialized successfully');
        },

        // ===== SUPPORT FUNCTIONS =====

        // 1.1: Suppress Extension Errors
        suppressExtensionErrors: function() {
            if (window.chrome?.runtime) {
                window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                    try {
                        sendResponse({ received: true });
                    } catch (e) {
                        // Ignore port closed
                    }
                });
            }
            
            const originalError = console.error;
            console.error = function(...args) {
                const errorStr = args[0]?.toString() || '';
                if (errorStr.includes('back/forward cache') ||
                    errorStr.includes('runtime.lastError') ||
                    errorStr.includes('port is closed')) {
                    return;
                }
                originalError.apply(console, args);
            };
        },

        // 1.2: Remove Redundant CSP
        removeRedundantCSP: function() {
            document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]')
                .forEach(meta => meta.remove());
        },

        // 1.3: Setup Error Handlers
        setupErrorHandlers: function() {
            window.addEventListener('error', (event) => {
                const message = event.message || '';
                if (message.includes('back/forward cache') ||
                    message.includes('port is closed')) {
                    event.preventDefault();
                }
            });

            window.addEventListener('unhandledrejection', (event) => {
                const reasonStr = event.reason?.toString() || '';
                if (reasonStr.includes('back/forward cache') ||
                    reasonStr.includes('port is closed')) {
                    event.preventDefault();
                }
            });
        },

        // 2.1: Initialize Language System
        initLanguageSystem: function() {
            const savedLanguage = localStorage.getItem('language') || 'en';
            
            // Set HTML attributes
            document.documentElement.lang = savedLanguage;
            document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
            
            // Update button states
            const enBtn = document.getElementById('lang-btn-en');
            const arBtn = document.getElementById('lang-btn-ar');
            if (enBtn && arBtn) {
                if (savedLanguage === 'ar') {
                    arBtn.classList.add('active');
                    enBtn.classList.remove('active');
                } else {
                    enBtn.classList.add('active');
                    arBtn.classList.remove('active');
                }
            }
            
            window.currentLanguage = savedLanguage;
            console.log('[LANG] ✅ Language initialized:', savedLanguage);
        },

        // 2.2: Initialize Header/Footer
        initHeaderFooter: function() {
            const header = document.getElementById('main-header');
            const footer = document.getElementById('main-footer');
            
            if (!header) {
                console.warn('[HEADER] ⚠️ Header not found');
            } else {
                console.log('[HEADER] ✅ Header initialized');
            }
            
            if (!footer) {
                console.warn('[FOOTER] ⚠️ Footer not found');
            } else {
                console.log('[FOOTER] ✅ Footer initialized');
            }
        },

        // 2.3: Initialize Navigation
        initNavigation: function() {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Smooth navigation
                    const href = link.getAttribute('href');
                    if (href?.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });
            
            console.log('[NAV] ✅ Navigation initialized');
        },

        // 2.4: Initialize Storage
        initStorage: function() {
            // Create safe storage manager
            window.appStorage = {
                set: (key, value) => {
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                    } catch (e) {
                        console.warn('[STORAGE] ⚠️ Storage full:', e);
                    }
                },
                get: (key) => {
                    try {
                        const item = localStorage.getItem(key);
                        return item ? JSON.parse(item) : null;
                    } catch (e) {
                        console.warn('[STORAGE] ⚠️ Retrieval error:', e);
                        return null;
                    }
                },
                remove: (key) => {
                    try {
                        localStorage.removeItem(key);
                    } catch (e) {
                        console.warn('[STORAGE] ⚠️ Deletion error:', e);
                    }
                }
            };
            
            console.log('[STORAGE] ✅ Storage manager initialized');
        },

        // 3.1: Initialize Product System
        initProductSystem: function() {
            // Initialize product rendering if products grid exists
            if (typeof renderProducts === 'function') {
                renderProducts();
                console.log('[PRODUCTS] ✅ Products system initialized');
            } else {
                console.log('[PRODUCTS] ℹ️ Not a product page');
            }
        },

        // 3.2: Initialize Cart System
        initCartSystem: function() {
            window.cart = {
                items: [],
                addItem: function(product) {
                    this.items.push(product);
                    this.updateCount();
                },
                removeItem: function(id) {
                    this.items = this.items.filter(item => item.id !== id);
                    this.updateCount();
                },
                updateCount: function() {
                    const cartCount = document.getElementById('cart-count');
                    if (cartCount) {
                        cartCount.textContent = this.items.length;
                    }
                }
            };
            
            console.log('[CART] ✅ Cart system initialized');
        },

        // 3.3: Initialize Event Listeners
        initEventListeners: function() {
            // Language switcher
            const langBtns = document.querySelectorAll('.lang-btn');
            langBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = btn.id.includes('en') ? 'en' : 'ar';
                    if (typeof switchLanguage === 'function') {
                        switchLanguage(lang);
                    }
                });
            });

            // Mobile menu toggle
            const menuToggle = document.getElementById('mobile-menu-toggle');
            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    const menu = document.querySelector('.nav-menu');
                    if (menu) {
                        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
                    }
                });
            }

            // Back to top button
            const backToTopBtn = document.getElementById('back-to-top-btn');
            if (backToTopBtn) {
                backToTopBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
            
            console.log('[EVENTS] ✅ Event listeners initialized');
        },

        // 3.4: Initialize Performance Monitoring
        initPerformanceMonitoring: function() {
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (entry.duration > 1000) {
                                console.warn('[PERF] Slow operation:', entry.name, entry.duration + 'ms');
                            }
                        }
                    });
                    observer.observe({ entryTypes: ['measure', 'navigation'] });
                    console.log('[PERF] ✅ Performance monitoring enabled');
                } catch (e) {
                    console.log('[PERF] ℹ️ Performance monitoring not available');
                }
            }
        }
    };

    // ===== START WORKFLOW =====

    // Phase 1: Immediate (before anything else)
    AppInitialization.initializeEarly();

    // Phase 2: When DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AppInitialization.initializeOnDOMReady();
        });
    } else {
        // DOM already loaded
        AppInitialization.initializeOnDOMReady();
    }

    // Phase 3: When everything is fully loaded
    if (document.readyState === 'complete') {
        AppInitialization.initializeOnFullLoad();
    } else {
        window.addEventListener('load', () => {
            AppInitialization.initializeOnFullLoad();
        });
    }

    // Export for external access
    window.AppInitialization = AppInitialization;

})();
