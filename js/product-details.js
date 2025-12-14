/**
 * Logic for the product details page.
 * Fetches product data from complete products.json (263 products)
 * Also injects SEO metadata and JSON-LD schema with UAE keywords.
 */

// 📋 UAE Keyword Description Generator
function generateUAEKeywordDescription(productName, category) {
    const uaeLocations = ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'الفجيرة', 'رأس الخيمة', 'أم القيوين'];
    const qualityKeywords = ['عالي الجودة', 'أصلي 100%', 'فاخر', 'متميز', 'متخصص'];
    
    let description = `${productName} - منتج متميز من متجر هدايا الإمارات.\n\n`;
    description += `متجر هدايا الإمارات يقدم المه ${productName} بأفضل جودة لجميع عملائنا في الإمارات.\n\n`;
    
    if (category === 'Perfumes') {
        description += `عطر متميز ✓ أصلي 100% ✓ موثوق من متجر هدايا الإمارات.\n`;
        description += `عطر عالي الجودة موفر الآن لجميع الإمارات - دبي, ابو ظبي, الشارقة, عجمان وباقي أنحاء الدولة.\n\n`;
    } else if (category === 'Watches') {
        description += `ساعة فاخرة ✓ أصلي 100% ✓ موثوق من متجر هدايا الإمارات.\n`;
        description += `ساعات عالية الجودة موفرة الآن في شتى مدن الإمارات - دبي, ابو ظبي, الشارقة والامارات الأخرى.\n\n`;
    }
    
    description += `شحن سريع خلال 1-3 أيام عمل ✓ ضمان إرجاع 14 يوم ✓ دعم عملاء 24/7.\n`;
    description += `متجر هدايا الإمارات هو اختيارك الأول للمنتجات الهدايا عالية الجودة.`;
    
    return description;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing product details page...');
    loadProductData();
});

/**
 * Gets product ID from URL parameters (supports both 'id' and 'slug')
 * @returns {{id: string|null}}
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id') || params.get('slug'),
    };
}

/**
 * Fetches product data from complete products.json
 */
async function loadProductData() {
    const { id } = getUrlParams();

    if (!id) {
        showError('معرّف المنتج غير موجود في الرابط.');
        return;
    }

    try {
        // Load from complete products.json
        const response = await fetch('./data/products.json');
        
        if (!response.ok) {
            throw new Error(`فشل تحميل بيانات المنتجات: ${response.status}`);
        }

        const products = await response.json();
        
        // Find product by id or slug (case-insensitive)
        const product = products.find(p => 
            String(p.id).toLowerCase() === String(id).toLowerCase() ||
            (p.slug && p.slug.toLowerCase() === String(id).toLowerCase())
        );

        if (!product) {
            showError('لم يتم العثور على المنتج المطلوب.');
            console.warn(`Product not found: ${id}`, { availableIds: products.map(p => p.id).slice(0, 10) });
            return;
        }

        displayProduct(product);
        injectSchema(product);

    } catch (error) {
        console.error('❌ Error loading product data:', error);
        showError('حدث خطأ أثناء تحميل بيانات المنتج.');
    }
}

/**
 * Displays the fetched product data on the page.
 * @param {object} product - The product data object
 */
