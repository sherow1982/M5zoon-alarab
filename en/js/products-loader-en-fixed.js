/**
 * SIMPLE English Products Loader - CLEAN NAMES ONLY
 * Version: v20251101-FINAL
 * NO MORE MIXED LANGUAGES - ENGLISH ONLY
 */

(function(window) {
    'use strict';
    
    console.log('🎯 SIMPLE English Products System - CLEAN NAMES v20251101');
    
    const SimpleEnglishLoader = {
        version: '20251101-FINAL',
        perfumesData: [],
        watchesData: [],
        
        /**
         * Initialize system
         */
        async init() {
            try {
                console.log('🚀 Starting CLEAN English products loader...');
                
                // Load data files
                const [perfumesResponse, watchesResponse] = await Promise.all([
                    fetch('../data/otor.json'),
                    fetch('../data/sa3at.json')
                ]);
                
                this.perfumesData = await perfumesResponse.json();
                this.watchesData = await watchesResponse.json();
                
                // Convert to CLEAN English names
                this.perfumesData = this.perfumesData.map(perfume => ({
                    ...perfume,
                    englishName: this.makeCleanEnglishName(perfume.title, 'perfume')
                }));
                
                this.watchesData = this.watchesData.map(watch => ({
                    ...watch,
                    englishName: this.makeCleanEnglishName(watch.title, 'watch')
                }));
                
                console.log(`✅ Converted ${this.perfumesData.length} perfumes to English`);
                console.log(`✅ Converted ${this.watchesData.length} watches to English`);
                
                // Load products on page
                this.loadProductsOnPage();
                
            } catch (error) {
                console.error('❌ Failed to load products:', error);
            }
        },
        
        /**
         * Make CLEAN English name from Arabic title
         */
        makeCleanEnglishName(originalTitle, productType) {
            if (!originalTitle) {
                return productType === 'perfume' ? 'Premium Perfume' : 'Premium Watch';
            }
            
            let title = originalTitle.toLowerCase();
            let englishName = '';
            
            if (productType === 'perfume') {
                // PERFUME NAME LOGIC
                if (title.includes('chanel') || title.includes('شانيل')) {
                    englishName = 'Chanel Premium Perfume';
                } else if (title.includes('gucci') || title.includes('جوتشي')) {
                    if (title.includes('flora') || title.includes('فلورا')) englishName = 'Gucci Flora Perfume';
                    else if (title.includes('bloom') || title.includes('بلوم')) englishName = 'Gucci Bloom Perfume';
                    else englishName = 'Gucci Premium Perfume';
                } else if (title.includes('dior') || title.includes('ديور')) {
                    englishName = 'Dior Sauvage Perfume';
                } else if (title.includes('versace') || title.includes('فرزاتشي')) {
                    englishName = 'Versace Eros Perfume';
                } else if (title.includes('tom ford')) {
                    if (title.includes('vanilla')) englishName = 'Tom Ford Vanilla Perfume';
                    else if (title.includes('ombre')) englishName = 'Tom Ford Ombre Leather';
                    else if (title.includes('bitter peach')) englishName = 'Tom Ford Bitter Peach';
                    else englishName = 'Tom Ford Premium Perfume';
                } else if (title.includes('ysl') || title.includes('سان لوران')) {
                    if (title.includes('libre') || title.includes('ليبر')) englishName = 'YSL Libre Perfume';
                    else if (title.includes('opium') || title.includes('اوبيوم')) englishName = 'YSL Black Opium';
                    else englishName = 'YSL Premium Perfume';
                } else if (title.includes('kayali')) {
                    englishName = 'Kayali Premium Perfume';
                } else if (title.includes('marly')) {
                    englishName = 'Marly Premium Perfume';
                } else if (title.includes('فواحة')) {
                    englishName = 'Car Fragrance Diffuser';
                } else if (title.includes('دخون')) {
                    englishName = 'Premium Incense';
                } else {
                    englishName = 'Premium Perfume Collection';
                }
                
                // Add size if present
                if (title.includes('100')) englishName += ' 100ml';
                else if (title.includes('50')) englishName += ' 50ml';
                else if (title.includes('30')) englishName += ' 30ml';
                
            } else {
                // WATCH NAME LOGIC
                let brand = 'Premium';
                let model = '';
                let color = '';
                let size = '';
                let extra = '';
                
                // Detect brand
                if (title.includes('rolex') || title.includes('رولكس')) {
                    brand = 'Rolex';
                    if (title.includes('yacht') || title.includes('يخت')) model = 'Yacht Master';
                    else if (title.includes('datejust') || title.includes('جاست')) model = 'Datejust';
                    else if (title.includes('daytona') || title.includes('دايتونا')) model = 'Daytona';
                    else if (title.includes('gmt')) model = 'GMT Master';
                    else if (title.includes('submariner')) model = 'Submariner';
                    else if (title.includes('oyster') || title.includes('اويستر')) model = 'Oyster Perpetual';
                    else model = 'Classic';
                    
                } else if (title.includes('omega') || title.includes('اوميغا')) {
                    brand = 'Omega';
                    if (title.includes('swatch') || title.includes('سواتش')) model = 'Swatch Collection';
                    else model = 'Seamaster';
                    
                } else if (title.includes('audemars') || title.includes('اوديمار')) {
                    brand = 'Audemars Piguet';
                    model = 'Royal Oak';
                } else if (title.includes('patek') || title.includes('باتيك')) {
                    brand = 'Patek Philippe';
                    model = 'Calatrava';
                } else if (title.includes('cartier') || title.includes('كارتييه')) {
                    brand = 'Cartier';
                    model = 'Tank';
                } else if (title.includes('bulgari') || title.includes('سربنتي')) {
                    brand = 'Bulgari';
                    model = 'Serpenti';
                } else if (title.includes('emporio') || title.includes('ارماني')) {
                    brand = 'Emporio Armani';
                    model = 'Classic';
                } else if (title.includes('burberry')) {
                    brand = 'Burberry';
                    model = 'Heritage';
                } else if (title.includes('versace') || title.includes('فيرساتشي')) {
                    brand = 'Versace';
                    model = 'Chronograph';
                } else if (title.includes('smart') || title.includes('ذكية')) {
                    brand = 'Smart';
                    model = 'Watch';
                }
                
                // Detect color
                if (title.includes('black') || title.includes('اسود')) color = 'Black';
                else if (title.includes('white') || title.includes('ابيض')) color = 'White';
                else if (title.includes('blue') || title.includes('ازرق')) color = 'Blue';
                else if (title.includes('green') || title.includes('اخضر')) color = 'Green';
                else if (title.includes('gold') || title.includes('جولد') || title.includes('ذهبي')) color = 'Gold';
                else if (title.includes('silver') || title.includes('فضي') || title.includes('سيلفر')) color = 'Silver';
                else if (title.includes('brown') || title.includes('بني')) color = 'Brown';
                else if (title.includes('navy') || title.includes('كحلي')) color = 'Navy';
                else if (title.includes('red') || title.includes('احمر')) color = 'Red';
                
                // Detect size
                if (title.includes('41')) size = '41mm';
                else if (title.includes('36')) size = '36mm';
                else if (title.includes('31')) size = '31mm';
                else if (title.includes('40')) size = '40mm';
                else if (title.includes('42')) size = '42mm';
                
                // Detect special features
                if (title.includes('بوكس') && title.includes('ايربودز')) extra = '& AirPods Set';
                else if (title.includes('بوكس') || title.includes('box')) extra = 'with Box';
                else if (title.includes('هدية')) extra = 'Gift Set';
                else if (title.includes('كوبل') || title.includes('couple')) extra = 'Couple Set';
                else if (title.includes('نسائي')) extra = "Women's";
                else if (title.includes('رجالي')) extra = "Men's";
                
                // Build clean English name
                const parts = [brand, model, color, size, extra].filter(p => p && p.length > 0);
                englishName = parts.join(' ');
                
                if (!englishName || englishName === 'Premium') englishName = 'Premium Luxury Watch';
            }
            
            return englishName;
        },
        
        /**
         * Load products on page
         */
        loadProductsOnPage() {
            // Load ONLY perfumes in perfumes section
            const perfumesGrid = document.getElementById('perfumes-grid');
            if (perfumesGrid) {
                console.log('🌸 Loading CLEAN English perfume names');
                const perfumesToShow = this.perfumesData.slice(0, 8);
                perfumesGrid.innerHTML = perfumesToShow.map(p => this.createProductCard(p, 'perfume')).join('');
            }
            
            // Load ONLY watches in watches section
            const watchesGrid = document.getElementById('watches-grid');
            if (watchesGrid) {
                console.log('⏰ Loading CLEAN English watch names');
                const watchesToShow = this.watchesData.slice(0, 8);
                watchesGrid.innerHTML = watchesToShow.map(w => this.createProductCard(w, 'watch')).join('');
            }
            
            // Load mixed featured products
            const featuredGrid = document.getElementById('featuredProducts');
            if (featuredGrid) {
                console.log('⭐ Loading CLEAN English featured products');
                const featured = [
                    ...this.perfumesData.slice(0, 3).map(p => ({...p, category: 'perfume'})),
                    ...this.watchesData.slice(0, 3).map(w => ({...w, category: 'watch'}))
                ].sort(() => Math.random() - 0.5);
                
                featuredGrid.innerHTML = featured.map(p => this.createProductCard(p, p.category)).join('');
            }
            
            // Load best deals
            const dealsGrid = document.getElementById('bestDeals');
            if (dealsGrid) {
                console.log('🔥 Loading CLEAN English deals');
                const allProducts = [
                    ...this.perfumesData.map(p => ({...p, category: 'perfume'})),
                    ...this.watchesData.map(w => ({...w, category: 'watch'}))
                ];
                
                const deals = allProducts
                    .filter(p => parseFloat(p.price || 0) > parseFloat(p.sale_price || 0))
                    .sort((a, b) => {
                        const discountA = Math.round(((parseFloat(a.price) - parseFloat(a.sale_price)) / parseFloat(a.price)) * 100);
                        const discountB = Math.round(((parseFloat(b.price) - parseFloat(b.sale_price)) / parseFloat(b.price)) * 100);
                        return discountB - discountA;
                    })
                    .slice(0, 6);
                
                dealsGrid.innerHTML = (deals.length > 0 ? deals : allProducts.slice(0, 6))
                    .map(p => this.createProductCard(p, p.category)).join('');
            }
            
            // Load ALL products for showcase page
            const showcaseGrid = document.getElementById('allProductsGrid');
            if (showcaseGrid) {
                console.log('📊 Loading ALL products with CLEAN English names');
                const allProducts = [
                    ...this.perfumesData.map(p => ({...p, category: 'perfume'})),
                    ...this.watchesData.map(w => ({...w, category: 'watch'}))
                ];
                
                showcaseGrid.innerHTML = allProducts.map(p => this.createProductCard(p, p.category, true)).join('');
                
                const countText = document.getElementById('productsCountText');
                if (countText) {
                    countText.textContent = `Showing ${allProducts.length} premium products`;
                }
            }
        },
        
        /**
         * Create product card with CLEAN English name
         */
        createProductCard(product, category, isShowcase = false) {
            const hasDiscount = parseFloat(product.price || 0) > parseFloat(product.sale_price || 0);
            const discountPercent = hasDiscount ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100) : 0;
            const rating = {stars: 4 + Math.round(Math.random()), reviews: Math.floor(Math.random() * 40) + 10};
            
            const targetAttr = isShowcase ? '' : 'target="_blank" rel="noopener"';
            const productUrl = `./product-details.html?type=${category}&id=${product.id}&source=${category === 'perfume' ? 'otor' : 'sa3at'}`;
            
            // Use CLEAN English name
            const displayName = product.englishName || 'Premium Product';
            const productType = category === 'perfume' ? 'Perfume' : 'Watch';
            const icon = category === 'perfume' ? '🌸' : '⏰';
            
            return `
                <div class="product-card" data-category="${category}">
                    <div class="product-image-container">
                        <img src="${product.image_link}" 
                             alt="${displayName}" 
                             class="product-image"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${encodeURIComponent(productType)}'">
                        ${hasDiscount ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                        <div class="product-overlay">
                            <a href="${productUrl}" class="btn-primary" ${targetAttr}>
                                <i class="fas fa-eye"></i> View Details
                            </a>
                            <button class="btn-secondary" onclick="addToCartClean('${product.id}', '${category}', '${displayName}')">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">${icon} ${productType}</div>
                        <h3 class="product-title">
                            <a href="${productUrl}" ${targetAttr}>
                                ${displayName}
                            </a>
                        </h3>
                        
                        <div class="product-description">
                            ${category === 'perfume' ? 
                                'Premium fragrance with long-lasting scent and elegant composition' :
                                'Luxury timepiece combining style with precision and quality'}
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
                                    onclick="orderNowClean('${product.id}', '${displayName}', '${product.sale_price}', '${category}')">
                                <i class="fas fa-credit-card"></i> Order Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    };
    
    /**
     * CLEAN cart function
     */
    window.addToCartClean = function(productId, category, englishName) {
        console.log(`🛒 Adding CLEAN: ${englishName}`);
        
        // Add to cart if system is available
        if (window.Emirates && window.Emirates.cart) {
            const product = category === 'perfume' ?
                SimpleEnglishLoader.perfumesData.find(p => p.id === productId) :
                SimpleEnglishLoader.watchesData.find(p => p.id === productId);
                
            if (product) {
                window.Emirates.cart.addItem({
                    id: productId,
                    title: englishName,
                    price: parseFloat(product.sale_price),
                    image: product.image_link,
                    category: category,
                    quantity: 1
                });
                
                // Update cart counter
                const counters = document.querySelectorAll('.cart-counter');
                const count = window.Emirates.cart.getItemCount();
                counters.forEach(counter => {
                    counter.textContent = count;
                    counter.style.display = count > 0 ? 'inline' : 'none';
                });
            }
        }
        
        alert(`${englishName} added to cart!`);
    };
    
    /**
     * CLEAN order function
     */
    window.orderNowClean = function(productId, englishName, price, category) {
        console.log(`📞 CLEAN Order: ${englishName}`);
        
        const message = `Hello! I want to order this product:\n\n🎁 Product: ${englishName}\n💰 Price: ${price} AED\n📱 Store: Emirates Gifts (English)\n\nI would like to know about ordering and delivery details to UAE.`;
        
        window.open(`https://wa.me/201110760081?text=${encodeURIComponent(message)}`, '_blank');
    };
    
    // Legacy function support
    window.addToCartEN = window.addToCartClean;
    window.orderNowEN = window.orderNowClean;
    
    // Export main object
    window.SimpleEnglishLoader = SimpleEnglishLoader;
    window.FixedEnglishProductsLoader = SimpleEnglishLoader; // Backward compatibility
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SimpleEnglishLoader.init());
    } else {
        SimpleEnglishLoader.init();
    }
    
})(window);

console.log('✅ CLEAN English Products System loaded - NO MORE ARABIC MIXING!');
console.log('🎯 All product names will be CLEAN ENGLISH ONLY');