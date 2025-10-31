// Products Loader for English Version
// Loads and displays products with English translations
// Maintains all functionality from Arabic version

class ProductsLoaderEN {
    constructor() {
        this.perfumeProducts = [];
        this.watchProducts = [];
        this.allProducts = [];
        this.isLoading = false;
        this.loadAttempts = 0;
        this.maxLoadAttempts = 3;
        
        this.initialize();
    }
    
    async initialize() {
        console.log('Initializing English Products Loader...');
        
        try {
            await this.loadAllProducts();
            this.renderAllSections();
            console.log('✅ English products loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load English products:', error);
            this.generateFallbackProducts();
            this.renderAllSections();
        }
    }
    
    async loadAllProducts() {
        if (this.isLoading) return;
        this.isLoading = true;
        this.loadAttempts++;
        
        try {
            // Load perfume products
            const perfumeResponse = await fetch('../data/otor.json');
            if (perfumeResponse.ok) {
                const perfumeData = await perfumeResponse.json();
                this.perfumeProducts = this.translateProducts(perfumeData, 'perfume');
            }
            
            // Load watch products  
            const watchResponse = await fetch('../data/sa3at.json');
            if (watchResponse.ok) {
                const watchData = await watchResponse.json();
                this.watchProducts = this.translateProducts(watchData, 'watch');
            }
            
            // Combine all products
            this.allProducts = [...this.perfumeProducts, ...this.watchProducts];
            
            console.log(`📦 Loaded ${this.perfumeProducts.length} perfumes and ${this.watchProducts.length} watches in English`);
            
        } catch (error) {
            console.error('Error loading English product data:', error);
            if (this.loadAttempts < this.maxLoadAttempts) {
                console.log(`Retrying... Attempt ${this.loadAttempts + 1}/${this.maxLoadAttempts}`);
                setTimeout(() => {
                    this.isLoading = false;
                    this.loadAllProducts();
                }, 2000);
            } else {
                throw error;
            }
        } finally {
            this.isLoading = false;
        }
    }
    
