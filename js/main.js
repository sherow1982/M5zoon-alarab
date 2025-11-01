// 🚫 ZERO POPUP ENVIRONMENT - MAIN HOMEPAGE SCRIPT
console.log('🚫 EMIRATES GIFTS - ZERO POPUP MAIN PAGE');

// Strict popup blocking
if (typeof window !== 'undefined') {
    window.alert = function() { console.log('🚫 Alert blocked'); return undefined; };
    window.confirm = function() { console.log('🚫 Confirm blocked'); return true; };
    window.prompt = function() { console.log('🚫 Prompt blocked'); return null; };
    
    // Block popup creation attempts
    const originalOpen = window.open;
    window.open = function() {
        console.log('🚫 window.open blocked');
        return null;
    };
}

// Global state
let currentPerfumes = [];
let currentWatches = [];
let displayedPerfumes = 8;
let displayedWatches = 8;
let isLoading = false;

// Safe product loading system
async function loadProducts() {
    if (isLoading) return;
    isLoading = true;
    
    try {
        console.log('📦 Loading products safely...');
        
        const loadPerfumes = async () => {
            try {
                const response = await fetch('./data/otor.json?cacheBust=' + Date.now());
                if (response.ok) {
                    const data = await response.json();
                    return Array.isArray(data) ? data : [];
                }
            } catch (e) {
                console.warn('⚠️ Perfumes loading error:', e);
            }
            return [];
        };
        
        const loadWatches = async () => {
            try {
                const response = await fetch('./data/sa3at.json?cacheBust=' + Date.now());
                if (response.ok) {
                    const data = await response.json();
                    return Array.isArray(data) ? data : [];
                }
            } catch (e) {
                console.warn('⚠️ Watches loading error:', e);
            }
            return [];
        };
        
        const [perfumes, watches] = await Promise.all([
            loadPerfumes(),
            loadWatches()
        ]);
        
        currentPerfumes = perfumes;
        currentWatches = watches;
        
        // Display initial products
        if (currentPerfumes.length > 0) {
            displayProducts(currentPerfumes.slice(0, displayedPerfumes), 'perfumes-grid');
            const viewMoreBtn = document.getElementById('perfumes-view-more');
            if (viewMoreBtn && currentPerfumes.length > displayedPerfumes) {
                viewMoreBtn.style.display = 'inline-flex';
            }
            console.log(`✅ Loaded ${currentPerfumes.length} perfumes`);
        }
        
        if (currentWatches.length > 0) {
            displayProducts(currentWatches.slice(0, displayedWatches), 'watches-grid');
            const viewMoreBtn = document.getElementById('watches-view-more');
            if (viewMoreBtn && currentWatches.length > displayedWatches) {
                viewMoreBtn.style.display = 'inline-flex';
            }
            console.log(`✅ Loaded ${currentWatches.length} watches`);
        }
        
    } catch (error) {
        console.error('❌ Product loading error:', error);
        showLoadingError();
    } finally {
        isLoading = false;
    }
}

// Safe product display
function displayProducts(products, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || !Array.isArray(products) || products.length === 0) {
        console.warn(`⚠️ No products to display for ${gridId}`);
        return;
    }
    
    try {
        const productsHTML = products.map(product => {
            if (!product || typeof product !== 'object') {
                console.warn('⚠️ Invalid product object:', product);
                return '';
            }
            
            const finalPrice = parseFloat(product.sale_price || product.price || 0);
            const productId = product.id || 'unknown';
            const productTitle = product.title || 'منتج مميز';
            const imageLink = product.image_link || 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=منتج+مميز';
            
            return `
                <div class="product-card" 
                     data-product-id="${productId}" 
                     data-product-type="${gridId.includes('perfume') ? 'perfume' : 'watch'}">
                    <div class="product-image-container">
                        <img src="${imageLink}" 
                             alt="${productTitle}" 
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=منتج+مميز'">
                    </div>
                    <div class="product-info">
                        <h4>${productTitle}</h4>
                        <div class="price">${finalPrice.toFixed(2)} د.إ</div>
                    </div>
                </div>
            `;
        }).filter(html => html.length > 0).join('');
        
        grid.innerHTML = productsHTML;
        
        // Add safe click event listeners
        const productCards = grid.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.dataset.productId;
                const productType = this.dataset.productType;
                if (productId && productType) {
                    navigateToProductSafely(productId, productType);
                }
            });
        });
        
    } catch (error) {
        console.error('❌ Error displaying products:', error);
        if (grid) {
            grid.innerHTML = '<div class="loading-message">❌ خطأ في عرض المنتجات</div>';
        }
    }
}

