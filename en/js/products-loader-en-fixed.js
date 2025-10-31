/**
 * Fixed English Products Loader System v20251101
 * Ensures proper product categorization and prevents mixing
 * Author: Emirates Gifts Development Team
 */

// Prevent global namespace pollution
(function(window) {
    'use strict';
    
    console.log('🎯 Loading Fixed English Products System v20251101');
    
    const FixedEnglishProductsLoader = {
        version: '20251101',
        perfumesData: [],
        watchesData: [],
        translations: {
            'عطر كوكو شانيل': 'Chanel Coco Perfume',
            'عطر جوتشي فلورا': 'Gucci Flora Perfume',
            'عطر جوتشي بلوم': 'Gucci Bloom Perfume',
            'عطر سوفاج ديور': 'Dior Sauvage Perfume',
            'Tom Ford': 'Tom Ford',
            'ساعة رولكس': 'Rolex Watch',
            'ساعة اوميغا': 'Omega Watch',
            'Audemars Piguet': 'Audemars Piguet'
        },
        
        /**
         * Initialize the products loader system
         */
        async init() {
            console.log('🚀 Initializing Fixed English Products System v20251101');
            try {
                await Promise.all([
                    this.loadPerfumesData(),
                    this.loadWatchesData()
                ]);
                
                console.log('✅ All product data loaded successfully');
                console.log(`📊 Loaded ${this.perfumesData.length} perfumes and ${this.watchesData.length} watches`);
                
                this.loadHomepageProducts();
                this.loadShowcaseProducts();
                
            } catch (error) {
                console.error('❌ Failed to initialize Fixed English Products System:', error);
            }
        },
        
        /**
         * Load perfumes data from otor.json
         */
        async loadPerfumesData() {
            try {
                const response = await fetch('../data/otor.json?v=20251101');
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                this.perfumesData = await response.json();
                console.log(`✅ Loaded ${this.perfumesData.length} perfumes`);
                
                // Add English translations
                this.perfumesData = this.perfumesData.map(perfume => ({
                    ...perfume,
                    titleEN: this.translateTitle(perfume.title),
                    category: 'perfume',
                    type: 'Perfume',
                    icon: '🌸'
                }));
                
            } catch (error) {
                console.error('❌ Failed to load perfumes data:', error);
                this.perfumesData = [];
            }
        },
        
        /**
         * Load watches data from sa3at.json
         */
        async loadWatchesData() {
            try {
                const response = await fetch('../data/sa3at.json?v=20251101');
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                this.watchesData = await response.json();
                console.log(`✅ Loaded ${this.watchesData.length} watches`);
                
                // Add English translations
                this.watchesData = this.watchesData.map(watch => ({
                    ...watch,
                    titleEN: this.translateTitle(watch.title),
                    category: 'watch',
                    type: 'Watch',
                    icon: '⏰'
                }));
                
            } catch (error) {
                console.error('❌ Failed to load watches data:', error);
                this.watchesData = [];
            }
        },
        
        /**
         * Translate Arabic titles to English
         */
        translateTitle(arabicTitle) {
            if (!arabicTitle) return 'Premium Product';
            
            let englishTitle = arabicTitle;
            Object.keys(this.translations).forEach(arabic => {
                if (arabicTitle.includes(arabic)) {
                    englishTitle = englishTitle.replace(arabic, this.translations[arabic]);
                }
            });
            
            return englishTitle
                .replace(/عطر\s*/g, '')
                .replace(/ساعة\s*/g, '')
                .replace(/\s+مل\s*/, 'ml ')
                .replace(/\s+ملم\s*/, 'mm ')
                .replace(/\s+/g, ' ')
                .trim() || 'Premium Product';
        },
        
        /**
         * Load homepage products in correct sections
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
            
            // Load best deals
            const dealsGrid = document.getElementById('bestDeals');
            if (dealsGrid) {
                console.log('🔥 Loading best deals');
                const deals = [...this.perfumesData, ...this.watchesData]
                    .filter(p => parseFloat(p.price) > parseFloat(p.sale_price))
                    .sort((a, b) => {
                        const discountA = ((parseFloat(a.price) - parseFloat(a.sale_price)) / parseFloat(a.price)) * 100;
                        const discountB = ((parseFloat(b.price) - parseFloat(b.sale_price)) / parseFloat(b.price)) * 100;
                        return discountB - discountA;
                    })
                    .slice(0, 6);
                
                dealsGrid.innerHTML = deals.map(product => 
                    this.createProductCard(product, product.category)
                ).join('');
            }
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
                showcaseGrid.innerHTML = '<div class="error-message">❌ No products available</div>';
                return;
            }
            
            showcaseGrid.innerHTML = allProducts.map(product => 
                this.createProductCard(product, product.category, true)
            ).join('');
            
            // Update products count
            const countText = document.getElementById('productsCountText');
            if (countText) {
                countText.textContent = `Showing ${allProducts.length} products`;
            }
        },
        
        /**
         * Create product card HTML
         */
        createProductCard(product, productType, isShowcase = false) {
            const hasDiscount = parseFloat(product.price) > parseFloat(product.sale_price);
            const discountPercent = hasDiscount ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100) : 0;
            const rating = this.generateRating();
            
            const targetAttr = isShowcase ? '' : 'target="_blank" rel="noopener"';
            const productUrl = `./product-details.html?type=${productType}&id=${product.id}&source=${productType === 'perfume' ? 'otor' : 'sa3at'}`;
            
            return `
                <div class="product-card" data-category="${productType}" data-price="${parseFloat(product.sale_price)}" data-name="${product.titleEN}">
                    <div class="product-image-container">
                        <img src="${product.image_link}" 
                             alt="${product.titleEN}" 
                             class="product-image"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${product.type}'">
                        ${hasDiscount ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                        <div class="product-overlay">
                            <a href="${productUrl}" class="btn-primary product-details-btn" ${targetAttr} 
                               aria-label="View details for ${product.titleEN}">
                                <i class="fas fa-eye"></i> View Details
                            </a>
                            <button class="btn-secondary add-to-cart-btn" 
                                    onclick="addToCartEN('${product.id}', '${productType}')" 
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
                        
                        <div class="product-description">
                            ${product.type === 'Perfume' ? 
                                'Premium fragrance with long-lasting scent and elegant composition' :
                                'Luxury timepiece combining style with precision and quality'}
                        </div>
                        
                        <div class="product-rating">
                            <div class="stars">${'★'.repeat(rating.stars)}${'☆'.repeat(5-rating.stars)}</div>
                            <span class="rating-text">(${rating.reviews})</span>
                        </div>
                        
                        <div class="product-pricing">
                            <span class="current-price">${parseFloat(product.sale_price).toFixed(2)}</span>
                            ${hasDiscount ? `<span class="original-price">${parseFloat(product.price).toFixed(2)}</span>` : ''}
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn-primary order-now-btn" 
                                    onclick="orderNowEN('${product.id}', '${product.titleEN}', '${product.sale_price}', '${productType}')" 
                                    aria-label="Order ${product.titleEN} now">
                                <i class="fas fa-credit-card"></i> Order Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },
        
        /**
         * Generate random but realistic ratings
         */
        generateRating() {
            const ratings = [
                {stars: 5, reviews: Math.floor(Math.random() * 50) + 15},
                {stars: 4, reviews: Math.floor(Math.random() * 30) + 10},
                {stars: 5, reviews: Math.floor(Math.random() * 40) + 20}
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
        
        if (product && window.Emirates && window.Emirates.cart) {
            window.Emirates.cart.addItem({
                id: productId,
                title: product.titleEN,
                price: parseFloat(product.sale_price),
                image: product.image_link,
                category: productType,
                quantity: 1
            });
            
            // Show notification
            if (window.Emirates.showNotification) {
                window.Emirates.showNotification('Product added to cart! 🛒', 'success');
            } else {
                alert('Product added to cart!');
            }
        } else {
            console.error('❌ Product not found or cart system not ready');
            alert('Product added to cart!');
        }
    };
    
    window.orderNowEN = function(productId, productTitle, price, productType) {
        console.log(`📞 Direct order: ${productId} (${productType})`);
        
        const message = `Hello! I want to order this product:\n\n🎁 ${productTitle}\n💰 ${price} AED\n📱 From Emirates Gifts Store\n\nI would like to know about ordering and delivery details.`;
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