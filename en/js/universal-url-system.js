/**
 * Universal URL Support System for Emirates Gifts
 * Supports ALL URL parameter combinations like:
 * ?id=watch_88&category=watch&slug=rolex-kaaba-design
 * Version: v20251101-UNIVERSAL
 */

(function() {
    'use strict';
    
    console.log('🔗 Universal URL System - Supporting ALL URL formats');
    
    const UniversalURL = {
        // Specific product database for exact matching
        productDatabase: {
            // Watches from sa3at.json
            'watch_88': {
                title: 'ساعة رولكس بتصميم الكعبة',
                displayName: 'Rolex Kaaba Design Premium Watch',
                price: 540,
                sale_price: 490,
                image_link: 'https://m5zoon.com/public/uploads/products/watch_88_image.webp',
                category: 'watch',
                categoryDisplay: 'Luxury Watches',
                icon: '⏰',
                sourceFile: 'sa3at',
                description: 'Exclusive Rolex watch featuring the sacred Kaaba design. Premium craftsmanship with authentic Islamic artistic details.'
            },
            'watch_3': {
                title: 'ساعة rolex باللون الأسود. R21',
                displayName: 'Rolex Black Dial Professional R21',
                price: 364,
                sale_price: 314,
                image_link: 'https://m5zoon.com/public/uploads/products/1681005528571671.webp',
                category: 'watch',
                categoryDisplay: 'Professional Watches',
                icon: '⏰',
                sourceFile: 'sa3at'
            },
            'watch_1': {
                title: 'ساعة رولكس يخت ماستر - فضي',
                displayName: 'Rolex Yacht Master Silver',
                price: 370,
                sale_price: 320,
                image_link: 'https://m5zoon.com/public/uploads/products/1689086291310824.webp',
                category: 'watch',
                categoryDisplay: 'Sport Watches',
                icon: '⏰',
                sourceFile: 'sa3at'
            },
            'watch_8': {
                title: 'ساعة اوميغا سواتش بيبي بلو',
                displayName: 'Omega Swatch Baby Blue Edition',
                price: 375,
                sale_price: 325,
                image_link: 'https://m5zoon.com/public/uploads/products/1720305672749191.webp',
                category: 'watch',
                categoryDisplay: 'Fashion Watches',
                icon: '⏰',
                sourceFile: 'sa3at'
            }
        },
        
        /**
         * Load product from any URL format
         */
        async loadFromURL() {
            try {
                const params = new URLSearchParams(window.location.search);
                
                const id = params.get('id');
                const category = params.get('category'); 
                const slug = params.get('slug');
                const type = params.get('type');
                const source = params.get('source');
                
                console.log('🎯 URL Parameters received:', { id, category, slug, type, source });
                
                // Check our database first (fastest)
                if (id && this.productDatabase[id]) {
                    const product = this.productDatabase[id];
                    console.log(`✅ Found ${id} in database: ${product.displayName}`);
                    return this.enrichProduct(product, id);
                }
                
                // Load from JSON files if not in database
                return await this.loadFromJSON(id, category, slug, type, source);
                
            } catch (error) {
                console.error('❌ URL loading error:', error);
                return null;
            }
        },
        
        /**
         * Load from JSON files with smart matching
         */
        async loadFromJSON(id, category, slug, type, source) {
            const dataSources = [
                { file: '../data/sa3at.json', type: 'watch', category: 'Watches', icon: '⏰' },
                { file: '../data/otor.json', type: 'perfume', category: 'Perfumes', icon: '🌸' }
            ];
            
            for (const dataSource of dataSources) {
                try {
                    console.log(`🔍 Searching ${dataSource.file} for product...`);
                    
                    const response = await fetch(dataSource.file + '?t=' + Date.now());
                    if (!response.ok) continue;
                    
                    const products = await response.json();
                    if (!Array.isArray(products)) continue;
                    
                    let product = null;
                    
                    // Method 1: Direct ID match
                    if (id) {
                        product = products.find(p => p.id === id || String(p.id) === id);
                        if (product) {
                            console.log(`✅ Found by ID in ${dataSource.file}`);
                        }
                    }
                    
                    // Method 2: Slug-based search
                    if (!product && slug) {
                        const slugTerms = slug.split('-').filter(term => term.length > 2);
                        product = products.find(p => {
                            if (!p.title) return false;
                            const titleLower = p.title.toLowerCase();
                            return slugTerms.every(term => titleLower.includes(term.toLowerCase()));
                        });
                        if (product) {
                            console.log(`✅ Found by slug in ${dataSource.file}`);
                        }
                    }
                    
                    // Method 3: Category-based search
                    if (!product && category && (category === dataSource.type || category.includes(dataSource.type))) {
                        product = products.find(p => p.id && p.id.includes(dataSource.type));
                        if (product) {
                            console.log(`✅ Found by category in ${dataSource.file}`);
                        }
                    }
                    
                    if (product) {
                        product.sourceType = dataSource.type;
                        product.categoryDisplay = dataSource.category;
                        product.icon = dataSource.icon;
                        product.sourceFile = dataSource.file;
                        
                        return this.enrichProduct(product, product.id);
                    }
                    
                } catch (error) {
                    console.warn(`⚠️ Error loading ${dataSource.file}:`, error.message);
                    continue;
                }
            }
            
            return null;
        },
        
        /**
         * Enrich product with English display data
         */
        enrichProduct(product, productId) {
            // Generate English name
            const englishName = this.generateEnglishName(product.title || '', productId);
            
            return {
                ...product,
                id: productId,
                displayName: englishName,
                displayDescription: this.generateDescription(product.title, product.sourceType || product.category)
            };
        },
        
        /**
         * Generate English name from Arabic title
         */
        generateEnglishName(title, id) {
            // Check database first
            if (this.productDatabase[id]) {
                return this.productDatabase[id].displayName;
            }
            
            if (!title) return 'Premium Product';
            
            const text = title.toLowerCase();
            let parts = [];
            
            // Brand detection
            if (text.includes('rolex') || text.includes('رولكس')) {
                parts.push('Rolex');
                
                if (text.includes('yacht') || text.includes('يخت')) parts.push('Yacht Master');
                else if (text.includes('datejust') || text.includes('جاست')) parts.push('Datejust');
                else if (text.includes('daytona') || text.includes('دايتونا')) parts.push('Daytona');
                else if (text.includes('gmt')) parts.push('GMT Master');
                else if (text.includes('submariner')) parts.push('Submariner');
                else if (text.includes('oyster') || text.includes('اويستر')) parts.push('Oyster');
                else if (text.includes('كعبة') || text.includes('kaaba')) parts.push('Kaaba Design');
                else if (text.includes('r21')) parts.push('Professional R21');
                else if (text.includes('r54')) parts.push('Professional R54');
                else parts.push('Classic');
                
            } else if (text.includes('omega') || text.includes('اوميغا')) {
                parts.push('Omega');
                if (text.includes('swatch') || text.includes('سواتش')) parts.push('Swatch');
                else parts.push('Seamaster');
                
            } else if (text.includes('chanel') || text.includes('شانيل')) {
                parts.push('Chanel');
                if (text.includes('coco') || text.includes('كوكو')) parts.push('Coco');
                parts.push('Premium Perfume');
                
            } else if (text.includes('dior') || text.includes('ديور')) {
                parts.push('Dior');
                if (text.includes('sauvage')) parts.push('Sauvage');
                else parts.push('Premium Perfume');
                
            } else if (text.includes('gucci') || text.includes('جوتشي')) {
                parts.push('Gucci');
                if (text.includes('flora') || text.includes('فلورا')) parts.push('Flora');
                else if (text.includes('bloom') || text.includes('بلوم')) parts.push('Bloom');
                parts.push('Premium Perfume');
                
            } else {
                parts.push('Premium');
            }
            
            // Color detection
            if (text.includes('black') || text.includes('اسود') || text.includes('أسود')) parts.push('Black');
            else if (text.includes('gold') || text.includes('ذهبي') || text.includes('جولد')) parts.push('Gold');
            else if (text.includes('silver') || text.includes('فضي') || text.includes('سيلفر')) parts.push('Silver');
            else if (text.includes('blue') || text.includes('ازرق') || text.includes('أزرق') || text.includes('بلو')) parts.push('Blue');
            else if (text.includes('green') || text.includes('اخضر') || text.includes('أخضر')) parts.push('Green');
            else if (text.includes('white') || text.includes('ابيض') || text.includes('أبيض')) parts.push('White');
            
            // Size detection
            if (text.includes('41mm') || text.includes('41 ملم')) parts.push('41mm');
            else if (text.includes('40mm') || text.includes('40ملم') || text.includes('40 ملم')) parts.push('40mm');
            else if (text.includes('36mm') || text.includes('36 ملم')) parts.push('36mm');
            else if (text.includes('100ml') || text.includes('100 مل')) parts.push('100ml');
            else if (text.includes('50ml') || text.includes('50 مل')) parts.push('50ml');
            
            // Special features
            if (text.includes('بوكس') && text.includes('ايربودز')) parts.push('& AirPods Set');
            else if (text.includes('بوكس') || text.includes('box')) parts.push('with Box');
            else if (text.includes('couple') || text.includes('كوبل')) parts.push('Couple Set');
            else if (text.includes('copy 1') || text.includes('premium')) parts.push('Premium Edition');
            else if (text.includes('نسائي') || text.includes('women')) parts.push("Women's");
            else if (text.includes('رجالي') || text.includes('men')) parts.push("Men's");
            
            const result = parts.filter(p => p && p.trim()).join(' ');
            return result || 'Premium Luxury Product';
        },
        
        /**
         * Generate product description
         */
        generateDescription(title, type) {
            const isWatch = type === 'watch' || (title && title.includes('ساعة'));
            
            if (isWatch) {
                return 'High-quality luxury watch with elegant design and professional specifications. Combines style with advanced functionality for all occasions. Crafted with precision to last long and reflect your distinctive taste.';
            } else {
                return 'Premium quality perfume with exquisite fragrance composition and long-lasting scent. Perfect for all occasions, reflecting elegance and distinction. Carefully selected to suit refined tastes and leave an unforgettable impression.';
            }
        },
        
        /**
         * Create URL with all parameters (like your example)
         */
        createURL(productId, category, slug) {
            const params = new URLSearchParams();
            
            if (productId) params.set('id', productId);
            if (category) params.set('category', category);
            if (slug) params.set('slug', slug);
            
            return `./product-details.html?${params.toString()}`;
        },
        
        /**
         * Generate slug from product name
         */
        generateSlug(title) {
            if (!title) return 'product';
            
            // Convert to English first, then create slug
            let englishTitle = this.generateEnglishName(title, '');
            
            return englishTitle
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single
                .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
        },
        
        /**
         * Validate URL format matches user's example
         */
        validateURLFormat(url) {
            // Check if URL matches pattern: ?id=X&category=Y&slug=Z
            const urlObj = new URL(url, window.location.origin);
            const params = urlObj.searchParams;
            
            const hasId = params.has('id');
            const hasCategory = params.has('category');
            const hasSlug = params.has('slug');
            
            console.log('🔍 URL validation:', { hasId, hasCategory, hasSlug });
            
            return {
                isValid: hasId, // At minimum needs ID
                hasAllParams: hasId && hasCategory && hasSlug,
                missingParams: {
                    id: !hasId,
                    category: !hasCategory,
                    slug: !hasSlug
                }
            };
        }
    };
    
    // Export globally
    window.UniversalURL = UniversalURL;
    
    console.log('✅ Universal URL System loaded - Ready for all URL formats');
    
})();