// Safe navigation to product
function navigateToProductSafely(productId, type) {
    if (!productId || !type) {
        console.error('❌ Missing product ID or type');
        return;
    }
    
    console.log(`🔗 Safe navigation to product: ${productId}`);
    
    const product = type === 'perfume' ? 
        currentPerfumes.find(p => p && p.id === productId) :
        currentWatches.find(p => p && p.id === productId);
    
    if (product && product.title) {
        const slug = product.title
            .toLowerCase()
            .replace(/[^a-z0-9\s\u0600-\u06ff]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
        
        const url = `./product-details.html?id=${encodeURIComponent(productId)}&category=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`;
        
        try {
            window.location.href = url;
        } catch (navError) {
            console.error('❌ Navigation error:', navError);
        }
    } else {
        console.error('❌ Product not found:', productId);
    }
}

// Show more perfumes safely
function showMorePerfumesSafely() {
    try {
        displayedPerfumes += 8;
        displayProducts(currentPerfumes.slice(0, displayedPerfumes), 'perfumes-grid');
        
        if (displayedPerfumes >= currentPerfumes.length) {
            const viewMoreBtn = document.getElementById('perfumes-view-more');
            if (viewMoreBtn) viewMoreBtn.style.display = 'none';
        }
        
        console.log(`✅ Showing ${displayedPerfumes} of ${currentPerfumes.length} perfumes`);
    } catch (error) {
        console.error('❌ Error showing more perfumes:', error);
    }
}

// Show more watches safely
function showMoreWatchesSafely() {
    try {
        displayedWatches += 8;
        displayProducts(currentWatches.slice(0, displayedWatches), 'watches-grid');
        
        if (displayedWatches >= currentWatches.length) {
            const viewMoreBtn = document.getElementById('watches-view-more');
            if (viewMoreBtn) viewMoreBtn.style.display = 'none';
        }
        
        console.log(`✅ Showing ${displayedWatches} of ${currentWatches.length} watches`);
    } catch (error) {
        console.error('❌ Error showing more watches:', error);
    }
}

// Safe cart counter update
function updateCartCounterSafely() {
    try {
        const cartData = localStorage.getItem('emirates_cart');
        const cart = cartData ? JSON.parse(cartData) : [];
        
        if (!Array.isArray(cart)) {
            console.warn('⚠️ Invalid cart data, resetting');
            localStorage.setItem('emirates_cart', '[]');
            return;
        }
        
        const totalItems = cart.reduce((sum, item) => {
            const qty = parseInt(item?.quantity || 0);
            return sum + (isNaN(qty) ? 0 : qty);
        }, 0);
        
        const counter = document.getElementById('cart-counter');
        if (counter) {
            counter.textContent = totalItems.toString();
            counter.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    } catch (error) {
        console.error('❌ Cart counter error:', error);
    }
}

// Safe progress bar update
function updateProgressSafely() {
    try {
        const scrolled = window.pageYOffset || 0;
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        
        if (maxScroll > 0) {
            const progress = (scrolled / maxScroll) * 100;
            const bar = document.getElementById('progressBar');
            if (bar) {
                bar.style.width = Math.max(0, Math.min(100, progress)) + '%';
            }
        }
    } catch (error) {
        console.error('❌ Progress bar error:', error);
    }
}

// Safe back to top update
function updateBackToTopSafely() {
    try {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            const scrolled = window.pageYOffset || 0;
            if (scrolled > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    } catch (error) {
        console.error('❌ Back to top error:', error);
    }
}

// Safe smooth scroll initialization
function initSmoothScrollSafely() {
    try {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            });
        });
        console.log('✅ Smooth scroll initialized');
    } catch (error) {
        console.error('❌ Smooth scroll error:', error);
    }
}

// Show loading error
function showLoadingError() {
    const perfumesGrid = document.getElementById('perfumes-grid');
    const watchesGrid = document.getElementById('watches-grid');
    
    const errorMessage = `
        <div class="loading-message" style="background: #fff5f5; border: 2px solid #fed7d7; color: #e74c3c;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px;"></i><br>
            ❌ خطأ في تحميل المنتجات<br>
            <button onclick="location.reload()" 
                    style="margin-top: 15px; background: #D4AF37; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                إعادة المحاولة
            </button>
        </div>
    `;
    
    if (perfumesGrid) perfumesGrid.innerHTML = errorMessage;
    if (watchesGrid) watchesGrid.innerHTML = errorMessage;
}

// Safe DOM content loaded handler
function initializeHomepage() {
    console.log('🚫 Zero Popup Homepage Initializing...');
    
    try {
        // Update cart counter
        updateCartCounterSafely();
        
        // Load products
        loadProducts();
        
        // Initialize smooth scroll
        initSmoothScrollSafely();
        
        // View more buttons
        const perfumesViewMore = document.getElementById('perfumes-view-more');
        const watchesViewMore = document.getElementById('watches-view-more');
        
        if (perfumesViewMore) {
            perfumesViewMore.addEventListener('click', showMorePerfumesSafely);
        }
        
        if (watchesViewMore) {
            watchesViewMore.addEventListener('click', showMoreWatchesSafely);
        }
        
        // Scroll events with passive listeners
        window.addEventListener('scroll', () => {
            updateProgressSafely();
            updateBackToTopSafely();
        }, { passive: true });
        
        // Back to top button
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    window.scrollTo({ 
                        top: 0, 
                        behavior: 'smooth' 
                    });
                } catch (scrollError) {
                    window.scrollTo(0, 0);
                }
            });
        }
        
        console.log('✅ Homepage initialization complete');
        
    } catch (error) {
        console.error('❌ Homepage initialization error:', error);
    }
}

// Safe window load handler
function handleWindowLoad() {
    try {
        // Final cart counter update
        updateCartCounterSafely();
        
        // Final progress bar update
        updateProgressSafely();
        
        console.log('✅ Window fully loaded and ready');
    } catch (error) {
        console.error('❌ Window load error:', error);
    }
}

// DOM ready check and initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHomepage);
} else {
    // DOM already loaded
    initializeHomepage();
}

// Window load event
if (document.readyState === 'complete') {
    handleWindowLoad();
} else {
    window.addEventListener('load', handleWindowLoad);
}

// Export functions for external use (safely)
if (typeof window !== 'undefined') {
    window.EmiratesGifts = {
        navigateToProduct: navigateToProductSafely,
        showMorePerfumes: showMorePerfumesSafely,
        showMoreWatches: showMoreWatchesSafely,
        updateCartCounter: updateCartCounterSafely,
        loadProducts: loadProducts
    };
}

console.log('✅ Emirates Gifts Main Script Loaded Successfully');

// Safe function references for backwards compatibility
window.navigateToProduct = navigateToProductSafely;
window.showMorePerfumes = showMorePerfumesSafely;
window.showMoreWatches = showMoreWatchesSafely;