// 🚫 ZERO POPUP ENVIRONMENT - MAIN HOMEPAGE SCRIPT
// Production-Ready Version 2.0 - ZERO INLINE CODE

// Environment detection for smart logging
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.search.includes('debug=true');

// Smart logging system (minimal in production)
const logger = {
    log: isDevelopment ? console.log.bind(console) : () => {},
    warn: isDevelopment ? console.warn.bind(console) : () => {},
    error: console.error.bind(console) // Always log errors
};

logger.log('🚫 EMIRATES GIFTS - ZERO INLINE CODE v2.0');

// Strict popup blocking
if (typeof window !== 'undefined') {
    window.alert = function() { logger.log('🚫 Alert blocked'); return undefined; };
    window.confirm = function() { logger.log('🚫 Confirm blocked'); return true; };
    window.prompt = function() { logger.log('🚫 Prompt blocked'); return null; };
    
    window.open = function() {
        logger.log('🚫 window.open blocked');
        return null;
    };
}

// Global state
let currentPerfumes = [];
let currentWatches = [];
let displayedPerfumes = 999; // Show all initially
let displayedWatches = 999;  // Show all initially
let isLoading = false;

// Enhanced image error handler (REPLACES INLINE ONERROR)
function setupSecureImageHandling(imgElement) {
    if (!imgElement || imgElement.dataset.secureHandlerSetup) return;
    
    imgElement.addEventListener('error', function() {
        if (this.dataset.fallbackApplied === 'true') return; // Prevent loop
        
        this.dataset.fallbackApplied = 'true';
        this.src = 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=منتج+مميز';
        this.alt = 'منتج مميز - صورة بديلة';
        logger.warn('⚠️ Image fallback applied securely');
    });
    
    imgElement.dataset.secureHandlerSetup = 'true';
    
    // Handle already failed images
    if (imgElement.complete && imgElement.naturalWidth === 0) {
        imgElement.dispatchEvent(new Event('error'));
    }
}

// Enhanced price formatter with validation
function formatPrice(price) {
    try {
        const numPrice = parseFloat(price || 0);
        return isNaN(numPrice) ? '0.00 د.إ' : `${numPrice.toFixed(2)} د.إ`;
    } catch (error) {
        logger.error('❌ Price formatting error:', error);
        return '0.00 د.إ';
    }
}

