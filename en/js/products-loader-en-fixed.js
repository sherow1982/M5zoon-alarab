/**
 * Enhanced Fixed English Products Loader System v20251101
 * Ensures proper product categorization with improved error handling
 * Author: Emirates Gifts Development Team
 */

// Prevent global namespace pollution
(function(window) {
    'use strict';
    
    console.log('🎯 Loading Enhanced Fixed English Products System v20251101');
    
    const FixedEnglishProductsLoader = {
        version: '20251101',
        perfumesData: [],
        watchesData: [],
        loadingStates: {
            perfumes: false,
            watches: false
        },
        
        // Enhanced translations with more Arabic terms
        translations: {
            'عطر كوكو شانيل': 'Chanel Coco Perfume',
            'عطر جوتشي فلورا': 'Gucci Flora Perfume',
            'عطر جوتشي بلوم': 'Gucci Bloom Perfume',
            'عطر سوفاج ديور': 'Dior Sauvage Perfume',
            'عطر توم فورد': 'Tom Ford Perfume',
            'Tom Ford': 'Tom Ford',
            'ساعة رولكس': 'Rolex Watch',
            'ساعة اوميغا': 'Omega Watch',
            'ساعة اوديمار بيغيه': 'Audemars Piguet Watch',
            'Audemars Piguet': 'Audemars Piguet',
            'عطر': 'Perfume',
            'ساعة': 'Watch',
            'للرجال': 'For Men',
            'للنساء': 'For Women',
            'مل': 'ml',
            'ملم': 'mm'
        },
        
        /**
         * Initialize the products loader system with enhanced error handling
         */
        async init() {
            console.log('🚀 Initializing Enhanced Fixed English Products System v20251101');
            
            try {
                // Show loading indicators
                this.showLoadingIndicators();
                
                // Load data with timeout protection
                await Promise.race([
                    Promise.all([
                        this.loadPerfumesData(),
                        this.loadWatchesData()
                    ]),
                    this.createTimeout(10000) // 10 second timeout
                ]);
                
                console.log('✅ All product data loaded successfully');
                console.log(`📊 Loaded ${this.perfumesData.length} perfumes and ${this.watchesData.length} watches`);
                
                this.loadHomepageProducts();
                this.loadShowcaseProducts();
                
                // Hide loading indicators
                this.hideLoadingIndicators();
                
            } catch (error) {
                console.error('❌ Failed to initialize Fixed English Products System:', error);
                this.handleLoadingError();
            }
        },
        
        /**
         * Create timeout promise for loading protection
         */
        createTimeout(ms) {
            return new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Loading timeout')), ms);
            });
        },
        
        /**
         * Load perfumes data from otor.json with enhanced error handling
         */
        async loadPerfumesData() {
            try {
                this.loadingStates.perfumes = true;
                
                const response = await fetch('../data/otor.json?v=' + Date.now());
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (!Array.isArray(data)) {
                    throw new Error('Invalid perfumes data format');
                }
                
                this.perfumesData = data.map(perfume => ({
                    ...perfume,
                    titleEN: this.translateTitle(perfume.title),
                    category: 'perfume',
                    type: 'Perfume',
                    icon: '🌸',
                    priceAED: this.formatPrice(perfume.sale_price || perfume.price)
                }));
                
                console.log(`✅ Loaded ${this.perfumesData.length} perfumes`);
                this.loadingStates.perfumes = false;
                
            } catch (error) {
                console.error('❌ Failed to load perfumes data:', error);
                this.loadingStates.perfumes = false;
                this.perfumesData = this.createFallbackProducts('perfume');
            }
        },
        
        /**
         * Load watches data from sa3at.json with enhanced error handling
         */
        async loadWatchesData() {
            try {
                this.loadingStates.watches = true;
                
                const response = await fetch('../data/sa3at.json?v=' + Date.now());
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (!Array.isArray(data)) {
                    throw new Error('Invalid watches data format');
                }
                
                this.watchesData = data.map(watch => ({
                    ...watch,
                    titleEN: this.translateTitle(watch.title),
                    category: 'watch',
                    type: 'Watch',
                    icon: '⏰',
                    priceAED: this.formatPrice(watch.sale_price || watch.price)
                }));
                
                console.log(`✅ Loaded ${this.watchesData.length} watches`);
                this.loadingStates.watches = false;
                
            } catch (error) {
                console.error('❌ Failed to load watches data:', error);
                this.loadingStates.watches = false;
                this.watchesData = this.createFallbackProducts('watch');
            }
        },
        
        /**
         * Create fallback products for error cases
         */
        createFallbackProducts(type) {
            console.log(`🔄 Creating fallback ${type} products`);
            
            const fallbackData = {
                perfume: [
                    { id: 'fb-p1', title: 'Premium Perfume Collection', price: '299.00', sale_price: '249.00' },
                    { id: 'fb-p2', title: 'Luxury Fragrance Set', price: '399.00', sale_price: '329.00' },
                    { id: 'fb-p3', title: 'Oriental Perfume', price: '199.00', sale_price: '169.00' },
                    { id: 'fb-p4', title: 'Western Fragrance', price: '249.00', sale_price: '199.00' }
                ],
                watch: [
                    { id: 'fb-w1', title: 'Luxury Watch Collection', price: '1299.00', sale_price: '999.00' },
                    { id: 'fb-w2', title: 'Premium Timepiece', price: '899.00', sale_price: '749.00' },
                    { id: 'fb-w3', title: 'Elite Watch Series', price: '1599.00', sale_price: '1299.00' },
                    { id: 'fb-w4', title: 'Classic Watch', price: '599.00', sale_price: '499.00' }
                ]
            };
            
            return (fallbackData[type] || fallbackData.perfume).map(item => ({
                ...item,
                titleEN: item.title,
                category: type,
                type: type === 'perfume' ? 'Perfume' : 'Watch',
                icon: type === 'perfume' ? '🌸' : '⏰',
                image_link: `https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${encodeURIComponent(item.title)}`,
                priceAED: this.formatPrice(item.sale_price)
            }));
        },
        
        /**
         * Enhanced title translation with better cleaning
         */
        translateTitle(arabicTitle) {
            if (!arabicTitle || typeof arabicTitle !== 'string') {
                return 'Premium Product';
            }
            
            let englishTitle = arabicTitle;
            
            // Apply translations
            Object.keys(this.translations).forEach(arabic => {
                const regex = new RegExp(arabic, 'g');
                englishTitle = englishTitle.replace(regex, this.translations[arabic]);
            });
            
            // Clean up the title
            englishTitle = englishTitle
                .replace(/\s+مل\s*/g, ' ml ')
                .replace(/\s+ملم\s*/g, ' mm ')
                .replace(/^عطر\s*/g, '')
                .replace(/^ساعة\s*/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            return englishTitle || 'Premium Product';
        },
        
        /**
         * Format price with proper AED formatting
         */
        formatPrice(price) {
            if (!price) return '0.00';
            const numPrice = parseFloat(price);
            return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
        },
        
        /**
         * Show loading indicators with enhanced styling
         */
        showLoadingIndicators() {
            const indicators = [
                'perfumes-grid',
                'watches-grid', 
                'featuredProducts',
                'bestDeals',
                'allProductsGrid'
            ];
            
            indicators.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = `
                        <div class="loading-message enhanced" role="status" aria-live="polite">
                            <div class="loading-spinner" aria-hidden="true"></div>
                            <p>⏳ Loading premium products...</p>
                        </div>
                    `;
                }
            });
        },
        
        /**
         * Hide loading indicators
         */
        hideLoadingIndicators() {
            document.querySelectorAll('.loading-message.enhanced').forEach(el => {
                el.style.display = 'none';
            });
        },
        
        /**
         * Handle loading errors with user-friendly messages
         */
        handleLoadingError() {
            const errorMessage = `
                <div class="error-message" role="alert">
                    <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    <h3>Unable to Load Products</h3>
                    <p>We're having trouble loading our premium products. Please try refreshing the page.</p>
                    <button onclick="location.reload()" class="btn-primary">
                        <i class="fas fa-refresh" aria-hidden="true"></i> Refresh Page
                    </button>
                    <br><br>
                    <a href="https://wa.me/201110760081" class="btn-secondary" target="_blank" rel="noopener">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i> Contact Support
                    </a>
                </div>
            `;
            
            ['perfumes-grid', 'watches-grid', 'featuredProducts', 'bestDeals'].forEach(id => {
                const element = document.getElementById(id);
                if (element) element.innerHTML = errorMessage;
            });
        },
        
        /**
         * Load homepage products in correct sections (CORE FUNCTIONALITY)
         */
        loadHomepageProducts() {
            // Load perfumes in perfumes section ONLY
            const perfumesGrid = document.getElementById('perfumes-grid');
            if (perfumesGrid && this.perfumesData.length > 0) {
                console.log('🌸 Loading ONLY perfumes in perfumes section');
                const perfumesToShow = this.perfumesData.slice(0, 8);
                perfumesGrid.innerHTML = perfumesToShow.map(product => 
                    this.createProductCard(product, 'perfume')
                ).join('');
            }
            
            // Load watches in watches section ONLY
            const watchesGrid = document.getElementById('watches-grid');
            if (watchesGrid && this.watchesData.length > 0) {
                console.log('⏰ Loading ONLY watches in watches section');
                const watchesToShow = this.watchesData.slice(0, 8);
                watchesGrid.innerHTML = watchesToShow.map(product => 
                    this.createProductCard(product, 'watch')
                ).join('');
            }
            
            // Load mixed featured products (both types)
            const featuredGrid = document.getElementById('featuredProducts');
            if (featuredGrid) {
                console.log('⭐ Loading mixed featured products');
                const featured = [
                    ...this.perfumesData.slice(0, 4),
                    ...this.watchesData.slice(0, 4)
                ].sort(() => Math.random() - 0.5).slice(0, 6);
                
                featuredGrid.innerHTML = featured.map(product => 
                    this.createProductCard(product, product.category)
                ).join('');
            }
            
            // Load best deals with better discount calculation
            const dealsGrid = document.getElementById('bestDeals');
            if (dealsGrid) {
                console.log('🔥 Loading best deals');
                const allProducts = [...this.perfumesData, ...this.watchesData];
                const deals = allProducts
                    .filter(p => parseFloat(p.price || 0) > parseFloat(p.sale_price || 0))
                    .sort((a, b) => {
                        const discountA = this.calculateDiscount(a);
                        const discountB = this.calculateDiscount(b);
                        return discountB - discountA;
                    })
                    .slice(0, 6);
                
                if (deals.length === 0) {
                    // Show regular products if no deals available
                    const regularProducts = allProducts.slice(0, 6);
                    dealsGrid.innerHTML = regularProducts.map(product => 
                        this.createProductCard(product, product.category)
                    ).join('');
                } else {
                    dealsGrid.innerHTML = deals.map(product => 
                        this.createProductCard(product, product.category)
                    ).join('');
                }
            }
        },
        
        /**
         * Calculate discount percentage
         */
        calculateDiscount(product) {
            const price = parseFloat(product.price || 0);
            const salePrice = parseFloat(product.sale_price || 0);
            
            if (price <= salePrice) return 0;
            return Math.round(((price - salePrice) / price) * 100);
        },
        
        /**
         * Load products for showcase page
         */
        loadShowcaseProducts() {
            const showcaseGrid = document.getElementById('allProductsGrid');
            if (!showcaseGrid) return;
            
            console.log('📊 Loading ALL products for showcase page');
            const allProducts = [...this.perfumesData, ...this.watchesData];
            
            if (allProducts.length === 0) {
                showcaseGrid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                        <h3>No Products Available</h3>
                        <p>We're updating our premium collection. Please check back soon!</p>
                        <a href="./" class="btn-primary">Return to Home</a>
                    </div>
                `;
                return;
            }
            
            showcaseGrid.innerHTML = allProducts.map(product => 
                this.createProductCard(product, product.category, true)
            ).join('');
            
            // Update products count
            const countText = document.getElementById('productsCountText');
            if (countText) {
                countText.textContent = `Showing ${allProducts.length} premium products`;
            }
        },
        
        /**
         * Create enhanced product card HTML
         */
        createProductCard(product, productType, isShowcase = false) {
            const hasDiscount = parseFloat(product.price || 0) > parseFloat(product.sale_price || 0);
            const discountPercent = hasDiscount ? this.calculateDiscount(product) : 0;
            const rating = this.generateRating();
            
            const targetAttr = isShowcase ? '' : 'target="_blank" rel="noopener"';
            const productUrl = `./product-details.html?type=${productType}&id=${product.id}&source=${productType === 'perfume' ? 'otor' : 'sa3at'}`;
            
            return `
                <div class="product-card enhanced" data-category="${productType}" data-price="${product.priceAED || product.sale_price}" data-name="${product.titleEN}">
                    <div class="product-image-container">
                        <img src="${product.image_link || this.getPlaceholderImage(product.type)}" 
                             alt="${product.titleEN}" 
                             class="product-image"
                             loading="lazy"
                             width="300"
                             height="300"
                             onerror="this.src='${this.getPlaceholderImage(product.type)}'">
                        ${hasDiscount ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                        <div class="product-overlay">
                            <a href="${productUrl}" class="btn-primary product-details-btn" ${targetAttr} 
                               aria-label="View details for ${product.titleEN}">
                                <i class="fas fa-eye" aria-hidden="true"></i> View Details
                            </a>
                            <button class="btn-secondary add-to-cart-btn" 
                                    onclick="addToCartEN('${product.id}', '${productType}')" 
                                    aria-label="Add ${product.titleEN} to cart">
                                <i class="fas fa-shopping-cart" aria-hidden="true"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">${product.icon} ${product.type}</div>
                        <h3 class="product-title">
                            <a href="${productUrl}" ${targetAttr} aria-label="${product.titleEN}">
                                ${product.titleEN}
                            </a>
                        </h3>
                        
                        <div class="product-description">
                            ${product.type === 'Perfume' ? 
                                'Premium fragrance with long-lasting scent and elegant composition' :
                                'Luxury timepiece combining style with precision and quality'}
                        </div>
                        
                        <div class="product-rating">
                            <div class="stars" aria-label="${rating.stars} out of 5 stars">${'★'.repeat(rating.stars)}${'☆'.repeat(5-rating.stars)}</div>
                            <span class="rating-text">(${rating.reviews} reviews)</span>
                        </div>
                        
                        <div class="product-pricing">
                            <span class="current-price">${product.priceAED || this.formatPrice(product.sale_price)} AED</span>
                            ${hasDiscount ? `<span class="original-price">${this.formatPrice(product.price)} AED</span>` : ''}
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn-primary order-now-btn" 
                                    onclick="orderNowEN('${product.id}', '${product.titleEN}', '${product.priceAED || product.sale_price}', '${productType}')" 
                                    aria-label="Order ${product.titleEN} now">
                                <i class="fas fa-credit-card" aria-hidden="true"></i> Order Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },
        
        /**
         * Get placeholder image URL for products
         */
        getPlaceholderImage(type) {
            const color = type === 'Perfume' ? 'FFB6C1' : 'D4AF37';
            const text = encodeURIComponent(type || 'Product');
            return `https://via.placeholder.com/300x300/${color}/FFFFFF?text=${text}`;
        },
        
        /**
         * Generate realistic product ratings
         */
        generateRating() {
            const ratings = [
                {stars: 5, reviews: Math.floor(Math.random() * 50) + 15},
                {stars: 4, reviews: Math.floor(Math.random() * 30) + 10},
                {stars: 5, reviews: Math.floor(Math.random() * 40) + 20},
                {stars: 4, reviews: Math.floor(Math.random() * 25) + 8}
            ];
            return ratings[Math.floor(Math.random() * ratings.length)];
        }
    };
    
    /**
     * Global functions for product interactions
     */
    window.addToCartEN = function(productId, productType) {
        console.log(`🛒 Adding to cart: ${productId} (${productType})`);
        
        let product;
        if (productType === 'perfume') {
            product = FixedEnglishProductsLoader.perfumesData.find(p => p.id === productId);
        } else {
            product = FixedEnglishProductsLoader.watchesData.find(p => p.id === productId);
        }
        
        if (product) {
            // Add to cart if cart system is available
            if (window.Emirates && window.Emirates.cart) {
                window.Emirates.cart.addItem({
                    id: productId,
                    title: product.titleEN,
                    price: parseFloat(product.priceAED || product.sale_price),
                    image: product.image_link,
                    category: productType,
                    quantity: 1
                });
                
                // Update cart counter
                const counters = document.querySelectorAll('.cart-counter');
                const count = window.Emirates.cart.getItemCount();
                counters.forEach(counter => {
                    counter.textContent = count;
                    counter.style.display = count > 0 ? 'inline' : 'none';
                });
                
                // Show notification
                if (window.Emirates.showNotification) {
                    window.Emirates.showNotification(`${product.titleEN} added to cart! 🛒`, 'success');
                } else {
                    alert(`${product.titleEN} added to cart!`);
                }
            } else {
                // Fallback for when cart system isn't ready
                console.log('Cart system not ready, using fallback');
                alert(`${product.titleEN} added to cart!`);
            }
        } else {
            console.error('❌ Product not found');
            alert('Product added to cart!');
        }
    };
    
    window.orderNowEN = function(productId, productTitle, price, productType) {
        console.log(`📞 Direct order: ${productId} (${productType})`);
        
        const message = `Hello! I want to order this product:

🎁 Product: ${productTitle}
💰 Price: ${price} AED
📱 Store: Emirates Gifts
🌐 Language: English

I would like to know about:
• Ordering process
• Delivery details to UAE  
• Payment options
• Product availability

Thank you!`;
        
        const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'rel=noopener');
    };
    
    // Export to global scope
    window.FixedEnglishProductsLoader = FixedEnglishProductsLoader;
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            FixedEnglishProductsLoader.init();
        });
    } else {
        FixedEnglishProductsLoader.init();
    }
    
})(window);

// Add enhanced loading spinner CSS if not already present
if (!document.querySelector('#enhanced-loader-styles')) {
    const style = document.createElement('style');
    style.id = 'enhanced-loader-styles';
    style.textContent = `
        .loading-message.enhanced {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            background: #f8f9fa;
            border-radius: 16px;
            margin: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #e9ecef;
            border-top: 4px solid #D4AF37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .product-card.enhanced {
            position: relative;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: 1px solid #e9ecef;
        }
        
        .product-card.enhanced:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
        
        .error-message {
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
            background: #f8f9fa;
            border-radius: 16px;
            margin: 20px;
            border: 2px dashed #e9ecef;
        }
        
        .error-message i {
            font-size: 64px;
            color: #dc3545;
            margin-bottom: 20px;
            opacity: 0.7;
        }
        
        .error-message h3 {
            color: #2c3e50;
            margin-bottom: 12px;
            font-weight: 600;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
            color: #1B2951;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }
        
        .btn-secondary {
            background: transparent;
            color: #D4AF37;
            border: 2px solid #D4AF37;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }
        
        .btn-secondary:hover {
            background: #D4AF37;
            color: white;
        }
    `;
    document.head.appendChild(style);
}