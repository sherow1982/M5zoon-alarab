// Enhanced Dynamic Product Loading and Display System - Emirates Gifts Store English Version
// PROFESSIONAL FIX: Proper category separation - perfumes → perfumes only, watches → watches only
// Iconic buttons + advanced features + open in new tab + automatic descriptions

(function() {
    'use strict';
    
    let allProducts = [];
    let perfumesOnly = [];
    let watchesOnly = [];
    let isLoading = false;
    
    console.log('🎯 INITIALIZING ENGLISH PRODUCTS SYSTEM WITH CATEGORY FIX');
    
    // Generate safe English slug
    function englishSlugify(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Keep only alphanumeric, spaces, and hyphens
            .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/-+/g, '-') // Remove multiple consecutive hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
    
    // Build pretty URL path
    function buildPrettyURL(product) {
        const slug = englishSlugify(product.title || product.name);
        return `./product-details.html?id=${product.id}&category=${product.categoryEn}&slug=${encodeURIComponent(slug)}`;
    }
    
    // Simple but effective Arabic to English translation
    function translateToEnglish(arabicTitle) {
        if (!arabicTitle) return 'Premium Product';
        
        // If already in English, return as is
        if (!/[\u0600-\u06FF]/.test(arabicTitle)) {
            return arabicTitle;
        }
        
        const translations = {
            // Perfume brands
            'شانيل كوكو': 'Chanel Coco',
            'ديور سوفاج': 'Dior Sauvage',
            'توم فورد': 'Tom Ford',
            'أرماني': 'Armani',
            'فرزاتشي': 'Versace',
            'جوتشي فلورا': 'Gucci Flora',
            'جوتشي بلوم': 'Gucci Bloom',
            'العطر الشرقي': 'Oriental Perfume',
            'عطر البراءة': 'Al-Baraa Premium Oud',
            'عطر الورد': 'Rose Perfume',
            'عطر العود': 'Oud Fragrance',
            'عطر المسك': 'Musk Perfume',
            // Watch brands
            'رولكس يخت ماستر فضي': 'Rolex Yacht Master Silver',
            'رولكس كلاسيكية': 'Rolex Classic',
            'أوميغا سواتش': 'Omega Swatch',
            'بولغاري سربنتي': 'Bulgari Serpenti',
            'أوديمار بيغيه رويال': 'Audemars Piguet Royal',
            'ساعة الكعبة': 'Kaaba Design Watch',
            // Common terms
            'عطر': 'Perfume',
            'ساعة': 'Watch',
            'فاخر': 'Luxury',
            'ممتاز': 'Premium',
            'عالي الجودة': 'High Quality',
            'ذهبي': 'Gold',
            'فضي': 'Silver',
            'أزرق': 'Blue',
            'أحمر': 'Red',
            'أسود': 'Black',
            'أبيض': 'White',
            'برتقالي': 'Orange',
            'ملل': 'ml',
            'ملم': 'mm',
            'رجالي': 'Men\'s',
            'نسائي': 'Women\'s',
            'للجنسين': 'Unisex'
        };
        
        let englishTitle = arabicTitle;
        
        // Apply translations
        Object.keys(translations).forEach(arabic => {
            const regex = new RegExp(arabic, 'gi');
            englishTitle = englishTitle.replace(regex, translations[arabic]);
        });
        
        // If still contains Arabic, use contextual names
        if (/[\u0600-\u06FF]/.test(englishTitle)) {
            const isWatch = arabicTitle.includes('ساعة') || arabicTitle.includes('رولكس') || arabicTitle.includes('أوميغا');
            const isPerfume = arabicTitle.includes('عطر') || arabicTitle.includes('شانيل') || arabicTitle.includes('ديور');
            
            if (isWatch) {
                const watchNames = [
                    'Premium Luxury Watch', 'Elegant Swiss Timepiece', 'Professional Watch',
                    'Luxury Gold Watch', 'Premium Steel Watch', 'Designer Watch Collection',
                    'Swiss Movement Watch', 'Classic Dress Watch', 'Sport Luxury Watch'
                ];
                englishTitle = watchNames[Math.floor(Math.random() * watchNames.length)];
            } else if (isPerfume) {
                const perfumeNames = [
                    'Premium Oriental Perfume', 'Luxury Eastern Fragrance', 'Designer Perfume',
                    'Premium French Perfume', 'Exclusive Arabian Scent', 'Luxury Fragrance Collection',
                    'Premium Oud Perfume', 'Elegant Floral Perfume', 'Sophisticated Musk Fragrance'
                ];
                englishTitle = perfumeNames[Math.floor(Math.random() * perfumeNames.length)];
            } else {
                englishTitle = 'Premium Luxury Product';
            }
        }
        
        return englishTitle.replace(/\s+/g, ' ').trim();
    }
    
    async function loadAllProducts() {
        if (isLoading) return { allProducts, perfumesOnly, watchesOnly };
        isLoading = true;
        
        try {
            console.log('🔄 LOADING PRODUCTS WITH STRICT CATEGORY SEPARATION...');
            
            // Load perfumes ONLY from otor.json
            const perfumesResponse = await fetch('../data/otor.json').catch(() => ({ ok: false }));
            if (perfumesResponse.ok) {
                const perfumesData = await perfumesResponse.json();
                perfumesOnly = perfumesData.map((p, index) => ({
                    ...p,
                    id: p.id || `perfume_${index + 1}`,
                    title: translateToEnglish(p.title || p.name),
                    category: 'Perfumes',
                    categoryEn: 'perfume',
                    categoryIcon: '🌸',
                    type: 'perfume',
                    source: 'otor.json'
                }));
                console.log(`🌸 PERFUMES LOADED: ${perfumesOnly.length} perfumes from otor.json`);
            }
            
            // Load watches ONLY from sa3at.json
            const watchesResponse = await fetch('../data/sa3at.json').catch(() => ({ ok: false }));
            if (watchesResponse.ok) {
                const watchesData = await watchesResponse.json();
                watchesOnly = watchesData.map((p, index) => ({
                    ...p,
                    id: p.id || `watch_${index + 1}`,
                    title: translateToEnglish(p.title || p.name),
                    category: 'Watches',
                    categoryEn: 'watch',
                    categoryIcon: '⏰',
                    type: 'watch',
                    source: 'sa3at.json'
                }));
                console.log(`⏰ WATCHES LOADED: ${watchesOnly.length} watches from sa3at.json`);
            }
            
            // IMPORTANT: Keep categories separate!
            allProducts = [...perfumesOnly, ...watchesOnly];
            
            console.log('✅ CATEGORY SEPARATION COMPLETE:');
            console.log(`📊 Total products: ${allProducts.length}`);
            console.log(`🌸 Perfumes only: ${perfumesOnly.length}`);
            console.log(`⏰ Watches only: ${watchesOnly.length}`);
            
        } catch (error) {
            console.error('❌ Error loading English products:', error);
            generateFallbackProducts();
        }
        
        isLoading = false;
        return { allProducts, perfumesOnly, watchesOnly };
    }
    
    function generateFallbackProducts() {
        console.log('🔧 Generating English fallback products with proper categorization...');
        
        perfumesOnly = [
            {
                id: 'perfume_1',
                title: 'Chanel Coco Premium Perfume 100ml',
                sale_price: '345.00',
                price: '450.00',
                image_link: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
                category: 'Perfumes',
                categoryEn: 'perfume',
                categoryIcon: '🌸',
                type: 'perfume'
            },
            {
                id: 'perfume_4',
                title: 'Dior Sauvage Premium Fragrance',
                sale_price: '380.00',
                price: '480.00',
                image_link: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop',
                category: 'Perfumes',
                categoryEn: 'perfume',
                categoryIcon: '🌸',
                type: 'perfume'
            }
        ];
        
        watchesOnly = [
            {
                id: 'watch_1',
                title: 'Rolex Yacht Master Silver Premium',
                sale_price: '1850.00',
                price: '2200.00',
                image_link: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
                category: 'Watches',
                categoryEn: 'watch',
                categoryIcon: '⏰',
                type: 'watch'
            },
            {
                id: 'watch_88',
                title: 'Rolex Kaaba Design Special Edition',
                sale_price: '2450.00',
                price: '2950.00',
                image_link: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop',
                category: 'Watches',
                categoryEn: 'watch',
                categoryIcon: '⏰',
                type: 'watch'
            }
        ];
        
        allProducts = [...perfumesOnly, ...watchesOnly];
        console.log('✅ English fallback products generated with proper categories');
    }
    
    function createProductCard(product, index = 0) {
        const hasDiscount = parseFloat(product.price) !== parseFloat(product.sale_price);
        const discountPercentage = hasDiscount ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100) : 0;
        const prettyUrl = buildPrettyURL(product);
        
        // Get ratings from persistent system
        let averageRating = 4.5;
        let totalReviews = 12;
        let starsHTML = '★★★★☆';
        
        if (window.persistentReviews) {
            const productReviews = window.persistentReviews.getProductReviews(product.id);
            if (productReviews) {
                averageRating = parseFloat(productReviews.averageRating);
                totalReviews = productReviews.totalCount;
                starsHTML = generateStarsHTML(averageRating);
            }
        }
        
        // Automatic contextual description for product type
        let productDescription = '';
        if (product.type === 'perfume') {
            productDescription = 'Premium perfume with exceptional quality composition and distinctive fragrance that lasts elegantly all day';
        } else if (product.type === 'watch') {
            productDescription = 'High-quality watch with elegant design and professional specifications perfect for all occasions';
        } else {
            productDescription = 'Premium quality product with excellent specifications and distinctive design at the best prices';
        }
        
        return `
            <div class="product-card emirates-element" 
                 data-product-id="${product.id}" 
                 data-category="${product.categoryEn}" 
                 data-product-name="${product.title.replace(/'/g, "\'")}"
                 data-product-price="${product.sale_price}"
                 data-product-type="${product.type}"
                 style="animation-delay: ${index * 0.1}s; text-align: center; cursor: pointer;"
                 onclick="openProductInNewTab('${prettyUrl}', event)">
                 
                <div class="product-image-container">
                    <img src="${product.image_link}" 
                         alt="${product.title}" 
                         class="product-image"
                         loading="${index < 6 ? 'eager' : 'lazy'}"
                         onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=Emirates+Gifts'">
                    
                    ${hasDiscount ? 
                        `<div class="product-badge discount-badge">${discountPercentage}% OFF</div>` : 
                        `<div class="product-badge new-badge">NEW</div>`
                    }
                    
                    <div class="product-category-badge" data-category="${product.type}">
                        ${product.categoryIcon} ${product.category}
                    </div>
                </div>
                
                <div class="product-info">
                    <h3 class="product-title">
                        <a href="${prettyUrl}" target="_blank" class="product-title-link">
                            ${product.title}
                        </a>
                    </h3>
                    
                    <!-- Automatic Description -->
                    <div class="product-description">
                        ${productDescription}
                    </div>
                    
                    <!-- Price -->
                    <div class="product-price">
                        <span class="current-price">${parseFloat(product.sale_price).toFixed(2)}</span>
                        ${hasDiscount ? `<span class="original-price">${parseFloat(product.price).toFixed(2)}</span>` : ''}
                    </div>
                    
                    <!-- Reviews -->
                    <div class="product-rating-display">
                        <div class="stars">${starsHTML}</div>
                        <span class="rating-number">${averageRating.toFixed(1)}</span>
                        <span class="reviews-count">(${totalReviews})</span>
                        <span class="verified-badge">✓ Verified</span>
                    </div>
                    
                    <!-- Iconic Action Buttons -->
                    <div class="card-actions-container">
                        <button class="icon-btn cart-icon-btn" 
                                onclick="addProductToCart('${product.id}', event)"
                                title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="btn-tooltip">Add to Cart</span>
                        </button>
                        
                        <button class="icon-btn order-now-icon-btn" 
                                onclick="orderProductNow('${product.id}', event)"
                                title="Order Now">
                            <i class="fas fa-bolt"></i>
                            <span class="btn-tooltip">Order Now</span>
                        </button>
                        
                        <button class="icon-btn whatsapp-icon-btn" 
                                onclick="sendWhatsAppOrderEN('${product.id}', event)"
                                title="WhatsApp Order">
                            <i class="fab fa-whatsapp"></i>
                            <span class="btn-tooltip">WhatsApp</span>
                        </button>
                        
                        <button class="icon-btn details-icon-btn" 
                                onclick="openProductInNewTab('${prettyUrl}', event)"
                                title="View Details">
                            <i class="fas fa-eye"></i>
                            <span class="btn-tooltip">Details</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Generate star rating HTML
    function generateStarsHTML(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        
        if (hasHalfStar) {
            stars += '☆';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }
        
        return stars;
    }
    
    // Display products in specified container
    function displayProducts(products, containerId, limit = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`❌ Container not found: ${containerId}`);
            return;
        }
        
        const productsToShow = limit ? products.slice(0, limit) : products;
        
        console.log(`📍 DISPLAYING IN ${containerId}:`, {
            requested: products.length,
            showing: productsToShow.length,
            types: productsToShow.map(p => p.type)
        });
        
        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No matching products</h3>
                    <p>Sorry, no products match your criteria.</p>
                    <button onclick="location.reload()" class="btn-primary">Reload</button>
                </div>
            `;
            return;
        }
        
        const productsHTML = productsToShow.map((product, index) => 
            createProductCard(product, index)
        ).join('');
        
        container.innerHTML = productsHTML;
        
        // Apply enhancements
        setTimeout(() => {
            updateCartBadge();
            if (window.enhancedProductCards) {
                window.enhancedProductCards.enhanceAllCards();
            }
        }, 300);
        
        console.log(`✅ Successfully displayed ${productsToShow.length} products in ${containerId}`);
    }
    
    async function loadHomePageProducts() {
        const { allProducts: products, perfumesOnly: perfumes, watchesOnly: watches } = await loadAllProducts();
        
        console.log('🎯 STARTING HOMEPAGE DISPLAY WITH CATEGORY SEPARATION:');
        console.log(`📊 Available - Perfumes: ${perfumes.length}, Watches: ${watches.length}`);
        
        // Wait for reviews system
        const waitForReviews = setInterval(() => {
            if (window.persistentReviews && window.persistentReviews.isInitialized) {
                clearInterval(waitForReviews);
                displayHomeProducts();
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(waitForReviews);
            displayHomeProducts();
        }, 5000);
        
        function displayHomeProducts() {
            // PERFUMES SECTION - ONLY PERFUMES!
            if (document.getElementById('perfumes-grid')) {
                console.log(`🌸 DISPLAYING PERFUMES ONLY: ${perfumes.length} perfumes → perfumes-grid`);
                displayProducts(perfumes, 'perfumes-grid', 8);
            }
            
            // WATCHES SECTION - ONLY WATCHES!
            if (document.getElementById('watches-grid')) {
                console.log(`⏰ DISPLAYING WATCHES ONLY: ${watches.length} watches → watches-grid`);
                displayProducts(watches, 'watches-grid', 8);
            }
            
            // Featured products - Mixed but balanced
            if (document.getElementById('featuredProducts')) {
                const featuredPerfumes = perfumes.slice(0, 6);
                const featuredWatches = watches.slice(0, 6);
                const featuredMixed = [...featuredPerfumes, ...featuredWatches]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 12);
                displayProducts(featuredMixed, 'featuredProducts', 12);
                console.log(`🌟 Displayed mixed featured: ${featuredMixed.length} (${featuredPerfumes.length} perfumes + ${featuredWatches.length} watches)`);
            }
            
            // Best deals
            if (document.getElementById('bestDeals')) {
                const bestDeals = products
                    .filter(p => parseFloat(p.price || 0) > parseFloat(p.sale_price || 0))
                    .sort((a, b) => (parseFloat(b.price || 0) - parseFloat(b.sale_price || 0)) - (parseFloat(a.price || 0) - parseFloat(a.sale_price || 0)))
                    .slice(0, 6);
                displayProducts(bestDeals, 'bestDeals', 6);
                console.log(`🔥 Displayed best deals: ${bestDeals.length} products`);
            }
            
            console.log('🎆 HOMEPAGE DISPLAY COMPLETE - CATEGORIES PROPERLY SEPARATED!');
        }
    }
    
    // Global button functions
    window.addProductToCart = function(productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        const product = allProducts.find(p => p.id.toString() === productId.toString());
        if (product) {
            addToCart(product);
            console.log(`🛒 Added ${product.title} to cart`);
        } else {
            console.error(`❌ Product not found: ${productId}`);
        }
    };
    
    window.orderProductNow = function(productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        const product = allProducts.find(p => p.id.toString() === productId.toString());
        if (product) {
            orderNow(product);
            console.log(`⚡ Ordered ${product.title} instantly`);
        } else {
            console.error(`❌ Product not found for ordering: ${productId}`);
        }
    };
    
    window.sendWhatsAppOrderEN = function(productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        const product = allProducts.find(p => p.id.toString() === productId.toString());
        if (product) {
            const message = `Hello! I would like to order this product:

🎁 ${product.title}
💰 ${product.sale_price} AED
📱 From Emirates Gifts Store

I would like to know about ordering details and delivery within UAE.`;
            const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            console.log(`💬 Sent WhatsApp order for ${product.title}`);
        } else {
            console.error(`❌ Product not found for WhatsApp: ${productId}`);
        }
    };
    
    window.openProductInNewTab = function(url, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        window.open(url, '_blank');
    };
    
    // Cart functions (compatible with main system)
    function addToCart(product) {
        const productData = {
            id: product.id,
            name: product.title,
            price: parseFloat(product.sale_price),
            priceText: product.sale_price + ' AED',
            image: product.image_link,
            url: buildPrettyURL(product),
            quantity: 1,
            timestamp: new Date().toISOString()
        };
        
        if (window.EmiratesCart) {
            window.EmiratesCart.addToCartQuick(productData);
        } else {
            let cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
            const existingIndex = cart.findIndex(item => item.id === product.id);
            
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push(productData);
            }
            
            localStorage.setItem('emirates_shopping_cart', JSON.stringify(cart));
            updateCartBadge();
            showCartSuccess(product.title);
        }
    }
    
    function orderNow(product) {
        addToCart(product);
        setTimeout(() => {
            window.open('./cart.html', '_blank');
        }, 1000);
    }
    
    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const badges = document.querySelectorAll('.cart-counter, .cart-badge, #cartBadge');
        
        badges.forEach(badge => {
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        });
    }
    
    function showCartSuccess(productTitle) {
        const existingMsg = document.querySelector('.cart-success-popup');
        if (existingMsg) existingMsg.remove();
        
        const successMsg = document.createElement('div');
        successMsg.className = 'cart-success-popup';
        successMsg.style.cssText = `
            position: fixed; top: 90px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #25D366, #20B358);
            color: white; padding: 15px 20px; border-radius: 12px;
            font-weight: 600; box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
            animation: slideInRight 0.4s ease-out;
            max-width: 300px; font-size: 14px;
            font-family: 'Inter', sans-serif;
        `;
        
        successMsg.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <i class="fas fa-check-circle"></i>
                <span>Added "${productTitle}" to cart!</span>
            </div>
            <div style="display: flex; gap: 8px;">
                <a href="./cart.html" target="_blank" style="background: rgba(255,255,255,0.2); color: white; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 600;">
                    <i class="fas fa-shopping-cart"></i> Cart
                </a>
                <a href="./checkout.html" target="_blank" style="background: rgba(255,255,255,0.2); color: white; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 600;">
                    <i class="fas fa-credit-card"></i> Order Now
                </a>
            </div>
        `;
        
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 5000);
    }
    
    // Specific functions for category loading
    window.loadPerfumesOnlyEN = async function(containerId, limit = 8) {
        const { perfumesOnly } = await loadAllProducts();
        console.log(`🌸 PERFUMES ONLY FUNCTION: ${perfumesOnly.length} perfumes → ${containerId}`);
        displayProducts(perfumesOnly, containerId, limit);
    };
    
    window.loadWatchesOnlyEN = async function(containerId, limit = 8) {
        const { watchesOnly } = await loadAllProducts();
        console.log(`⏰ WATCHES ONLY FUNCTION: ${watchesOnly.length} watches → ${containerId}`);
        displayProducts(watchesOnly, containerId, limit);
    };
    
    function addProductsCSS() {
        if (!document.querySelector('#products-loader-css-en')) {
            const style = document.createElement('style');
            style.id = 'products-loader-css-en';
            style.textContent = `
                .product-card {
                    background: white; border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    overflow: hidden; transition: all 0.4s ease; border: 1px solid rgba(212, 175, 55, 0.15);
                    position: relative; cursor: pointer; text-align: center; direction: ltr;
                    opacity: 0; animation: fadeInUp 0.6s ease-out forwards;
                }
                .product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); border-color: rgba(212, 175, 55, 0.4); }
                .product-category-badge { position: absolute; top: 10px; right: 10px; background: rgba(212, 175, 55, 0.95);
                    color: #2c3e50; padding: 6px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 600;
                    z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
                .product-category-badge[data-category="perfume"] { background: rgba(255, 192, 203, 0.9); color: #8B0000; }
                .product-category-badge[data-category="watch"] { background: rgba(135, 206, 235, 0.9); color: #000080; }
                .icon-btn { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #ddd; background: white;
                    display: flex; align-items: center; justify-content: center; cursor: pointer;
                    transition: all 0.3s ease; position: relative; font-size: 1.2rem; color: #666;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .icon-btn:hover { background: #D4AF37; border-color: #D4AF37; color: white;
                    transform: translateY(-3px) scale(1.1); box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4); }
                .icon-btn.order-now-icon-btn { background: linear-gradient(135deg, #25D366, #20B358);
                    color: white; border-color: #25D366; }
                .icon-btn.order-now-icon-btn:hover { background: linear-gradient(135deg, #20B358, #1e8449) !important;
                    box-shadow: 0 6px 20px rgba(32, 179, 88, 0.4); }
                .icon-btn.whatsapp-icon-btn { background: #25D366; color: white; border-color: #25D366; }
                .icon-btn.whatsapp-icon-btn:hover { background: #20B358 !important;
                    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); }
                .card-actions-container { display: flex; justify-content: center; gap: 8px; margin-top: 15px;
                    padding: 10px 0; flex-wrap: wrap; }
                .product-description { font-size: 0.85rem; color: #666; margin: 8px 0; line-height: 1.4;
                    text-align: center; padding: 0 10px; direction: ltr; }
                .product-price { margin: 12px 0; text-align: center; }
                .current-price { font-size: 1.4rem; font-weight: 900; color: #27ae60; }
                .current-price::after { content: ' AED'; font-size: 1rem; font-weight: 600; color: #D4AF37; }
                .original-price { font-size: 1rem; color: #e74c3c; text-decoration: line-through; margin-left: 10px; }
                .original-price::after { content: ' AED'; font-size: 0.9rem; }
                .product-rating-display { display: flex; align-items: center; justify-content: center; gap: 8px;
                    margin: 12px 0; padding: 8px 12px; background: rgba(255, 215, 0, 0.1);
                    border-radius: 8px; border: 1px solid rgba(255, 215, 0, 0.3); }
                .stars { color: #FFD700; font-size: 1rem; }
                .rating-number { font-weight: bold; color: #D4AF37; font-size: 0.9rem; }
                .reviews-count { color: #666; font-size: 0.85rem; }
                .verified-badge { background: #25D366; color: white; padding: 2px 6px; border-radius: 8px;
                    font-size: 0.7rem; font-weight: 600; }
                .btn-tooltip { position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%);
                    background: rgba(0,0,0,0.9); color: white; padding: 6px 12px; border-radius: 8px;
                    font-size: 0.75rem; opacity: 0; transition: all 0.3s ease; white-space: nowrap;
                    z-index: 1001; font-weight: 600; pointer-events: none; }
                .icon-btn:hover .btn-tooltip { opacity: 1; bottom: -35px; }
                @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes slideInRight { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
            `;
            document.head.appendChild(style);
        }
    }
    
    function init() {
        addProductsCSS();
        
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === '' || currentPage === 'index.html') {
            console.log('🏠 Initializing English homepage products...');
            loadHomePageProducts();
        } else if (currentPage === 'products-showcase.html') {
            console.log('🏪 Initializing English products showcase...');
            loadProductsShowcase();
        }
        
        updateCartBadge();
        console.log('🚀 English products system initialized with PROFESSIONAL CATEGORY FIX');
    }
    
    async function loadProductsShowcase() {
        const { allProducts: products, perfumesOnly: perfumes, watchesOnly: watches } = await loadAllProducts();
        
        const waitForReviews = setInterval(() => {
            if (window.persistentReviews && window.persistentReviews.isInitialized) {
                clearInterval(waitForReviews);
                displayProducts(products, 'allProductsGrid');
                setupFiltering(products, perfumes, watches);
                setupSorting();
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(waitForReviews);
            displayProducts(products, 'allProductsGrid');
            setupFiltering(products, perfumes, watches);
            setupSorting();
        }, 5000);
    }
    
    function setupFiltering(allProducts, perfumesOnly, watchesOnly) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('searchInput');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                let filteredProducts = allProducts;
                
                if (filter === 'perfumes') {
                    filteredProducts = perfumesOnly; // Use dedicated perfumes array!
                    console.log(`🌸 FILTER APPLIED - PERFUMES ONLY: ${filteredProducts.length} perfumes`);
                } else if (filter === 'watches') {
                    filteredProducts = watchesOnly; // Use dedicated watches array!
                    console.log(`⏰ FILTER APPLIED - WATCHES ONLY: ${filteredProducts.length} watches`);
                } else {
                    filteredProducts = allProducts;
                    console.log(`🎯 FILTER APPLIED - ALL PRODUCTS: ${filteredProducts.length} products`);
                }
                
                displayProducts(filteredProducts, 'allProductsGrid');
            });
        });
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchTerm = this.value.toLowerCase().trim();
                    if (searchTerm === '') {
                        displayProducts(allProducts, 'allProductsGrid');
                        return;
                    }
                    
                    const filteredProducts = allProducts.filter(product => 
                        product.title.toLowerCase().includes(searchTerm) ||
                        product.category.toLowerCase().includes(searchTerm)
                    );
                    displayProducts(filteredProducts, 'allProductsGrid');
                    console.log(`🔍 Search results for "${searchTerm}": ${filteredProducts.length} products`);
                }, 300);
            });
        }
    }
    
    function setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                const sortType = this.value;
                let sortedProducts = [...allProducts];
                
                switch (sortType) {
                    case 'price-low':
                        sortedProducts.sort((a, b) => parseFloat(a.sale_price) - parseFloat(b.sale_price));
                        break;
                    case 'price-high':
                        sortedProducts.sort((a, b) => parseFloat(b.sale_price) - parseFloat(a.sale_price));
                        break;
                    case 'rating':
                        sortedProducts.sort((a, b) => {
                            const ratingA = window.persistentReviews ? 
                                parseFloat(window.persistentReviews.getProductReviews(a.id)?.averageRating || 4.5) : 4.5;
                            const ratingB = window.persistentReviews ? 
                                parseFloat(window.persistentReviews.getProductReviews(b.id)?.averageRating || 4.5) : 4.5;
                            return ratingB - ratingA;
                        });
                        break;
                    default:
                        break;
                }
                
                displayProducts(sortedProducts, 'allProductsGrid');
            });
        }
    }
    
    // Global exports
    window.ProductsLoaderEN = {
        loadAllProducts,
        loadHomePageProducts, 
        loadProductsShowcase,
        loadPerfumesOnlyEN: window.loadPerfumesOnlyEN,
        loadWatchesOnlyEN: window.loadWatchesOnlyEN,
        displayProducts,
        createProductCard,
        setupFiltering,
        setupSorting,
        getAllProducts: () => allProducts,
        getPerfumesOnly: () => perfumesOnly,
        getWatchesOnly: () => watchesOnly,
        englishSlugify,
        translateToEnglish,
        buildPrettyURL,
        addToCart,
        orderNow,
        updateCartBadge,
        generateStarsHTML
    };
    
    // Backwards compatibility
    window.ProductsLoader = window.ProductsLoaderEN;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('🎯 PROFESSIONAL ENGLISH PRODUCTS FIX COMPLETE');
    console.log('✅ Perfumes section will show ONLY perfumes');
    console.log('✅ Watches section will show ONLY watches');
    console.log('✅ No more category mixing!');
    
})();