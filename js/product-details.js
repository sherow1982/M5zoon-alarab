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
        description += `ساعات عالية الجودة موفرة الآن في شتى مدن الإمارات - دبي, ابو ظبي, الشارقة والأمارات الأخرى.\n\n`;
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
    document.getElementById('page-title').textContent = pageTitle;
    document.getElementById('page-description').setAttribute('content', metaDescription);
    document.getElementById('canonical-url').setAttribute('href', window.location.href);

    // Update DOM elements
    document.getElementById('product-image').src = productImage;
    document.getElementById('product-image').alt = productTitle;
    document.getElementById('product-title').textContent = productTitle;
    document.getElementById('breadcrumb-product').textContent = productTitle;
    document.getElementById('category-badge').textContent = category || 'منتج';

    // Update prices
    document.getElementById('old-price').textContent = `${oldPrice.toFixed(0)} د.إ`;
    document.getElementById('current-price').textContent = `${newPrice.toFixed(0)} د.إ`;
    
    // Update discount badge
    const discountBadge = document.getElementById('discount-badge');
    if (discountPercent > 0) {
        discountBadge.textContent = `-${discountPercent}%`;
        discountBadge.style.display = 'block';
    } else {
        discountBadge.style.display = 'none';
    }

    // Update savings
    const savingsEl = document.getElementById('savings');
    if (savings > 0) {
        savingsEl.textContent = `وفر ${savings.toFixed(0)} د.إ`;
        savingsEl.style.display = 'inline-block';
    } else {
        savingsEl.style.display = 'none';
    }

    // Update description with UAE keywords
    document.getElementById('product-description-text').textContent = enhancedDescription;

    // Update WhatsApp link
    const whatsappMessage = encodeURIComponent(
        `مرحباً, أرغب في طلب:\n${productTitle}\nالسعر: ${newPrice.toFixed(0)} د.إ`
    );
    document.getElementById('whatsapp-btn').href = `https://wa.me/201110760081?text=${whatsappMessage}`;

    // Show product container and hide loading/error
    document.getElementById('loading-container').classList.add('hide');
    document.getElementById('error-container').classList.add('hide');
    document.getElementById('product-container').classList.remove('hide');

    console.log('✅ Product displayed successfully:', productTitle);
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
    errorContainer.querySelector('p').textContent = message;
    document.getElementById('loading-container').classList.add('hide');
    errorContainer.classList.remove('hide');
}