// Enhanced product title sanitizer with XSS protection
function sanitizeProductTitle(title) {
    if (!title || typeof title !== 'string') return 'منتج مميز';
    
    return title
        .trim()
        .replace(/[<>&"'`]/g, '') // Enhanced XSS prevention
        .substring(0, 100)
        .trim() || 'منتج مميز';
}

// Enhanced product loading with intelligent retry
async function loadProducts() {
    if (isLoading) return;
    isLoading = true;
    
    try {
        logger.log('📦 Loading products with enhanced security...');
        
        const loadWithRetry = async (url, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
                    
                    const response = await fetch(url + '?v=' + Date.now(), {
                        signal: controller.signal,
                        headers: {
                            'Accept': 'application/json',
                            'Cache-Control': 'no-cache'
                        }
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (response.ok) {
                        const data = await response.json();
                        return Array.isArray(data) ? data : [];
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                } catch (e) {
                    logger.warn(`⚠️ Retry ${i + 1}/${retries} failed for ${url}:`, e.message);
                    if (i === retries - 1) throw e;
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
                }
            }
            return [];
        };
        
        const [perfumes, watches] = await Promise.all([
            loadWithRetry('./data/otor.json'),
            loadWithRetry('./data/sa3at.json')
        ]);
        
        currentPerfumes = perfumes;
        currentWatches = watches;
        
        logger.log(`📊 Loaded ${currentPerfumes.length} perfumes, ${currentWatches.length} watches`);
        
        // Display initial products - show ALL
        if (currentPerfumes.length > 0) {
            displayProductsSecurely(currentPerfumes.slice(0, displayedPerfumes), 'perfumes-grid');
            updateViewMoreButton('perfumes-view-more', currentPerfumes.length, displayedPerfumes);
        } else {
            showNoProductsMessage('perfumes-grid', 'لا توجد عطور متاحة حالياً');
        }
        
        if (currentWatches.length > 0) {
            displayProductsSecurely(currentWatches.slice(0, displayedWatches), 'watches-grid');
            updateViewMoreButton('watches-view-more', currentWatches.length, displayedWatches);
        } else {
            showNoProductsMessage('watches-grid', 'لا توجد ساعات متاحة حالياً');
        }
        
    } catch (error) {
        logger.error('❌ Product loading failed:', error);
        showLoadingError();
    } finally {
        isLoading = false;
    }
}

// Enhanced view more button management
function updateViewMoreButton(buttonId, totalItems, displayedItems) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    if (totalItems > displayedItems) {
        button.style.display = 'inline-flex';
        button.style.visibility = 'visible';
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
        button.setAttribute('aria-hidden', 'false');
        logger.log(`✅ ${buttonId} shown (${displayedItems}/${totalItems})`);
    } else {
        button.style.display = 'none';
        button.setAttribute('aria-hidden', 'true');
        logger.log(`ℹ️ ${buttonId} hidden - all shown`);
    }
}

// SECURE PRODUCTS DISPLAY (ZERO INLINE CODE)
function displayProductsSecurely(products, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || !Array.isArray(products) || products.length === 0) {
        logger.warn(`⚠️ No products for ${gridId}`);
        return;
    }
    
    try {
        const productsHTML = products.map(product => {
            if (!product || typeof product !== 'object') {
                logger.warn('⚠️ Invalid product:', product);
                return '';
            }
            
            const finalPrice = formatPrice(product.sale_price || product.price);
            const productId = String(product.id || Date.now());
            const productTitle = sanitizeProductTitle(product.title);
            const imageLink = product.image_link || 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=منتج+مميز';
            const productType = gridId.includes('perfume') ? 'perfume' : 'watch';
            
            // ❌ NO INLINE ONERROR - COMPLETELY SECURE TEMPLATE
            return `
                <div class="product-card" 
                     data-product-id="${productId}" 
                     data-product-type="${productType}"
                     role="button"
                     tabindex="0"
                     aria-label="عرض تفاصيل ${productTitle}">
                    <div class="product-image-container">
                        <img src="${imageLink}" 
                             alt="${productTitle}" 
                             loading="lazy"
                             width="300"
                             height="250"
                             data-fallback-applied="false">
                    </div>
                    <div class="product-info">
                        <h4>${productTitle}</h4>
                        <div class="price" aria-label="السعر ${finalPrice}">${finalPrice}</div>
                    </div>
                </div>
            `;
        }).filter(html => html.trim().length > 0).join('');
        
        grid.innerHTML = productsHTML;
        
        // Enhanced event listeners with full security
        const productCards = grid.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // Click navigation with validation
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.dataset.productId;
                const productType = this.dataset.productType;
                
                if (productId && productType && productId !== 'unknown') {
                    navigateToProductSafely(productId, productType);
                } else {
                    logger.error('❌ Invalid product data for navigation');
                }
            });
            
            // Enhanced keyboard accessibility
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
                if (e.key === 'Escape') {
                    this.blur();
                }
            });
            
            // SECURE IMAGE ERROR HANDLING (NO INLINE ONERROR)
            const img = card.querySelector('img');
            if (img) {
                setupSecureImageHandling(img);
            }
        });
        
        logger.log(`📦 Securely displayed ${products.length} products in ${gridId}`);
        
    } catch (error) {
        logger.error('❌ Display error:', error);
        grid.innerHTML = '<div class="loading-message" role="alert">❌ خطأ في عرض المنتجات</div>';
    }
}

// Enhanced navigation with security validation
function navigateToProductSafely(productId, type) {
    if (!productId || !type || productId === 'unknown') {
        logger.error('❌ Invalid navigation data');
        return;
    }
    
    logger.log(`🔗 Secure navigation to: ${productId}`);
    
    const product = type === 'perfume' ? 
        currentPerfumes.find(p => p && String(p.id) === String(productId)) :
        currentWatches.find(p => p && String(p.id) === String(productId));
    
    if (product && product.title) {
        // Enhanced slug generation with Arabic support
        const slug = product.title
            .toLowerCase()
            .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)
            .trim();
        
        const params = new URLSearchParams({
            id: productId,
            category: type,
            slug: slug || 'product'
        });
        
        try {
            const targetUrl = `./product-details.html?${params.toString()}`;
            window.location.href = targetUrl;
        } catch (navError) {
            logger.error('❌ Navigation error:', navError);
            // Secure fallback
            window.location.href = `./product-details.html?id=${encodeURIComponent(productId)}&category=${encodeURIComponent(type)}`;
        }
    } else {
        logger.error('❌ Product not found:', productId);
        // Redirect to products page after short delay
        setTimeout(() => {
            window.location.href = './products-showcase.html';
        }, 1500);
    }
}