function displayProduct(product) {
    const {
        id,
        name,
        title,
        description,
        price,
        sale_price,
        original_price,
        image,
        image_link,
        imageUrl,
        category,
        rating = 4.7,
        reviews = 62,
        discount = 0
    } = product;

    const productTitle = name || title || 'Product';
    const productImage = image || image_link || imageUrl || '';
    const productDesc = description || `${productTitle} - منتج عالي الجودة`;

    // Calculate prices
    const oldPrice = parseFloat(original_price || price || 0);
    const newPrice = parseFloat(sale_price || price || 0);
    const savings = oldPrice - newPrice;
    const discountPercent = discount || (oldPrice > 0 && savings > 0 ? Math.round((savings / oldPrice) * 100) : 0);

    // مباشر توليد الوصف الاحترافي
    const enhancedDescription = generateUAEKeywordDescription(productTitle, category);

    // Update page title and meta description
    const pageTitle = `🛒 ${productTitle} | متجر هدايا الإمارات`;
    const metaDescription = `اشتري ${productTitle} من متجر هدايا الإمارات - ${category === 'Perfumes' ? 'عطور' : 'ساعات'} عالية الجودة. شحن سريع إلى دبي وأبوظبي والشارقة. ضمان 14 يوم + استرجاع مجاني.`;
    
    document.title = pageTitle;
    const pageTitleEl = document.getElementById('page-title');
    if (pageTitleEl) pageTitleEl.textContent = pageTitle;
    
    const pageDescEl = document.getElementById('page-description');
    if (pageDescEl) pageDescEl.setAttribute('content', metaDescription);
    
    const canonicalEl = document.getElementById('canonical-url');
    if (canonicalEl) canonicalEl.setAttribute('href', window.location.href);

    // Update carousel images (NEW)
    for (let i = 0; i < 3; i++) {
        const carouselImg = document.querySelector(`#carousel-item-${i} img`);
        if (carouselImg) {
            carouselImg.src = productImage;
            carouselImg.alt = productTitle;
        }
    }

    // Update title
    const productTitleEl = document.getElementById('product-title');
    if (productTitleEl) productTitleEl.textContent = productTitle;
    
    const breadcrumbEl = document.getElementById('breadcrumb-product');
    if (breadcrumbEl) breadcrumbEl.textContent = productTitle;
    
    const categoryEl = document.getElementById('category-badge');
    if (categoryEl) categoryEl.textContent = category || 'منتج';

    // Update prices
    const oldPriceEl = document.getElementById('old-price');
    if (oldPriceEl) oldPriceEl.textContent = `${oldPrice.toFixed(0)} د.إ`;
    
    const currentPriceEl = document.getElementById('current-price');
    if (currentPriceEl) currentPriceEl.textContent = `${newPrice.toFixed(0)} د.إ`;
    
    // Update discount badge
    const discountBadge = document.getElementById('discount-badge');
    if (discountBadge) {
        if (discountPercent > 0) {
            discountBadge.textContent = `-${discountPercent}%`;
            discountBadge.style.display = 'block';
        } else {
            discountBadge.style.display = 'none';
        }
    }

    // Update savings
    const savingsEl = document.getElementById('savings');
    if (savingsEl) {
        if (savings > 0) {
            savingsEl.textContent = `وفر ${savings.toFixed(0)} د.إ`;
            savingsEl.style.display = 'inline-block';
        } else {
            savingsEl.style.display = 'none';
        }
    }

    // Update description with UAE keywords
    const descEl = document.getElementById('product-description-text');
    if (descEl) descEl.textContent = enhancedDescription;

    // Update WhatsApp link
    const whatsappMessage = encodeURIComponent(
        `مرحبا, أرغب في طلب:\n${productTitle}\nالسعر: ${newPrice.toFixed(0)} د.إ`
    );
    const whatsappBtn = document.getElementById('whatsapp-btn');
    if (whatsappBtn) whatsappBtn.href = `https://wa.me/201110760081?text=${whatsappMessage}`;

    // Store product data for cart button
    window.currentProduct = product;

    // Add to cart button handler - SINGLE HANDLER ONLY
    const cartBtn = document.getElementById('add-to-cart-btn');
    if (cartBtn) {
        // Remove any previous listeners
        const newCartBtn = cartBtn.cloneNode(true);
        cartBtn.parentNode.replaceChild(newCartBtn, cartBtn);
        
        newCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addToCartHandler(product);
        });
    }

    // Show product container and hide loading/error
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) loadingContainer.classList.add('hide');
    
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) errorContainer.classList.add('hide');
    
    const productContainer = document.getElementById('product-container');
    if (productContainer) productContainer.classList.remove('hide');

    // Initialize carousel after product loads
    if (window.productCarousel) {
        console.log('✅ Carousel ready');
    }

    // Initialize quantity counter after product loads
    if (window.quantityCounter) {
        console.log('✅ Quantity counter ready');
    }

    // Track funnel view
    if (window.funnelTracker) {
        window.funnelTracker.trackView();
        console.log('📊 Funnel view tracked');
    }

    console.log('✅ Product displayed successfully:', productTitle);
}

/**
 * Add product to cart - SINGLE HANDLER
 */