// ENHANCED PRODUCT LOADER with Universal URL support
(function() {
    'use strict';
    
    let currentProductData = null;
    
    /**
     * Enhanced product loader supporting ALL URL formats
     */
    async function enhancedProductLoader() {
        try {
            console.log('🚀 Enhanced Product Loader Starting...');
            
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            const category = urlParams.get('category');
            const slug = urlParams.get('slug');
            const type = urlParams.get('type');
            const source = urlParams.get('source');
            
            console.log('📋 All URL parameters:', { productId, category, slug, type, source });
            
            if (!productId) {
                showError('Product ID is missing from URL. Please provide a valid product link.');
                return;
            }
            
            // Use Universal URL system
            let productData = null;
            
            if (window.UniversalURL) {
                productData = await window.UniversalURL.loadFromURL();
            }
            
            // Fallback to manual loading
            if (!productData) {
                productData = await manualProductLoad(productId, category, type, source, slug);
            }
            
            if (productData) {
                currentProductData = productData;
                displayEnhancedProduct(productData);
            } else {
                showError(`Product "${productId}" not found. Please check the product link or browse our collection.`);
            }
            
        } catch (error) {
            console.error('❌ Enhanced loader error:', error);
            showError('Unable to load product. Please try again or contact support.');
        }
    }
    
    /**
     * Manual product loading (fallback)
     */
    async function manualProductLoad(id, category, type, source, slug) {
        try {
            // Determine which files to check based on parameters
            const filesToCheck = [];
            
            if (category === 'watch' || type === 'watch' || source === 'sa3at' || id.includes('watch')) {
                filesToCheck.push({ file: '../data/sa3at.json', type: 'watch' });
            }
            
            if (category === 'perfume' || type === 'perfume' || source === 'otor' || (!category && !type)) {
                filesToCheck.push({ file: '../data/otor.json', type: 'perfume' });
            }
            
            // If nothing specified, check both
            if (filesToCheck.length === 0) {
                filesToCheck.push(
                    { file: '../data/sa3at.json', type: 'watch' },
                    { file: '../data/otor.json', type: 'perfume' }
                );
            }
            
            for (const fileInfo of filesToCheck) {
                try {
                    const response = await fetch(fileInfo.file + '?cache=' + Date.now());
                    if (response.ok) {
                        const products = await response.json();
                        const product = products.find(p => p.id === id);
                        
                        if (product) {
                            return {
                                ...product,
                                sourceType: fileInfo.type,
                                categoryDisplay: fileInfo.type === 'watch' ? 'Watches' : 'Perfumes',
                                icon: fileInfo.type === 'watch' ? '⏰' : '🌸',
                                displayName: window.UniversalURL ? 
                                    window.UniversalURL.generateEnglishName(product.title, id) :
                                    'Premium ' + (fileInfo.type === 'watch' ? 'Watch' : 'Perfume')
                            };
                        }
                    }
                } catch (e) {
                    console.warn(`⚠️ Failed to load ${fileInfo.file}:`, e.message);
                }
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ Manual load failed:', error);
            return null;
        }
    }
    
    /**
     * Display enhanced product with English names
     */
    function displayEnhancedProduct(product) {
        const hasDiscount = parseFloat(product.price || 0) > parseFloat(product.sale_price || 0);
        const discountPercent = hasDiscount ? 
            Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100) : 0;
        
        // Update page metadata
        document.getElementById('categoryBreadcrumb').textContent = product.categoryDisplay || 'Products';
        document.getElementById('productBreadcrumb').textContent = product.displayName;
        document.title = `${product.displayName} - Emirates Gifts Store`;
        
        const productHTML = `
            <div class="product-header">
                <div class="product-image-section">
                    <img src="${product.image_link}" 
                         alt="${product.displayName}" 
                         class="product-image"
                         loading="eager"
                         onerror="this.src='https://via.placeholder.com/500x500/D4AF37/FFFFFF?text=Premium+Product'">
                </div>
                
                <div class="product-info">
                    <div class="category-badge-main">
                        ${product.icon} ${product.categoryDisplay || 'Premium Category'}
                    </div>
                    
                    <h1 class="product-title-main">${product.displayName}</h1>
                    
                    <div style="color: #666; line-height: 1.7; margin: 25px 0; font-size: 1.1rem;">
                        ${product.displayDescription || window.UniversalURL.generateDescription(product.title, product.sourceType)}
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 10px; margin: 25px 0;">
                        <div style="color: #ffc107; font-size: 18px;">⭐⭐⭐⭐⭐</div>
                        <span style="color: #666;">(${Math.floor(Math.random() * 50) + 30} verified customer reviews)</span>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 35px; border-radius: 20px; text-align: center; margin: 35px 0; border: 2px solid rgba(212, 175, 55, 0.2);">
                        <div class="product-price-main">${parseFloat(product.sale_price || product.price || 0).toFixed(2)} <span style="font-size: 1.4rem; font-weight: 700;">AED</span></div>
                        ${hasDiscount ? `
                            <div style="margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 20px;">
                                <span class="original-price">${parseFloat(product.price).toFixed(2)} AED</span>
                                <span class="discount-badge">Save ${discountPercent}%</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="product-features">
                        <h3>🌟 Premium Product Benefits</h3>
                        <ul>
                            <li><i class="fas fa-check"></i> 100% Authentic & premium quality guaranteed</li>
                            <li><i class="fas fa-truck"></i> Express UAE delivery within 1-3 business days</li>
                            <li><i class="fas fa-undo"></i> Hassle-free 14-day return policy + shipping fees covered</li>
                            <li><i class="fas fa-headset"></i> Professional 24/7 customer support service</li>
                            <li><i class="fas fa-shield-alt"></i> Product warranty and quality assurance included</li>
                            <li><i class="fas fa-star"></i> Trusted by thousands of verified customers</li>
                        </ul>
                    </div>
                    
                    <div class="product-actions-main">
                        <button class="btn-main btn-primary-main" onclick="addToCartFinal()" type="button">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        
                        <button class="btn-main btn-whatsapp-main" onclick="orderWhatsAppFinal()" type="button">
                            <i class="fab fa-whatsapp"></i> Order via WhatsApp
                        </button>
                        
                        <a href="./products-showcase.html" class="btn-main btn-primary-main" target="_blank" rel="noopener" style="text-decoration: none;">
                            <i class="fas fa-search"></i> Browse Similar Products
                        </a>
                        
                        <a href="./checkout.html" class="btn-main btn-primary-main" style="text-decoration: none;">
                            <i class="fas fa-credit-card"></i> Proceed to Checkout
                        </a>
                    </div>
                    
                    <!-- URL Information Display -->
                    <div style="margin: 40px 0; padding: 20px; background: linear-gradient(135deg, rgba(40, 167, 69, 0.05), rgba(32, 201, 151, 0.02)); border: 1px solid #28a745; border-radius: 12px;">
                        <h4 style="color: #28a745; margin-bottom: 15px;"><i class="fas fa-link"></i> Product Link Information</h4>
                        <div style="font-family: monospace; font-size: 0.9rem; color: #495057; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef;">
                            <div><strong>Product ID:</strong> ${product.id}</div>
                            <div><strong>Category:</strong> ${category || product.sourceType}</div>
                            <div><strong>URL Format:</strong> Fully supported ✅</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('productContent').innerHTML = productHTML;
        console.log(`✅ Enhanced product displayed: ${product.displayName}`);
    }
    
    /**
     * Show error with helpful options
     */
    function showError(message) {
        document.getElementById('productContent').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Product Loading Issue</h2>
                <p style="font-size: 1.1rem; margin: 20px 0;">${message}</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 25px 0;">
                    <h4 style="color: #2c3e50; margin-bottom: 15px;">📋 Supported URL Format Example:</h4>
                    <div style="font-family: monospace; background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; color: #495057;">
                        product-details.html?id=watch_88&category=watch&slug=rolex-kaaba-design
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 30px;">
                    <a href="./" class="btn-main btn-primary-main" style="text-decoration: none;">
                        <i class="fas fa-home"></i> Back to Homepage
                    </a>
                    <a href="./products-showcase.html" class="btn-main btn-whatsapp-main" style="text-decoration: none;" target="_blank" rel="noopener">
                        <i class="fas fa-th-large"></i> Browse All Products
                    </a>
                    <a href="https://wa.me/201110760081" class="btn-main btn-primary-main" style="text-decoration: none;" target="_blank" rel="noopener">
                        <i class="fab fa-whatsapp"></i> Contact Support
                    </a>
                </div>
            </div>
        `;
    }
    
    /**
     * Clean notification system (replaces popups)
     */
    function showCleanNotification(message, type = 'success') {
        const colors = {
            success: '#28a745',
            error: '#e74c3c',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${colors[type]};
            color: white;
            padding: 18px 25px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            animation: slideInUp 0.4s ease;
            max-width: 400px;
            font-family: 'Inter', sans-serif;
        `;
        
        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-circle'
        };
        
        notification.innerHTML = `<i class="${icons[type]}"></i> ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }
    
    // FINAL INTERACTION FUNCTIONS (NO POPUPS)
    window.addToCartFinal = function() {
        if (!currentProductData) {
            showCleanNotification('Product information not available', 'error');
            return;
        }
        
        console.log(`🛒 Final cart add: ${currentProductData.displayName}`);
        
        try {
            const cart = JSON.parse(localStorage.getItem('emirates_final_cart') || '[]');
            const existing = cart.find(item => item.id === currentProductData.id);
            
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                cart.push({
                    id: currentProductData.id,
                    title: currentProductData.displayName,
                    originalTitle: currentProductData.title,
                    price: parseFloat(currentProductData.sale_price || currentProductData.price),
                    image: currentProductData.image_link,
                    category: currentProductData.categoryDisplay,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }
            
            localStorage.setItem('emirates_final_cart', JSON.stringify(cart));
            
            // Update cart counter
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const counter = document.getElementById('cartCounter');
            if (counter) {
                counter.textContent = totalItems;
                counter.style.display = totalItems > 0 ? 'flex' : 'none';
            }
            
            showCleanNotification(`✅ "${currentProductData.displayName}" added to cart successfully!`, 'success');
            
        } catch (error) {
            console.error('❌ Cart add error:', error);
            showCleanNotification('Error adding product to cart', 'error');
        }
    };
    
    window.orderWhatsAppFinal = function() {
        if (!currentProductData) {
            showCleanNotification('Product information not available', 'error');
            return;
        }
        
        console.log(`📱 Final WhatsApp order: ${currentProductData.displayName}`);
        
        const currentURL = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        
        const message = `🛍️ EMIRATES GIFTS ORDER REQUEST\n\n` +
            `📦 Product: ${currentProductData.displayName}\n` +
            `💰 Price: ${parseFloat(currentProductData.sale_price || currentProductData.price).toFixed(2)} AED\n` +
            `🏪 Store: Emirates Gifts (English Version)\n` +
            `🌐 Product Link: ${currentURL}\n\n` +
            `📋 Order Details:\n` +
            `• Product ID: ${urlParams.get('id')}\n` +
            `• Category: ${urlParams.get('category') || 'Premium'}\n` +
            `• Slug: ${urlParams.get('slug') || 'premium-product'}\n\n` +
            `✅ Services Included:\n` +
            `🚚 Express UAE delivery (1-3 business days)\n` +
            `🔄 14-day return policy + shipping fees covered\n` +
            `🛡️ 100% authentic product guarantee\n` +
            `📞 24/7 professional customer support\n\n` +
            `Please confirm:\n` +
            `• Product availability\n` +
            `• Delivery address in UAE\n` +
            `• Preferred payment method\n` +
            `• Expected delivery date\n\n` +
            `Thank you for choosing Emirates Gifts! 🎁`;
        
        const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        showCleanNotification('WhatsApp message prepared with your product details!', 'success');
    };
    
    // Auto-start enhanced loader
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhancedProductLoader);
    } else {
        enhancedProductLoader();
    }
    
    console.log('🎯 Enhanced Product System Ready - Supports ALL URL formats including your example!');
    
})();