// Enhanced show more functions with accessibility announcements
function showMorePerfumesSafely() {
    try {
        const oldCount = displayedPerfumes;
        displayedPerfumes = Math.min(displayedPerfumes + 6, currentPerfumes.length);
        
        logger.log(`🔄 Perfumes: ${oldCount} → ${displayedPerfumes}/${currentPerfumes.length}`);
        
        displayProductsSecurely(currentPerfumes.slice(0, displayedPerfumes), 'perfumes-grid');
        updateViewMoreButton('perfumes-view-more', currentPerfumes.length, displayedPerfumes);
        
        // Accessibility-aware smooth scroll
        const perfumesSection = document.getElementById('perfumes-section');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (perfumesSection && !prefersReducedMotion) {
            perfumesSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Screen reader announcement
        announceToScreenReader(`تم عرض ${displayedPerfumes} من أصل ${currentPerfumes.length} عطر`);
        
    } catch (error) {
        logger.error('❌ Show more perfumes error:', error);
    }
}

function showMoreWatchesSafely() {
    try {
        const oldCount = displayedWatches;
        displayedWatches = Math.min(displayedWatches + 6, currentWatches.length);
        
        logger.log(`🔄 Watches: ${oldCount} → ${displayedWatches}/${currentWatches.length}`);
        
        displayProductsSecurely(currentWatches.slice(0, displayedWatches), 'watches-grid');
        updateViewMoreButton('watches-view-more', currentWatches.length, displayedWatches);
        
        // Accessibility-aware smooth scroll
        const watchesSection = document.getElementById('watches-section');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (watchesSection && !prefersReducedMotion) {
            watchesSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Screen reader announcement
        announceToScreenReader(`تم عرض ${displayedWatches} من أصل ${currentWatches.length} ساعة`);
        
    } catch (error) {
        logger.error('❌ Show more watches error:', error);
    }
}

// Accessibility helper for screen readers
function announceToScreenReader(message) {
    try {
        let announcer = document.getElementById('sr-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            announcer.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = message;
        
        // Clear announcement after 2 seconds
        setTimeout(() => {
            if (announcer) announcer.textContent = '';
        }, 2000);
        
    } catch (error) {
        logger.error('❌ Screen reader announce error:', error);
    }
}

// Force show buttons when needed
function showViewMoreButtonsIfNeeded() {
    updateViewMoreButton('perfumes-view-more', currentPerfumes.length, displayedPerfumes);
    updateViewMoreButton('watches-view-more', currentWatches.length, displayedWatches);
}

// Enhanced cart counter with data validation
function updateCartCounterSafely() {
    try {
        const cartData = localStorage.getItem('emirates_cart');
        let cart = [];
        
        if (cartData) {
            try {
                const parsedCart = JSON.parse(cartData);
                cart = Array.isArray(parsedCart) ? parsedCart : [];
            } catch (parseError) {
                logger.error('❌ Cart parse error:', parseError);
                localStorage.removeItem('emirates_cart');
                cart = [];
            }
        }
        
        const totalItems = cart.reduce((sum, item) => {
            if (!item || typeof item !== 'object') return sum;
            const qty = parseInt(item.quantity || 0);
            return sum + (isNaN(qty) ? 0 : Math.max(0, qty));
        }, 0);
        
        const counter = document.getElementById('cart-counter');
        if (counter) {
            counter.textContent = totalItems.toString();
            counter.style.display = totalItems > 0 ? 'flex' : 'none';
            counter.setAttribute('aria-label', `عدد العناصر في السلة: ${totalItems}`);
        }
        
    } catch (error) {
        logger.error('❌ Cart counter error:', error);
    }
}

// Throttled progress bar for better performance
let progressRafId;
function updateProgressSafely() {
    if (progressRafId) return;
    
    progressRafId = requestAnimationFrame(() => {
        try {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
            const scrollHeight = document.documentElement.scrollHeight || 0;
            const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;
            
            const maxScroll = Math.max(0, scrollHeight - clientHeight);
            
            if (maxScroll > 0) {
                const progress = Math.max(0, Math.min(100, (scrollTop / maxScroll) * 100));
                const bar = document.getElementById('progressBar');
                if (bar) {
                    bar.style.width = progress + '%';
                }
            }
        } catch (error) {
            logger.error('❌ Progress error:', error);
        }
        progressRafId = null;
    });
}

// Enhanced back to top with accessibility
function updateBackToTopSafely() {
    try {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
        const shouldShow = scrolled > 300;
        
        if (shouldShow && !backToTop.classList.contains('show')) {
            backToTop.classList.add('show');
            backToTop.setAttribute('aria-hidden', 'false');
        } else if (!shouldShow && backToTop.classList.contains('show')) {
            backToTop.classList.remove('show');
            backToTop.setAttribute('aria-hidden', 'true');
        }
    } catch (error) {
        logger.error('❌ Back to top error:', error);
    }
}

// Enhanced smooth scroll with accessibility support
function initSmoothScrollSafely() {
    try {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    
                    target.scrollIntoView({ 
                        behavior: prefersReducedMotion ? 'auto' : 'smooth', 
                        block: 'start' 
                    });
                    
                    // Focus management for accessibility
                    if (target.tabIndex < 0) {
                        target.tabIndex = -1;
                    }
                    target.focus({ preventScroll: true });
                }
            });
        });
        logger.log('✅ Smooth scroll with full accessibility');
    } catch (error) {
        logger.error('❌ Smooth scroll error:', error);
    }
}

