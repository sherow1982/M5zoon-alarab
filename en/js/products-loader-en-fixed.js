/**
 * FIXED English Products Loader System v20251101-CLEAN
 * Clean, simple, and professional product name translations
 * Author: Emirates Gifts Development Team
 */

(function(window) {
    'use strict';
    
    console.log('🎯 Loading CLEAN English Products System v20251101');
    
    const FixedEnglishProductsLoader = {
        version: '20251101-CLEAN',
        perfumesData: [],
        watchesData: [],
        
        // SIMPLE and CLEAN translation system
        cleanTranslations: {
            // Perfume brands - SIMPLE
            'عطر كوكو شانيل': 'Chanel Coco Perfume',
            'عطر جوتشي فلورا': 'Gucci Flora Perfume',
            'عطر جوتشي بلوم': 'Gucci Bloom Perfume', 
            'عطر سوفاج ديور': 'Dior Sauvage Perfume',
            'عطر فرزاتشي ايروس': 'Versace Eros Perfume',
            'عطر ايف سان لوران ليبر': 'YSL Libre Perfume',
            'عطر ايف سان لوران مای سيلف': 'YSL Myself Perfume',
            'عطر ايف سان لوران بلاك اوبيوم': 'YSL Black Opium Perfume',
            
            // Watch brands - SIMPLE
            'ساعة رولكس يخت ماستر': 'Rolex Yacht Master',
            'ساعة اوميغا سواتش': 'Omega Swatch',
            'ساعة رولكس': 'Rolex Watch',
            'ساعة سربنتي توبوغاس': 'Bulgari Serpenti Watch',
            'ساعة ذكية': 'Smart Watch',
            'بوكس الساعة': 'Watch Box Set',
            
            // Colors - SIMPLE
            'أسود': 'Black', 'اسود': 'Black',
            'أبيض': 'White', 'ابيض': 'White', 
            'أزرق': 'Blue', 'ازرق': 'Blue',
            'أخضر': 'Green', 'اخضر': 'Green',
            'ذهبي': 'Gold', 'جولد': 'Gold',
            'فضي': 'Silver', 'سيلفر': 'Silver',
            'بني': 'Brown', 'بنى': 'Brown',
            'كحلي': 'Navy',
            'نبيتي': 'Purple',
            'رصاصي': 'Gray',
            'احمر': 'Red',
            'صفراء': 'Yellow',
            
            // Basic terms
            'عطر': '',
            'ساعة': '', 
            'مل': 'ml',
            'ملم': 'mm',
            'نسائي': "Women's",
            'رجالي': "Men's",
            'مع': 'with',
            'البوكس الأصلي': 'Original Box',
            'هدية': 'Gift',
            'ايربودز': 'AirPods',
            'كاميرا': 'Camera',
            'مزودة': 'with',
            'في 1': 'in 1'
        },
        
        /**
         * Initialize system
         */
        async init() {
            try {
                await Promise.all([
                    this.loadPerfumesData(),
                    this.loadWatchesData()
                ]);
                
                this.loadHomepageProducts();
                this.loadShowcaseProducts();
                
                console.log('✅ Clean English system loaded successfully');
                
            } catch (error) {
                console.error('❌ Error loading products:', error);
                this.handleError();
            }
        },
        
        /**
         * Load perfumes data
         */
        async loadPerfumesData() {
            try {
                const response = await fetch('../data/otor.json');
                this.perfumesData = await response.json();
                
                // Apply CLEAN translations
                this.perfumesData = this.perfumesData.map(perfume => ({
                    ...perfume,
                    titleEN: this.getCleanEnglishName(perfume.title, 'perfume'),
                    category: 'perfume',
                    type: 'Perfume',
                    icon: '🌸'
                }));
                
                console.log(`✅ Loaded ${this.perfumesData.length} perfumes with clean names`);
                
            } catch (error) {
                console.error('❌ Failed to load perfumes:', error);
                this.perfumesData = [];
            }
        },
        
        /**
         * Load watches data
         */
        async loadWatchesData() {
            try {
                const response = await fetch('../data/sa3at.json');
                this.watchesData = await response.json();
                
                // Apply CLEAN translations
                this.watchesData = this.watchesData.map(watch => ({
                    ...watch,
                    titleEN: this.getCleanEnglishName(watch.title, 'watch'),
                    category: 'watch', 
                    type: 'Watch',
                    icon: '⏰'
                }));
                
                console.log(`✅ Loaded ${this.watchesData.length} watches with clean names`);
                
            } catch (error) {
                console.error('❌ Failed to load watches:', error);
                this.watchesData = [];
            }
        },
        
        /**
         * Get CLEAN English name - NO MORE MIXED LANGUAGES
         */
        getCleanEnglishName(arabicTitle, productType) {
            if (!arabicTitle) return 'Premium Product';
            
            let englishName = arabicTitle;
            
            // Apply simple, clean translations
            Object.keys(this.cleanTranslations).forEach(arabic => {
                const regex = new RegExp(arabic, 'gi');
                englishName = englishName.replace(regex, this.cleanTranslations[arabic]);
            });
            
            // CLEAN UP completely
            englishName = englishName
                .replace(/عطر\s*/g, '') // Remove Arabic 'perfume'
                .replace(/ساعة\s*/g, '') // Remove Arabic 'watch'
                .replace(/\s+مل/g, 'ml') // Fix ml spacing
                .replace(/\s+ملم/g, 'mm') // Fix mm spacing
                .replace(/\s{2,}/g, ' ') // Fix multiple spaces
                .replace(/^\s+|\s+$/g, '') // Trim spaces
                .replace(/^[.-]+|[.-]+$/g, ''); // Remove dots/dashes
            
            // If still has Arabic, create simple English name
            if (/[\u0600-\u06ff]/.test(englishName)) {
                if (productType === 'perfume') {
                    englishName = this.createSimplePerfumeName(arabicTitle);
                } else {
                    englishName = this.createSimpleWatchName(arabicTitle);
                }
            }
            
            // Final cleanup and capitalization
            englishName = this.finalCleanup(englishName);
            
            return englishName || 'Premium Product';
        },
        
        /**
         * Create simple perfume names
         */
        createSimplePerfumeName(title) {
            if (title.includes('كوكو شانيل')) return 'Chanel Coco Perfume';
            if (title.includes('جوتشي')) return 'Gucci Perfume';
            if (title.includes('ديور')) return 'Dior Perfume';
            if (title.includes('فرزاتشي')) return 'Versace Perfume';
            if (title.includes('سان لوران')) return 'YSL Perfume';
            if (title.includes('Tom Ford')) return 'Tom Ford Perfume';
            if (title.includes('دخون')) return 'Premium Incense';
            if (title.includes('فواحة')) return 'Car Fragrance';
            return 'Premium Perfume';
        },
        
        /**
         * Create simple watch names  
         */
        createSimpleWatchName(title) {
            let brand = 'Premium';
            let model = 'Watch';
            let color = '';
            
            // Detect brand
            if (title.includes('رولكس') || title.includes('Rolex')) brand = 'Rolex';
            else if (title.includes('اوميغا') || title.includes('Omega')) brand = 'Omega';
            else if (title.includes('سربنتي')) brand = 'Bulgari';
            else if (title.includes('كارتييه') || title.includes('Cartier')) brand = 'Cartier';
            else if (title.includes('اوديمار')) brand = 'Audemars Piguet';
            else if (title.includes('باتيك')) brand = 'Patek Philippe';
            else if (title.includes('ارماني')) brand = 'Armani';
            else if (title.includes('Burberry')) brand = 'Burberry';
            else if (title.includes('ذكية')) brand = 'Smart';
            
            // Detect model
            if (title.includes('يخت ماستر')) model = 'Yacht Master';
            else if (title.includes('ديت جاست')) model = 'Datejust';
            else if (title.includes('دايتونا')) model = 'Daytona';
            else if (title.includes('اويستر')) model = 'Oyster';
            else if (title.includes('GMT')) model = 'GMT';
            else if (title.includes('سواتش')) model = 'Swatch';
            else if (title.includes('كوبل')) model = 'Couple Set';
            else if (title.includes('Ultra')) model = 'Ultra';
            else if (title.includes('بوكس')) model = 'Box Set';
            
            // Detect color
            if (title.includes('اسود') || title.includes('أسود')) color = 'Black';
            else if (title.includes('ابيض') || title.includes('أبيض')) color = 'White';
            else if (title.includes('ازرق') || title.includes('أزرق')) color = 'Blue';
            else if (title.includes('اخضر') || title.includes('أخضر')) color = 'Green';
            else if (title.includes('ذهبي') || title.includes('جولد')) color = 'Gold';
            else if (title.includes('فضي') || title.includes('سيلفر')) color = 'Silver';
            else if (title.includes('بني')) color = 'Brown';
            
            return `${brand} ${model}${color ? ' ' + color : ''}`.trim();
        },
        
        /**
         * Final cleanup of names
         */
        finalCleanup(name) {
            return name
                .replace(/\s+/g, ' ') // Single spaces
                .replace(/^\s+|\s+$/g, '') // Trim
                .replace(/^Watch\s+/i, '') // Remove Watch prefix
                .replace(/^Perfume\s+/i, '') // Remove Perfume prefix
                .replace(/\s+Watch$/i, ' Watch') // Fix Watch suffix
                .replace(/\s+Perfume$/i, ' Perfume') // Fix Perfume suffix
                // Capitalize first letter of each word
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        },
        
        /**
         * Load homepage products
         */
        loadHomepageProducts() {
            // Perfumes section
            const perfumesGrid = document.getElementById('perfumes-grid');
            if (perfumesGrid && this.perfumesData.length > 0) {
                console.log('🌸 Loading perfumes with CLEAN English names');
                const perfumesToShow = this.perfumesData.slice(0, 8);
                perfumesGrid.innerHTML = perfumesToShow.map(product => 
                    this.createCleanProductCard(product)
                ).join('');
            }
            
            // Watches section  
            const watchesGrid = document.getElementById('watches-grid');
            if (watchesGrid && this.watchesData.length > 0) {
                console.log('⏰ Loading watches with CLEAN English names');
                const watchesToShow = this.watchesData.slice(0, 8);
                watchesGrid.innerHTML = watchesToShow.map(product =>
                    this.createCleanProductCard(product)
                ).join('');
            }
            
            // Featured products
            const featuredGrid = document.getElementById('featuredProducts');
            if (featuredGrid) {
                const featured = [
                    ...this.perfumesData.slice(0, 4),
                    ...this.watchesData.slice(0, 4)
                ].sort(() => Math.random() - 0.5).slice(0, 6);
                
                featuredGrid.innerHTML = featured.map(product =>
                    this.createCleanProductCard(product)
                ).join('');
            }
            
            // Best deals
            const dealsGrid = document.getElementById('bestDeals');
            if (dealsGrid) {
                const allProducts = [...this.perfumesData, ...this.watchesData];
                const deals = allProducts
                    .filter(p => parseFloat(p.price || 0) > parseFloat(p.sale_price || 0))
                    .sort((a, b) => {
                        const discountA = this.calculateDiscount(a);
                        const discountB = this.calculateDiscount(b);
                        return discountB - discountA;
                    })
                    .slice(0, 6);
                
                dealsGrid.innerHTML = (deals.length > 0 ? deals : allProducts.slice(0, 6))
                    .map(product => this.createCleanProductCard(product))
                    .join('');
            }
        },
        
        /**
         * Load showcase products
         */
        loadShowcaseProducts() {
            const showcaseGrid = document.getElementById('allProductsGrid');
            if (!showcaseGrid) return;
            
            const allProducts = [...this.perfumesData, ...this.watchesData];
            
            if (allProducts.length === 0) {
                showcaseGrid.innerHTML = '<div class="error-message">No products available</div>';
                return;
            }
            
            showcaseGrid.innerHTML = allProducts.map(product =>
                this.createCleanProductCard(product, true)
            ).join('');
            
            const countText = document.getElementById('productsCountText');
            if (countText) {
                countText.textContent = `Showing ${allProducts.length} products`;
            }
        },
        
        /**
         * Create CLEAN product card with proper English names
         */
        createCleanProductCard(product, isShowcase = false) {
            const hasDiscount = parseFloat(product.price || 0) > parseFloat(product.sale_price || 0);
            const discountPercent = hasDiscount ? this.calculateDiscount(product) : 0;
            const rating = this.generateRating();
            
            const targetAttr = isShowcase ? '' : 'target="_blank" rel="noopener"';
            const productUrl = `./product-details.html?type=${product.category}&id=${product.id}&source=${product.category === 'perfume' ? 'otor' : 'sa3at'}`;
            
            // ENSURE CLEAN English title
            const cleanTitle = product.titleEN || 'Premium Product';
            
            return `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-image-container">
                        <img src="${product.image_link}" 
                             alt="${cleanTitle}" 
                             class="product-image"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${encodeURIComponent(product.type)}'">
                        ${hasDiscount ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                        <div class="product-overlay">
                            <a href="${productUrl}" class="btn-primary" ${targetAttr}>
                                <i class="fas fa-eye"></i> View Details
                            </a>
                            <button class="btn-secondary" onclick="addToCartEN('${product.id}', '${product.category}')">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">${product.icon} ${product.type}</div>
                        <h3 class="product-title">
                            <a href="${productUrl}" ${targetAttr}>
                                ${cleanTitle}
                            </a>
                        </h3>
                        
                        <div class="product-description">
                            ${product.type === 'Perfume' ? 
                                'Premium fragrance with long-lasting scent' :
                                'Luxury timepiece with precision and style'}
                        </div>
                        
                        <div class="product-rating">
                            <div class="stars">${'★'.repeat(rating.stars)}${'☆'.repeat(5-rating.stars)}</div>
                            <span class="rating-text">(${rating.reviews})</span>
                        </div>
                        
                        <div class="product-pricing">
                            <span class="current-price">${parseFloat(product.sale_price).toFixed(2)} AED</span>
                            ${hasDiscount ? `<span class="original-price">${parseFloat(product.price).toFixed(2)} AED</span>` : ''}
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn-primary order-now-btn" 
                                    onclick="orderNowEN('${product.id}', '${cleanTitle}', '${product.sale_price}', '${product.category}')">
                                <i class="fas fa-credit-card"></i> Order Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },
        
        /**
         * Calculate discount
         */
        calculateDiscount(product) {
            const price = parseFloat(product.price || 0);
            const salePrice = parseFloat(product.sale_price || 0);
            return price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
        },
        
        /**
         * Generate rating
         */
        generateRating() {
            const ratings = [
                {stars: 5, reviews: Math.floor(Math.random() * 50) + 15},
                {stars: 4, reviews: Math.floor(Math.random() * 30) + 10}
            ];
            return ratings[Math.floor(Math.random() * ratings.length)];
        },
        
        /**
         * Handle errors
         */
        handleError() {
            document.querySelectorAll('#perfumes-grid, #watches-grid, #featuredProducts, #bestDeals').forEach(grid => {
                if (grid) {
                    grid.innerHTML = `
                        <div class="error-message">
                            <h3>Unable to load products</h3>
                            <button onclick="location.reload()" class="btn-primary">
                                <i class="fas fa-refresh"></i> Refresh
                            </button>
                        </div>
                    `;
                }
            });
        }
    };
    
    /**
     * Global cart function - CLEAN
     */
    window.addToCartEN = function(productId, productType) {
        let product = productType === 'perfume' ? 
            FixedEnglishProductsLoader.perfumesData.find(p => p.id === productId) :
            FixedEnglishProductsLoader.watchesData.find(p => p.id === productId);
        
        if (product) {
            const cleanTitle = product.titleEN || 'Premium Product';
            console.log(`🛒 Adding: ${cleanTitle}`);
            
            if (window.Emirates && window.Emirates.cart) {
                window.Emirates.cart.addItem({
                    id: productId,
                    title: cleanTitle,
                    price: parseFloat(product.sale_price),
                    image: product.image_link,
                    category: productType,
                    quantity: 1
                });
            }
            alert(`${cleanTitle} added to cart!`);
        }
    };
    
    /**
     * Global order function - CLEAN
     */
    window.orderNowEN = function(productId, productTitle, price, productType) {
        const message = `Hello! I want to order:\\n\\n🎁 ${productTitle}\\n💰 ${price} AED\\n📱 Emirates Gifts Store\\n\\nPlease provide ordering details.`;
        window.open(`https://wa.me/201110760081?text=${encodeURIComponent(message)}`, '_blank');
    };
    
    // Export and initialize
    window.FixedEnglishProductsLoader = FixedEnglishProductsLoader;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => FixedEnglishProductsLoader.init());
    } else {
        FixedEnglishProductsLoader.init();
    }
    
})(window);