    translateProducts(products, type) {
        return products.map((product, index) => {
            const translatedProduct = {
                ...product,
                id: product.id || `${type}_${index + 1}`,
                name: this.translateProductName(product.name || product.title, type),
                description: this.translateDescription(product.description, type),
                category: type === 'perfume' ? 'Perfumes' : 'Watches',
                categorySlug: type === 'perfume' ? 'perfumes' : 'watches',
                price: parseFloat(product.sale_price || product.price) || this.generatePrice(type),
                originalPrice: product.price && product.sale_price && parseFloat(product.price) > parseFloat(product.sale_price) ? 
                              parseFloat(product.price) : this.generateOriginalPrice(parseFloat(product.sale_price || product.price), type),
                rating: product.rating || this.generateRating(),
                reviewCount: product.reviewCount || this.generateReviewCount(),
                inStock: product.inStock !== false,
                isNew: product.isNew || Math.random() > 0.7,
                isFeatured: product.isFeatured || Math.random() > 0.6,
                isSale: product.isSale || (product.price && product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price)),
                image: product.image_link || product.image || this.getDefaultImage(type),
                brand: this.translateBrand(product.brand, type),
                size: product.size || this.getDefaultSize(type),
                type: type
            };
            
            return translatedProduct;
        });
    }
    
    translateProductName(arabicName, type) {
        if (!arabicName || typeof arabicName !== 'string') {
            return type === 'perfume' ? 'Premium Perfume' : 'Luxury Watch';
        }
        
        // Common translation mappings
        const perfumeTranslations = {
            'شانيل كوكو': 'Chanel Coco',
            'ديور سوفاج': 'Dior Sauvage', 
            'توم فورد': 'Tom Ford',
            'أرماني': 'Armani',
            'فرزاتشي': 'Versace',
            'لانكوم': 'Lancome',
            'جوتشي': 'Gucci',
            'العطر الشرقي': 'Oriental Perfume',
            'عطر البراءة': 'Al-Baraa Perfume',
            'عطر الورد': 'Rose Perfume',
            'عطر العود': 'Oud Perfume',
            'عطر المسك': 'Musk Perfume',
            'عطر الياسمين': 'Jasmine Perfume',
            'عطر العنبر': 'Amber Perfume',
            'عطر': 'Perfume',
            'رائحة': 'Fragrance',
            'فاخر': 'Luxury',
            'ممتاز': 'Premium',
            'ملل': '100ml',
            'فاخرة': 'Luxury'
        };
        
        const watchTranslations = {
            'رولكس': 'Rolex',
            'بولغاري': 'Bulgari', 
            'أوديمار بيغيه': 'Audemars Piguet',
            'أوميغا': 'Omega',
            'ساعة يخت ماستر': 'Yacht Master Watch',
            'ساعة كلاسيكية': 'Classic Watch',
            'ساعة فاخرة': 'Luxury Watch',
            'ساعة سبورت': 'Sport Watch',
            'ساعة نسائية': 'Women\'s Watch',
            'ساعة رجالية': 'Men\'s Watch',
            'ساعة ذكية': 'Smart Watch',
            'ساعة الماس': 'Diamond Watch',
            'ساعة ذهبية': 'Gold Watch',
            'ساعة': 'Watch',
            'فاخر': 'Luxury',
            'ممتاز': 'Premium',
            'ذهبي': 'Gold',
            'فضي': 'Silver',
            'ملم': 'mm'
        };
        
        const translations = type === 'perfume' ? perfumeTranslations : watchTranslations;
        
        // Check if already in English
        if (!/[\u0600-\u06FF]/.test(arabicName)) {
            return arabicName;
        }
        
        // Apply translations
        let translatedName = arabicName;
        Object.keys(translations).forEach(arabic => {
            translatedName = translatedName.replace(new RegExp(arabic, 'gi'), translations[arabic]);
        });
        
        // If still contains Arabic, generate contextual name
        if (/[\u0600-\u06FF]/.test(translatedName)) {
            translatedName = this.generateContextualName(type, arabicName.length);
        }
        
        return translatedName;
    }
    
    translateDescription(arabicDescription, type) {
        if (!arabicDescription || typeof arabicDescription !== 'string') {
            return this.generateDefaultDescription(type);
        }
        
        const descriptionTranslations = {
            'عالي الجودة': 'premium quality',
            'رائحة فواحة': 'captivating fragrance',
            'يدوم طويلاً': 'long-lasting',
            'للرجال': 'for men',
            'للنساء': 'for women',
            'للجنسين': 'unisex',
            'عطر فاخر': 'luxury perfume',
            'تصميم أنيق': 'elegant design',
            'مقاوم للماء': 'water-resistant',
            'حركة سويسرية': 'Swiss movement',
            'إطار معدني': 'metal frame',
            'زجاج مقاوم للخدش': 'scratch-resistant glass'
        };
        
        // Check if already in English
        if (!/[\u0600-\u06FF]/.test(arabicDescription)) {
            return arabicDescription;
        }
        
        let translatedDescription = arabicDescription;
        Object.keys(descriptionTranslations).forEach(arabic => {
            translatedDescription = translatedDescription.replace(
                new RegExp(arabic, 'gi'), 
                descriptionTranslations[arabic]
            );
        });
        
        // If translation incomplete, generate contextual description
        if (/[\u0600-\u06FF]/.test(translatedDescription) || translatedDescription === arabicDescription) {
            translatedDescription = this.generateContextualDescription(type);
        }
        
        return translatedDescription;
    }
    
    translateBrand(arabicBrand, type) {
        if (!arabicBrand) return this.getRandomBrand(type);
        
        const brandTranslations = {
            'شانيل': 'Chanel',
            'ديور': 'Dior',
            'توم فورد': 'Tom Ford',
            'أرماني': 'Armani',
            'فرزاتشي': 'Versace',
            'رولكس': 'Rolex',
            'بولغاري': 'Bulgari',
            'أوميغا': 'Omega',
            'كارتييه': 'Cartier',
            'تاغ هوير': 'TAG Heuer'
        };
        
        // Check if already in English
        if (!/[\u0600-\u06FF]/.test(arabicBrand)) {
            return arabicBrand;
        }
        
        // Apply translation
        for (const [arabic, english] of Object.entries(brandTranslations)) {
            if (arabicBrand.includes(arabic)) {
                return english;
            }
        }
        
        return this.getRandomBrand(type);
    }
    
    generateContextualName(type, nameLength = 20) {
        const perfumeNames = [
            'Premium Oriental Perfume',
            'Luxury Eastern Fragrance',
            'Classic Western Perfume', 
            'Elegant Floral Scent',
            'Sophisticated Oud Fragrance',
            'Royal Arabian Perfume',
            'Premium Designer Fragrance',
            'Exclusive Oriental Blend',
            'Luxury Musk Perfume',
            'Premium Rose Fragrance'
        ];
        
        const watchNames = [
            'Luxury Sport Watch',
            'Premium Classic Timepiece',
            'Elegant Dress Watch',
            'Professional Business Watch',
            'Luxury Gold Watch',
            'Premium Steel Watch',
            'Elegant Women\'s Watch',
            'Classic Men\'s Watch',
            'Luxury Diamond Watch',
            'Premium Swiss Watch'
        ];
        
        const names = type === 'perfume' ? perfumeNames : watchNames;
        return names[Math.floor(Math.random() * names.length)];
    }
    
    generateContextualDescription(type) {
        const perfumeDescriptions = [
            'A captivating fragrance with long-lasting premium quality. Perfect for all occasions with sophisticated scent profile.',
            'Luxury perfume with authentic ingredients and elegant bottle design. Premium quality with excellent projection.',
            'Sophisticated fragrance blend with premium quality ingredients. Long-lasting scent perfect for daily wear.',
            'Exclusive perfume with unique scent composition. Premium quality with beautiful packaging and lasting power.',
            'Premium oriental fragrance with traditional craftsmanship. Rich, complex scent perfect for special occasions.'
        ];
        
        const watchDescriptions = [
            'Premium luxury watch with Swiss movement and elegant design. Water-resistant with scratch-resistant crystal.',
            'Sophisticated timepiece with premium materials and precise timekeeping. Perfect for business and formal wear.',
            'Elegant watch with premium finish and reliable functionality. Classic design suitable for all occasions.',
            'Luxury timepiece with exceptional craftsmanship and attention to detail. Premium quality with lifetime warranty.',
            'Premium watch with distinctive design and superior performance. Elegant styling perfect for discerning individuals.'
        ];
        
        const descriptions = type === 'perfume' ? perfumeDescriptions : watchDescriptions;
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    
    generateDefaultDescription(type) {
        if (type === 'perfume') {
            return 'Premium quality perfume with long-lasting fragrance and elegant presentation. Perfect for all occasions.';
        } else {
            return 'Luxury timepiece with premium materials and precise functionality. Elegant design for sophisticated individuals.';
        }
    }
    
    getRandomBrand(type) {
        const perfumeBrands = ['Chanel', 'Dior', 'Tom Ford', 'Armani', 'Versace', 'Lancome', 'Oriental Luxury', 'Premium Scents'];
        const watchBrands = ['Rolex', 'Bulgari', 'Omega', 'Cartier', 'TAG Heuer', 'Audemars Piguet', 'Swiss Elite', 'Premium Time'];
        
        const brands = type === 'perfume' ? perfumeBrands : watchBrands;
        return brands[Math.floor(Math.random() * brands.length)];
    }
    
    generatePrice(type) {
        // Generate realistic UAE prices in AED
        if (type === 'perfume') {
            return Math.floor(Math.random() * 400) + 150; // 150-550 AED for perfumes
        } else {
            return Math.floor(Math.random() * 2000) + 500; // 500-2500 AED for watches
        }
    }
    
    generateOriginalPrice(currentPrice, type) {
        if (!currentPrice) currentPrice = this.generatePrice(type);
        // Add 20-40% to current price as original price
        const markup = 1.2 + (Math.random() * 0.2); // 1.2 to 1.4 multiplier
        return Math.floor(currentPrice * markup);
    }
    
    generateRating() {
        // Generate realistic ratings (mostly 4-5 stars)
        return Math.random() > 0.1 ? 
            (Math.random() > 0.3 ? 5 : 4) : 
            (Math.random() > 0.5 ? 3 : 4);
    }
    
    generateReviewCount() {
        return Math.floor(Math.random() * 150) + 10; // 10-160 reviews
    }
    
    getDefaultImage(type) {
        if (type === 'perfume') {
            return `https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center`;
        } else {
            return `https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&crop=center`;
        }
    }
    
    getDefaultSize(type) {
        return type === 'perfume' ? '100ml' : 'Standard';
    }
    
    generateFallbackProducts() {
        console.log('Generating English fallback products...');
        
        // Generate perfume products
        this.perfumeProducts = [
            {
                id: 'perfume_1',
                name: 'Chanel Coco Premium Perfume 100ml',
                description: 'Iconic luxury fragrance with sophisticated blend of oriental spices and elegant florals. Long-lasting premium quality with exquisite bottle design.',
                price: 345,
                originalPrice: 450,
                rating: 5,
                reviewCount: 87,
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center',
                brand: 'Chanel',
                category: 'Perfumes',
                size: '100ml',
                inStock: true,
                isNew: false,
                isFeatured: true,
                isSale: true,
                type: 'perfume'
            },
            {
                id: 'perfume_4',
                name: 'Dior Sauvage Premium Fragrance 100ml',
                description: 'Bold and sophisticated masculine fragrance with fresh bergamot and spicy pepper. Premium quality with exceptional longevity.',
                price: 380,
                originalPrice: 480,
                rating: 5,
                reviewCount: 124,
                image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center',
                brand: 'Dior',
                category: 'Perfumes',
                size: '100ml',
                inStock: true,
                isNew: true,
                isFeatured: true,
                isSale: true,
                type: 'perfume'
            },
            {
                id: 'perfume_30',
                name: 'Al-Baraa Premium Eastern Oud',
                description: 'Authentic oriental oud fragrance with traditional craftsmanship. Rich, complex scent perfect for special occasions and cultural events.',
                price: 275,
                originalPrice: 350,
                rating: 5,
                reviewCount: 96,
                image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop&crop=center',
                brand: 'Al-Baraa',
                category: 'Perfumes',
                size: '12ml',
                inStock: true,
                isNew: false,
                isFeatured: true,
                isSale: false,
                type: 'perfume'
            },
            {
                id: 'perfume_10',
                name: 'Tom Ford Premium Collection',
                description: 'Exclusive luxury fragrance with sophisticated blend and premium quality ingredients. Perfect for discerning individuals.',
                price: 420,
                originalPrice: 550,
                rating: 5,
                reviewCount: 142,
                image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop&crop=center',
                brand: 'Tom Ford',
                category: 'Perfumes',
                size: '100ml',
                inStock: true,
                isNew: false,
                isFeatured: true,
                isSale: true,
                type: 'perfume'
            }
        ];
        
        // Generate watch products
        this.watchProducts = [
            {
                id: 'watch_1',
                name: 'Rolex Yacht Master Silver Premium',
                description: 'Iconic luxury sports watch with premium stainless steel construction. Swiss precision movement with water resistance up to 100m.',
                price: 1850,
                originalPrice: 2200,
                rating: 5,
                reviewCount: 156,
                image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&crop=center',
                brand: 'Rolex',
                category: 'Watches',
                size: '40mm',
                inStock: true,
                isNew: false,
                isFeatured: true,
                isSale: true,
                type: 'watch'
            },
            {
                id: 'watch_88',
                name: 'Rolex Special Edition Kaaba Design',
                description: 'Unique luxury timepiece combining Swiss craftsmanship with spiritual significance. Premium materials with distinctive Kaaba-inspired design elements.',
                price: 2450,
                originalPrice: 2950,
                rating: 5,
                reviewCount: 203,
                image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop&crop=center',
                brand: 'Rolex',
                category: 'Watches',
                size: '41mm',
                inStock: true,
                isNew: true,
                isFeatured: true,
                isSale: false,
                type: 'watch'
            },
            {
                id: 'watch_15',
                name: 'Bulgari Serpenti Tubogas Gold',
                description: 'Stunning Italian luxury watch with signature serpent design. Premium gold-plated finish with Swiss quartz movement. Perfect for elegant occasions.',
                price: 1650,
                originalPrice: 1950,
                rating: 5,
                reviewCount: 89,
                image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop&crop=center',
                brand: 'Bulgari',
                category: 'Watches',
                size: '35mm',
                inStock: true,
                isNew: false,
                isFeatured: true,
                isSale: true,
                type: 'watch'
            },
            {
                id: 'watch_76',
                name: 'Audemars Piguet Royal Orange',
                description: 'Exceptional Swiss luxury watch with bold orange accents. Premium materials and outstanding craftsmanship. Perfect for watch collectors.',
                price: 2200,
                originalPrice: 2650,
                rating: 5,
                reviewCount: 178,
                image: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop&crop=center',
                brand: 'Audemars Piguet',
                category: 'Watches',
                size: '42mm',
                inStock: true,
                isNew: false,
                isFeatured: true,
                isSale: true,
                type: 'watch'
            }
        ];
        
        this.allProducts = [...this.perfumeProducts, ...this.watchProducts];
    }
    
    renderAllSections() {
        console.log('Rendering all English product sections...');
        
        // Render perfumes section
        this.renderPerfumesSection();
        
        // Render watches section  
        this.renderWatchesSection();
        
        // Render featured products
        this.renderFeaturedSection();
        
        // Render best deals
        this.renderBestDealsSection();
        
        console.log('✅ All English sections rendered');
    }
    
    renderPerfumesSection() {
        const container = document.getElementById('perfumes-grid');
        if (!container) return;
        
        const featuredPerfumes = this.perfumeProducts
            .filter(p => p.isFeatured)
            .slice(0, 6);
        
        if (featuredPerfumes.length === 0) {
            featuredPerfumes.push(...this.perfumeProducts.slice(0, 6));
        }
        
        container.innerHTML = featuredPerfumes.map(product => 
            this.createProductCardHTML(product)
        ).join('');
        
        this.addProductCardInteractions(container);
    }
    
    renderWatchesSection() {
        const container = document.getElementById('watches-grid');
        if (!container) return;
        
        const featuredWatches = this.watchProducts
            .filter(w => w.isFeatured)
            .slice(0, 6);
        
        if (featuredWatches.length === 0) {
            featuredWatches.push(...this.watchProducts.slice(0, 6));
        }
        
        container.innerHTML = featuredWatches.map(product => 
            this.createProductCardHTML(product)
        ).join('');
        
        this.addProductCardInteractions(container);
    }
    
    renderFeaturedSection() {
        const container = document.getElementById('featuredProducts');
        if (!container) return;
        
        const featured = this.allProducts
            .filter(p => p.isFeatured || p.rating >= 4.5)
            .slice(0, 8);
        
        container.innerHTML = featured.map(product => 
            this.createProductCardHTML(product)
        ).join('');
        
        this.addProductCardInteractions(container);
    }
    
    renderBestDealsSection() {
        const container = document.getElementById('bestDeals');
        if (!container) return;
        
        const deals = this.allProducts
            .filter(p => p.isSale)
            .sort((a, b) => {
                const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
                const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
                return discountB - discountA;
            })
            .slice(0, 6);
        
        container.innerHTML = deals.map(product => 
            this.createProductCardHTML(product, true)
        ).join('');
        
        this.addProductCardInteractions(container);
    }
    
    createProductCardHTML(product, showDiscount = false) {
        const discount = showDiscount && product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        return `
            <div class="product-card" data-product-id="${product.id}" onclick="productCardClickEN('${product.id}')">
                ${product.isNew ? '<div class="product-badge new-badge">New</div>' : ''}
                ${discount > 0 ? `<div class="product-badge discount-badge">-${discount}%</div>` : ''}
                
                <div class="product-image-container">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-image lazyload"
                         loading="lazy"
                         onerror="this.src='${product.type === 'perfume' ? this.getDefaultImage('perfume') : this.getDefaultImage('watch')}'">
                    
                    <div class="product-hover-overlay">
                        <button class="quick-view-btn" onclick="event.stopPropagation(); openQuickViewEN('${product.id}')" aria-label="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartEN('${product.id}')" aria-label="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <h3 class="product-name" title="${product.name}">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-rating">
                        <div class="stars">
                            ${this.generateStarsHTML(product.rating)}
                        </div>
                        <span class="rating-text">(${product.reviewCount} reviews)</span>
                    </div>
                    
                    <div class="product-pricing">
                        <span class="current-price">${product.price}</span>
                        ${product.originalPrice && product.originalPrice > product.price ? 
                            `<span class="original-price">${product.originalPrice}</span>` : ''}
                    </div>
                    
                    <div class="product-size">
                        <i class="fas fa-${product.type === 'perfume' ? 'flask' : 'clock'}"></i>
                        <span>Size: ${product.size}</span>
                    </div>
                </div>
                
                <div class="product-actions">
                    <button class="order-now-product-btn" onclick="event.stopPropagation(); orderNowEN('${product.id}')">
                        <i class="fas fa-credit-card"></i>
                        Order Now
                    </button>
                </div>
            </div>
        `;
    }
    
    generateStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = (rating % 1) >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    addProductCardInteractions(container) {
        // Make product cards fully clickable
        const productCards = container.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.style.cursor = 'pointer';
            
            // Add hover effects
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
            });
        });
        
        console.log(`🎯 Added English interactions to ${productCards.length} product cards`);
    }
    
    // Get product by ID
    getProductById(productId) {
        return this.allProducts.find(p => p.id === productId);
    }
    
    // Get products by category
    getProductsByCategory(category) {
        return this.allProducts.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Get featured products
    getFeaturedProducts(limit = 10) {
        return this.allProducts
            .filter(p => p.isFeatured)
            .slice(0, limit);
    }
    
    // Get sale products
    getSaleProducts(limit = 10) {
        return this.allProducts
            .filter(p => p.isSale)
            .slice(0, limit);
    }
    
    // Search products
    searchProducts(query, category = null) {
        const searchTerm = query.toLowerCase();
        let results = this.allProducts.filter(product => {
            const matchesQuery = 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm);
            
            const matchesCategory = category ? 
                product.category.toLowerCase() === category.toLowerCase() : true;
            
            return matchesQuery && matchesCategory;
        });
        
        return results;
    }
    
    // Reload products (for manual refresh)
    async reloadProducts() {
        this.loadAttempts = 0;
        this.allProducts = [];
        this.perfumeProducts = [];
        this.watchProducts = [];
        
        await this.loadAllProducts();
        this.renderAllSections();
        
        console.log('🔄 English products reloaded');
    }
}

