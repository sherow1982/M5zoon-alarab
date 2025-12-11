// 🚫 ZERO POPUP + ZERO INLINE CODE ENVIRONMENT
const isDev = window.location.hostname === 'localhost';
const log = isDev ? console.log.bind(console) : () => {};
const warn = isDev ? console.warn.bind(console) : () => {};
const error = console.error.bind(console);

log('🚫 EMIRATES GIFTS ENGLISH - ZERO INLINE CODE');

// Strict popup blocking
window.alert = function() { log('🚫 Alert blocked'); return undefined; };
window.confirm = function() { log('🚫 Confirm blocked'); return true; };
window.prompt = function() { log('🚫 Prompt blocked'); return null; };
window.open = function() { log('🚫 window.open blocked'); return null; };

let currentPerfumes = [];
let currentWatches = [];
let displayedPerfumes = 8;
let displayedWatches = 8;

// Enhanced image error handler (ZERO INLINE)
function setupSecureImageHandler(imgElement) {
    if (!imgElement || imgElement.dataset.secureHandler) return;
    
    imgElement.addEventListener('error', function() {
        if (this.dataset.fallbackApplied === 'true') return;
        
        this.dataset.fallbackApplied = 'true';
        this.src = 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=Premium+Product';
        this.alt = 'Premium Product - Fallback Image';
        warn('⚠️ Image fallback applied');
    });
    
    imgElement.dataset.secureHandler = 'true';
    
    // Handle pre-failed images
    if (imgElement.complete && imgElement.naturalWidth === 0) {
        imgElement.dispatchEvent(new Event('error'));
    }
}

// English product name converter with enhanced mapping
function getEnglishProductName(arabicTitle, productId) {
    const specificTranslations = {
        'watch_88': 'Rolex Kaaba Design Premium Watch',
        'watch_3': 'Rolex Black Dial Professional R21',
        'watch_1': 'Rolex Yacht Master Silver Edition',
        'watch_8': 'Omega Swatch Baby Blue Limited Edition',
        'watch_2': 'Rolex Submariner Black Premium',
        'watch_4': 'Rolex Daytona Gold Collection',
        'watch_5': 'Omega Speedmaster Professional',
        'watch_6': 'Patek Philippe Calatrava Classic',
        'watch_7': 'TAG Heuer Formula 1 Racing',
        'watch_9': 'Breitling Navitimer Pilot',
        'watch_10': 'IWC Portuguese Chronograph',
        'perfume_1': 'Chanel Coco Premium Perfume 100ml',
        'perfume_10': 'Dior Sauvage Premium Fragrance',
        'perfume_15': 'Tom Ford Black Orchid Luxury',
        'perfume_2': 'Chanel No.5 Classic Edition',
        'perfume_3': 'Creed Aventus Premium Collection',
        'perfume_4': 'Tom Ford Oud Wood Oriental',
        'perfume_5': 'Dior Miss Dior Blooming Bouquet',
        'perfume_6': 'Guerlain Shalimar Oriental Classic',
        'perfume_7': 'Yves Saint Laurent Black Opium',
        'perfume_8': 'Giorgio Armani Si Passione',
        'perfume_9': 'Versace Eros Flame Intense'
    };
    
    if (specificTranslations[productId]) {
        return specificTranslations[productId];
    }
    
    if (!arabicTitle || typeof arabicTitle !== 'string') return 'Premium Product';
    
    // Enhanced brand and feature detection
    const title = arabicTitle.toLowerCase();
    let parts = [];
    
    // Brand detection
    if (title.includes('rolex') || title.includes('روليكس')) parts.push('Rolex');
    else if (title.includes('omega') || title.includes('أوميغا')) parts.push('Omega');
    else if (title.includes('chanel') || title.includes('شانيل')) parts.push('Chanel');
    else if (title.includes('dior') || title.includes('ديور')) parts.push('Dior');
    else if (title.includes('tom ford')) parts.push('Tom Ford');
    else if (title.includes('creed')) parts.push('Creed');
    
    // Color/style detection
    if (title.includes('black') || title.includes('أسود')) parts.push('Black');
    else if (title.includes('gold') || title.includes('ذهبي')) parts.push('Gold');
    else if (title.includes('silver') || title.includes('فضي')) parts.push('Silver');
    else if (title.includes('blue') || title.includes('أزرق')) parts.push('Blue');
    
    // Product type
    if (productId && productId.includes('watch')) {
        parts.push('Premium Watch');
    } else if (productId && productId.includes('perfume')) {
        parts.push('Premium Perfume');
    }
    
    return parts.length > 0 ? parts.join(' ') : 'Premium Luxury Product';
}

