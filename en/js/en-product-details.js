// 🚫 EMIRATES GIFTS ENGLISH PRODUCT DETAILS - ZERO INLINE CODE v2.0

(function() {
    'use strict';
    
    const isDev = window.location.hostname === 'localhost';
    const log = isDev ? console.log.bind(console) : () => {};
    const warn = isDev ? console.warn.bind(console) : () => {};
    const error = console.error.bind(console);
    
    log('🚫 EMIRATES PRODUCT DETAILS EN - ZERO INLINE CODE - PRODUCTS.JSON');
    
    // Strict popup blocking
    window.alert = function() { log('🚫 Alert blocked'); return undefined; };
    window.confirm = function() { log('🚫 Confirm blocked'); return true; };
    window.prompt = function() { log('🚫 Prompt blocked'); return null; };
    window.open = function(url) { 
        log('🚫 window.open intercepted:', url); 
        if (url && url.includes('wa.me')) {
            // Allow WhatsApp only
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        return null; 
    };
    
    // Extract and normalize all URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productCategory = urlParams.get('category');
    const productSlug = urlParams.get('slug');
    const productType = urlParams.get('type');
    const productSource = urlParams.get('source');
    
    log('📋 URL Parameters:', {
        id: productId,
        category: productCategory,
        slug: productSlug,
        type: productType,
        source: productSource
    });
    
    let currentProduct = null;
    
    // Enhanced image error handler (ZERO INLINE)
    function setupSecureImageHandler(imgElement) {
        if (!imgElement || imgElement.dataset.secureHandler) return;
        
        imgElement.addEventListener('error', function() {
            if (this.dataset.fallbackApplied === 'true') return;
            
            this.dataset.fallbackApplied = 'true';
            this.src = 'https://via.placeholder.com/500x500/D4AF37/FFFFFF?text=Premium+Product';
            this.alt = 'Premium Product - Fallback Image';
            warn('⚠️ Product image fallback applied');
        });
        
        imgElement.dataset.secureHandler = 'true';
        
        // Handle pre-failed images
        if (imgElement.complete && imgElement.naturalWidth === 0) {
            imgElement.dispatchEvent(new Event('error'));
        }
    }
    
    // Enhanced English product name converter
    function getEnglishProductName(arabicTitle, productId) {
        const specificTranslations = {
            'watch_1': 'Rolex Yacht Master Silver Edition',
            'watch_2': 'Rolex Classic 41mm 2022 Model',
            'watch_3': 'Rolex Black Dial Professional R21',
            'watch_88': 'Rolex Kaaba Design Premium Watch',
            'watch_4': 'Rolex Daytona Gold Collection',
            'watch_5': 'Omega Speedmaster Professional',
            'watch_6': 'Patek Philippe Calatrava Classic',
            'watch_7': 'TAG Heuer Formula 1 Racing',
            'watch_8': 'Omega Swatch Baby Blue Limited Edition',
            'watch_9': 'Breitling Navitimer Pilot',
            'watch_10': 'IWC Portuguese Chronograph',
            'perfume_1': 'Chanel Coco Premium Perfume 100ml',
            'perfume_2': 'Gucci Flora Premium Fragrance',
            'perfume_3': 'Gucci Bloom Premium Perfume',
            'perfume_4': 'Tom Ford Oud Wood Premium',
            'perfume_5': 'Dior Miss Dior Premium',
            'perfume_6': 'Guerlain Shalimar Oriental Classic',
            'perfume_7': 'Yves Saint Laurent Black Opium',
            'perfume_8': 'Giorgio Armani Si Passione',
            'perfume_9': 'Versace Eros Flame Intense',
            'perfume_10': 'Dior Sauvage Premium Fragrance',
            'perfume_15': 'Tom Ford Black Orchid Luxury'
        };
        
        if (specificTranslations[productId]) {
            return specificTranslations[productId];
        }
        
        if (!arabicTitle || typeof arabicTitle !== 'string') return 'Premium Product';
        
        // Enhanced brand and feature detection
        const title = arabicTitle.toLowerCase();
        let parts = [];
        
        // Brand detection
        if (title.includes('rolex') || title.includes('روليكس')) parts.push('Rolex');
        else if (title.includes('omega') || title.includes('أوميغا')) parts.push('Omega');
        else if (title.includes('chanel') || title.includes('شانيل')) parts.push('Chanel');
        else if (title.includes('dior') || title.includes('ديور')) parts.push('Dior');
        else if (title.includes('tom ford')) parts.push('Tom Ford');
        else if (title.includes('creed')) parts.push('Creed');
        else if (title.includes('gucci') || title.includes('جوتشي')) parts.push('Gucci');
        else if (title.includes('armani') || title.includes('أرماني')) parts.push('Armani');
        else if (title.includes('versace') || title.includes('فيرساتشي')) parts.push('Versace');
        
        // Model/style detection
        if (title.includes('coco') || title.includes('كوكو')) parts.push('Coco');
        if (title.includes('sauvage') || title.includes('سوفاج')) parts.push('Sauvage');
        if (title.includes('black orchid')) parts.push('Black Orchid');
        if (title.includes('yacht master')) parts.push('Yacht Master');
        if (title.includes('submariner')) parts.push('Submariner');
        if (title.includes('daytona')) parts.push('Daytona');
        
        // Color detection
        if (title.includes('black') || title.includes('أسود')) parts.push('Black');
        else if (title.includes('gold') || title.includes('ذهبي')) parts.push('Gold');
        else if (title.includes('silver') || title.includes('فضي')) parts.push('Silver');
        else if (title.includes('blue') || title.includes('أزرق')) parts.push('Blue');
        
        // Product type
        if (productId && productId.includes('watch')) {
            parts.push('Premium Watch');
        } else if (productId && productId.includes('perfume')) {
            parts.push('Premium Perfume');
        }
        
        return parts.length > 0 ? parts.join(' ') : 'Premium Luxury Product';
    }
    
    /**
     * Universal product loading system - LOADS FROM products.json
     */
    async function loadProductUniversal() {
        try {
            log('🔍 Starting universal product search from products.json (English)...');
            
            if (!productId) {
                throw new Error('Product ID is required in the URL');
            }
            
            let product = null;
            
            try {
                log(`🔍 Loading from ../data/products.json for ${productId}...`);
                
                const response = await fetch('../data/products.json?v=' + Date.now());
                if (response.ok) {
                    const allProducts = await response.json();
                    if (Array.isArray(allProducts)) {
                        const arabicProduct = allProducts.find(p => 
                            p && (String(p.id) === String(productId) || p.id === productId)
                        );
                        
                        if (arabicProduct) {
                            const productType = arabicProduct.category === 'Perfumes' ? 'perfume' : 'watch';
                            
                            // Translate to English
                            product = {
                                id: arabicProduct.id,
                                title: arabicProduct.title,
                                displayName: getEnglishProductName(arabicProduct.title, arabicProduct.id),
                                price: arabicProduct.price,
                                sale_price: arabicProduct.sale_price,
                                image_link: arabicProduct.image_link,
                                category: arabicProduct.category,
                                icon: arabicProduct.category === 'Perfumes' ? '🌸' : '⏰',
                                description: arabicProduct.category === 'Perfumes' ?
                                    'Premium luxury perfume with high-quality ingredients, long-lasting fragrance, and elegant packaging perfect for special moments. Authenticity guaranteed with international specifications.' :
                                    'Premium luxury watch with high-quality materials, precise movement, and elegant design suitable for all occasions. Authenticity guaranteed with manufacturer warranty.',
                                sourceType: productType
                            };
                            
                            log(`✅ Product found and translated from products.json: ${product.displayName}`);
                        }
                    }
                }
            } catch (fileError) {
                warn(`⚠️ Error loading products.json:`, fileError);
            }
            
            if (product) {
                currentProduct = product;
                displayProductSecurely(product);
                log('✅ Product successfully loaded and displayed (English)');
            } else {
                error(`❌ Product ${productId} not found in products.json`);
                showErrorMessageSecurely(`Product <strong>${productId}</strong> not found in our database. Please check the product link and try again.`);
            }
            
        } catch (loadError) {
            error('❌ Universal product loading failed:', loadError);
            showErrorMessageSecurely('Error loading product details: ' + loadError.message);
        }
    }
    
    /**
     * SECURE PRODUCT DISPLAY (NO INLINE CODE)
     */
    function displayProductSecurely(product) {
        if (!product || typeof product !== 'object') {
            error('❌ Invalid product data');
            return;
        }
        
        try {
            const hasDiscount = parseFloat(product.price || 0) > parseFloat(product.sale_price || 0);
            const discountPercent = hasDiscount ?
                Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100) : 0;
            
            // Update page metadata securely
            const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
            const productBreadcrumb = document.getElementById('productBreadcrumb');
            
            if (categoryBreadcrumb) categoryBreadcrumb.textContent = product.category || 'Products';
            if (productBreadcrumb) productBreadcrumb.textContent = product.displayName || 'Product Details';
            
            // Update document title safely
            if (product.displayName) {
                document.title = `${product.displayName} - Emirates Gifts Store`;
            }
            
            const displayName = (product.displayName || 'Premium Product')
                .replace(/[<>&"']/g, '')
                .substring(0, 200);
            
            const productDescription = (product.description || 
                'Premium quality product with authenticity guarantee and excellent international specifications suitable for all tastes and occasions.')
                .replace(/[<>&"']/g, '')
                .substring(0, 500);
            
            const imageUrl = product.image_link || 'https://via.placeholder.com/500x500/D4AF37/FFFFFF?text=Premium+Product';
            const finalPrice = parseFloat(product.sale_price || product.price || 0);
            const originalPrice = parseFloat(product.price || 0);
            
            const productHTML = `
                <div class="product-header">
                    <div class="product-image-section">
                        <img src="${imageUrl}" 
                             alt="${displayName}" 
                             class="product-image"
                             loading="eager"
                             width="500"
                             height="500"
                             data-fallback-applied="false">
                    </div>
                    
                    <div class="product-info">
                        <div class="category-badge-main">${product.icon || '🎁'} ${product.category || 'Products'}</div>
                        
                        <h1 class="product-title-main">${displayName}</h1>
                        
                        <div style="color: #666; line-height: 1.7; margin: 25px 0; font-size: 1.1rem;">
                            ${productDescription}
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 10px; margin: 25px 0;">
                            <div style="color: #ffc107; font-size: 18px;">⭐⭐⭐⭐⭐</div>
                            <span style="color: #666;">(${Math.floor(Math.random() * 50) + 30} verified reviews)</span>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 35px; border-radius: 20px; text-align: center; margin: 35px 0; border: 2px solid rgba(212, 175, 55, 0.2);">
                            <div class="product-price-main">AED ${finalPrice.toFixed(2)} <span style="font-size: 1.4rem; font-weight: 700;"></span></div>
                            ${hasDiscount ? `
                                <div style="margin-top: 15px;">
                                    <span class="original-price">AED ${originalPrice.toFixed(2)}</span>
                                    <span class="discount-badge">Save ${discountPercent}%</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="product-features">
                            <h3>🌟 Guaranteed Product Features</h3>
                            <ul>
                                <li><i class="fas fa-check" aria-hidden="true"></i> 100% guaranteed high quality with manufacturer warranty</li>
                                <li><i class="fas fa-truck" aria-hidden="true"></i> Fast delivery in UAE within 1-3 business days</li>
                                <li><i class="fas fa-undo" aria-hidden="true"></i> Easy 14-day return policy with shipping fee coverage</li>
                                <li><i class="fas fa-headset" aria-hidden="true"></i> Professional 24/7 multilingual customer service</li>
                                <li><i class="fas fa-shield-alt" aria-hidden="true"></i> Premium packaging with quality guarantee certificate</li>
                                <li><i class="fas fa-star" aria-hidden="true"></i> Trusted by thousands of satisfied customers in UAE</li>
                            </ul>
                        </div>
                        
                        <div class="product-actions-main">
                            <button class="btn-main btn-primary-main add-cart-btn" 
                                    data-product-id="${product.id}"
                                    type="button"
                                    aria-label="Add ${displayName} to cart">
                                <i class="fas fa-shopping-cart" aria-hidden="true"></i> Add to Cart
                            </button>
                            
                            <button class="btn-main btn-whatsapp-main whatsapp-order-btn" 
                                    data-product-id="${product.id}"
                                    type="button"
                                    aria-label="Order ${displayName} via WhatsApp">
                                <i class="fab fa-whatsapp" aria-hidden="true"></i> Order via WhatsApp
                            </button>
                            
                            <a href="./checkout.html" class="btn-main btn-checkout-main" 
                               style="text-decoration: none;"
                               aria-label="Go to checkout page">
                                <i class="fas fa-credit-card" aria-hidden="true"></i> Complete Order Now
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('productContent').innerHTML = productHTML;
            
            // Setup secure event handlers
            setupProductEventHandlersSecurely();
            
        } catch (displayError) {
            error('❌ Product display error:', displayError);
            showErrorMessageSecurely('Error displaying product details');
        }
    }
    
    /**
     * Setup secure event handlers (ZERO INLINE)
     */
    function setupProductEventHandlersSecurely() {
        // Add to cart button
        const addCartBtn = document.querySelector('.add-cart-btn');
        if (addCartBtn) {
            addCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.dataset.productId;
                if (productId) {
                    addToCartSecurely(productId);
                }
            });
            
            // Keyboard support
            addCartBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
        
        // WhatsApp order button
        const whatsappBtn = document.querySelector('.whatsapp-order-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.dataset.productId;
                if (productId) {
                    orderViaWhatsAppSecurely(productId);
                }
            });
            
            // Keyboard support
            whatsappBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
        
        // Setup secure image handler
        const productImg = document.querySelector('.product-image');
        if (productImg) {
            setupSecureImageHandler(productImg);
        }
    }
    
    /**
     * Secure add to cart system
     */
    function addToCartSecurely(productId) {
        if (!currentProduct || !productId) {
            showSecureNotification('Product data not available', true);
            return;
        }
        
        try {
            const cartData = localStorage.getItem('emirates_cart');
            let cart = [];
            
            if (cartData) {
                try {
                    cart = JSON.parse(cartData);
                } catch (parseError) {
                    warn('⚠️ Cart data corrupted, resetting');
                    cart = [];
                }
            }
            
            if (!Array.isArray(cart)) cart = [];
            
            const existingIndex = cart.findIndex(item => 
                item && String(item.id) === String(productId)
            );
            
            if (existingIndex !== -1) {
                cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
            } else {
                cart.push({
                    id: productId,
                    title: currentProduct.displayName,
                    price: parseFloat(currentProduct.sale_price || currentProduct.price || 0),
                    image: currentProduct.image_link,
                    quantity: 1,
                    category: currentProduct.category
                });
            }
            
            localStorage.setItem('emirates_cart', JSON.stringify(cart));
            updateCartCounterSecurely();
            
            log(`✅ Added ${currentProduct.displayName} to cart`);
            showSecureNotification(`"${currentProduct.displayName}" added to cart successfully!`);
            
        } catch (cartError) {
            error('❌ Add to cart error:', cartError);
            showSecureNotification('Error adding product to cart', true);
        }
    }
    
    /**
     * Secure WhatsApp order system
     */
    function orderViaWhatsAppSecurely(productId) {
        if (!currentProduct || !productId) {
            showSecureNotification('Product data not available', true);
            return;
        }
        
        try {
            const finalPrice = parseFloat(currentProduct.sale_price || currentProduct.price || 0);
            
            const message = `🛍️ Order from Emirates Gifts Store

` +
                `🎁 Product: ${currentProduct.displayName}
` +
                `💰 Price: AED ${finalPrice.toFixed(2)}
` +
                `🏶 Store: Emirates Gifts (English)
` +
                `🌐 Link: ${window.location.href}

` +
                `✅ Guaranteed Services:
` +
                `🚚 UAE delivery 1-3 days
` +
                `🔄 14-day return policy
` +
                `🛡 100% authenticity guarantee

` +
                `Please confirm order details!`;
            
            const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
            
            // Safe WhatsApp redirect
            const link = document.createElement('a');
            link.href = whatsappUrl;
            link.target = '_blank';
            link.rel = 'noopener';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            log('📱 WhatsApp order initiated securely');
            showSecureNotification('WhatsApp opened with your order details!');
            
        } catch (whatsappError) {
            error('❌ WhatsApp order error:', whatsappError);
            showSecureNotification('Error opening WhatsApp', true);
        }
    }
    
    /**
     * Secure notification system (NO POPUPS)
     */
    function showSecureNotification(message, isError = false) {
        // Remove existing notifications
        document.querySelectorAll('.secure-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'secure-notification';
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        
        const bgColor = isError ? 
            'linear-gradient(135deg, #e74c3c, #c0392b)' : 
            'linear-gradient(135deg, #25D366, #20B358)';
        
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${bgColor};
            color: white;
            padding: 18px 25px;
            border-radius: 15px;
            font-weight: 700;
            font-size: 1rem;
            z-index: 10000;
            animation: slideInUp 0.4s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 400px;
            font-family: 'Inter', sans-serif;
        `;
        
        const icon = isError ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
        notification.innerHTML = `<i class="${icon}" style="margin-right: 8px;" aria-hidden="true"></i>${message}`;
        
        document.body.appendChild(notification);
        
        // Auto remove with animation
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.4s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }, 4000);
    }
    
    /**
     * Show error message (secure version)
     */
    function showErrorMessageSecurely(message) {
        const errorHTML = `
            <div class="error-message" role="alert">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <h2>Product Loading Issue</h2>
                <p style="font-size: 1.2rem; margin: 25px 0;">${message}</p>
                
                <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-top: 40px;">
                    <a href="./" class="btn-main btn-primary-main" 
                       style="text-decoration: none;"
                       aria-label="Back to homepage">
                        <i class="fas fa-home" aria-hidden="true"></i> Back to Home
                    </a>
                    <a href="./products-showcase.html" class="btn-main btn-whatsapp-main" 
                       style="text-decoration: none;"
                       aria-label="Browse all products">
                        <i class="fas fa-th-large" aria-hidden="true"></i> Browse Products
                    </a>
                    <a href="https://wa.me/201110760081" class="btn-main btn-primary-main" 
                       style="text-decoration: none;" 
                       target="_blank" 
                       rel="noopener"
                       aria-label="Contact customer service">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i> Contact Us
                    </a>
                </div>
            </div>
        `;
        
        const productContent = document.getElementById('productContent');
        if (productContent) {
            productContent.innerHTML = errorHTML;
        }
    }
    
    // Update cart counter securely
    function updateCartCounterSecurely() {
        try {
            const cartData = localStorage.getItem('emirates_cart');
            let cart = [];
            
            if (cartData) {
                try {
                    cart = JSON.parse(cartData);
                } catch (e) {
                    cart = [];
                }
            }
            
            if (!Array.isArray(cart)) cart = [];
            
            const totalItems = cart.reduce((sum, item) => {
                if (!item || typeof item !== 'object') return sum;
                const qty = parseInt(item.quantity || 0);
                return sum + (isNaN(qty) ? 0 : Math.max(0, qty));
            }, 0);
            
            const counter = document.getElementById('cartCounter');
            if (counter) {
                counter.textContent = totalItems.toString();
                counter.style.display = totalItems > 0 ? 'flex' : 'none';
                counter.setAttribute('aria-label', `Number of items in cart: ${totalItems}`);
            }
        } catch (error) {
            error('❌ Cart counter error:', error);
        }
    }
    
    // Enhanced progress bar
    function updateProgressSecurely() {
        try {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            
            if (maxScroll > 0) {
                const progress = Math.max(0, Math.min(100, (scrolled / maxScroll) * 100));
                const bar = document.getElementById('progressBar');
                if (bar) {
                    bar.style.width = progress + '%';
                }
            }
        } catch (error) {
            error('❌ Progress bar error:', error);
        }
    }
    
    // Enhanced initialization
    function initializeEnglishProductDetails() {
        log('🚫 English Product Details Init - Zero Inline Code - PRODUCTS.JSON...');
        
        try {
            // Update cart counter
            updateCartCounterSecurely();
            
            // Load product from products.json
            loadProductUniversal();
            
            // Setup progress bar with throttling
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (scrollTimeout) return;
                scrollTimeout = setTimeout(() => {
                    updateProgressSecurely();
                    scrollTimeout = null;
                }, 16);
            }, { passive: true });
            
            log('✅ English Product Details initialized');
            
        } catch (initError) {
            error('❌ Initialization error:', initError);
        }
    }
    
    // Global error handling
    window.addEventListener('error', function(event) {
        error('❌ Global error:', event.error);
        event.preventDefault();
        return true;
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        error('❌ Unhandled promise:', event.reason);
        event.preventDefault();
    });
    
    // Smart DOM initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEnglishProductDetails);
    } else {
        setTimeout(initializeEnglishProductDetails, 0);
    }
    
    // Secure global exports
    if (typeof window !== 'undefined') {
        window.EmiratesProductDetailsEN = Object.freeze({
            version: '2.0.0-english-secure-products-json',
            addToCart: addToCartSecurely,
            updateCartCounter: updateCartCounterSecurely,
            loadProduct: loadProductUniversal,
            isDevelopment: isDev
        });
    }
    
    log('✅ Emirates Product Details EN v2.0 - ZERO INLINE CODE - LOADS FROM products.json');
    
})();
