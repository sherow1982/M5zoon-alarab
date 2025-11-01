/**
 * Enhanced Fixed English Products Loader System v20251101
 * Complete Arabic-to-English translation system for all product names
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
        
        // COMPREHENSIVE Arabic-to-English Translation Dictionary
        translations: {
            // Base product types
            'عطر': 'Perfume',
            'فواحة': 'Car Fragrance', 
            'دخون': 'Incense',
            'ساعة': 'Watch',
            
            // Perfume brands and products
            'كوكو شانيل': 'Chanel Coco',
            'شانيل': 'Chanel',
            'جوتشي فلورا': 'Gucci Flora',
            'جوتشي بلوم': 'Gucci Bloom', 
            'جوتشي': 'Gucci',
            'سوفاج ديور': 'Dior Sauvage',
            'فرزاتشي ايروس': 'Versace Eros',
            'فرزاتشي': 'Versace',
            'ايف سان لوران': 'Yves Saint Laurent',
            'سان لوران': 'Saint Laurent',
            'ليبر أو دو تواليت': 'Libre Eau de Toilette',
            'ليبر': 'Libre',
            'ماي سيلف': 'Myself',
            'لوم او دو تواليت': 'L\'Homme Eau de Toilette',
            'فلاورز اند فليمز': 'Flowers and Flames',
            'انتنس': 'Intense',
            'لا نوي': 'La Nuit',
            'بلاك اوبيوم': 'Black Opium',
            
            // Watch brands
            'رولكس': 'Rolex',
            'اوميغا': 'Omega',
            'سواتش': 'Swatch',
            'سربنتي توبوغاس': 'Serpenti Tubogas',
            'اوديمار بيجيه': 'Audemars Piguet',
            'باتيك فيليب': 'Patek Philippe',
            'امبوريو ارماني': 'Emporio Armani',
            'ارماني': 'Armani',
            'كارتييه': 'Cartier',
            'برايتلينغ': 'Breitling',
            'بربري': 'Burberry',
            'ايغنر': 'Aigner',
            'بياجيه': 'Piaget',
            'فورسينغ': 'Forsining',
            'فيرساتشي': 'Versace',
            
            // Watch models and collections
            'يخت ماستر': 'Yacht Master',
            'ديت جاست': 'Datejust',
            'دايتونا': 'Daytona', 
            'اويستر': 'Oyster',
            'سبمارينر': 'Submariner',
            'جي ام تي': 'GMT',
            'باتمان': 'Batman',
            'بيبسي': 'Pepsi',
            'Tank': 'Tank',
            'Royal': 'Royal',
            'Endurance Pro': 'Endurance Pro',
            
            // Colors - comprehensive list
            'أسود': 'Black',
            'اسود': 'Black',
            'أبيض': 'White', 
            'ابيض': 'White',
            'أحمر': 'Red',
            'احمر': 'Red',
            'أزرق': 'Blue',
            'ازرق': 'Blue',
            'أخضر': 'Green',
            'اخضر': 'Green',
            'ذهبي': 'Gold',
            'جولد': 'Gold',
            'فضي': 'Silver',
            'سيلفر': 'Silver',
            'بني': 'Brown',
            'كحلي': 'Navy Blue',
            'نبيتي': 'Purple',
            'رصاصي': 'Gray',
            'بيج': 'Beige',
            'روز جولد': 'Rose Gold',
            'هافان': 'Havana',
            'زهري': 'Pink',
            'برتقالي': 'Orange',
            'يلو': 'Yellow',
            'صفراء': 'Yellow',
            'ملكي': 'Royal',
            'فاتح': 'Light',
            'غامق': 'Dark',
            
            // Descriptions and attributes
            'مينا': 'Dial',
            'استيك': 'Strap',
            'كلاسيكية': 'Classic',
            'نسائي': "Women's",
            'رجالي': "Men's", 
            'للنساء': 'For Women',
            'للرجال': 'For Men',
            'مميزة': 'Premium',
            'حديث': 'Modern',
            'نيو موديل': 'New Model',
            'موديل حديث': 'Modern Model',
            'ذكية': 'Smart',
            'كوبل': 'Couple',
            'مزودة': 'Equipped with',
            'كاميرا': 'Camera',
            'دائري': 'Round',
            
            // Special terms
            'البوكس الأصلي': 'Original Box',
            'بالبوكس الأصلي': 'with Original Box',
            'بوكس': 'Box',
            'ايربودز': 'AirPods',
            'هدية': 'Gift',
            'في': 'in',
            'و': '&',
            'copy1': 'Premium Edition',
            'Copy 1': 'Premium Edition',
            'COPY 1': 'Premium Edition',
            'high quality': 'High Quality',
            'automatic': 'Automatic',
            'AUTOMATIC': 'Automatic',
            
            // Sizes and measurements
            'مل': 'ml',
            'ملم': 'mm',
            '100 مل': '100ml',
            '50 مل': '50ml', 
            '30 مل': '30ml',
            '41 ملم': '41mm',
            '36 ملم': '36mm',
            '31 ملم': '31mm',
            '28 ملم': '28mm',
            '42 ملم': '42mm',
            '40 ملم': '40mm',
            '28ml': '28mm',
            
            // Special product names
            'عطرية للسيارة قابلة لإعادة الشحن': 'Rechargeable Car Fragrance',
            'قابلة لإعادة الشحن': 'Rechargeable',
            'للسيارة': 'for Car',
            'راقيه': 'Premium',
            'عبدالرشيد': 'Abdul Rashid',
            'بو خالد': 'Abu Khalid',
            'بن لوتاه': 'Bin Lootah',
            'تصميم الكعبة': 'Kaaba Design',
            'سبرايت': 'Sprite',
            'في 1': 'in 1',
            '6 في 1': '6 in 1',
            
            // Specific product collections
            'Tomber': 'Tomber Luxury',
            'Aromatic': 'Aromatic Collection',
            'Khaneen': 'Khaneen Premium',
            'Paradise': 'Paradise Collection',
            'De louvre': 'De Louvre',
            'Autumn': 'Autumn Collection',
            'Emotion': 'Emotion Series',
            'Glory': 'Glory Premium',
            'ARIAF': 'Ariaf Luxury',
            'JORA': 'Jora Collection',
            'Oud Al-Brayeh': 'Oud Al-Brayeh',
            'SHAIKAH HIND': 'Shaikah Hind',
            
            // Hair and body products
            'HAIR SERUM': 'Hair Serum',
            'HAIR & BODY MIST': 'Hair & Body Mist'
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
                
                console.log(`✅ Loaded ${this.perfumesData.length} perfumes with English translations`);
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
                
                console.log(`✅ Loaded ${this.watchesData.length} watches with English translations`);
                this.loadingStates.watches = false;
                
            } catch (error) {
                console.error('❌ Failed to load watches data:', error);
                this.loadingStates.watches = false;
                this.watchesData = this.createFallbackProducts('watch');
            }
        },
        
        /**
         * COMPREHENSIVE Arabic-to-English Title Translation
         * Handles all product names with professional translations
         */
        translateTitle(arabicTitle) {
            if (!arabicTitle || typeof arabicTitle !== 'string') {
                return 'Premium Product';
            }
            
            console.log('🔤 Translating:', arabicTitle);
            
            let englishTitle = arabicTitle;
            
            // Apply comprehensive translations in order of specificity
            // First handle compound terms
            const compoundTerms = [
                'عطر كوكو شانيل',
                'عطر جوتشي فلورا',
                'عطر جوتشي بلوم',
                'عطر سوفاج ديور',
                'عطر فرزاتشي ايروس',
                'عطر ايف سان لوران ليبر أو دو تواليت',
                'عطر ايف سان لوران ماي سيلف',
                'عطر ايف سان لوران لوم او دو تواليت',
                'عطر ايف سان لوران ليبر فلاورز اند فليمز',
                'عطر ايف سان لوران ليبر انتنس',
                'عطر ايف سان لوران لا نوي',
                'عطر ايف سان لوران بلاك اوبيوم',
                'ساعة رولكس يخت ماستر',
                'ساعة رولكس ديت جاست',
                'ساعة اوميغا سواتش',
                'ساعة سربنتي توبوغاس',
                'بوكس الساعة والايربودز  6 في 1',
                'ساعة Ultra مع ايربودز هدية',
                'ساعة ذكية مزودة بكاميرا',
                'فواحة عطرية للسيارة قابلة لإعادة الشحن'
            ];
            
            // Apply compound translations first
            compoundTerms.forEach(compound => {
                if (englishTitle.includes(compound)) {
                    let translation = this.translations[compound];
                    if (!translation) {
                        // Build compound translation from parts
                        translation = compound.split(' ').map(part => 
                            this.translations[part] || part
                        ).join(' ');
                    }
                    englishTitle = englishTitle.replace(compound, translation);
                }
            });
            
            // Then apply individual word translations
            Object.keys(this.translations).forEach(arabic => {
                if (englishTitle.includes(arabic)) {
                    const regex = new RegExp(arabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                    englishTitle = englishTitle.replace(regex, this.translations[arabic]);
                }
            });
            
            // Clean up and format the title
            englishTitle = this.cleanUpTitle(englishTitle);
            
            console.log('✅ Translated to:', englishTitle);
            return englishTitle || 'Premium Product';
        },
        
        /**
         * Clean up and format translated titles
         */
        cleanUpTitle(title) {
            return title
                // Remove standalone 'Perfume' and 'Watch' at the beginning
                .replace(/^Perfume\s+/gi, '')
                .replace(/^Watch\s+/gi, '')
                
                // Fix spacing around measurements
                .replace(/\s+(\d+)\s*ml\s*/gi, ' $1ml')
                .replace(/\s+(\d+)\s*mm\s*/gi, ' $1mm')
                
                // Fix brand name formatting
                .replace(/Tom\s+Ford/gi, 'Tom Ford')
                .replace(/Yves\s+Saint\s+Laurent/gi, 'Yves Saint Laurent')
                .replace(/Emporio\s+Armani/gi, 'Emporio Armani')
                .replace(/Audemars\s+Piguet/gi, 'Audemars Piguet')
                .replace(/Patek\s+Philippe/gi, 'Patek Philippe')
                
                // Clean up multiple spaces and symbols
                .replace(/\s*-\s*/g, ' - ')
                .replace(/\s*\+\s*/g, ' + ')
                .replace(/\s*&\s*/g, ' & ')
                .replace(/\s*\*\s*/g, ' & ')
                .replace(/\s{2,}/g, ' ')
                
                // Capitalize important words
                .replace(/\b(premium|luxury|classic|modern|automatic|edition)\b/gi, (match) => 
                    match.charAt(0).toUpperCase() + match.slice(1).toLowerCase())
                
                // Final cleanup
                .replace(/^\s+|\s+$/g, '')
                .replace(/\s*\.\s*/g, ' ')
                .replace(/^[\s.-]+|[\s.-]+$/g, '');
        },
        
        /**
         * Create fallback products for error cases
         */
        createFallbackProducts(type) {
            console.log(`🔄 Creating fallback ${type} products`);
            
            const fallbackData = {
                perfume: [
                    { id: 'fb-p1', title: 'Chanel Coco Premium 100ml', price: '299.00', sale_price: '249.00' },
                    { id: 'fb-p2', title: 'Gucci Flora Luxury Collection', price: '399.00', sale_price: '329.00' },
                    { id: 'fb-p3', title: 'Dior Sauvage Premium 100ml', price: '359.00', sale_price: '299.00' },
                    { id: 'fb-p4', title: 'Tom Ford Vanilla Premium', price: '389.00', sale_price: '319.00' },
                    { id: 'fb-p5', title: 'Yves Saint Laurent Libre', price: '349.00', sale_price: '279.00' },
                    { id: 'fb-p6', title: 'Versace Eros Premium', price: '329.00', sale_price: '269.00' }
                ],
                watch: [
                    { id: 'fb-w1', title: 'Rolex Yacht Master Silver', price: '1299.00', sale_price: '999.00' },
                    { id: 'fb-w2', title: 'Omega Swatch Premium Blue', price: '899.00', sale_price: '749.00' },
                    { id: 'fb-w3', title: 'Rolex Datejust Classic Gold', price: '1599.00', sale_price: '1299.00' },
                    { id: 'fb-w4', title: 'Audemars Piguet Royal Blue', price: '1899.00', sale_price: '1599.00' },
                    { id: 'fb-w5', title: 'Patek Philippe Classic Black', price: '1699.00', sale_price: '1399.00' },
                    { id: 'fb-w6', title: 'Cartier Tank Premium Silver', price: '1199.00', sale_price: '999.00' }
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
                            <p>⏳ Loading premium products with English names...</p>
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
                console.log('🌸 Loading ONLY perfumes in perfumes section with English names');
                const perfumesToShow = this.perfumesData.slice(0, 8);
                perfumesGrid.innerHTML = perfumesToShow.map(product => 
                    this.createProductCard(product, 'perfume')
                ).join('');
            }
            
            // Load watches in watches section ONLY
            const watchesGrid = document.getElementById('watches-grid');
            if (watchesGrid && this.watchesData.length > 0) {
                console.log('⏰ Loading ONLY watches in watches section with English names');
                const watchesToShow = this.watchesData.slice(0, 8);
                watchesGrid.innerHTML = watchesToShow.map(product => 
                    this.createProductCard(product, 'watch')
                ).join('');
            }
            
            // Load mixed featured products (both types)
            const featuredGrid = document.getElementById('featuredProducts');
            if (featuredGrid) {
                console.log('⭐ Loading mixed featured products with English names');
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
                console.log('🔥 Loading best deals with English names');
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
            
            console.log('📊 Loading ALL products for showcase page with English names');
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
         * Create enhanced product card HTML with English names
         */
        createProductCard(product, productType, isShowcase = false) {
            const hasDiscount = parseFloat(product.price || 0) > parseFloat(product.sale_price || 0);
            const discountPercent = hasDiscount ? this.calculateDiscount(product) : 0;
            const rating = this.generateRating();
            
            const targetAttr = isShowcase ? '' : 'target="_blank" rel="noopener"';
            const productUrl = `./product-details.html?type=${productType}&id=${product.id}&source=${productType === 'perfume' ? 'otor' : 'sa3at'}`;
            
            // Ensure English title is displayed
            const displayTitle = product.titleEN || this.translateTitle(product.title) || 'Premium Product';
            
            return `
                <div class="product-card enhanced" data-category="${productType}" data-price="${product.priceAED || product.sale_price}" data-name="${displayTitle}">
                    <div class="product-image-container">
                        <img src="${product.image_link || this.getPlaceholderImage(product.type)}" 
                             alt="${displayTitle}" 
                             class="product-image"
                             loading="lazy"
                             width="300"
                             height="300"
                             onerror="this.src='${this.getPlaceholderImage(product.type)}'">
                        ${hasDiscount ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                        <div class="product-overlay">
                            <a href="${productUrl}" class="btn-primary product-details-btn" ${targetAttr} 
                               aria-label="View details for ${displayTitle}">
                                <i class="fas fa-eye" aria-hidden="true"></i> View Details
                            </a>
                            <button class="btn-secondary add-to-cart-btn" 
                                    onclick="addToCartEN('${product.id}', '${productType}')" 
                                    aria-label="Add ${displayTitle} to cart">
                                <i class="fas fa-shopping-cart" aria-hidden="true"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">${product.icon} ${product.type}</div>
                        <h3 class="product-title">
                            <a href="${productUrl}" ${targetAttr} aria-label="${displayTitle}">
                                ${displayTitle}
                            </a>
                        </h3>
                        
                        <div class="product-description">
                            ${this.getProductDescription(displayTitle, product.type)}
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
                                    onclick="orderNowEN('${product.id}', '${displayTitle}', '${product.priceAED || product.sale_price}', '${productType}')" 
                                    aria-label="Order ${displayTitle} now">
                                <i class="fas fa-credit-card" aria-hidden="true"></i> Order Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },
        
        /**
         * Get contextual product description based on title and type
         */
        getProductDescription(title, type) {
            if (type === 'Perfume') {
                if (title.includes('Tom Ford')) {
                    return 'Luxury Tom Ford fragrance with sophisticated blend and long-lasting scent';
                } else if (title.includes('Chanel')) {
                    return 'Iconic Chanel perfume with elegant composition and timeless appeal';
                } else if (title.includes('Dior')) {
                    return 'Premium Dior fragrance with distinctive character and refined notes';
                } else if (title.includes('Gucci')) {
                    return 'Exquisite Gucci perfume with modern sophistication and lasting power';
                } else if (title.includes('Versace')) {
                    return 'Bold Versace fragrance with dynamic energy and luxurious appeal';
                } else if (title.includes('Yves Saint Laurent')) {
                    return 'Sophisticated YSL fragrance with contemporary elegance and allure';
                } else if (title.includes('Car Fragrance')) {
                    return 'Premium rechargeable car fragrance for elegant automotive ambiance';
                } else if (title.includes('Incense')) {
                    return 'Traditional premium incense with authentic Arabian fragrance blend';
                } else {
                    return 'Premium fragrance with long-lasting scent and elegant composition';
                }
            } else {
                if (title.includes('Rolex')) {
                    return 'Luxury Rolex timepiece combining Swiss precision with timeless elegance';
                } else if (title.includes('Omega')) {
                    return 'Premium Omega watch featuring exceptional craftsmanship and accuracy';
                } else if (title.includes('Audemars Piguet')) {
                    return 'Exclusive Audemars Piguet watch with sophisticated design and premium quality';
                } else if (title.includes('Patek Philippe')) {
                    return 'Elite Patek Philippe timepiece representing the pinnacle of watchmaking';
                } else if (title.includes('Cartier')) {
                    return 'Elegant Cartier watch combining French luxury with precise timekeeping';
                } else if (title.includes('Smart')) {
                    return 'Advanced smartwatch with modern features and stylish design';
                } else if (title.includes('Couple')) {
                    return 'Matching couple watches set perfect for celebrating togetherness';
                } else {
                    return 'Luxury timepiece combining style with precision and quality';
                }
            }
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
     * Global functions for product interactions with English names
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
            const productTitle = product.titleEN || FixedEnglishProductsLoader.translateTitle(product.title);
            
            // Add to cart if cart system is available
            if (window.Emirates && window.Emirates.cart) {
                window.Emirates.cart.addItem({
                    id: productId,
                    title: productTitle,
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
                
                // Show notification with English name
                if (window.Emirates.showNotification) {
                    window.Emirates.showNotification(`${productTitle} added to cart! 🛒`, 'success');
                } else {
                    alert(`${productTitle} added to cart!`);
                }
            } else {
                // Fallback for when cart system isn't ready
                console.log('Cart system not ready, using fallback');
                alert(`${productTitle} added to cart!`);
            }
        } else {
            console.error('❌ Product not found');
            alert('Product added to cart!');
        }
    };
    
    window.orderNowEN = function(productId, productTitle, price, productType) {
        console.log(`📞 Direct order: ${productId} (${productType})`);
        
        // Ensure we use English title
        let englishTitle = productTitle;
        if (!englishTitle || englishTitle.includes('عطر') || englishTitle.includes('ساعة')) {
            const product = productType === 'perfume' ? 
                FixedEnglishProductsLoader.perfumesData.find(p => p.id === productId) :
                FixedEnglishProductsLoader.watchesData.find(p => p.id === productId);
            
            if (product) {
                englishTitle = product.titleEN || FixedEnglishProductsLoader.translateTitle(product.title);
            }
        }
        
        const message = `Hello! I want to order this product:

🎁 Product: ${englishTitle}
💰 Price: ${price} AED
📱 Store: Emirates Gifts
🌐 Language: English

I would like to know about:
• Ordering process
• Delivery details to UAE  
• Payment options
• Product availability
• Shipping time (1-3 business days)

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
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 20px;
            margin: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 2px solid rgba(212, 175, 55, 0.2);
            position: relative;
            overflow: hidden;
        }
        
        .loading-message.enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .loading-spinner {
            width: 56px;
            height: 56px;
            border: 5px solid #e9ecef;
            border-top: 5px solid #D4AF37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 24px;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-message.enhanced p {
            color: #495057;
            font-weight: 600;
            font-size: 16px;
            margin: 0;
            z-index: 2;
            position: relative;
        }
        
        .product-card.enhanced {
            position: relative;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid #f8f9fa;
        }
        
        .product-card.enhanced:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
            border-color: #D4AF37;
        }
        
        .error-message {
            text-align: center;
            padding: 80px 40px;
            color: #6c757d;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 24px;
            margin: 30px;
            border: 3px dashed rgba(212, 175, 55, 0.3);
            position: relative;
        }
        
        .error-message::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            height: 4px;
            background: linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37);
            border-radius: 2px;
        }
        
        .error-message i {
            font-size: 72px;
            color: #dc3545;
            margin-bottom: 24px;
            opacity: 0.8;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        .error-message h3 {
            color: #2c3e50;
            margin-bottom: 16px;
            font-weight: 700;
            font-size: 24px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
            color: #1B2951;
            border: none;
            padding: 14px 28px;
            border-radius: 30px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: inline-flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
            font-size: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.6);
            background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
        }
        
        .btn-secondary {
            background: transparent;
            color: #D4AF37;
            border: 3px solid #D4AF37;
            padding: 12px 24px;
            border-radius: 30px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .btn-secondary:hover {
            background: #D4AF37;
            color: white;
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
        }
    `;
    document.head.appendChild(style);
}