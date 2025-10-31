// Fixed English Product Loader - Correct product categorization and display
// No more mixing perfumes with watches - each category shows correct products
// Fixed URL generation and product details opening

(function() {
    'use strict';
    
    // Data storage with proper separation
    let perfumesDataEN = [];
    let watchesDataEN = [];
    let allProductsDataEN = [];
    let isDataLoadedEN = false;
    
    // Product translation mapping
    const translations = {
        // Perfume categories
        'عطر كوكو شانيل': 'Chanel Coco Perfume',
        'عطر جوتشي فلورا': 'Gucci Flora Perfume',
        'عطر جوتشي بلوم': 'Gucci Bloom Perfume',
        'عطر سوفاج ديور': 'Dior Sauvage Perfume',
        'عطر فرزاتشي ايروس': 'Versace Eros Perfume',
        'Tom Ford': 'Tom Ford',
        'Hermes': 'Hermes',
        'Penhaligons': 'Penhaligons',
        'Xerjoff': 'Xerjoff',
        'Kayali': 'Kayali',
        'Yves Saint Laurent': 'Yves Saint Laurent',
        'Marly': 'Marly',
        'دخون': 'Incense',
        'Oud Al-Brayeh': 'Oud Al-Brayeh',
        
        // Watch categories
        'ساعة رولكس': 'Rolex Watch',
        'ساعة Rolex': 'Rolex Watch',
        'ساعة اوميغا سواتش': 'Omega Swatch',
        'ساعة سربنتي': 'Serpenti Watch',
        'ساعة نسائية ديور': 'Dior Ladies Watch',
        'ساعة فورسينغ': 'Forsining Watch',
        'ساعة ذكية': 'Smart Watch',
        'Burberry watches': 'Burberry Watch',
        'Patek Philippe': 'Patek Philippe',
        'Emporio Armani': 'Emporio Armani',
        'Cartier Tank': 'Cartier Tank',
        'Breitling': 'Breitling',
        'Aigner watch': 'Aigner Watch',
        'Piaget watch': 'Piaget Watch',
        'Audemars Piguet': 'Audemars Piguet'
    };
    
    // Translate product title to English
    function translateTitle(arabicTitle) {
        if (!arabicTitle) return 'Premium Product';
        
        let englishTitle = arabicTitle;
        
        // Apply translations
        Object.keys(translations).forEach(arabic => {
            if (arabicTitle.includes(arabic)) {
                englishTitle = englishTitle.replace(arabic, translations[arabic]);
            }
        });
        
        // Clean up common Arabic words
        englishTitle = englishTitle
            .replace(/عطر\s*/g, '')
            .replace(/ساعة\s*/g, '')
            .replace(/\s+مل\s*/, 'ml ')
            .replace(/\s+ملم\s*/, 'mm ')
            .replace(/\s+\+\s*البوكس\s*الأصلي/g, ' + Original Box')
            .replace(/\s*copy\s*1\s*/gi, ' Premium Edition')
            .replace(/\s*high\s*quality\s*/gi, ' High Quality')
            .replace(/مينا\s*/g, 'Dial ')
            .replace(/اسود/g, 'Black')
            .replace(/ابيض/g, 'White')
            .replace(/اخضر/g, 'Green')
            .replace(/ازرق/g, 'Blue')
            .replace(/بني/g, 'Brown')
            .replace(/ذهبي/g, 'Gold')
            .replace(/فضي/g, 'Silver')
            .replace(/احمر/g, 'Red')
            .replace(/اصفر/g, 'Yellow')
            .replace(/\s+/g, ' ')
            .trim();
        
        return englishTitle || 'Premium Product';
    }
    
    // Generate proper English slug
    function englishSlugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    
    // Build correct product URL
    function buildCorrectURL(product) {
        const slug = englishSlugify(product.titleEN || product.title);
        return `./product-details.html?type=${product.type.toLowerCase()}&id=${product.actualId}&source=${product.source}&lang=en&slug=${slug}`;
    }
    
    // Load and process product data
    async function loadProductDataEN() {
        if (isDataLoadedEN) {
            return {
                perfumes: perfumesDataEN,
                watches: watchesDataEN,
                all: allProductsDataEN
            };
        }
        
        try {
            console.log('🔄 Loading English product data with proper separation...');
            
            // Load perfumes from ../data/otor.json
            try {
                const perfumesResponse = await fetch('../data/otor.json');
                if (perfumesResponse.ok) {
                    const rawPerfumes = await perfumesResponse.json();
                    perfumesDataEN = rawPerfumes.map((item, index) => {
                        const titleEN = translateTitle(item.title);
                        return {
                            ...item,
                            actualId: item.id,
                            title: item.title, // Keep original Arabic
                            titleEN: titleEN, // Add English translation
                            displayIndex: index + 1,
                            type: 'PERFUME',
                            category: 'Perfumes',
                            categoryAR: 'عطور',
                            icon: '🌸',
                            source: 'otor.json',
                            detailsUrl: buildCorrectURL({
                                type: 'PERFUME',
                                actualId: item.id,
                                source: 'otor.json',
                                titleEN: titleEN
                            }),
                            description: 'Premium quality perfume with long-lasting fragrance and elegant scent profile',
                            priceAED: `${parseFloat(item.sale_price).toFixed(2)} AED`,
                            originalPriceAED: `${parseFloat(item.price).toFixed(2)} AED`
                        };
                    });
                    console.log(`✅ Loaded ${perfumesDataEN.length} perfumes`);
                }
            } catch (error) {
                console.error('❌ Error loading perfumes:', error);
            }
            
            // Load watches from ../data/sa3at.json
            try {
                const watchesResponse = await fetch('../data/sa3at.json');
                if (watchesResponse.ok) {
                    const rawWatches = await watchesResponse.json();
                    watchesDataEN = rawWatches.map((item, index) => {
                        const titleEN = translateTitle(item.title);
                        return {
                            ...item,
                            actualId: item.id,
                            title: item.title, // Keep original Arabic
                            titleEN: titleEN, // Add English translation
                            displayIndex: index + 1,
                            type: 'WATCH',
                            category: 'Watches',
                            categoryAR: 'ساعات',
                            icon: '⏰',
                            source: 'sa3at.json',
                            detailsUrl: buildCorrectURL({
                                type: 'WATCH',
                                actualId: item.id,
                                source: 'sa3at.json',
                                titleEN: titleEN
                            }),
                            description: 'Premium quality watch with elegant design and professional specifications',
                            priceAED: `${parseFloat(item.sale_price).toFixed(2)} AED`,
                            originalPriceAED: `${parseFloat(item.price).toFixed(2)} AED`
                        };
                    });
                    console.log(`✅ Loaded ${watchesDataEN.length} watches`);
                }
            } catch (error) {
                console.error('❌ Error loading watches:', error);
            }
            
            // Merge all products
            allProductsDataEN = [...perfumesDataEN, ...watchesDataEN];
            isDataLoadedEN = true;
            
            console.log(`🎯 Total English products loaded: ${allProductsDataEN.length}`);
            console.log(`🌸 Perfumes: ${perfumesDataEN.length}`);
            console.log(`⏰ Watches: ${watchesDataEN.length}`);
            
        } catch (error) {
            console.error('❌ General error loading English data:', error);
        }
        
        return {
            perfumes: perfumesDataEN,
            watches: watchesDataEN,
            all: allProductsDataEN
        };
    }
    
    // Create English product card
    function createEnglishProductCard(product, index = 0) {
        const isValidProduct = product && product.actualId && product.type;
        if (!isValidProduct) {
            console.error('❌ Invalid English product:', product);
            return '<div class="error-product">Product data error</div>';
        }
        
        const originalPrice = parseFloat(product.price) || 0;
        const salePrice = parseFloat(product.sale_price) || originalPrice;
        const hasDiscount = originalPrice > salePrice;
        const discountPercent = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
        
        const correctUrl = product.detailsUrl;
        const englishTitle = product.titleEN || translateTitle(product.title);
        
        let categoryDisplay = '';
        let categoryStyle = '';
        let description = '';
        
        if (product.type === 'PERFUME') {
            categoryDisplay = '🌸 Perfumes';
            categoryStyle = 'background: rgba(255, 182, 193, 0.9); color: #8B0000;';
            description = 'Premium quality perfume with exquisite fragrance and long-lasting scent';
        } else if (product.type === 'WATCH') {
            categoryDisplay = '⏰ Watches';
            categoryStyle = 'background: rgba(135, 206, 235, 0.9); color: #000080;';
            description = 'Luxury watch with elegant design and premium craftsmanship';
        }
        
        return `
            <div class="product-card english-product" 
                 data-product-id="${product.actualId}" 
                 data-product-type="${product.type}"
                 data-source-file="${product.source}"
                 data-index="${index}"
                 style="animation-delay: ${index * 0.1}s; cursor: pointer; text-align: center;"
                 onclick="openCorrectProductEN('${product.type}', '${product.actualId}', '${product.source}', event)">
                 
                <!-- Image Container -->
                <div class="product-image-container" style="position: relative; overflow: hidden; height: 250px;">
                    <img src="${product.image_link}" 
                         alt="${englishTitle}" 
                         class="product-image"
                         style="width: 100%; height: 100%; object-fit: cover;"
                         loading="${index < 8 ? 'eager' : 'lazy'}"
                         onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${product.type === 'PERFUME' ? 'Perfume' : 'Watch'}'">
                    
                    <!-- Correct Category Badge -->
                    <div class="product-category-badge" 
                         style="position: absolute; top: 10px; left: 10px; padding: 6px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 600; z-index: 2; ${categoryStyle}">
                        ${categoryDisplay}
                    </div>
                    
                    <!-- Discount Badge -->
                    ${hasDiscount ? 
                        `<div class="discount-badge" style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; padding: 6px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 600;">${discountPercent}% OFF</div>` : 
                        `<div class="new-badge" style="position: absolute; top: 10px; right: 10px; background: #27ae60; color: white; padding: 6px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 600;">NEW</div>`
                    }
                </div>
                
                <!-- Product Information -->
                <div class="product-info" style="padding: 20px;">
                    <!-- Title -->
                    <h3 class="product-title" style="font-size: 1.2rem; font-weight: 700; color: #2c3e50; margin-bottom: 10px; line-height: 1.4; text-align: center;">
                        <a href="${correctUrl}" 
                           target="_blank" 
                           rel="noopener"
                           onclick="event.stopPropagation(); logProductClickEN('${product.type}', '${product.actualId}');"
                           style="text-decoration: none; color: inherit;">
                            ${englishTitle}
                        </a>
                    </h3>
                    
                    <!-- Description -->
                    <div class="product-description" style="font-size: 0.85rem; color: #666; margin: 10px 0; line-height: 1.4; text-align: center;">
                        ${description}
                    </div>
                    
                    <!-- Price -->
                    <div class="product-price" style="text-align: center; margin: 15px 0;">
                        <span class="current-price" style="font-size: 1.4rem; font-weight: 900; color: #27ae60;">${salePrice.toFixed(2)}</span>
                        <span class="currency" style="font-size: 1.1rem; font-weight: 600; color: #27ae60; margin-left: 5px;">AED</span>
                        ${hasDiscount ? `<span class="original-price" style="font-size: 1rem; color: #e74c3c; text-decoration: line-through; margin-left: 10px;">${originalPrice.toFixed(2)} AED</span>` : ''}
                    </div>
                    
                    <!-- Rating -->
                    <div class="product-rating" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0; padding: 8px; background: rgba(255, 215, 0, 0.1); border-radius: 8px;">
                        <div class="stars" style="color: #FFD700; font-size: 1rem;">★★★★☆</div>
                        <span class="rating-number" style="font-weight: bold; color: #D4AF37; font-size: 0.9rem;">4.5</span>
                        <span class="reviews-count" style="color: #666; font-size: 0.8rem;">(15)</span>
                        <span class="verified-badge" style="background: #25D366; color: white; padding: 2px 6px; border-radius: 6px; font-size: 0.7rem; font-weight: 600;">✓ Verified</span>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="product-actions" style="display: flex; justify-content: center; gap: 8px; margin-top: 15px; flex-wrap: wrap;">
                        <!-- Add to Cart -->
                        <button class="icon-btn add-cart-btn" 
                                data-product-id="${product.actualId}"
                                data-product-type="${product.type}"
                                onclick="addProductToCartEN('${product.type}', '${product.actualId}', event)"
                                title="Add to Cart"
                                style="width: 42px; height: 42px; border-radius: 50%; background: white; border: 2px solid #ddd; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; color: #666;">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        
                        <!-- Order Now -->
                        <button class="icon-btn order-now-btn" 
                                data-product-id="${product.actualId}"
                                data-product-type="${product.type}"
                                onclick="orderProductNowEN('${product.type}', '${product.actualId}', event)"
                                title="Order Now"
                                style="width: 42px; height: 42px; border-radius: 50%; background: #25D366; border: 2px solid #25D366; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; color: white;">
                            <i class="fas fa-bolt"></i>
                        </button>
                        
                        <!-- WhatsApp -->
                        <button class="icon-btn whatsapp-btn" 
                                onclick="sendWhatsAppEN('${product.type}', '${product.actualId}', event)"
                                title="WhatsApp Order"
                                style="width: 42px; height: 42px; border-radius: 50%; background: #25D366; border: 2px solid #25D366; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; color: white;">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        
                        <!-- View Details -->
                        <button class="icon-btn details-btn" 
                                onclick="openCorrectProductEN('${product.type}', '${product.actualId}', '${product.source}', event)"
                                title="View Details"
                                style="width: 42px; height: 42px; border-radius: 50%; background: white; border: 2px solid #007bff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; color: #007bff;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Display products correctly in English
    function displayEnglishProducts(products, containerId, categoryName) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container not found: ${containerId}`);
            return;
        }
        
        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 15px; opacity: 0.6;"></i>
                    <h3>No Products Found</h3>
                    <p>No ${categoryName || 'products'} available at the moment</p>
                    <button onclick="location.reload()" class="btn-primary" style="margin-top: 15px;">Reload Page</button>
                </div>
            `;
            return;
        }
        
        const productsHTML = products.map((product, index) => 
            createEnglishProductCard(product, index)
        ).join('');
        
        container.innerHTML = productsHTML;
        
        console.log(`✅ Displayed ${products.length} ${categoryName || 'products'} in ${containerId}`);
        
        setTimeout(updateCartCounterEN, 300);
    }
    
    // Cart management for English
    window.addProductToCartEN = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        console.log(`🛒 Adding to cart - Type: ${productType}, ID: ${productId}`);
        
        let product = null;
        
        if (productType === 'PERFUME') {
            product = perfumesDataEN.find(p => p.actualId === productId);
        } else if (productType === 'WATCH') {
            product = watchesDataEN.find(p => p.actualId === productId);
        }
        
        if (product) {
            const cartItem = {
                id: product.actualId,
                name: product.titleEN,
                nameAR: product.title,
                price: parseFloat(product.sale_price),
                image: product.image_link,
                type: product.type,
                category: product.category,
                source: product.source,
                url: product.detailsUrl,
                quantity: 1,
                addedAt: new Date().toISOString(),
                lang: 'en'
            };
            
            let cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
            const existingIndex = cart.findIndex(item => item.id === product.actualId);
            
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
                console.log(`➕ Increased quantity for ${product.titleEN}`);
            } else {
                cart.push(cartItem);
                console.log(`✅ Added ${product.titleEN} to cart`);
            }
            
            localStorage.setItem('emirates_shopping_cart', JSON.stringify(cart));
            updateCartCounterEN();
            showSuccessMessageEN(`"${product.titleEN}" added to cart!`);
        } else {
            console.error(`❌ Product not found: ${productType} - ${productId}`);
            showErrorMessageEN('Error: Product not found');
        }
    };
    
    // Order now for English
    window.orderProductNowEN = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        console.log(`⚡ Order now - Type: ${productType}, ID: ${productId}`);
        
        window.addProductToCartEN(productType, productId, null);
        
        setTimeout(() => {
            window.open('./cart.html', '_blank');
        }, 1000);
    };
    
    // WhatsApp for English
    window.sendWhatsAppEN = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        let product = null;
        
        if (productType === 'PERFUME') {
            product = perfumesDataEN.find(p => p.actualId === productId);
        } else if (productType === 'WATCH') {
            product = watchesDataEN.find(p => p.actualId === productId);
        }
        
        if (product) {
            const message = `Hello! I want to order this product:\n\n${product.icon} ${product.titleEN}\n💰 ${parseFloat(product.sale_price).toFixed(2)} AED\n📱 From Emirates Gifts Store\n\nI would like to know about ordering and delivery details.`;
            
            const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            console.log(`💬 WhatsApp order sent: ${product.titleEN}`);
        } else {
            console.error(`❌ Product not found for WhatsApp: ${productType} - ${productId}`);
        }
    };
    
    // Open correct product
    window.openCorrectProductEN = function(productType, productId, source, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        let product = null;
        
        if (productType === 'PERFUME') {
            product = perfumesDataEN.find(p => p.actualId === productId);
        } else if (productType === 'WATCH') {
            product = watchesDataEN.find(p => p.actualId === productId);
        }
        
        if (product) {
            const correctUrl = product.detailsUrl;
            window.open(correctUrl, '_blank');
            console.log(`🔗 Opened correct English product: ${product.titleEN} - ${correctUrl}`);
        } else {
            console.error(`❌ Failed to open English product: ${productType} - ${productId}`);
        }
    };
    
    // Log product click
    window.logProductClickEN = function(productType, productId) {
        console.log(`👆 English product clicked: ${productType} - ${productId}`);
    };
    
    // Update cart counter
    function updateCartCounterEN() {
        try {
            const cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const counters = document.querySelectorAll('.cart-counter, .mobile-cart-counter');
            
            counters.forEach(counter => {
                if (counter) {
                    counter.textContent = totalItems;
                    counter.style.display = totalItems > 0 ? 'flex' : 'none';
                }
            });
        } catch (error) {
            console.error('Error updating English cart counter:', error);
        }
    }
    
    // Success message in English
    function showSuccessMessageEN(message) {
        const existing = document.querySelector('.success-notification-en');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'success-notification-en';
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #25D366, #20B358);
            color: white; padding: 15px 20px; border-radius: 10px;
            font-weight: 600; font-family: 'Inter', sans-serif;
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
            animation: slideInRight 0.4s ease; max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    // Error message in English
    function showErrorMessageEN(message) {
        const existing = document.querySelector('.error-notification-en');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'error-notification-en';
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white; padding: 15px 20px; border-radius: 10px;
            font-weight: 600; font-family: 'Inter', sans-serif;
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
            animation: slideInRight 0.4s ease; max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    // Load English homepage
    async function loadEnglishHomePage() {
        const data = await loadProductDataEN();
        
        console.log('🏠 Loading English homepage with proper separation');
        
        // Perfumes section - PERFUMES ONLY
        if (document.getElementById('perfumes-grid')) {
            displayEnglishProducts(data.perfumes.slice(0, 8), 'perfumes-grid', 'perfumes');
        }
        
        // Watches section - WATCHES ONLY
        if (document.getElementById('watches-grid')) {
            displayEnglishProducts(data.watches.slice(0, 8), 'watches-grid', 'watches');
        }
        
        // Featured products (mixed)
        if (document.getElementById('featuredProducts')) {
            const featured = [...data.perfumes.slice(0, 4), ...data.watches.slice(0, 4)];
            displayEnglishProducts(featured, 'featuredProducts', 'featured products');
        }
    }
    
    // Load English products showcase
    async function loadEnglishProductsShowcase() {
        const data = await loadProductDataEN();
        
        console.log('🛍️ Loading English products showcase');
        
        // Display all products
        displayEnglishProducts(data.all, 'allProductsGrid', 'all products');
        
        // Setup filtering
        setupEnglishFiltering(data);
    }
    
    // Setup English filtering
    function setupEnglishFiltering(data) {
        const categoryFilter = document.getElementById('categoryFilter');
        const searchInput = document.getElementById('searchInput');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                const selectedCategory = this.value;
                
                console.log(`🔍 English filter applied: ${selectedCategory}`);
                
                if (selectedCategory === 'perfumes') {
                    displayEnglishProducts(data.perfumes, 'allProductsGrid', 'perfumes');
                    console.log(`🌸 Showing ${data.perfumes.length} perfumes only`);
                } else if (selectedCategory === 'watches') {
                    displayEnglishProducts(data.watches, 'allProductsGrid', 'watches');
                    console.log(`⏰ Showing ${data.watches.length} watches only`);
                } else {
                    displayEnglishProducts(data.all, 'allProductsGrid', 'all products');
                    console.log(`🎯 Showing ${data.all.length} products (all)`);
                }
            });
        }
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchTerm = this.value.toLowerCase().trim();
                    
                    if (searchTerm === '') {
                        displayEnglishProducts(data.all, 'allProductsGrid', 'all products');
                        return;
                    }
                    
                    const filteredProducts = data.all.filter(product => 
                        product.title.toLowerCase().includes(searchTerm) ||
                        product.titleEN.toLowerCase().includes(searchTerm) ||
                        product.category.toLowerCase().includes(searchTerm)
                    );
                    
                    displayEnglishProducts(filteredProducts, 'allProductsGrid', 'search results');
                    console.log(`🔍 English search "${searchTerm}": ${filteredProducts.length} products`);
                }, 300);
            });
        }
    }
    
    // Add CSS for English version
    function addEnglishCSS() {
        if (document.querySelector('#english-products-css')) return;
        
        const style = document.createElement('style');
        style.id = 'english-products-css';
        style.textContent = `
            .english-product {
                opacity: 0;
                animation: fadeInUp 0.6s ease forwards;
                background: white;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                overflow: hidden;
                transition: all 0.4s ease;
                border: 1px solid rgba(212, 175, 55, 0.15);
                position: relative;
            }
            
            .english-product:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                border-color: rgba(212, 175, 55, 0.4);
            }
            
            .icon-btn:hover {
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 6px 15px rgba(0,0,0,0.2);
            }
            
            .add-cart-btn:hover {
                background: #D4AF37 !important;
                border-color: #D4AF37 !important;
                color: white !important;
            }
            
            .details-btn:hover {
                background: #007bff !important;
                color: white !important;
            }
            
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .icon-btn {
                    width: 38px !important;
                    height: 38px !important;
                    font-size: 1rem !important;
                }
                
                .product-actions {
                    gap: 6px !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Initialize English system
    function initializeEnglish() {
        console.log('🚀 Initializing fixed English products system');
        
        addEnglishCSS();
        
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === '' || currentPage === 'index.html') {
            loadEnglishHomePage();
        } else if (currentPage === 'products-showcase.html') {
            loadEnglishProductsShowcase();
        }
        
        updateCartCounterEN();
        
        console.log('✅ English system initialized successfully');
    }
    
    // Export for external access
    window.FixedEnglishProductsLoader = {
        loadProductDataEN,
        loadEnglishHomePage,
        loadEnglishProductsShowcase,
        displayEnglishProducts,
        createEnglishProductCard,
        updateCartCounterEN,
        getPerfumesDataEN: () => perfumesDataEN,
        getWatchesDataEN: () => watchesDataEN,
        getAllProductsDataEN: () => allProductsDataEN,
        translateTitle
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEnglish);
    } else {
        initializeEnglish();
    }
    
    console.log('🎯 Fixed English Products System: Complete separation of perfumes and watches');
    console.log('🔧 Features: Correct display, proper URLs, functional buttons, accurate translations');
    
})();