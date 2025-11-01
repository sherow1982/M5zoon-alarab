// 🚫 EMIRATES GIFTS PRODUCTS SHOWCASE ENGLISH - ZERO INLINE CODE v2.1

(function() {
    'use strict';
    
    const isDev = window.location.hostname === 'localhost';
    const log = isDev ? console.log.bind(console) : () => {};
    const warn = isDev ? console.warn.bind(console) : () => {};
    const error = console.error.bind(console);
    
    log('🚫 EMIRATES PRODUCTS SHOWCASE EN - ZERO INLINE CODE');
    
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
    
    let currentProducts = [];
    let loadingAttempts = 0;
    const maxAttempts = 3;
    
    // Enhanced image error handler (ZERO INLINE)
    function setupSecureImageHandler(imgElement) {
        if (!imgElement || imgElement.dataset.secureHandler) return;
        
        imgElement.addEventListener('error', function() {
            if (this.dataset.fallbackApplied === 'true') return;
            
            this.dataset.fallbackApplied = 'true';
            this.src = 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=Premium+Product';
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
            'watch_88': 'Rolex Kaaba Design Premium Watch',
            'watch_3': 'Rolex Black Dial Professional R21',
            'watch_1': 'Rolex Yacht Master Silver Edition',
            'watch_8': 'Omega Swatch Baby Blue Limited Edition',
            'watch_2': 'Rolex Submariner Black Premium',
            'watch_4': 'Rolex Daytona Gold Collection',
            'watch_5': 'Omega Speedmaster Professional',
            'watch_6': 'Patek Philippe Calatrava Classic',
            'watch_7': 'TAG Heuer Formula 1 Racing',
            'watch_9': 'Breitling Navitimer Pilot',
            'watch_10': 'IWC Portuguese Chronograph',
            'perfume_1': 'Chanel Coco Premium Perfume 100ml',
            'perfume_10': 'Dior Sauvage Premium Fragrance',
            'perfume_15': 'Tom Ford Black Orchid Luxury',
            'perfume_2': 'Chanel No.5 Classic Edition',
            'perfume_3': 'Creed Aventus Premium Collection',
            'perfume_4': 'Tom Ford Oud Wood Oriental',
            'perfume_5': 'Dior Miss Dior Blooming Bouquet',
            'perfume_6': 'Guerlain Shalimar Oriental Classic',
            'perfume_7': 'Yves Saint Laurent Black Opium',
            'perfume_8': 'Giorgio Armani Si Passione',
            'perfume_9': 'Versace Eros Flame Intense'
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
        
        // Color/style detection
        if (title.includes('black') || title.includes('أسود')) parts.push('Black');
        else if (title.includes('gold') || title.includes('ذهبي')) parts.push('Gold');
        else if (title.includes('silver') || title.includes('فضي')) parts.push('Silver');
        else if (title.includes('blue') || title.includes('أزرق')) parts.push('Blue');
        
        // Model detection
        if (title.includes('yacht master')) parts.push('Yacht Master');
        if (title.includes('submariner')) parts.push('Submariner');
        if (title.includes('daytona')) parts.push('Daytona');
        if (title.includes('coco')) parts.push('Coco');
        if (title.includes('sauvage')) parts.push('Sauvage');
        
        // Product type
        if (productId && productId.includes('watch')) {
            parts.push('Premium Watch');
        } else if (productId && productId.includes('perfume')) {
            parts.push('Premium Perfume');
        }
        
        return parts.length > 0 ? parts.join(' ') : 'Premium Luxury Product';
    }
    
    // 🔗 Enhanced English WhatsApp message formatter with correct domain for Merchant Center
    function formatEnglishWhatsAppMessage(product) {
        if (!product) return '';
        
        const finalPrice = parseFloat(product.sale_price || product.price || 0);
        const originalPrice = parseFloat(product.price || 0);
        const productTitle = (product.englishName || getEnglishProductName(product.title, product.id)).trim();
        const productId = product.id || 'unknown';
        
        // 🎯 Build correct product URL for Merchant Center integration (English version)
        const productSlug = productTitle
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)
            .trim();
            
        const productUrl = `https://emirates-gifts.arabsad.com/en/product-details.html?id=${productId}&category=${product.type}&slug=${productSlug || 'product'}`;
        
        let message = `🛒 *Order from Emirates Gifts Store*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📝 *Product Name:*\n${productTitle}\n\n`;
        message += `🆔 *Product ID:* ${productId}\n\n`;
        message += `💰 *Price:* AED ${finalPrice.toFixed(2)}\n`;
        
        if (originalPrice > finalPrice && finalPrice > 0) {
            const savings = originalPrice - finalPrice;
            const discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
            message += `💲 *Original Price:* AED ${originalPrice.toFixed(2)}\n`;
            message += `🔥 *You Save:* AED ${savings.toFixed(2)} (${discountPercent}% OFF)\n`;
        }
        
        message += `\n🔗 *Product Link:*\n${productUrl}\n\n`;
        message += `🏪 *Store:* Emirates Gifts هدايا الإمارات\n`;
        message += `🚚 *Shipping:* Within 1-3 business days\n`;
        message += `🔄 *Return Policy:* 14 days + shipping fees\n`;
        message += `✅ *Quality Guarantee:* 100% authentic & certified\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `Please confirm your order and send delivery details:\n`;
        message += `• Full Name\n`;
        message += `• Phone Number (UAE)\n`;
        message += `• Detailed Address\n`;
        message += `• Additional Notes (Optional)`;
        
        return message;
    }
    
    /**
     * Enhanced product loading with retry and English translation
     */
    async function loadAllProductsSecurely() {
        try {
            loadingAttempts++;
            log(`📦 Loading all products for English... (${loadingAttempts}/${maxAttempts})`);
            
            let allProducts = [];
            
            // Load perfumes with enhanced error handling
            try {
                const perfumesResponse = await fetch('../data/otor.json?v=' + Date.now());
                if (perfumesResponse.ok) {
                    const perfumes = await perfumesResponse.json();
                    if (Array.isArray(perfumes) && perfumes.length > 0) {
                        allProducts = allProducts.concat(
                            perfumes.map(p => ({
                                ...p, 
                                type: 'perfume', 
                                category: 'Perfumes',
                                icon: '🌸',
                                englishName: getEnglishProductName(p.title, p.id)
                            }))
                        );
                        log(`✅ Loaded ${perfumes.length} perfumes with English translation`);
                    }
                }
            } catch (perfumeError) {
                warn('⚠️ Perfumes loading error:', perfumeError);
            }
            
            // Load watches with enhanced error handling
            try {
                const watchesResponse = await fetch('../data/sa3at.json?v=' + Date.now());
                if (watchesResponse.ok) {
                    const watches = await watchesResponse.json();
                    if (Array.isArray(watches) && watches.length > 0) {
                        allProducts = allProducts.concat(
                            watches.map(p => ({
                                ...p, 
                                type: 'watch', 
                                category: 'Watches',
                                icon: '⏰',
                                englishName: getEnglishProductName(p.title, p.id)
                            }))
                        );
                        log(`✅ Loaded ${watches.length} watches with English translation`);
                    }
                }
            } catch (watchError) {
                warn('⚠️ Watches loading error:', watchError);
            }
            
            // Display products or retry
            if (allProducts.length > 0) {
                currentProducts = allProducts;
                displayProductsSecurely(allProducts);
                updateFilterCountsSecurely();
                log(`✅ Successfully displaying ${allProducts.length} products in English`);
            } else {
                if (loadingAttempts < maxAttempts) {
                    log('⚠️ No products loaded, retrying...');
                    setTimeout(loadAllProductsSecurely, 2000);
                } else {
                    error('❌ Failed to load products after multiple attempts');
                    showLoadingErrorSecurely();
                }
            }
            
        } catch (loadError) {
            error('❌ Product loading error:', loadError);
            if (loadingAttempts < maxAttempts) {
                setTimeout(loadAllProductsSecurely, 2000);
            } else {
                showLoadingErrorSecurely();
            }
        }
    }
    
    /**
     * SECURE PRODUCT DISPLAY (NO INLINE CODE) - ENGLISH VERSION
     */
    function displayProductsSecurely(products) {
        const grid = document.getElementById('allProductsGrid');
        
        if (!grid) {
            error('❌ Products grid not found');
            return;
        }
        
        if (!products || !Array.isArray(products) || products.length === 0) {
            showNoProductsMessageSecurely();
            return;
        }
        
        try {
            const productsHTML = products.map(product => {
                if (!product || typeof product !== 'object') return '';
                
                const finalPrice = parseFloat(product.sale_price || product.price || 0);
                const originalPrice = parseFloat(product.price || 0);
                const hasDiscount = originalPrice > finalPrice && finalPrice > 0;
                const discountPercent = hasDiscount ? 
                    Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;
                    
                const productId = String(product.id || Date.now());
                const productTitle = (product.englishName || getEnglishProductName(product.title, product.id))
                    .replace(/[<>&"']/g, '')
                    .substring(0, 100);
                    
                const imageUrl = product.image_link || 
                    'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=Premium+Product';
                
                // 📱 ENHANCED ENGLISH WHATSAPP MESSAGE WITH CORRECT DOMAIN
                const whatsappMessage = formatEnglishWhatsAppMessage(product);
                
                // ❌ NO INLINE EVENT HANDLERS - COMPLETELY SECURE
                return `
                    <div class="product-card" 
                         data-product-type="${product.type}" 
                         data-product-id="${productId}"
                         role="button"
                         tabindex="0"
                         aria-label="View details for ${productTitle}">
                        <div class="product-image-container">
                            <img src="${imageUrl}" 
                                 alt="${productTitle}" 
                                 class="product-image"
                                 loading="lazy"
                                 width="300"
                                 height="250"
                                 data-fallback-applied="false">
                            ${hasDiscount ? `<div class="discount-badge">Save ${discountPercent}%</div>` : ''}
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${productTitle}</h3>
                            <div class="product-price">
                                AED ${finalPrice.toFixed(2)}
                                ${hasDiscount ? `<span class="original-price">AED ${originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <div class="product-actions">
                                <button class="btn-primary add-to-cart-btn" 
                                        data-product-id="${productId}"
                                        type="button"
                                        aria-label="Add ${productTitle} to cart">
                                    <i class="fas fa-cart-plus" aria-hidden="true"></i> Add to Cart
                                </button>
                                <a href="https://wa.me/201110760081?text=${encodeURIComponent(whatsappMessage)}" 
                                   class="btn-whatsapp whatsapp-order-btn" 
                                   target="_blank" 
                                   rel="noopener"
                                   data-product-id="${productId}"
                                   data-product-title="${productTitle}"
                                   aria-label="Order ${productTitle} via WhatsApp">
                                    <i class="fab fa-whatsapp" aria-hidden="true"></i> Order
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }).filter(html => html.trim().length > 0).join('');
            
            grid.innerHTML = productsHTML;
            
            // Setup secure event handlers for all products
            setupProductEventHandlersSecurely();
            
            log(`📦 Securely displayed ${products.length} products in English`);
            
        } catch (displayError) {
            error('❌ Display products error:', displayError);
            showLoadingErrorSecurely();
        }
    }
    
    /**
     * Setup secure event handlers (ZERO INLINE)
     */
    function setupProductEventHandlersSecurely() {
        // Product card navigation handlers
        document.querySelectorAll('.product-card').forEach(card => {
            // Click handler for navigation
            card.addEventListener('click', function(e) {
                // Don't navigate if clicked on buttons
                if (e.target.closest('.product-actions')) return;
                
                e.preventDefault();
                const productId = this.dataset.productId;
                const productType = this.dataset.productType;
                
                if (productId && productType) {
                    navigateToProductDetailsSecurely(productId, productType);
                }
            });
            
            // Keyboard accessibility
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (!e.target.closest('.product-actions')) {
                        e.preventDefault();
                        this.click();
                    }
                }
            });
            
            // Secure image handling
            const img = card.querySelector('.product-image');
            if (img) {
                setupSecureImageHandler(img);
            }
        });
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const productId = this.dataset.productId;
                if (productId) {
                    addToCartSecurely(productId);
                }
            });
            
            // Keyboard support
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.click();
                }
            });
        });
        
        // 📱 Enhanced WhatsApp buttons with dynamic messages and corrected links
        document.querySelectorAll('.whatsapp-order-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // Don't trigger card click
                
                const productId = this.dataset.productId;
                if (productId) {
                    const product = currentProducts.find(p => p && String(p.id) === String(productId));
                    if (product) {
                        // Update WhatsApp link with fresh product data including correct domain link
                        const freshMessage = formatEnglishWhatsAppMessage(product);
                        this.href = `https://wa.me/201110760081?text=${encodeURIComponent(freshMessage)}`;
                        log('📱 English WhatsApp message updated with arabsad.com/en product link');
                    }
                }
                
                log('📱 English WhatsApp order initiated with correct domain link');
            });
        });
    }
    
    /**
     * Secure navigation to product details
     */
    function navigateToProductDetailsSecurely(productId, type) {
        if (!productId || !type) {
            error('❌ Missing navigation data');
            return;
        }
        
        log(`🔗 Secure navigation to: ${productId} (English)`);
        
        const product = currentProducts.find(p => p && String(p.id) === String(productId));
        if (product) {
            const englishName = product.englishName || getEnglishProductName(product.title, productId);
            const slug = englishName
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50)
                .trim();
            
            const params = new URLSearchParams({
                id: productId,
                category: type,
                slug: slug || 'product'
            });
            
            try {
                window.location.href = `./product-details.html?${params.toString()}`;
            } catch (navError) {
                error('❌ Navigation error:', navError);
                // Enhanced fallback navigation
                const fallbackUrl = `./product-details.html?id=${encodeURIComponent(productId)}&category=${encodeURIComponent(type)}`;
                window.location.href = fallbackUrl;
            }
        } else {
            error('❌ Product not found:', productId);
            showSecureNotification('Product not found. Redirecting...', true);
            setTimeout(() => {
                window.location.href = './';
            }, 2000);
        }
    }
    
    /**
     * Secure add to cart system
     */
    function addToCartSecurely(productId) {
        const product = currentProducts.find(p => p && String(p.id) === String(productId));
        if (!product) {
            error('❌ Product not found for cart');
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
            
            if (!Array.isArray(cart)) {
                cart = [];
            }
            
            const existingIndex = cart.findIndex(item => 
                item && String(item.id) === String(productId)
            );
            
            const englishName = product.englishName || getEnglishProductName(product.title, product.id);
            
            if (existingIndex !== -1) {
                cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
            } else {
                cart.push({
                    id: productId,
                    title: englishName,
                    price: parseFloat(product.sale_price || product.price || 0),
                    image: product.image_link,
                    quantity: 1,
                    type: product.type,
                    category: product.category
                });
            }
            
            localStorage.setItem('emirates_cart', JSON.stringify(cart));
            updateCartBadgeSecurely();
            
            log(`✅ Added ${englishName} to cart`);
            showSecureNotification(`"${englishName}" added to cart successfully!`);
            
        } catch (cartError) {
            error('❌ Cart error:', cartError);
            showSecureNotification('Error adding product to cart', true);
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
            max-width: 350px;
            font-family: 'Inter', sans-serif;
        `;
        
        const icon = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
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
        }, 3500);
    }
    
    /**
     * Update cart badge securely
     */
    function updateCartBadgeSecurely() {
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
            
            const badge = document.getElementById('cartBadge');
            if (badge) {
                badge.textContent = totalItems.toString();
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
                badge.setAttribute('aria-label', `Number of items in cart: ${totalItems}`);
            }
        } catch (error) {
            error('❌ Cart badge error:', error);
        }
    }
    
    /**
     * Update filter counts securely
     */
    function updateFilterCountsSecurely() {
        try {
            const perfumeCount = currentProducts.filter(p => p.type === 'perfume').length;
            const watchCount = currentProducts.filter(p => p.type === 'watch').length;
            
            const allBtn = document.querySelector('[data-filter="all"]');
            const perfumesBtn = document.querySelector('[data-filter="perfumes"]');
            const watchesBtn = document.querySelector('[data-filter="watches"]');
            
            if (allBtn) allBtn.innerHTML = `<i class="fas fa-th-large" aria-hidden="true"></i> All Products (${currentProducts.length})`;
            if (perfumesBtn) perfumesBtn.innerHTML = `<i class="fas fa-spray-can" aria-hidden="true"></i> Perfumes (${perfumeCount})`;
            if (watchesBtn) watchesBtn.innerHTML = `<i class="fas fa-clock" aria-hidden="true"></i> Watches (${watchCount})`;
            
            log(`📊 Filter counts: All(${currentProducts.length}) Perfumes(${perfumeCount}) Watches(${watchCount})`);
        } catch (error) {
            error('❌ Filter counts error:', error);
        }
    }
    
    /**
     * Initialize secure filters (ZERO INLINE)
     */
    function initializeSecureFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                try {
                    // Update active state
                    document.querySelectorAll('.filter-btn').forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-checked', 'false');
                    });
                    
                    this.classList.add('active');
                    this.setAttribute('aria-checked', 'true');
                    
                    const filter = this.getAttribute('data-filter');
                    log(`🔍 Filtering by: ${filter}`);
                    
                    let filteredProducts = [];
                    
                    if (filter === 'all') {
                        filteredProducts = currentProducts;
                    } else if (filter === 'perfumes') {
                        filteredProducts = currentProducts.filter(p => p.type === 'perfume');
                    } else if (filter === 'watches') {
                        filteredProducts = currentProducts.filter(p => p.type === 'watch');
                    }
                    
                    displayProductsSecurely(filteredProducts);
                    
                    // Announce filter change for screen readers
                    const filterName = filter === 'all' ? 'All Products' : 
                                     filter === 'perfumes' ? 'Perfumes' : 'Watches';
                    announceToScreenReaderSecurely(`Products filtered to show ${filterName}`);
                    
                } catch (filterError) {
                    error('❌ Filter error:', filterError);
                }
            });
            
            // Keyboard support
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    /**
     * Screen reader announcements
     */
    function announceToScreenReaderSecurely(message) {
        try {
            let announcer = document.getElementById('sr-announcer');
            if (!announcer) {
                announcer = document.createElement('div');
                announcer.id = 'sr-announcer';
                announcer.setAttribute('aria-live', 'polite');
                announcer.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
                document.body.appendChild(announcer);
            }
            
            announcer.textContent = message;
            setTimeout(() => {
                if (announcer) announcer.textContent = '';
            }, 2000);
        } catch (error) {
            error('❌ Screen reader error:', error);
        }
    }
    
    /**
     * Enhanced progress bar
     */
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
    
    /**
     * Show secure error messages
     */
    function showLoadingErrorSecurely() {
        const grid = document.getElementById('allProductsGrid');
        if (!grid) return;
        
        grid.innerHTML = `
            <div class="loading-message" 
                 style="background: linear-gradient(135deg, #fff5f5, #fef5e7); border: 2px solid #fed7d7; color: #e74c3c;" 
                 role="alert">
                <i class="fas fa-exclamation-triangle" 
                   style="font-size: 3rem; margin-bottom: 20px; color: #e74c3c;" 
                   aria-hidden="true"></i><br>
                <h3 style="color: #1B2951; margin: 15px 0;">❌ Error Loading Products</h3>
                <p style="color: #666; margin: 15px 0;">Sorry, we couldn't load products at the moment</p>
                <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <a href="./" 
                       class="error-btn home-btn" 
                       style="color: white; background: linear-gradient(135deg, #D4AF37, #B8860B); text-decoration: none; font-weight: bold; padding: 15px 30px; border-radius: 15px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease;"
                       aria-label="Go back to homepage">
                        <i class="fas fa-home" aria-hidden="true"></i> Back to Home
                    </a>
                    <button class="error-btn retry-btn" 
                            style="color: white; background: linear-gradient(135deg, #25D366, #20B358); border: none; font-weight: bold; padding: 15px 30px; border-radius: 15px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s ease; font-family: 'Inter', sans-serif;"
                            aria-label="Retry loading products"
                            type="button">
                        <i class="fas fa-redo" aria-hidden="true"></i> Try Again
                    </button>
                    <a href="https://wa.me/201110760081" 
                       class="error-btn whatsapp-btn"
                       target="_blank" 
                       rel="noopener"
                       style="color: white; background: linear-gradient(135deg, #25D366, #20B358); text-decoration: none; font-weight: bold; padding: 15px 30px; border-radius: 15px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease;"
                       aria-label="Contact customer service">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i> Contact Us
                    </a>
                </div>
            </div>
        `;
        
        // Setup retry button handler securely
        setTimeout(() => {
            const retryBtn = grid.querySelector('.retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    try {
                        loadingAttempts = 0; // Reset attempts
                        location.reload();
                    } catch (reloadError) {
                        error('❌ Reload error:', reloadError);
                        // Fallback: redirect to homepage
                        window.location.href = './';
                    }
                });
                
                retryBtn.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            }
        }, 100);
    }
    
    /**
     * Show no products message
     */
    function showNoProductsMessageSecurely() {
        const grid = document.getElementById('allProductsGrid');
        if (!grid) return;
        
        grid.innerHTML = `
            <div class="loading-message" role="status" aria-live="polite">
                <i class="fas fa-info-circle" 
                   style="font-size: 3rem; margin-bottom: 20px; color: #D4AF37;" 
                   aria-hidden="true"></i><br>
                <h3 style="color: #1B2951; margin: 15px 0;">No Products Available</h3>
                <p style="color: #666; margin: 15px 0;">Please check back later for the latest products</p>
                <div style="margin-top: 30px;">
                    <a href="./" 
                       style="color: white; background: linear-gradient(135deg, #D4AF37, #B8860B); text-decoration: none; font-weight: bold; padding: 15px 30px; border-radius: 15px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease;"
                       aria-label="Go back to homepage">
                        <i class="fas fa-home" aria-hidden="true"></i> Back to Home
                    </a>
                </div>
            </div>
        `;
    }
    
    /**
     * Enhanced initialization
     */
    function initializeProductsShowcaseSecurely() {
        log('🚫 Zero Inline Code Products Showcase EN Init...');
        
        try {
            // Update cart badge
            updateCartBadgeSecurely();
            
            // Load all products
            loadAllProductsSecurely();
            
            // Initialize secure filters
            initializeSecureFilters();
            
            // Setup progress bar with throttling
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (scrollTimeout) return;
                scrollTimeout = setTimeout(() => {
                    updateProgressSecurely();
                    scrollTimeout = null;
                }, 16);
            }, { passive: true });
            
            log('✅ English Products Showcase initialized with zero inline code');
            
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
        document.addEventListener('DOMContentLoaded', initializeProductsShowcaseSecurely);
    } else {
        setTimeout(initializeProductsShowcaseSecurely, 0);
    }
    
    // Secure global exports
    if (typeof window !== 'undefined') {
        window.EmiratesShowcaseEN = Object.freeze({
            version: '2.1.0-english-secure-with-merchant-links',
            navigateToProduct: navigateToProductDetailsSecurely,
            addToCart: addToCartSecurely,
            updateCartBadge: updateCartBadgeSecurely,
            loadProducts: loadAllProductsSecurely,
            isDevelopment: isDev
        });
        
        // Legacy support (clean versions)
        window.navigateToProductDetails = navigateToProductDetailsSecurely;
        window.addToCartClean = addToCartSecurely;
    }
    
    log('✅ Emirates Gifts Products Showcase EN v2.1 - WITH MERCHANT CENTER LINKS');
    
})();