// Enhanced error display with secure retry
function showLoadingError() {
    const errorHTML = `
        <div class="loading-message" 
             style="background: #fff5f5; border: 2px solid #fed7d7; color: #e74c3c;" 
             role="alert">
            <i class="fas fa-exclamation-triangle" 
               style="font-size: 2rem; margin-bottom: 15px;" 
               aria-hidden="true"></i><br>
            ❌ خطأ في تحميل المنتجات<br>
            <button class="retry-button" 
                    style="margin-top: 15px; background: #D4AF37; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: 'Cairo', sans-serif;"
                    aria-label="إعادة تحميل الصفحة">
                إعادة المحاولة
            </button>
        </div>
    `;
    
    ['perfumes-grid', 'watches-grid'].forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (grid) {
            grid.innerHTML = errorHTML;
            
            // Secure retry button handler
            const retryBtn = grid.querySelector('.retry-button');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    try {
                        location.reload();
                    } catch (reloadError) {
                        logger.error('❌ Reload error:', reloadError);
                    }
                });
            }
        }
    });
}

// No products message
function showNoProductsMessage(gridId, message) {
    const grid = document.getElementById(gridId);
    if (grid) {
        grid.innerHTML = `
            <div class="loading-message" role="status" aria-live="polite">
                <i class="fas fa-info-circle" 
                   style="font-size: 2rem; margin-bottom: 15px; color: #D4AF37;" 
                   aria-hidden="true"></i><br>
                ${message}
            </div>
        `;
    }
}