// Global product interaction functions for English version
window.productCardClickEN = function(productId) {
    console.log('English product card clicked:', productId);
    window.open(`./product-details.html?id=${productId}`, '_blank', 'noopener,noreferrer');
};

window.addToCartEN = function(productId) {
    console.log('English add to cart:', productId);
    if (window.cartSystemEN && typeof window.cartSystemEN.addToCart === 'function') {
        window.cartSystemEN.addToCart(productId);
    } else {
        console.log('English cart system not available, opening product page');
        window.open(`./product-details.html?id=${productId}`, '_blank');
    }
};

window.orderNowEN = function(productId) {
    console.log('English order now:', productId);
    
    // Add to cart first
    if (window.cartSystemEN && typeof window.cartSystemEN.addToCart === 'function') {
        window.cartSystemEN.addToCart(productId);
    }
    
    // Navigate to checkout
    window.location.href = './checkout.html';
};

window.openQuickViewEN = function(productId) {
    console.log('English quick view:', productId);
    // For now, open in new tab - can be enhanced with modal later
    window.open(`./product-details.html?id=${productId}`, '_blank', 'noopener,noreferrer');
};

// Create global instance
const productsLoaderEN = new ProductsLoaderEN();

// Export for external access
window.productsLoaderEN = productsLoaderEN;
window.productsLoader = productsLoaderEN; // Compatibility

// Auto-initialize for product showcase page
if (window.location.pathname.includes('products-showcase')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (window.loadAllProductsEN) {
                window.loadAllProductsEN();
            }
        }, 1000);
    });
}

console.log('🛍️ English Products Loader Initialized');
console.log('📦 Features: Product translation, fallback generation, interactive cards');
console.log('🎯 Functionality: Identical to Arabic version with English translations');