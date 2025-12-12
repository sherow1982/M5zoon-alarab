// Emirates Gifts - Main Homepage Script v2.1
// Limited products display with View More buttons

(function() {
    'use strict';
    
    const isDev = window.location.hostname === 'localhost';
    const log = isDev ? console.log.bind(console) : () => {};
    const error = console.error.bind(console);
    
    const PERFUMES_INITIAL = 6; // Show 6 perfumes on homepage
    const WATCHES_INITIAL = 6;  // Show 6 watches on homepage
    
    let allProducts = [];
    let perfumesLoaded = false;
    let watchesLoaded = false;
    
    log('🏠 Emirates Gifts Homepage v2.1 - Limited Products Mode');
    
    /**
     * Load products from JSON
     */
    async function loadProductsData() {
        try {
            log('📦 Loading products data...');
            
            const response = await fetch('./data/products.json?v=' + Date.now());
            if (!response.ok) throw new Error('Failed to load products');
            
            const products = await response.json();
            if (!Array.isArray(products)) throw new Error('Invalid products format');
            
            allProducts = products.map(p => ({
                ...p,
                categoryType: p.category === 'Perfumes' ? 'perfume' : 'watch'
            }));
            
            log(`✅ Loaded ${allProducts.length} products`);
            return allProducts;
            
        } catch (err) {
            error('❌ Error loading products:', err);
            return [];
        }
    }
    
    /**
     * Display limited products in grid
     */
    function displayLimitedProducts(products, gridSelector, limit) {
        const grid = document.querySelector(gridSelector);
        if (!grid) {
            error(`❌ Grid not found: ${gridSelector}`);
            return;
        }
        
        const productsToShow = products.slice(0, limit);
        
        if (productsToShow.length === 0) {
            grid.innerHTML = '<div class="no-products" role="status">لا توجد منتجات</div>';
            return;
        }
        
        const html = productsToShow.map(product => {
            if (!product || !product.id) return '';
            
            const finalPrice = parseFloat(product.sale_price || product.price || 0);
            const originalPrice = parseFloat(product.price || 0);
            const hasDiscount = originalPrice > finalPrice && finalPrice > 0;
            const discountPercent = hasDiscount ? 
                Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;
            
            const productTitle = (product.title || product.title_ar || 'منتج مميز')
                .replace(/[<>&"']/g, '')
                .substring(0, 100);
            
            const imageUrl = product.image_link || 
                'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=منتج+مميز';
            
            return `
                <div class="product-card" 
                     data-product-id="${product.id}" 
                     data-product-type="${product.categoryType}" 
                     role="button" 
                     tabindex="0"
                     aria-label="عرض تفاصيل ${productTitle}">
                    <div class="product-image-container">
                        <img src="${imageUrl}" 
                             alt="${productTitle}" 
                             class="product-image"
                             loading="lazy"
                             width="280"
                             height="280">
                        ${hasDiscount ? `<div class="product-discount">خصم ${discountPercent}%</div>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${productTitle}</h3>
                        <div class="product-price">
                            <span class="price-current">${finalPrice.toFixed(2)} د.إ</span>
                            ${hasDiscount ? `<span class="price-original">${originalPrice.toFixed(2)} د.إ</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).filter(html => html.trim().length > 0).join('');
        
        grid.innerHTML = html;
        setupProductHandlers();
    }
    
    /**
     * Setup product event handlers
     */
    function setupProductHandlers() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                const productId = this.dataset.productId;
                const productType = this.dataset.productType;
                if (productId && productType) {
                    navigateToProductDetails(productId, productType);
                }
            });
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            const img = card.querySelector('.product-image');
            if (img) setupImageErrorHandler(img);
        });
    }
    
    /**
     * Setup image error handler
     */
    function setupImageErrorHandler(imgElement) {
        if (!imgElement || imgElement.dataset.handlerSetup) return;
        
        imgElement.addEventListener('error', function() {
            if (this.dataset.fallbackApplied === 'true') return;
            this.dataset.fallbackApplied = 'true';
            this.src = 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=منتج+مميز';
            this.alt = 'منتج مميز - صورة بديلة';
        });
        
        imgElement.dataset.handlerSetup = 'true';
        
        // Handle already failed images
        if (imgElement.complete && imgElement.naturalWidth === 0) {
            imgElement.dispatchEvent(new Event('error'));
        }
    }
    
    /**
     * Navigate to product details
     */
    function navigateToProductDetails(productId, type) {
        const product = allProducts.find(p => String(p.id) === String(productId));
        if (!product) return;
        
        const slug = (product.title || product.title_ar || '')
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
        
        window.location.href = `./product-details.html?${params.toString()}`;
    }
    
    /**
     * Update cart badge
     */
    function updateCartBadge() {
        try {
            const cartData = localStorage.getItem('emirates_cart');
            let cart = [];
            
            if (cartData) {
                try {
                    cart = JSON.parse(cartData);
                } catch (e) {
                    cart = [];
                }
            }
            
            if (!Array.isArray(cart)) cart = [];
            
            const totalItems = cart.reduce((sum, item) => {
                if (!item) return sum;
                const qty = parseInt(item.quantity || 0);
                return sum + (isNaN(qty) ? 0 : Math.max(0, qty));
            }, 0);
            
            const badge = document.getElementById('cart-counter');
            if (badge) {
                badge.textContent = totalItems.toString();
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
                badge.setAttribute('aria-label', `عدد العناصر في السلة: ${totalItems}`);
            }
        } catch (err) {
            error('❌ Cart badge error:', err);
        }
    }
    
    /**
     * Setup View More buttons
     */
    function setupViewMoreButtons(products) {
        const perfumes = products.filter(p => p.category === 'Perfumes');
        const watches = products.filter(p => p.category === 'Watches');
        
        // Perfumes View More
        const perfumesBtn = document.getElementById('perfumes-view-more');
        if (perfumesBtn) {
            if (perfumes.length > PERFUMES_INITIAL) {
                perfumesBtn.style.display = 'flex';
                perfumesBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = './products-showcase.html?category=perfumes';
                });
                perfumesBtn.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            } else {
                perfumesBtn.style.display = 'none';
            }
        }
        
        // Watches View More
        const watchesBtn = document.getElementById('watches-view-more');
        if (watchesBtn) {
            if (watches.length > WATCHES_INITIAL) {
                watchesBtn.style.display = 'flex';
                watchesBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = './products-showcase.html?category=watches';
                });
                watchesBtn.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            } else {
                watchesBtn.style.display = 'none';
            }
        }
        
        log(`✅ View More buttons configured - Perfumes: ${perfumes.length}, Watches: ${watches.length}`);
    }
    
    /**
     * Initialize homepage
     */
    async function initialize() {
        log('🚀 Initializing homepage...');
        
        try {
            // Update cart badge
            updateCartBadge();
            
            // Load products
            const products = await loadProductsData();
            if (products.length === 0) throw new Error('No products loaded');
            
            // Separate by category
            const perfumes = products.filter(p => p.category === 'Perfumes');
            const watches = products.filter(p => p.category === 'Watches');
            
            // Display limited products
            displayLimitedProducts(perfumes, '#perfumes-grid', PERFUMES_INITIAL);
            displayLimitedProducts(watches, '#watches-grid', WATCHES_INITIAL);
            
            // Setup View More buttons
            setupViewMoreButtons(products);
            
            // Setup scroll spy
            setupScrollSpy();
            
            log(`✅ Homepage initialized - Showing ${PERFUMES_INITIAL} perfumes + ${WATCHES_INITIAL} watches`);
            
        } catch (err) {
            error('❌ Initialization error:', err);
        }
    }
    
    /**
     * Setup scroll spy
     */
    function setupScrollSpy() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        }, { passive: true });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        backToTop.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
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
    
})();
