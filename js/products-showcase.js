// 🚫 EMIRATES GIFTS PRODUCTS SHOWCASE - ZERO INLINE CODE v2.2 - PRODUCTS.JSON

(function() {
    'use strict';
    
    const isDev = window.location.hostname === 'localhost';
    const log = isDev ? console.log.bind(console) : () => {};
    const warn = isDev ? console.warn.bind(console) : () => {};
    const error = console.error.bind(console);
    
    log('🚫 EMIRATES PRODUCTS SHOWCASE v2.2 - LOADING FROM products.json');
    
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
            this.src = 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=منتج+مميز';
            this.alt = 'منتج مميز - صورة بديلة';
            warn('⚠️ Product image fallback applied');
        });
        
        imgElement.dataset.secureHandler = 'true';
        
        // Handle pre-failed images
        if (imgElement.complete && imgElement.naturalWidth === 0) {
            imgElement.dispatchEvent(new Event('error'));
        }
    }
    
    // 🔗 Enhanced WhatsApp message formatter
    function formatWhatsAppMessage(product) {
        if (!product) return '';
        
        const finalPrice = parseFloat(product.sale_price || product.price || 0);
        const originalPrice = parseFloat(product.price || 0);
        const productTitle = (product.title || product.title_ar || 'منتج مميز').trim();
        const productId = product.id || 'unknown';
        
        const productSlug = productTitle
            .toLowerCase()
            .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)
            .trim();
            
        const productUrl = `https://emirates-gifts.arabsad.com/product-details.html?id=${productId}&category=${product.category_type || (product.category === 'Perfumes' ? 'perfume' : 'watch')}&slug=${productSlug || 'product'}`;
        
        let message = `🛒 *طلب من متجر هدايا الإمارات*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📝 *اسم المنتج:*\n${productTitle}\n\n`;
        message += `🆔 *كود المنتج:* ${productId}\n\n`;
        message += `💰 *السعر:* ${finalPrice.toFixed(2)} د.إ\n`;
        
        if (originalPrice > finalPrice && finalPrice > 0) {
            const savings = originalPrice - finalPrice;
            const discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
            message += `💲 *السعر الأصلي:* ${originalPrice.toFixed(2)} د.إ\n`;
            message += `🔥 *التوفير:* ${savings.toFixed(2)} د.إ (${discountPercent}%)\n`;
        }
        
        message += `\n🔗 *رابط المنتج:*\n${productUrl}\n\n`;
        message += `🏪 *المتجر:* هدايا الإمارات Emirates Gifts\n`;
        message += `🚚 *التوصيل:* خلال 1-3 أيام عمل\n`;
        message += `🔄 *ضمان الإرجاع:* 14 يوم + مصاريف الشحن\n`;
        message += `✅ *ضمان الجودة:* 100% أصلي ومعتمد\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `رجاءً تأكيد الطلب وإرسال بيانات التوصيل:\n`;
        message += `• الاسم الكامل\n`;
        message += `• رقم الهاتف (الإمارات)\n`;
        message += `• العنوان التفصيلي\n`;
        message += `• ملاحظات إضافية (اختياري)`;
        
        return message;
    }
    
    // 📊 Inject SEO Schema Markup
    function injectSeoSchema(products) {
        try {
            // Remove old schema scripts
            document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
                if (script.dataset.type === 'products-schema' || script.dataset.type === 'organization-schema' || script.dataset.type === 'breadcrumb-schema') {
                    script.remove();
                }
            });
            
            // Organization Schema
            const orgSchema = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Emirates Gifts | هدايا الإمارات",
                "url": "https://emirates-gifts.arabsad.com",
                "logo": "https://emirates-gifts.arabsad.com/logo.png",
                "description": "متجر عطور وساعات وهدايا عالية الجودة في الإمارات",
                "sameAs": [
                    "https://wa.me/201110760081"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "Customer Support",
                    "telephone": "+20 111 076 0081",
                    "availableLanguage": ["ar", "en"]
                },
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Dubai",
                    "addressCountry": "AE",
                    "addressRegion": "Dubai"
                },
                "priceRange": "AED 250 - AED 600"
            };
            
            const orgScript = document.createElement('script');
            orgScript.type = 'application/ld+json';
            orgScript.dataset.type = 'organization-schema';
            orgScript.textContent = JSON.stringify(orgSchema, null, 2);
            document.head.appendChild(orgScript);
            
            // Breadcrumb Schema
            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "الرئيسية",
                        "item": "https://emirates-gifts.arabsad.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "جميع المنتجات",
                        "item": "https://emirates-gifts.arabsad.com/products-showcase.html"
                    }
                ]
            };
            
            const breadcrumbScript = document.createElement('script');
            breadcrumbScript.type = 'application/ld+json';
            breadcrumbScript.dataset.type = 'breadcrumb-schema';
            breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema, null, 2);
            document.head.appendChild(breadcrumbScript);
            
            // Product Collection Schema (ItemList)
            const productCollection = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "جميع منتجاتنا",
                "description": "مجموعة شاملة من العطور والساعات والهدايا عالية الجودة",
                "url": "https://emirates-gifts.arabsad.com/products-showcase.html",
                "mainEntity": {
                    "@type": "ItemList",
                    "name": "أحدث المنتجات",
                    "numberOfItems": products.length,
                    "itemListElement": products.slice(0, 20).map((product, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "url": `https://emirates-gifts.arabsad.com/product-details.html?id=${product.id}`,
                        "name": product.title || product.title_ar
                    }))
                }
            };
            
            const collectionScript = document.createElement('script');
            collectionScript.type = 'application/ld+json';
            collectionScript.dataset.type = 'products-schema';
            collectionScript.textContent = JSON.stringify(productCollection, null, 2);
            document.head.appendChild(collectionScript);
            
            log('✅ SEO Schema markup injected');
        } catch (schemaError) {
            error('❌ Schema injection error:', schemaError);
        }
    }
    
    /**
     * Load all products from products.json
     */
    async function loadAllProductsSecurely() {
        try {
            loadingAttempts++;
            log(`📦 Loading all products from products.json... (${loadingAttempts}/${maxAttempts})`);
            
            const response = await fetch('./data/products.json?v=' + Date.now());
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const allProducts = await response.json();
            
            if (!Array.isArray(allProducts) || allProducts.length === 0) {
                throw new Error('No products data returned');
            }
            
            // Normalize product data
            const normalizedProducts = allProducts.map(product => ({
                ...product,
                category_type: product.category === 'Perfumes' ? 'perfume' : 'watch',
                icon: product.category === 'Perfumes' ? '🌸' : '⏰'
            }));
            
            currentProducts = normalizedProducts;
            displayProductsSecurely(normalizedProducts);
            updateFilterCountsSecurely();
            injectSeoSchema(normalizedProducts);
            
            log(`✅ Successfully loaded and displayed ${normalizedProducts.length} products from products.json`);
            
        } catch (loadError) {
            error('❌ Product loading error:', loadError);
            if (loadingAttempts < maxAttempts) {
                log('⚠️ Retrying product load...');
                setTimeout(loadAllProductsSecurely, 2000);
            } else {
                showLoadingErrorSecurely();
            }
        }
    }
    
    /**
     * SECURE PRODUCT DISPLAY (NO INLINE CODE)
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
                const productTitle = (product.title || product.title_ar || 'منتج مميز')
                    .replace(/[<>&"']/g, '')
                    .substring(0, 100);
                    
                const imageUrl = product.image_link || 
                    'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=منتج+مميز';
                
                const whatsappMessage = formatWhatsAppMessage(product);
                
                return `
                    <div class="product-card" 
                         data-product-type="${product.category_type}" 
                         data-product-id="${productId}"
                         data-product-title="${productTitle}"
                         role="button"
                         tabindex="0"
                         aria-label="عرض تفاصيل ${productTitle}">
                        <div class="product-image-container">
                            <img src="${imageUrl}" 
                                 alt="${productTitle}" 
                                 class="product-image"
                                 loading="lazy"
                                 width="300"
                                 height="250"
                                 data-fallback-applied="false">
                            ${hasDiscount ? `<div class="discount-badge">خصم ${discountPercent}%</div>` : ''}
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${productTitle}</h3>
                            <div class="product-price">
                                ${finalPrice.toFixed(2)} د.إ
                                ${hasDiscount ? `<span class="original-price">${originalPrice.toFixed(2)} د.إ</span>` : ''}
                            </div>
                            <div class="product-actions">
                                <button class="btn-primary add-to-cart-btn" 
                                        data-product-id="${productId}"
                                        type="button"
                                        aria-label="إضافة ${productTitle} إلى السلة">
                                    <i class="fas fa-cart-plus" aria-hidden="true"></i> أضف للسلة
                                </button>
                                <a href="https://wa.me/201110760081?text=${encodeURIComponent(whatsappMessage)}" 
                                   class="btn-whatsapp whatsapp-order-btn" 
                                   target="_blank" 
                                   rel="noopener"
                                   data-product-id="${productId}"
                                   data-product-title="${productTitle}"
                                   aria-label="طلب ${productTitle} عبر واتساب">
                                    <i class="fab fa-whatsapp" aria-hidden="true"></i> اطلب
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }).filter(html => html.trim().length > 0).join('');
            
            grid.innerHTML = productsHTML;
            setupProductEventHandlersSecurely();
            
            log(`📦 Securely displayed ${products.length} products`);
            
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
            card.addEventListener('click', function(e) {
                if (e.target.closest('.product-actions')) return;
                
                e.preventDefault();
                const productId = this.dataset.productId;
                const productType = this.dataset.productType;
                
                if (productId && productType) {
                    navigateToProductDetailsSecurely(productId, productType);
                }
            });
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (!e.target.closest('.product-actions')) {
                        e.preventDefault();
                        this.click();
                    }
                }
            });
            
            const img = card.querySelector('.product-image');
            if (img) setupSecureImageHandler(img);
        });
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const productId = this.dataset.productId;
                if (productId) addToCartSecurely(productId);
            });
            
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.click();
                }
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
        
        const product = currentProducts.find(p => p && String(p.id) === String(productId));
        if (product && product.title) {
            const slug = (product.title || product.title_ar || '')
                .toLowerCase()
                .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\s]/g, '')
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
            }
        } else {
            error('❌ Product not found:', productId);
            showSecureNotification('لم يتم العثور على المنتج', true);
        }
    }
    
    /**
     * Secure add to cart system
     */
    function addToCartSecurely(productId) {
        const product = currentProducts.find(p => p && String(p.id) === String(productId));
        if (!product) {
            error('❌ Product not found for cart');
            return;
        }
        
        try {
            let cart = [];
            const cartData = localStorage.getItem('emirates_cart');
            
            if (cartData) {
                try {
                    cart = JSON.parse(cartData);
                } catch (e) {
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
                    title: product.title || product.title_ar,
                    price: parseFloat(product.sale_price || product.price || 0),
                    image: product.image_link,
                    quantity: 1,
                    type: product.category_type,
                    category: product.category
                });
            }
            
            localStorage.setItem('emirates_cart', JSON.stringify(cart));
            updateCartBadgeSecurely();
            
            log(`✅ Added to cart: ${product.title}`);
            showSecureNotification(`تم إضافة "${product.title}" للسلة بنجاح!`);
            
        } catch (cartError) {
            error('❌ Cart error:', cartError);
            showSecureNotification('خطأ في إضافة المنتج', true);
        }
    }
    
    /**
     * Secure notification system (NO POPUPS)
     */
    function showSecureNotification(message, isError = false) {
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
            left: 30px;
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
            font-family: 'Cairo', sans-serif;
        `;
        
        const icon = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
        notification.innerHTML = `<i class="${icon}" style="margin-left: 8px;" aria-hidden="true"></i>${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.4s ease';
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
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
                badge.setAttribute('aria-label', `عدد العناصر في السلة: ${totalItems}`);
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
            const perfumeCount = currentProducts.filter(p => p.category === 'Perfumes').length;
            const watchCount = currentProducts.filter(p => p.category === 'Watches').length;
            
            const allBtn = document.querySelector('[data-filter="all"]');
            const perfumesBtn = document.querySelector('[data-filter="perfumes"]');
            const watchesBtn = document.querySelector('[data-filter="watches"]');
            
            if (allBtn) allBtn.innerHTML = `<i class="fas fa-th-large" aria-hidden="true"></i> جميع المنتجات (${currentProducts.length})`;
            if (perfumesBtn) perfumesBtn.innerHTML = `<i class="fas fa-spray-can" aria-hidden="true"></i> العطور (${perfumeCount})`;
            if (watchesBtn) watchesBtn.innerHTML = `<i class="fas fa-clock" aria-hidden="true"></i> الساعات (${watchCount})`;
            
            log(`📊 Products: All(${currentProducts.length}) Perfumes(${perfumeCount}) Watches(${watchCount})`);
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
                    document.querySelectorAll('.filter-btn').forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-checked', 'false');
                    });
                    
                    this.classList.add('active');
                    this.setAttribute('aria-checked', 'true');
                    
                    const filter = this.getAttribute('data-filter');
                    let filteredProducts = [];
                    
                    if (filter === 'all') {
                        filteredProducts = currentProducts;
                    } else if (filter === 'perfumes') {
                        filteredProducts = currentProducts.filter(p => p.category === 'Perfumes');
                    } else if (filter === 'watches') {
                        filteredProducts = currentProducts.filter(p => p.category === 'Watches');
                    }
                    
                    displayProductsSecurely(filteredProducts);
                    log(`🔍 Filtered: ${filter} (${filteredProducts.length} products)`);
                    
                } catch (filterError) {
                    error('❌ Filter error:', filterError);
                }
            });
            
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    /**
     * Show loading error
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
                <h3 style="color: #1B2951; margin: 15px 0;">❌ خطأ في تحميل المنتجات</h3>
                <p style="color: #666; margin: 15px 0;">عذراً، لم نتمكن من تحميل المنتجات</p>
                <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <a href="./" 
                       style="color: white; background: linear-gradient(135deg, #D4AF37, #B8860B); text-decoration: none; font-weight: bold; padding: 15px 30px; border-radius: 15px; display: inline-flex; align-items: center; gap: 8px;">
                        <i class="fas fa-home" aria-hidden="true"></i> الرئيسية
                    </a>
                    <a href="https://wa.me/201110760081" 
                       target="_blank" 
                       rel="noopener"
                       style="color: white; background: linear-gradient(135deg, #25D366, #20B358); text-decoration: none; font-weight: bold; padding: 15px 30px; border-radius: 15px; display: inline-flex; align-items: center; gap: 8px;">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i> تواصل
                    </a>
                </div>
            </div>
        `;
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
                <h3 style="color: #1B2951; margin: 15px 0;">لا توجد منتجات</h3>
                <p style="color: #666; margin: 15px 0;">رجاءً اعد لاحقاً</p>
            </div>
        `;
    }
    
    /**
     * Progress bar
     */
    function updateProgressSecurely() {
        try {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            
            if (maxScroll > 0) {
                const progress = Math.max(0, Math.min(100, (scrolled / maxScroll) * 100));
                const bar = document.getElementById('progressBar');
                if (bar) bar.style.width = progress + '%';
            }
        } catch (error) {
            error('❌ Progress bar error:', error);
        }
    }
    
    /**
     * Enhanced initialization
     */
    function initializeProductsShowcaseSecurely() {
        log('🚫 Zero Inline Code Products Showcase Init v2.2...');
        
        try {
            updateCartBadgeSecurely();
            loadAllProductsSecurely();
            initializeSecureFilters();
            
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (scrollTimeout) return;
                scrollTimeout = setTimeout(() => {
                    updateProgressSecurely();
                    scrollTimeout = null;
                }, 16);
            }, { passive: true });
            
            log('✅ Products Showcase v2.2 initialized');
            
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
        window.EmiratesShowcaseSecure = Object.freeze({
            version: '2.2.0-products-json',
            navigateToProduct: navigateToProductDetailsSecurely,
            addToCart: addToCartSecurely,
            updateCartBadge: updateCartBadgeSecurely,
            loadProducts: loadAllProductsSecurely,
            isDevelopment: isDev
        });
    }
    
    log('✅ Emirates Products Showcase v2.2 - LOADING ALL 126 PRODUCTS FROM products.json WITH SEO');
    
})();