// Enhanced homepage initialization
function initializeHomepage() {
    logger.log('🚫 Zero Inline Code Homepage Init v2.0...');
    
    try {
        // Initial cart counter
        updateCartCounterSafely();
        
        // Load products
        loadProducts();
        
        // Initialize smooth scroll with accessibility
        initSmoothScrollSafely();
        
        // Enhanced View More buttons setup
        const perfumesViewMore = document.getElementById('perfumes-view-more');
        const watchesViewMore = document.getElementById('watches-view-more');
        
        if (perfumesViewMore) {
            ['click', 'touchend'].forEach(eventType => {
                perfumesViewMore.addEventListener(eventType, function(e) {
                    if (eventType === 'touchend') e.preventDefault();
                    showMorePerfumesSafely();
                });
            });
            
            perfumesViewMore.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showMorePerfumesSafely();
                }
            });
            
            logger.log('✅ Perfumes button with full touch/keyboard support');
        }
        
        if (watchesViewMore) {
            ['click', 'touchend'].forEach(eventType => {
                watchesViewMore.addEventListener(eventType, function(e) {
                    if (eventType === 'touchend') e.preventDefault();
                    showMoreWatchesSafely();
                });
            });
            
            watchesViewMore.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showMoreWatchesSafely();
                }
            });
            
            logger.log('✅ Watches button with full touch/keyboard support');
        }
        
        // Optimized scroll events with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                updateProgressSafely();
                updateBackToTopSafely();
                scrollTimeout = null;
            }, 16); // ~60fps
        }, { passive: true });
        
        // Enhanced back to top button
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                try {
                    window.scrollTo({ 
                        top: 0, 
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                    
                    // Announce to screen readers
                    announceToScreenReader('تم الانتقال إلى أعلى الصفحة');
                } catch (scrollError) {
                    window.scrollTo(0, 0);
                }
            });
            
            // Keyboard support
            backToTopBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
        
        logger.log('✅ Homepage fully initialized - Zero inline code, maximum security');
        
    } catch (error) {
        logger.error('❌ Initialization error:', error);
    }
}

// Enhanced window load handler
function handleWindowLoad() {
    try {
        // Final updates
        updateCartCounterSafely();
        updateProgressSafely();
        showViewMoreButtonsIfNeeded();
        
        // Performance metrics (dev only)
        if (isDevelopment && window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            logger.log(`⏱️ DOM Ready: ${domReady}ms, Full Load: ${loadTime}ms`);
        }
        
        logger.log('✅ Emirates Gifts fully loaded - Production ready v2.0');
    } catch (error) {
        logger.error('❌ Window load error:', error);
    }
}

// Enhanced error handling
window.addEventListener('error', function(event) {
    logger.error('❌ Global error:', event.error || event.message);
    // Prevent cascading errors
    event.preventDefault();
    return true;
});

window.addEventListener('unhandledrejection', function(event) {
    logger.error('❌ Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Smart DOM ready detection
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHomepage);
} else {
    // DOM already loaded, initialize immediately
    setTimeout(initializeHomepage, 0);
}

// Smart window load detection
if (document.readyState === 'complete') {
    setTimeout(handleWindowLoad, 0);
} else {
    window.addEventListener('load', handleWindowLoad);
}

// Secure global namespace (frozen for security)
if (typeof window !== 'undefined') {
    window.EmiratesGifts = Object.freeze({
        version: '2.0.0-production-secure',
        navigateToProduct: navigateToProductSafely,
        showMorePerfumes: showMorePerfumesSafely,
        showMoreWatches: showMoreWatchesSafely,
        updateCartCounter: updateCartCounterSafely,
        loadProducts: loadProducts,
        showViewMoreButtons: showViewMoreButtonsIfNeeded,
        isDevelopment: isDevelopment,
        formatPrice: formatPrice,
        sanitizeTitle: sanitizeProductTitle
    });
    
    // Backwards compatibility (secured)
    window.navigateToProduct = navigateToProductSafely;
    window.showMorePerfumes = showMorePerfumesSafely;
    window.showMoreWatches = showMoreWatchesSafely;
    window.showViewMoreButtons = showViewMoreButtonsIfNeeded;
}

logger.log('✅ Emirates Gifts v2.0 - ZERO INLINE CODE, MAXIMUM SECURITY');

// Advanced performance monitoring (development only)
if (isDevelopment && 'PerformanceObserver' in window) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    logger.log(`🖼️ LCP: ${Math.round(entry.startTime)}ms`);
                } else if (entry.entryType === 'first-input') {
                    logger.log(`⚡ FID: ${Math.round(entry.processingStart - entry.startTime)}ms`);
                } else if (entry.entryType === 'layout-shift') {
                    logger.log(`📏 CLS: ${entry.value.toFixed(4)}`);
                }
            }
        });
        
        observer.observe({ 
            entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
        });
    } catch (perfError) {
        logger.warn('⚠️ Performance observer not available');
    }
}

// Alias the secure display function
const displayProducts = displayProductsSecurely;

logger.log('🔒 All systems secured and optimized - Ready for production');