// Enhanced product loading
async function loadProducts() {
    try {
        log('📦 Loading products for English version...');
        
        const loadWithRetry = async (url, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url + '?v=' + Date.now());
                    if (response.ok) {
                        const data = await response.json();
                        return Array.isArray(data) ? data : [];
                    }
                } catch (e) {
                    warn(`⚠️ Retry ${i + 1}/${retries} failed for ${url}`);
                    if (i === retries - 1) throw e;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            return [];
        };
        
        const [perfumes, watches] = await Promise.all([
            loadWithRetry('../data/otor.json'),
            loadWithRetry('../data/sa3at.json')
        ]);
        
        currentPerfumes = perfumes;
        currentWatches = watches;
        
        if (currentPerfumes.length > 0) {
            const perfumesWithEnglish = currentPerfumes.map(p => ({
                ...p,
                englishName: getEnglishProductName(p.title, p.id)
            }));
            displayProductsSecurely(perfumesWithEnglish.slice(0, displayedPerfumes), 'perfumes-grid');
            updateViewMoreButton('perfumes-view-more', currentPerfumes.length, displayedPerfumes);
            log(`✅ Loaded ${currentPerfumes.length} perfumes`);
        }
        
        if (currentWatches.length > 0) {
            const watchesWithEnglish = currentWatches.map(p => ({
                ...p,
                englishName: getEnglishProductName(p.title, p.id)
            }));
            displayProductsSecurely(watchesWithEnglish.slice(0, displayedWatches), 'watches-grid');
            updateViewMoreButton('watches-view-more', currentWatches.length, displayedWatches);
            log(`✅ Loaded ${currentWatches.length} watches`);
        }
        
    } catch (error) {
        error('❌ Product loading failed:', error);
    }
}

// Update view more button
function updateViewMoreButton(buttonId, totalItems, displayedItems) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    if (totalItems > displayedItems) {
        button.style.display = 'inline-flex';
        button.style.visibility = 'visible';
        button.style.opacity = '1';
        log(`✅ ${buttonId} shown (${displayedItems}/${totalItems})`);
    } else {
        button.style.display = 'none';
        log(`ℹ️ ${buttonId} hidden - all shown`);
    }
}