function addToCartHandler(product) {
    try {
        const { id, name, sale_price, price, image, image_link, imageUrl, category } = product;
        const productPrice = parseFloat(sale_price || price || 0);
        const productImage = image || image_link || imageUrl || '';
        
        // احصل على الكمية من العداد
        let quantity = 1;
        if (window.quantityCounter && window.quantityCounter.getQuantity) {
            quantity = window.quantityCounter.getQuantity();
        } else {
            // Fallback: try to get from input directly
            const qtyInput = document.querySelector('[data-quantity-counter] input[type="number"]');
            if (qtyInput) {
                quantity = parseInt(qtyInput.value) || 1;
            }
        }

        console.log('📐 Adding to cart. Quantity:', quantity);

        let cart = JSON.parse(localStorage.getItem('emirates_cart') || '[]');
        
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += quantity;
            console.log('♾️ Updated existing item. New quantity:', existingItem.quantity);
        } else {
            cart.push({
                id: id,
                name: name,
                price: productPrice,
                image: productImage,
                quantity: quantity,
                category: category
            });
            console.log('🌟 Added new item. Quantity:', quantity);
        }
        
        localStorage.setItem('emirates_cart', JSON.stringify(cart));
        
        // Update cart badge
        if (window.updateFloatingCartBadge) {
            window.updateFloatingCartBadge();
        }
        
        // Track to funnel
        if (window.funnelTracker) {
            window.funnelTracker.trackAddToCart({
                productId: id,
                productName: name,
                quantity: quantity,
                price: productPrice
            });
        }
        
        // Show notification
        showNotification(`تم إضافة "${name}" x${quantity} للسلة! 😊`);
        
        console.log('✅ منتج مضاف:', name, 'الكمية:', quantity);
    } catch (e) {
        console.error('خطأ في إضافة للسلة:', e);
        showNotification('حدث خطأ! يرجا محاولة مرة أخرى.', 'error');
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
      font-family: 'Cairo', sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Injects Product and LocalBusiness JSON-LD schema with UAE keywords
 * @param {object} product - The product data object
 */
function injectSchema(product) {
    const {
        id,
        name,
        title,
        description,
        price,
        sale_price,
        original_price,
        image,
        image_link,
        imageUrl,
        category,
        rating = 4.7,
        reviews = 62,
        url
    } = product;

    const productTitle = name || title || 'Product';
    const productImage = image || image_link || imageUrl || '';
    const currentPrice = parseFloat(sale_price || price || 0);
    const url_final = window.location.href;

    const priceValidUntil = new Date();
    priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

    // Product Schema with UAE focus
    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": url_final + "#product",
        "name": `${productTitle} | متجر هدايا الإمارات`,
        "image": [productImage],
        "description": `${productTitle} من متجر هدايا الإمارات - عرض مباشر لأفضل المنتجات بأسعار منافسة في الإمارات.`,
        "brand": {
            "@type": "Brand",
            "@id": "https://emirates-gifts.arabsad.com/#brand",
            "name": "🛒 متجر هدايا الإمارات"
        },
        "category": category || "منتج",
        "offers": {
            "@type": "Offer",
            "@id": url_final + "#offer",
            "url": url_final,
            "priceCurrency": "AED",
            "price": String(currentPrice),
            "priceValidUntil": priceValidUntil.toISOString().split('T')[0],
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "@id": "https://emirates-gifts.arabsad.com/#organization",
                "name": "🛒 متجر هدايا الإمارات",
                "areaServed": ["AE-DU", "AE-AZ", "AE-SH", "AE-AJ", "AE-FU", "AE-RK", "AE-UM"]
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": String(rating),
            "reviewCount": String(reviews),
            "bestRating": "5",
            "worstRating": "1"
        },
        "url": url_final
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": url_final + "#breadcrumb",
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
                "name": category || "منتجات",
                "item": "https://emirates-gifts.arabsad.com/products-showcase.html"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": productTitle,
                "item": url_final
            }
        ]
    };

    // Remove old schema scripts
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());

    // Inject Product schema
    const productScriptTag = document.createElement('script');
    productScriptTag.type = 'application/ld+json';
    productScriptTag.textContent = JSON.stringify(productSchema, null, 2);
    document.head.appendChild(productScriptTag);

    // Inject Breadcrumb schema
    const breadcrumbScriptTag = document.createElement('script');
    breadcrumbScriptTag.type = 'application/ld+json';
    breadcrumbScriptTag.textContent = JSON.stringify(breadcrumbSchema, null, 2);
    document.head.appendChild(breadcrumbScriptTag);

    console.log('✅ Schema markup injected for:', productTitle);
}

/**
 * Displays an error message on the page.
 * @param {string} message - The error message to display
 */
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        const errorP = errorContainer.querySelector('p');
        if (errorP) errorP.textContent = message;
    }
    
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) loadingContainer.classList.add('hide');
    
    if (errorContainer) errorContainer.classList.remove('hide');
}
