/**
 * Enhanced English Products Loader System v20251101
 * Improved error handling and performance optimization
 * Author: Emirates Gifts Development Team
 */

(function(window) {
    'use strict';
    
    console.log('🚀 Loading Enhanced English Products System v20251101');
    
    const EnhancedProductsLoader = {
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
            'ساعة رولكس': 'Rolex Watch',
            'ساعة اوميغا': 'Omega Watch',
            'ساعة اوديمار بيغيه': 'Audemars Piguet Watch',
            'عطر': 'Perfume',
            'ساعة': 'Watch',
            'للرجال': 'For Men',
            'للنساء': 'For Women',
            'مل': 'ml',
            'ملم': 'mm'
        },
        
        /**
         * Initialize with enhanced error handling
         */
        async init() {
            console.log('🎯 Initializing Enhanced Products System');
            
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
                
                console.log(`✅ Successfully loaded ${this.perfumesData.length} perfumes and ${this.watchesData.length} watches`);
                
                // Load products into pages
                this.loadAllProducts();
                
                // Hide loading indicators
                this.hideLoadingIndicators();
                
            } catch (error) {
                console.error('❌ Failed to initialize products system:', error);
                this.handleLoadingError();
            }
        },
        
        /**
         * Create timeout promise
         */
        createTimeout(ms) {
            return new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Loading timeout')), ms);
            });
        },
        
        /**
         * Enhanced perfumes data loading
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
                    descriptionEN: this.generateDescription('perfume'),
                    category: 'perfume',
                    type: 'Perfume',
                    icon: '🌸',
                    priceAED: this.formatPrice(perfume.sale_price || perfume.price)
                }));
                
                console.log(`✅ Loaded ${this.perfumesData.length} perfumes`);
                this.loadingStates.perfumes = false;
                
            } catch (error) {
                console.error('❌ Failed to load perfumes:', error);
                this.loadingStates.perfumes = false;
                this.perfumesData = this.createFallbackProducts('perfume');
            }
        },
        
        /**
         * Enhanced watches data loading
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
                    descriptionEN: this.generateDescription('watch'),
                    category: 'watch',
                    type: 'Watch',
                    icon: '⏰',
                    priceAED: this.formatPrice(watch.sale_price || watch.price)
                }));
                
                console.log(`✅ Loaded ${this.watchesData.length} watches`);
                this.loadingStates.watches = false;
                
            } catch (error) {
                console.error('❌ Failed to load watches:', error);
                this.loadingStates.watches = false;
                this.watchesData = this.createFallbackProducts('watch');
            }
        },
        
        /**
         * Enhanced title translation
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
                .replace(/^\s*عطر\s*/g, '')
                .replace(/^\s*ساعة\s*/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            return englishTitle || 'Premium Product';
        },
        
        /**
         * Generate product descriptions
         */
        generateDescription(type) {
            const descriptions = {
                perfume: [
                    'Premium fragrance with long-lasting scent and elegant composition',
                    'Luxurious perfume crafted with the finest ingredients',
                    'Sophisticated fragrance perfect for any occasion',
                    'Exquisite scent that embodies elegance and refinement'
                ],
                watch: [
                    'Luxury timepiece combining style with precision and quality',
                    'Premium watch featuring exceptional craftsmanship',
                    'Elegant timepiece designed for the modern lifestyle',
                    'Sophisticated watch that makes a statement of luxury'
                ]
            };
            
            const typeDescriptions = descriptions[type] || descriptions.perfume;
            return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
        },
        
        /**
         * Format price with AED currency
         */
        formatPrice(price) {
            if (!price) return '0.00';
            const numPrice = parseFloat(price);
            return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
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
                    { id: 'fb-p3', title: 'Oriental Perfume', price: '199.00', sale_price: '169.00' }
                ],
                watch: [
                    { id: 'fb-w1', title: 'Luxury Watch Collection', price: '1299.00', sale_price: '999.00' },
                    { id: 'fb-w2', title: 'Premium Timepiece', price: '899.00', sale_price: '749.00' },
                    { id: 'fb-w3', title: 'Elite Watch Series', price: '1599.00', sale_price: '1299.00' }
                ]
            };
            
            return (fallbackData[type] || fallbackData.perfume).map(item => ({
                ...item,
                titleEN: item.title,
                category: type,
                type: type === 'perfume' ? 'Perfume' : 'Watch',
                icon: type === 'perfume' ? '🌸' : '⏰',
                image_link: `https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${item.title}`,
                descriptionEN: this.generateDescription(type),
                priceAED: this.formatPrice(item.sale_price)
            }));
        },
        
        /**
         * Show loading indicators
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
                        <div class="loading-message enhanced">
                            <div class="loading-spinner"></div>
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
            document.querySelectorAll('.loading-message').forEach(el => {
                if (el.classList.contains('enhanced')) {
                    el.style.display = 'none';
                }
            });
        },
        
        /**
         * Handle loading errors
         */
        handleLoadingError() {
            const errorMessage = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to load products. Please refresh the page.</p>
                    <button onclick="location.reload()" class="btn-primary">
                        <i class="fas fa-refresh"></i> Refresh Page
                    </button>
                </div>
            `;
            
            ['perfumes-grid', 'watches-grid', 'featuredProducts', 'bestDeals'].forEach(id => {
                const element = document.getElementById(id);
                if (element) element.innerHTML = errorMessage;
            });
        },
        
        /**
         * Load all products into their respective sections
         */
        loadAllProducts() {
            // Load homepage sections
            this.loadHomepageProducts();
            
            // Load showcase page if present
            this.loadShowcaseProducts();
            
            // Update cart counter
            this.updateCartCounter();
        },
        
        /**
         * Load homepage products with correct separation
         */
        loadHomepageProducts() {
            // Perfumes section - ONLY perfumes
            const perfumesGrid = document.getElementById('perfumes-grid');
            if (perfumesGrid && this.perfumesData.length > 0) {
                console.log('🌸 Loading perfumes in perfumes section');
                const perfumesToShow = this.perfumesData.slice(0, 8);
                perfumesGrid.innerHTML = perfumesToShow.map(product => 
                    this.createProductCard(product)
                ).join('');
            }
            
            // Watches section - ONLY watches
            const watchesGrid = document.getElementById('watches-grid');
            if (watchesGrid && this.watchesData.length > 0) {
                console.log('⏰ Loading watches in watches section');
                const watchesToShow = this.watchesData.slice(0, 8);
                watchesGrid.innerHTML = watchesToShow.map(product => 
                    this.createProductCard(product)
                ).join('');
            }
            
            // Featured products - mixed selection
            this.loadFeaturedProducts();
            
            // Best deals - products with discounts
            this.loadBestDeals();
        },
        
        /**
         * Load featured products (mixed)
         */
        loadFeaturedProducts() {
            const featuredGrid = document.getElementById('featuredProducts');
            if (!featuredGrid) return;
            
            const allProducts = [...this.perfumesData, ...this.watchesData];
            if (allProducts.length === 0) return;
            
            // Select featured products
            const featured = allProducts
                .sort(() => Math.random() - 0.5)
                .slice(0, 6);
            
            featuredGrid.innerHTML = featured.map(product => 
                this.createProductCard(product, true)
            ).join('');
        },
        
        /**
         * Load best deals (products with discounts)
         */
        loadBestDeals() {
            const dealsGrid = document.getElementById('bestDeals');
            if (!dealsGrid) return;
            
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
                    this.createProductCard(product, true)
                ).join('');
            } else {
                dealsGrid.innerHTML = deals.map(product => 
                    this.createProductCard(product, true)
                ).join('');
            }
        },
        
        /**
         * Load showcase products
         */
        loadShowcaseProducts() {
            const showcaseGrid = document.getElementById('allProductsGrid');
            if (!showcaseGrid) return;
            
            console.log('📊 Loading showcase products');
            const allProducts = [...this.perfumesData, ...this.watchesData];
            
            if (allProducts.length === 0) {
                showcaseGrid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-shopping-cart"></i>
                        <p>No products available at the moment</p>
                        <a href="./" class="btn-primary">Return to Home</a>
                    </div>
                `;
                return;
            }
            
            showcaseGrid.innerHTML = allProducts.map(product => 
                this.createProductCard(product, false, true)
            ).join('');
            
            // Update products count
            const countText = document.getElementById('productsCountText');
            if (countText) {
                countText.textContent = `Showing ${allProducts.length} premium products`;
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
         * Create enhanced product card
         */
        createProductCard(product, isFeatured = false, isShowcase = false) {
            const discount = this.calculateDiscount(product);
            const hasDiscount = discount > 0;
            const rating = this.generateRating();
            
            const productUrl = `./product-details.html?type=${product.category}&id=${product.id}&source=${product.category === 'perfume' ? 'otor' : 'sa3at'}`;
            const targetAttr = isShowcase ? '' : 'target="_blank" rel="noopener"';
            
            return `
                <div class="product-card enhanced ${isFeatured ? 'featured' : ''}" 
                     data-category="${product.category}" 
                     data-price="${product.priceAED}" 
                     data-name="${product.titleEN}">
                    
                    <div class="product-image-container">
                        <img src="${product.image_link || this.getPlaceholderImage(product.type)}" 
                             alt="${product.titleEN}" 
                             class="product-image"
                             loading="lazy"
                             onerror="this.src='${this.getPlaceholderImage(product.type)}'">
                        
                        ${hasDiscount ? `<div class="discount-badge">${discount}% OFF</div>` : ''}
                        ${isFeatured ? '<div class="featured-badge">⭐ Featured</div>' : ''}
                        
                        <div class="product-overlay">
                            <a href="${productUrl}" class="btn-primary product-details-btn" ${targetAttr}
                               aria-label="View details for ${product.titleEN}">
                                <i class="fas fa-eye"></i> View Details
                            </a>
                            <button class="btn-secondary add-to-cart-btn" 
                                    onclick="addToCartEN('${product.id}', '${product.category}')" 
                                    aria-label="Add ${product.titleEN} to cart">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
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
                        
                        <div class="product-description">${product.descriptionEN}</div>
                        
                        <div class="product-rating">
                            <div class="stars">${'★'.repeat(rating.stars)}${'☆'.repeat(5-rating.stars)}</div>
                            <span class="rating-text">(${rating.reviews} reviews)</span>
                        </div>
                        
                        <div class="product-pricing">
                            <span class="current-price">${product.priceAED} AED</span>
                            ${hasDiscount ? `<span class="original-price">${this.formatPrice(product.price)} AED</span>` : ''}
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn-primary order-now-btn" 
                                    onclick="orderNowEN('${product.id}', '${product.titleEN}', '${product.priceAED}', '${product.category}')" 
                                    aria-label="Order ${product.titleEN} now">
                                <i class="fas fa-credit-card"></i> Order Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },
        
        /**
         * Get placeholder image URL
         */
        getPlaceholderImage(type) {
            const color = type === 'Perfume' ? 'FFB6C1' : 'D4AF37';
            return `https://via.placeholder.com/300x300/${color}/FFFFFF?text=${type}`;
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
        },
        
        /**
         * Update cart counter
         */
        updateCartCounter() {
            if (window.Emirates && window.Emirates.cart) {
                const count = window.Emirates.cart.getItemCount();
                document.querySelectorAll('.cart-counter').forEach(counter => {
                    counter.textContent = count;
                    counter.style.display = count > 0 ? 'inline' : 'none';
                });
            }
        }
    };
    
    /**
     * Global functions for product interactions
     */
    window.addToCartEN = function(productId, productType) {
        console.log(`🛒 Adding to cart: ${productId} (${productType})`);
        
        let product;
        if (productType === 'perfume') {
            product = EnhancedProductsLoader.perfumesData.find(p => p.id === productId);
        } else {
            product = EnhancedProductsLoader.watchesData.find(p => p.id === productId);
        }
        
        if (product) {
            // Add to cart if cart system is available
            if (window.Emirates && window.Emirates.cart) {
                window.Emirates.cart.addItem({
                    id: productId,
                    title: product.titleEN,
                    price: parseFloat(product.priceAED),
                    image: product.image_link,
                    category: productType,
                    quantity: 1
                });
                
                // Update counter
                EnhancedProductsLoader.updateCartCounter();
                
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
🌐 Version: English

I would like to know about:
• Ordering process
• Delivery details to UAE
• Payment options

Thank you!`;
        
        const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'rel=noopener');
    };
    
    // Export to global scope
    window.EnhancedProductsLoader = EnhancedProductsLoader;
    window.FixedEnglishProductsLoader = EnhancedProductsLoader; // Backward compatibility
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            EnhancedProductsLoader.init();
        });
    } else {
        EnhancedProductsLoader.init();
    }
    
})(window);

// Add loading spinner CSS
if (!document.querySelector('#enhanced-loader-styles')) {
    const style = document.createElement('style');
    style.id = 'enhanced-loader-styles';
    style.textContent = `
        .loading-message.enhanced {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #D4AF37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .product-card.enhanced {
            position: relative;
            transition: transform 0.3s ease;
        }
        
        .product-card.enhanced:hover {
            transform: translateY(-4px);
        }
        
        .featured-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            z-index: 2;
        }
        
        .error-message {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .error-message i {
            font-size: 48px;
            color: #D4AF37;
            margin-bottom: 16px;
        }
    `;
    document.head.appendChild(style);
}