// SECURE PRODUCTS DISPLAY (ZERO INLINE CODE)
function displayProductsSecurely(products, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || !Array.isArray(products) || products.length === 0) {
        warn(`⚠️ No products for ${gridId}`);
        return;
    }
    
    try {
        const productsHTML = products.map(product => {
            if (!product || typeof product !== 'object') return '';
            
            const finalPrice = parseFloat(product.sale_price || product.price || 0);
            const displayName = product.englishName || getEnglishProductName(product.title, product.id);
            const productId = String(product.id || Date.now());
            const productType = gridId.includes('perfume') ? 'perfume' : 'watch';
            const imageUrl = product.image_link || 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=Premium+Product';
            
            // ❌ NO INLINE ONCLICK/ONERROR - COMPLETELY SECURE
            return `
                <div class="product-card" 
                     data-product-id="${productId}" 
                     data-product-type="${productType}"
                     role="button"
                     tabindex="0"
                     aria-label="View details for ${displayName}">
                    <div class="product-image-container">
                        <img src="${imageUrl}" 
                             alt="${displayName}" 
                             loading="lazy"
                             width="300"
                             height="250"
                             data-fallback-applied="false">
                    </div>
                    <div class="product-info">
                        <h4 class="product-title">${displayName}</h4>
                        <div class="price">AED ${finalPrice.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }).filter(html => html.trim().length > 0).join('');
        
        grid.innerHTML = productsHTML;
        
        // Setup secure event handlers
        const productCards = grid.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // Click navigation
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.dataset.productId;
                const productType = this.dataset.productType;
                
                if (productId && productType) {
                    navigateToProductSecurely(productId, productType);
                }
            });
            
            // Keyboard accessibility
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Secure image handling
            const img = card.querySelector('img');
            if (img) {
                setupSecureImageHandler(img);
            }
        });
        
        log(`📦 Securely displayed ${products.length} products in ${gridId}`);
        
    } catch (displayError) {
        error('❌ Display error:', displayError);
        grid.innerHTML = '<div class="loading-message" role="alert">❌ Error displaying products</div>';
    }
}

// Secure navigation
function navigateToProductSecurely(productId, type) {
    if (!productId || !type) {
        error('❌ Missing navigation data');
        return;
    }
    
    log(`🔗 Secure navigation to: ${productId}`);
    
    const product = type === 'perfume' ? 
        currentPerfumes.find(p => p && String(p.id) === String(productId)) :
        currentWatches.find(p => p && String(p.id) === String(productId));
    
    if (product) {
        const englishName = getEnglishProductName(product.title, productId);
        const slug = englishName
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)
            .trim();
        
        const params = new URLSearchParams({
            id: productId,
            category: type,
            slug: slug || 'product'
        });
        
        try {
            window.location.href = `./product-details.html?${params.toString()}`;
        } catch (navError) {
            error('❌ Navigation error:', navError);
            window.location.href = `./product-details.html?id=${encodeURIComponent(productId)}&category=${encodeURIComponent(type)}`;
        }
    } else {
        error('❌ Product not found:', productId);
    }
}

// Show more functions with accessibility
function showMorePerfumesSecurely() {
    try {
        const oldCount = displayedPerfumes;
        displayedPerfumes = Math.min(displayedPerfumes + 8, currentPerfumes.length);
        
        const perfumesWithEnglish = currentPerfumes.map(p => ({
            ...p,
            englishName: getEnglishProductName(p.title, p.id)
        }));
        
        displayProductsSecurely(perfumesWithEnglish.slice(0, displayedPerfumes), 'perfumes-grid');
        updateViewMoreButton('perfumes-view-more', currentPerfumes.length, displayedPerfumes);
        
        // Smooth scroll to new content
        const section = document.getElementById('perfumes-section');
        if (section && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        log(`🔄 Perfumes: ${oldCount} → ${displayedPerfumes}/${currentPerfumes.length}`);
    } catch (error) {
        error('❌ Show more perfumes error:', error);
    }
}

function showMoreWatchesSecurely() {
    try {
        const oldCount = displayedWatches;
        displayedWatches = Math.min(displayedWatches + 8, currentWatches.length);
        
        const watchesWithEnglish = currentWatches.map(p => ({
            ...p,
            englishName: getEnglishProductName(p.title, p.id)
        }));
        
        displayProductsSecurely(watchesWithEnglish.slice(0, displayedWatches), 'watches-grid');
        updateViewMoreButton('watches-view-more', currentWatches.length, displayedWatches);
        
        // Smooth scroll to new content
        const section = document.getElementById('watches-section');
        if (section && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        log(`🔄 Watches: ${oldCount} → ${displayedWatches}/${currentWatches.length}`);
    } catch (error) {
        error('❌ Show more watches error:', error);
    }
}

// Enhanced cart counter
function updateCartCounter() {
    try {
        const cartData = localStorage.getItem('emirates_cart');
        let cart = [];
        
        if (cartData) {
            try {
                cart = JSON.parse(cartData);
            } catch (parseError) {
                warn('⚠️ Cart data corrupted');
                cart = [];
            }
        }
        
        if (!Array.isArray(cart)) cart = [];
        
        const totalItems = cart.reduce((sum, item) => {
            if (!item || typeof item !== 'object') return sum;
            const qty = parseInt(item.quantity || 0);
            return sum + (isNaN(qty) ? 0 : Math.max(0, qty));
        }, 0);
        
        const counter = document.getElementById('cart-counter');
        if (counter) {
            counter.textContent = totalItems.toString();
            counter.style.display = totalItems > 0 ? 'flex' : 'none';
            counter.setAttribute('aria-label', `Number of items in cart: ${totalItems}`);
        }
    } catch (error) {
        error('❌ Cart counter error:', error);
    }
}

// Enhanced progress bar
function updateProgressSecurely() {
    try {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        
        if (maxScroll > 0) {
            const progress = Math.max(0, Math.min(100, (scrolled / maxScroll) * 100));
            const bar = document.getElementById('progressBar');
            if (bar) {
                bar.style.width = progress + '%';
            }
        }
    } catch (error) {
        error('❌ Progress error:', error);
    }
}

// Enhanced back to top
function updateBackToTopSecurely() {
    try {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
        const shouldShow = scrolled > 300;
        
        if (shouldShow && !backToTop.classList.contains('show')) {
            backToTop.classList.add('show');
        } else if (!shouldShow && backToTop.classList.contains('show')) {
            backToTop.classList.remove('show');
        }
    } catch (error) {
        error('❌ Back to top error:', error);
    }
}

// Enhanced smooth scroll
function initSmoothScrollSecurely() {
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
                }
            });
        });
        log('✅ Smooth scroll initialized');
    } catch (error) {
        error('❌ Smooth scroll error:', error);
    }
}

// Enhanced initialization
function initializeEnglishHomepage() {
    log('🚫 English Homepage Init - Zero Inline Code...');
    
    try {
        // Update cart counter
        updateCartCounter();
        
        // Load products
        loadProducts();
        
        // Initialize smooth scroll
        initSmoothScrollSecurely();
        
        // Enhanced View More buttons
        const perfumesViewMore = document.getElementById('perfumes-view-more');
        const watchesViewMore = document.getElementById('watches-view-more');
        
        if (perfumesViewMore) {
            perfumesViewMore.addEventListener('click', showMorePerfumesSecurely);
            perfumesViewMore.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showMorePerfumesSecurely();
                }
            });
        }
        
        if (watchesViewMore) {
            watchesViewMore.addEventListener('click', showMoreWatchesSecurely);
            watchesViewMore.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showMoreWatchesSecurely();
                }
            });
        }
        
        // Scroll events with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                updateProgressSecurely();
                updateBackToTopSecurely();
                scrollTimeout = null;
            }, 16);
        }, { passive: true });
        
        // Enhanced back to top
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
                } catch (scrollError) {
                    window.scrollTo(0, 0);
                }
            });
            
            backToTopBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
        
        log('✅ English homepage fully initialized');
        
    } catch (initError) {
        error('❌ Initialization error:', initError);
    }
}

// Global error handling
window.addEventListener('error', function(event) {
    error('❌ Global error:', event.error);
    event.preventDefault();
    return true;
});

window.addEventListener('unhandledrejection', function(event) {
    error('❌ Unhandled promise:', event.reason);
    event.preventDefault();
});

// Smart DOM initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnglishHomepage);
} else {
    setTimeout(initializeEnglishHomepage, 0);
}

// Secure global exports
if (typeof window !== 'undefined') {
    window.EmiratesGiftsEN = Object.freeze({
        version: '2.0.0-english-secure',
        navigateToProduct: navigateToProductSecurely,
        showMorePerfumes: showMorePerfumesSecurely,
        showMoreWatches: showMoreWatchesSecurely,
        updateCartCounter: updateCartCounter,
        loadProducts: loadProducts,
        isDevelopment: isDev
    });
    
    // Legacy support
    window.navigateToProduct = navigateToProductSecurely;
}

log('✅ Emirates Gifts English v2.0 - ZERO INLINE CODE');