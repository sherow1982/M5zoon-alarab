// نظام تحميل وعرض المنتجات المحسّن - إصدار v3.0
// إصلاح شامل: فصل كامل بين العطور والساعات
// تحسينات الأداء والأمان ومعالجة الأخطاء

(function() {
    'use strict';
    
    // إعدادات النظام
    const CONFIG = {
        version: '3.0.0',
        debug: false,
        maxRetries: 3,
        loadTimeout: 10000,
        cacheExpiry: 300000, // 5 دقائق
        batchSize: 20,
        lazyLoadThreshold: 8
    };
    
    // متغيرات البيانات الأساسية
    let perfumesData = [];
    let watchesData = [];
    let allProductsData = [];
    let isDataLoaded = false;
    let loadingPromise = null;
    let retryCount = 0;
    
    // Cache للبيانات
    const dataCache = new Map();
    
    // وظائف المساعدة
    const Utils = {
        log: (message, type = 'info') => {
            if (CONFIG.debug) {
                const emoji = {
                    info: 'ℹ️',
                    success: '✅',
                    warning: '⚠️',
                    error: '❌'
                };
                console.log(`${emoji[type]} ${message}`);
            }
        },
        
        sanitizeHtml: (str) => {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },
        
        validateProduct: (product) => {
            return product && 
                   product.id && 
                   product.title && 
                   product.image_link && 
                   (product.price || product.sale_price);
        },
        
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        formatPrice: (price) => {
            const numPrice = parseFloat(price) || 0;
            return numPrice.toFixed(2);
        },
        
        calculateDiscount: (originalPrice, salePrice) => {
            const original = parseFloat(originalPrice) || 0;
            const sale = parseFloat(salePrice) || original;
            if (original > sale && original > 0) {
                return Math.round(((original - sale) / original) * 100);
            }
            return 0;
        },
        
        generateUniqueId: () => {
            return Date.now() + Math.random().toString(36).substr(2, 9);
        }
    };
    
    // إدارة الأخطاء
    const ErrorHandler = {
        handle: (error, context = 'general') => {
            Utils.log(`خطأ في ${context}: ${error.message}`, 'error');
            
            // إرسال تقرير الخطأ (اختياري)
            if (window.gtag) {
                window.gtag('event', 'exception', {
                    description: `${context}: ${error.message}`,
                    fatal: false
                });
            }
        },
        
        showUserError: (message) => {
            const notification = document.createElement('div');
            notification.className = 'error-notification';
            notification.style.cssText = `
                position: fixed; top: 100px; right: 20px; z-index: 10001;
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white; padding: 15px 20px; border-radius: 10px;
                font-weight: 600; font-family: 'Cairo', sans-serif;
                box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
                animation: slideInRight 0.4s ease; max-width: 300px;
            `;
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    <span>${Utils.sanitizeHtml(message)}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
        }
    };
    
    // تحميل البيانات مع إدارة محسّنة للأخطاء
    async function loadProductData() {
        if (isDataLoaded) {
            return {
                perfumes: perfumesData,
                watches: watchesData,
                all: allProductsData
            };
        }
        
        if (loadingPromise) {
            return loadingPromise;
        }
        
        loadingPromise = performDataLoad();
        return loadingPromise;
    }
    
    async function performDataLoad() {
        const cacheKey = 'products_data';
        const cachedData = dataCache.get(cacheKey);
        
        if (cachedData && (Date.now() - cachedData.timestamp) < CONFIG.cacheExpiry) {
            Utils.log('تم استخدام البيانات المخزنة', 'success');
            return cachedData.data;
        }
        
        try {
            Utils.log('بدء تحميل بيانات المنتجات...', 'info');
            
            const [perfumesResult, watchesResult] = await Promise.allSettled([
                loadDataWithRetry('./data/otor.json', 'perfumes'),
                loadDataWithRetry('./data/sa3at.json', 'watches')
            ]);
            
            // معالجة بيانات العطور
            if (perfumesResult.status === 'fulfilled') {
                perfumesData = processProductData(perfumesResult.value, 'PERFUME', 'otor');
                Utils.log(`تم تحميل ${perfumesData.length} عطر`, 'success');
            } else {
                ErrorHandler.handle(perfumesResult.reason, 'تحميل العطور');
                perfumesData = [];
            }
            
            // معالجة بيانات الساعات
            if (watchesResult.status === 'fulfilled') {
                watchesData = processProductData(watchesResult.value, 'WATCH', 'sa3at');
                Utils.log(`تم تحميل ${watchesData.length} ساعة`, 'success');
            } else {
                ErrorHandler.handle(watchesResult.reason, 'تحميل الساعات');
                watchesData = [];
            }
            
            // دمج البيانات
            allProductsData = [...perfumesData, ...watchesData];
            isDataLoaded = true;
            
            const result = {
                perfumes: perfumesData,
                watches: watchesData,
                all: allProductsData
            };
            
            // حفظ في الذاكرة المؤقتة
            dataCache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
            
            Utils.log(`تم تحميل ${allProductsData.length} منتج بنجاح`, 'success');
            return result;
            
        } catch (error) {
            ErrorHandler.handle(error, 'تحميل البيانات');
            ErrorHandler.showUserError('خطأ في تحميل المنتجات');
            
            return {
                perfumes: [],
                watches: [],
                all: []
            };
        }
    }
    
    async function loadDataWithRetry(url, type) {
        let lastError;
        
        for (let i = 0; i < CONFIG.maxRetries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), CONFIG.loadTimeout);
                
                const response = await fetch(url, {
                    signal: controller.signal,
                    cache: 'default',
                    credentials: 'same-origin'
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (!Array.isArray(data)) {
                    throw new Error('بيانات غير صحيحة: متوقع مصفوفة');
                }
                
                return data;
                
            } catch (error) {
                lastError = error;
                Utils.log(`محاولة ${i + 1} فشلت لـ ${type}: ${error.message}`, 'warning');
                
                if (i < CONFIG.maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                }
            }
        }
        
        throw lastError;
    }
    
    function processProductData(rawData, productType, source) {
        return rawData
            .filter(Utils.validateProduct)
            .map((item, index) => ({
                ...item,
                actualId: item.id,
                displayIndex: index + 1,
                type: productType,
                category: productType === 'PERFUME' ? 'عطور' : 'ساعات',
                categoryEn: productType === 'PERFUME' ? 'perfume' : 'watch',
                icon: productType === 'PERFUME' ? '🌸' : '⏰',
                source: `${source}.json`,
                detailsUrl: `./product-details.html?type=${productType.toLowerCase()}&id=${encodeURIComponent(item.id)}&source=${source}`,
                isLoaded: true,
                uniqueKey: Utils.generateUniqueId()
            }));
    }
    
    // إنشاء بطاقة منتج محسّنة
    function createProductCard(product, index = 0, options = {}) {
        if (!Utils.validateProduct(product)) {
            Utils.log(`منتج غير صحيح: ${product?.id || 'unknown'}`, 'warning');
            return createErrorCard('خطأ في بيانات المنتج');
        }
        
        const originalPrice = parseFloat(product.price) || 0;
        const salePrice = parseFloat(product.sale_price) || originalPrice;
        const hasDiscount = originalPrice > salePrice && originalPrice > 0;
        const discountPercent = Utils.calculateDiscount(originalPrice, salePrice);
        
        const productInfo = getProductInfo(product.type);
        const loadingMode = index >= CONFIG.lazyLoadThreshold ? 'lazy' : 'eager';
        
        const cardId = `product-${product.actualId}-${product.uniqueKey}`;
        
        return `
            <article class="product-card correct-product" 
                     id="${cardId}"
                     data-product-id="${Utils.sanitizeHtml(product.actualId)}" 
                     data-product-type="${Utils.sanitizeHtml(product.type)}"
                     data-source-file="${Utils.sanitizeHtml(product.source)}"
                     data-index="${index}"
                     style="animation-delay: ${Math.min(index * 0.1, 2)}s; cursor: pointer;"
                     role="article"
                     aria-label="${Utils.sanitizeHtml(product.title)} - ${productInfo.categoryDisplay}"
                     tabindex="0"
                     onclick="openProductDetails('${Utils.sanitizeHtml(product.type)}', '${Utils.sanitizeHtml(product.actualId)}', event)"
                     onkeydown="handleProductKeydown(event, '${Utils.sanitizeHtml(product.type)}', '${Utils.sanitizeHtml(product.actualId)}')"
                     data-price="${salePrice}"
                     data-category="${Utils.sanitizeHtml(product.category)}">
                     
                <!-- الصورة -->
                <div class="product-image-container" role="img" aria-label="صورة ${Utils.sanitizeHtml(product.title)}">
                    <img src="${Utils.sanitizeHtml(product.image_link)}" 
                         alt="${Utils.sanitizeHtml(product.title)} - ${productInfo.categoryDisplay}" 
                         class="product-image"
                         width="300"
                         height="250"
                         loading="${loadingMode}"
                         decoding="async"
                         onerror="handleImageError(this, '${product.type}')">
                    
                    <!-- شارة الفئة -->
                    <div class="product-category-badge" 
                         style="${productInfo.badgeStyle}"
                         role="badge"
                         aria-label="فئة: ${productInfo.categoryDisplay}">
                        ${productInfo.categoryDisplay}
                    </div>
                    
                    <!-- شارة الخصم/جديد -->
                    ${hasDiscount ? 
                        `<div class="discount-badge" role="badge" aria-label="خصم ${discountPercent}%">خصم ${discountPercent}%</div>` : 
                        `<div class="new-badge" role="badge" aria-label="منتج جديد">جديد</div>`
                    }
                </div>
                
                <!-- معلومات المنتج -->
                <div class="product-info">
                    <!-- العنوان -->
                    <h3 class="product-title">
                        <a href="${Utils.sanitizeHtml(product.detailsUrl)}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           onclick="handleProductLinkClick(event, '${Utils.sanitizeHtml(product.type)}', '${Utils.sanitizeHtml(product.actualId)}')"
                           aria-label="عرض تفاصيل ${Utils.sanitizeHtml(product.title)}">
                            ${Utils.sanitizeHtml(product.title)}
                        </a>
                    </h3>
                    
                    <!-- الوصف -->
                    <p class="product-description">
                        ${productInfo.description}
                    </p>
                    
                    <!-- السعر -->
                    <div class="product-price" role="region" aria-label="معلومات السعر">
                        <span class="current-price" aria-label="السعر الحالي">${Utils.formatPrice(salePrice)} د.إ</span>
                        ${hasDiscount ? `<span class="original-price" aria-label="السعر الأصلي">${Utils.formatPrice(originalPrice)} د.إ</span>` : ''}
                    </div>
                    
                    <!-- التقييمات -->
                    <div class="product-rating" role="region" aria-label="تقييم المنتج">
                        <div class="stars" aria-hidden="true">★★★★☆</div>
                        <span class="rating-number" aria-label="تقييم 4.5 من 5">4.5</span>
                        <span class="reviews-count" aria-label="15 مراجعة">(15)</span>
                        <span class="verified-badge" aria-label="موثّق">✓ موثّق</span>
                    </div>
                    
                    <!-- الأزرار -->
                    <div class="product-actions" role="group" aria-label="إجراءات المنتج">
                        ${createActionButtons(product)}
                    </div>
                </div>
            </article>
        `;
    }
    
    function getProductInfo(productType) {
        if (productType === 'PERFUME') {
            return {
                categoryDisplay: '🌸 عطور',
                description: 'عطر فاخر بتركيبة عالية الجودة ورائحة مميزة تدوم طويلاً',
                badgeStyle: 'background: rgba(255, 182, 193, 0.9); color: #8B0000;'
            };
        } else {
            return {
                categoryDisplay: '⏰ ساعات',
                description: 'ساعة عالية الجودة بتصميم أنيق ومواصفات احترافية مميزة',
                badgeStyle: 'background: rgba(135, 206, 235, 0.9); color: #000080;'
            };
        }
    }
    
    function createActionButtons(product) {
        const buttons = [
            {
                icon: 'fas fa-shopping-cart',
                action: `addToCart('${Utils.sanitizeHtml(product.type)}', '${Utils.sanitizeHtml(product.actualId)}', event)`,
                title: 'أضف للسلة',
                class: 'add-cart-btn',
                ariaLabel: `أضف ${Utils.sanitizeHtml(product.title)} إلى السلة`
            },
            {
                icon: 'fas fa-bolt',
                action: `orderNow('${Utils.sanitizeHtml(product.type)}', '${Utils.sanitizeHtml(product.actualId)}', event)`,
                title: 'اطلب فوراً',
                class: 'order-now-btn',
                ariaLabel: `اطلب ${Utils.sanitizeHtml(product.title)} فوراً`
            },
            {
                icon: 'fab fa-whatsapp',
                action: `sendWhatsApp('${Utils.sanitizeHtml(product.type)}', '${Utils.sanitizeHtml(product.actualId)}', event)`,
                title: 'واتساب',
                class: 'whatsapp-btn',
                ariaLabel: `طلب ${Utils.sanitizeHtml(product.title)} عبر واتساب`
            },
            {
                icon: 'fas fa-eye',
                action: `openProductDetails('${Utils.sanitizeHtml(product.type)}', '${Utils.sanitizeHtml(product.actualId)}', event)`,
                title: 'التفاصيل',
                class: 'details-btn',
                ariaLabel: `عرض تفاصيل ${Utils.sanitizeHtml(product.title)}`
            }
        ];
        
        return buttons.map(btn => `
            <button class="icon-btn ${btn.class}" 
                    onclick="${btn.action}"
                    onkeydown="handleButtonKeydown(event, () => ${btn.action})"
                    title="${btn.title}"
                    aria-label="${btn.ariaLabel}"
                    type="button">
                <i class="${btn.icon}" aria-hidden="true"></i>
            </button>
        `).join('');
    }
    
    function createErrorCard(message) {
        return `
            <div class="error-product" role="alert">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <h3>خطأ في بيانات المنتج</h3>
                <p>${Utils.sanitizeHtml(message)}</p>
                <button onclick="location.reload()" class="btn-primary">إعادة المحاولة</button>
            </div>
        `;
    }
    
    function createNoProductsMessage(productType) {
        return `
            <div class="no-products" role="status" aria-live="polite">
                <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                <h3>لا توجد منتجات</h3>
                <p>لم يتم العثور على ${productType || 'منتجات'}</p>
                <button onclick="location.reload()" class="btn-primary">إعادة المحاولة</button>
            </div>
        `;
    }
    
    // عرض المنتجات بشكل صحيح
    function displayProducts(products, containerId, productType = '', options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            Utils.log(`لم يتم العثور على الحاوية: ${containerId}`, 'error');
            return;
        }
        
        // تنظيف الحاوية
        container.innerHTML = '';
        
        if (!products || products.length === 0) {
            container.innerHTML = createNoProductsMessage(productType);
            container.setAttribute('aria-live', 'polite');
            return;
        }
        
        try {
            // إنشاء HTML للمنتجات
            const productsHTML = products
                .slice(0, options.limit || products.length)
                .map((product, index) => createProductCard(product, index, options))
                .join('');
            
            container.innerHTML = productsHTML;
            container.setAttribute('aria-live', 'polite');
            
            Utils.log(`تم عرض ${products.length} ${productType} في ${containerId}`, 'success');
            
            // تحديث عداد السلة
            setTimeout(updateCartCounter, 300);
            
            // تفعيل التحميل البطيء
            if (options.lazyLoad) {
                enableLazyLoading(container);
            }
            
        } catch (error) {
            ErrorHandler.handle(error, `عرض المنتجات في ${containerId}`);
            container.innerHTML = createErrorCard('خطأ في عرض المنتجات');
        }
    }
    
    // تفعيل التحميل البطيء
    function enableLazyLoading(container) {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            container.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // وظائل إدارة الأحداث
    window.handleImageError = function(img, productType) {
        const fallbackSrc = `https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${productType === 'PERFUME' ? '%D8%B9%D8%B7%D8%B1' : '%D8%B3%D8%A7%D8%B9%D8%A9'}`;
        if (img.src !== fallbackSrc) {
            img.src = fallbackSrc;
            img.alt = `صورة افتراضية لـ${productType === 'PERFUME' ? 'عطر' : 'ساعة'}`;
        }
    };
    
    window.handleProductKeydown = function(event, productType, productId) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProductDetails(productType, productId, event);
        }
    };
    
    window.handleButtonKeydown = function(event, callback) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            callback();
        }
    };
    
    window.handleProductLinkClick = function(event, productType, productId) {
        event.stopPropagation();
        Utils.log(`نقر على رابط المنتج: ${productType} - ${productId}`, 'info');
    };
    
    // وظائف إجراءات المنتجات
    window.addToCart = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        try {
            const product = findProduct(productType, productId);
            if (!product) {
                ErrorHandler.showUserError('لم يتم العثور على المنتج');
                return;
            }
            
            const cartItem = createCartItem(product);
            const cart = getCart();
            const existingIndex = cart.findIndex(item => item.id === product.actualId);
            
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
                Utils.log(`زيادة كمية ${product.title}`, 'info');
            } else {
                cart.push(cartItem);
                Utils.log(`تم إضافة ${product.title} للسلة`, 'success');
            }
            
            saveCart(cart);
            updateCartCounter();
            showSuccessMessage(`تم إضافة "${product.title}" للسلة!`);
            
        } catch (error) {
            ErrorHandler.handle(error, 'إضافة للسلة');
            ErrorHandler.showUserError('خطأ في إضافة المنتج للسلة');
        }
    };
    
    window.orderNow = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        try {
            // أضف للسلة أولاً
            addToCart(productType, productId, null);
            
            // انتقل لصفحة الطلب
            setTimeout(() => {
                window.open('./checkout.html', '_blank', 'noopener,noreferrer');
            }, 500);
            
        } catch (error) {
            ErrorHandler.handle(error, 'طلب فوري');
            ErrorHandler.showUserError('خطأ في عملية الطلب');
        }
    };
    
    window.sendWhatsApp = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        try {
            const product = findProduct(productType, productId);
            if (!product) {
                ErrorHandler.showUserError('لم يتم العثور على المنتج');
                return;
            }
            
            const message = createWhatsAppMessage(product);
            const whatsappUrl = `https://wa.me/971501234567?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            Utils.log(`تم إرسال طلب واتساب: ${product.title}`, 'success');
            
        } catch (error) {
            ErrorHandler.handle(error, 'إرسال واتساب');
            ErrorHandler.showUserError('خطأ في إرسال الرسالة');
        }
    };
    
    window.openProductDetails = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        try {
            const product = findProduct(productType, productId);
            if (!product) {
                ErrorHandler.showUserError('لم يتم العثور على المنتج');
                return;
            }
            
            window.open(product.detailsUrl, '_blank', 'noopener,noreferrer');
            Utils.log(`فتح تفاصيل المنتج: ${product.title}`, 'info');
            
        } catch (error) {
            ErrorHandler.handle(error, 'فتح تفاصيل المنتج');
            ErrorHandler.showUserError('خطأ في فتح صفحة المنتج');
        }
    };
    
    // وظائف مساعدة للسلة
    function findProduct(productType, productId) {
        const searchArray = productType === 'PERFUME' ? perfumesData : watchesData;
        return searchArray.find(p => p.actualId === productId);
    }
    
    function createCartItem(product) {
        return {
            id: product.actualId,
            name: product.title,
            price: parseFloat(product.sale_price) || parseFloat(product.price) || 0,
            image: product.image_link,
            type: product.type,
            category: product.category,
            source: product.source,
            url: product.detailsUrl,
            quantity: 1,
            addedAt: new Date().toISOString()
        };
    }
    
    function createWhatsAppMessage(product) {
        const price = Utils.formatPrice(product.sale_price || product.price);
        return `مرحباً! أريد طلب هذا المنتج:

${product.icon} ${product.title}
💰 ${price} درهم
📱 من متجر هدايا الإمارات

أريد معرفة تفاصيل الطلب والتوصيل.`;
    }
    
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
        } catch (error) {
            Utils.log('خطأ في قراءة السلة', 'warning');
            return [];
        }
    }
    
    function saveCart(cart) {
        try {
            localStorage.setItem('emirates_shopping_cart', JSON.stringify(cart));
        } catch (error) {
            Utils.log('خطأ في حفظ السلة', 'warning');
        }
    }
    
    function updateCartCounter() {
        try {
            const cart = getCart();
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const counters = document.querySelectorAll('.cart-counter, .mobile-cart-counter');
            
            counters.forEach(counter => {
                if (counter) {
                    counter.textContent = totalItems;
                    counter.style.display = totalItems > 0 ? 'flex' : 'none';
                    counter.classList.toggle('has-items', totalItems > 0);
                    counter.setAttribute('aria-label', `${totalItems} عنصر في السلة`);
                }
            });
        } catch (error) {
            ErrorHandler.handle(error, 'تحديث عداد السلة');
        }
    }
    
    function showSuccessMessage(message) {
        const existing = document.querySelector('.success-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px; z-index: 10001;
            background: linear-gradient(135deg, #25D366, #20B358);
            color: white; padding: 15px 20px; border-radius: 10px;
            font-weight: 600; font-family: 'Cairo', sans-serif;
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
            animation: slideInRight 0.4s ease; max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <span>${Utils.sanitizeHtml(message)}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إزالة تلقائية
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
    
    // تحميل صفحات مختلفة
    async function loadHomePage() {
        try {
            const data = await loadProductData();
            
            Utils.log('بدؙ تحميل منتجات الصفحة الرئيسية', 'info');
            
            // عطور في قسم العطور فقط
            if (document.getElementById('perfumes-grid')) {
                displayProducts(
                    data.perfumes.slice(0, 8), 
                    'perfumes-grid', 
                    'عطور',
                    { limit: 8, lazyLoad: true }
                );
            }
            
            // ساعات في قسم الساعات فقط
            if (document.getElementById('watches-grid')) {
                displayProducts(
                    data.watches.slice(0, 8), 
                    'watches-grid', 
                    'ساعات',
                    { limit: 8, lazyLoad: true }
                );
            }
            
            // منتجات مميزة (مختلطة)
            if (document.getElementById('featuredProducts')) {
                const featured = [
                    ...data.perfumes.slice(0, 4),
                    ...data.watches.slice(0, 4)
                ];
                displayProducts(featured, 'featuredProducts', 'مميزة');
            }
            
            // أفضل العروض
            if (document.getElementById('bestDeals')) {
                const deals = data.all
                    .filter(p => Utils.calculateDiscount(p.price, p.sale_price) > 0)
                    .slice(0, 6);
                displayProducts(deals, 'bestDeals', 'عروض');
            }
            
        } catch (error) {
            ErrorHandler.handle(error, 'تحميل الصفحة الرئيسية');
        }
    }
    
    async function loadProductsShowcase() {
        try {
            const data = await loadProductData();
            
            Utils.log('بدء تحميل صفحة عرض المنتجات', 'info');
            
            // عرض جميع المنتجات
            if (document.getElementById('allProductsGrid')) {
                displayProducts(data.all, 'allProductsGrid', 'جميع المنتجات', { lazyLoad: true });
            }
            
            // إعداد الفلاتر
            setupFiltering(data);
            
        } catch (error) {
            ErrorHandler.handle(error, 'تحميل صفحة عرض المنتجات');
        }
    }
    
    function setupFiltering(data) {
        const categoryFilter = document.getElementById('categoryFilter');
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                applyFilters(data, this.value, searchInput?.value || '', sortSelect?.value || '');
            });
        }
        
        if (searchInput) {
            const debouncedSearch = Utils.debounce((searchTerm) => {
                applyFilters(data, categoryFilter?.value || 'all', searchTerm, sortSelect?.value || '');
            }, 300);
            
            searchInput.addEventListener('input', function() {
                debouncedSearch(this.value);
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                applyFilters(data, categoryFilter?.value || 'all', searchInput?.value || '', this.value);
            });
        }
    }
    
    function applyFilters(data, category, searchTerm, sortBy) {
        let filteredProducts = data.all;
        
        // تطبيق فلتر الفئة
        if (category === 'perfumes') {
            filteredProducts = data.perfumes;
        } else if (category === 'watches') {
            filteredProducts = data.watches;
        }
        
        // تطبيق فلتر البحث
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filteredProducts = filteredProducts.filter(product => 
                product.title.toLowerCase().includes(searchLower) ||
                product.category.toLowerCase().includes(searchLower)
            );
        }
        
        // تطبيق الترتيب
        if (sortBy) {
            filteredProducts = sortProducts(filteredProducts, sortBy);
        }
        
        const resultsText = category === 'all' ? 'جميع المنتجات' : 
                          category === 'perfumes' ? 'عطور' : 'ساعات';
        
        displayProducts(filteredProducts, 'allProductsGrid', `${resultsText} (${filteredProducts.length})`);
        
        Utils.log(`تم تطبيق الفلاتر: ${filteredProducts.length} منتج`, 'info');
    }
    
    function sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => 
                    (parseFloat(a.sale_price) || parseFloat(a.price) || 0) - 
                    (parseFloat(b.sale_price) || parseFloat(b.price) || 0)
                );
            case 'price-high':
                return sorted.sort((a, b) => 
                    (parseFloat(b.sale_price) || parseFloat(b.price) || 0) - 
                    (parseFloat(a.sale_price) || parseFloat(a.price) || 0)
                );
            case 'name':
                return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
            case 'newest':
                return sorted.reverse();
            default:
                return sorted;
        }
    }
    
    // إضافة CSS محسّن
    function addEnhancedCSS() {
        if (document.querySelector('#enhanced-products-css')) return;
        
        const style = document.createElement('style');
        style.id = 'enhanced-products-css';
        style.textContent = `
            .correct-product {
                opacity: 0;
                animation: fadeInUp 0.6s ease forwards;
                background: white;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(212, 175, 55, 0.15);
                position: relative;
                cursor: pointer;
                contain: layout style;
                will-change: transform;
            }
            
            .correct-product:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                border-color: rgba(212, 175, 55, 0.4);
            }
            
            .correct-product:focus-within {
                outline: 2px solid #D4AF37;
                outline-offset: 2px;
            }
            
            .icon-btn {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .icon-btn:hover,
            .icon-btn:focus {
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 6px 15px rgba(0,0,0,0.2);
            }
            
            .add-cart-btn:hover,
            .add-cart-btn:focus {
                background: #D4AF37 !important;
                border-color: #D4AF37 !important;
                color: white !important;
            }
            
            .details-btn:hover,
            .details-btn:focus {
                background: #007bff !important;
                color: white !important;
            }
            
            .error-product,
            .no-products {
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
                color: #666;
                background: #f8f9fa;
                border-radius: 15px;
                margin: 20px 0;
            }
            
            .error-product i,
            .no-products i {
                font-size: 2rem;
                margin-bottom: 15px;
                opacity: 0.6;
                color: #f39c12;
            }
            
            @keyframes fadeInUp {
                from { 
                    opacity: 0; 
                    transform: translateY(30px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            @keyframes slideInRight {
                from { 
                    transform: translateX(100%); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0); 
                    opacity: 1; 
                }
            }
            
            @media (max-width: 768px) {
                .correct-product {
                    margin-bottom: 20px;
                }
                
                .icon-btn {
                    width: 38px !important;
                    height: 38px !important;
                    font-size: 1rem !important;
                }
                
                .product-actions {
                    gap: 6px !important;
                }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .correct-product {
                    animation: none;
                    opacity: 1;
                }
                
                .icon-btn:hover {
                    transform: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // تهيئة النظام
    function initialize() {
        Utils.log(`بدء تهيئة نظام المنتجات v${CONFIG.version}`, 'info');
        
        try {
            addEnhancedCSS();
            
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            
            if (currentPage === '' || currentPage === 'index.html') {
                loadHomePage();
            } else if (currentPage === 'products-showcase.html') {
                loadProductsShowcase();
            }
            
            updateCartCounter();
            
            Utils.log('تم تهيئة النظام بنجاح', 'success');
            
        } catch (error) {
            ErrorHandler.handle(error, 'تهيئة النظام');
        }
    }
    
    // تصدير عام للوصول الخارجي
    window.EmiratesProductsSystem = {
        version: CONFIG.version,
        loadProductData,
        loadHomePage,
        loadProductsShowcase,
        displayProducts,
        updateCartCounter,
        getPerfumesData: () => perfumesData,
        getWatchesData: () => watchesData,
        getAllProductsData: () => allProductsData,
        getConfig: () => ({ ...CONFIG }),
        enableDebug: () => { CONFIG.debug = true; },
        disableDebug: () => { CONFIG.debug = false; }
    };
    
    // تفعيل عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    Utils.log(`نظام المنتجات v${CONFIG.version} جاهز`, 'success');
    
})();